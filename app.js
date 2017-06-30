var express = require('express');

var admin = require("firebase-admin");

var serviceAccount = require("./leg-count-dev-firebase-adminsdk-8ocjf-c21fd6d9f7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://leg-count-dev.firebaseio.com/",
  databaseAuthVariableOverride: {
    uid: "email-sender"
  }
});

var db = admin.database();
var ref = db.ref("email");

ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

ref.on("child_added", function(snapshot) {
  console.log(snapshot.val());
});
