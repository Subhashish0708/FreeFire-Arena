// Sends a push notification to every player registered for a match when the admin saves its room ID/password.
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

// IMPORTANT: region must match your Firestore location (e.g. "asia-south1" for Mumbai).
exports.notifyRoom = onDocumentWritten(
  {document: "tournaments/{tid}/private/room", region: "asia-south1"},
  async (event) => {
    const after = event.data.after.data();
    if (!after) return;
    const before = event.data.before.data();
    if (before && before.roomId === after.roomId && before.password === after.password) return;

    const db = admin.firestore();
    const tid = event.params.tid;
    const t = (await db.doc("tournaments/" + tid).get()).data() || {};
    const regs = await db.collection("registrations").where("tid", "==", tid).get();
    const uids = regs.docs.map((d) => d.data().uid);
    const snaps = await Promise.all(uids.map((u) => db.doc("fcmTokens/" + u).get()));
    const list = snaps.filter((s) => s.exists).map((s) => ({uid: s.id, token: s.data().token}));
    if (!list.length) return;

    const res = await admin.messaging().sendEachForMulticast({
      tokens: list.map((x) => x.token),
      data: {
        title: "🔥 Room ID ready: " + (t.name || "Match"),
        body: "Room ID: " + after.roomId + " · Password: " + after.password,
        url: "/",
      },
      webpush: {headers: {Urgency: "high"}},
    });
    // remove dead tokens
    await Promise.all(res.responses.map((r, i) =>
      !r.success && r.error && /not-registered|invalid-registration/.test(r.error.code)
        ? db.doc("fcmTokens/" + list[i].uid).delete() : null));
  });
