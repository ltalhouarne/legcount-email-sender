var express = require('express');
var nodemailer = require('nodemailer');
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

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'legcount@gmail.com',
    pass: 'OMITTED'
  }
});

ref.on("child_added", function(snapshot) {
  if(snapshot.val().status === 'notSent') {
    transporter.sendMail({
        from: 'legcount@gmail.com',
        to: snapshot.val().to,
        subject: 'You are invited to join ' + snapshot.val().teamName + ' team',
        text: 'Please go to legcount.com to sign up for your team.'
    }, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    ref.child(snapshot.key).update({"status" : "sent"});
  }
});
