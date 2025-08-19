const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.notifyPostChange = functions.firestore
  .document("posts/{postId}")
  .onCreate(async (snap, context) => {
    const newPost = snap.data();

    // Fata FCM tokens zose muri Tokens collection
    const tokensSnapshot = await admin.firestore().collection("Tokens").get();
    const tokens = tokensSnapshot.docs
      .map(doc => doc.data().fcmToken)
      .filter(token => token);

    if (tokens.length === 0) return null;

    const message = {
      notification: {
        title: "New Post Added",
        body: newPost.title || "A new post is available!",
      },
      tokens: tokens,
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log("Notifications sent:", response.successCount);
      return response;
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  });
