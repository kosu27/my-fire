const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test4-a29fa.firebaseio.com",
});

const router = express.Router();

const endPoint = "/messages";

const db = admin.firestore();

// messages
router
  .route(endPoint)
  .get(async (req, res) => {
    const messages = [];
    try {
      const querySnapshot = await db
        .collection("messages")
        .orderBy("createdAt", "desc")
        .get();
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    } catch (error) {
      console.error(error, "@@@@@@@@@");
    }

    res.json({
      message: "Called by the GET method",
      messages,
    });
  })
  .post(async (req, res) => {
    const { name, body } = req.body;
    const createdAt = new Date().toISOString();

    try {
      const docRef = await db.collection("messages").add({
        name,
        body,
        createdAt,
      });

      const docSnapshot = await docRef.get();
      const createdMessage = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };

      res.json({
        message: "Called by the POST method",
        data: createdMessage,
      });
    } catch (error) {}
  });

//messages/1
router
  .route(`${endPoint}/:id`)
  .put(async (req, res) => {
    const { id } = req.params;
    const { name, body } = req.body;

    const newData = {
      name,
      body,
    };

    try {
      await db.collection("messages").doc(id).update(newData);

      res.json({
        message: `Updated!! ID: ${id}`,
      });
    } catch (error) {
      res.status(500).json({
        message: `SomethingError!! ID: ${id}`,
      });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    try {
      await db.collection("messages").doc(id).delete();

      res.json({
        message: `Deleted!! ID: ${id}`,
      });
    } catch (error) {
      res.status(500).json({
        message: `SomethingError!! ID: ${id}`,
      });
    }
  });

module.exports = router;
