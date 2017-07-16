var express = require('express');
var nodemailer = require('nodemailer');
var admin = require("firebase-admin");

var serviceAccount = require("./leg-count-dev-firebase-admin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://leg-count-dev.firebaseio.com/",
    databaseAuthVariableOverride: {
        uid: "email-sender"
    }
});

var db = admin.database();
var ref = db.ref("email");

var numberOfEmails = 1;

for(var i = 0; i < numberOfEmails; i++) {
    ref.push().set({
        status: "notSent",
        teamName: "loics",
        to: "talhouar.loic@gmail.com"
    });
}
