// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.scheduledPostNotifier = functions
  .pubsub
  .schedule("every 5 minutes")     // scheduler
  .timeZone("Africa/Kigali")      // optional: timezone
  .onRun(async (context) => {
    const fiveMinAgo = admin.firestore.Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);

    // find posts created/updated in last 5 minutes
    const postsSnap = await db.collection("posts").where("timestamp", ">", fiveMinAgo).get();
    if (postsSnap.empty) {
      console.log("No new posts in last 5 minutes.");
      return null;
    }

    // get tokens
    const tokensSnap = await db.collection("fcmTokens").get();
    const tokens = tokensSnap.docs.map(d => d.id).filter(Boolean);
    if (!tokens.length) {
      console.log("No tokens to send to.");
      return null;
    }

    // build messages
    const messages = [];
    postsSnap.forEach(postDoc => {
      const post = postDoc.data();
      const title = post.title || "Post nshya";
      const body = (post.excerpt || (post.body && post.body.substring(0,120))) || "";
      tokens.forEach(token => {
        messages.push({
          token,
          notification: { title, body },
          webpush: { fcmOptions: { link: `/posts/${postDoc.id}` } },
          data: { postId: postDoc.id }
        });
      });
    });

    // send in batches of 500
    const BATCH = 500;
    for (let i = 0; i < messages.length; i += BATCH) {
      const batch = messages.slice(i, i + BATCH);
      const resp = await admin.messaging().sendAll(batch);
      // clean up bad tokens
      resp.responses.forEach((r, idx) => {
        if (!r.success) {
          const err = r.error;
          const badToken = batch[idx].token;
          if (err && (err.code === "messaging/registration-token-not-registered" || err.code === "messaging/invalid-registration-token")) {
            console.log("Removing invalid token", badToken);
            db.collection("fcmTokens").doc(badToken).delete().catch(console.error);
          } else {
            console.warn("Error sending message for token", badToken, err);
          }
        }
      });
    }

    console.log("Notifications sent for new posts.");
    return null;
  });
