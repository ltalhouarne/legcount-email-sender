var express = require('express');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var admin = require("firebase-admin");

var serviceAccount = require("./leg-count-dev-firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://leg-count-dev.firebaseio.com/",
  databaseAuthVariableOverride: {
    uid: "OMMITTED"
  }
});

var db = admin.database();
var ref = db.ref("email");

var transporter = nodemailer.createTransport(sesTransport({
  accessKeyId: "OMMITTED",
  secretAccessKey: "OMMITTED",
  rateLimit: 5
}));

ref.on("child_added", function(snapshot) {
  if(snapshot.val().status === 'notSent') {
    transporter.sendMail({
        from: 'no-reply@legcount.com',
        to: snapshot.val().to,
        subject: 'You are invited to join ' + snapshot.val().teamName + ' team',
        text: 'Please go to legcount.com to sign up for your team.'
    }, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info);
      }
    });
    ref.child(snapshot.key).update({"status" : "sent"});
  }
});
