# FireArena – setup (about 20 minutes)

## 1. Firebase
1. console.firebase.google.com → Add project.
2. Build → **Authentication** → Sign-in method → enable **Email/Password** and **Google**.
3. Build → **Firestore Database** → Create (production mode).
4. Project settings → Your apps → Web (</>) → copy the config into `config.js`.
5. Paste `firestore.rules` into Firestore → Rules → Publish (or `firebase deploy --only firestore`).

## 2. Make yourself admin
Sign up in the app, then in Firestore create collection `admins` with a document whose ID is your **UID**
(Authentication → Users → copy UID). Fields can be empty. An **Admin** tab appears: create tournaments, set room ID/password, view players.

## 3. Host (free)
`npm i -g firebase-tools && firebase login && firebase init hosting` (public dir `.`, don't overwrite files) → `firebase deploy`.
Add your domain under Authentication → Settings → Authorized domains. Edit `privacy.html` (replace YOUR_EMAIL).

## 4. Play Store
1. Open **pwabuilder.com**, enter your site URL, choose Android → generate the package (Trusted Web Activity, signed AAB).
2. Host the `assetlinks.json` file PWABuilder gives you at `/.well-known/assetlinks.json`.
3. Play Console ($25 once): upload AAB, add screenshots, privacy URL, Data Safety form, content rating.
4. Declare in Data Safety: email, name, user IDs collected; deletion available in-app.

## Legal checklist
- Keep entry **free** and prizes **sponsor-funded**. Entry fees or player-funded prizes = real-money gaming rules apply.
- Free Fire is banned in India; confirm you're hosting Free Fire MAX events and get legal advice.
- Keep the "not affiliated with Garena" notice; don't use their logos.
- Slot counter is client-incremented under strict rules; for stronger anti-abuse move it to a Cloud Function.
