import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

admin.initializeApp();
const db = firebase.database();

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

exports.emailMessage = functions.https.schedule('every wednesday 21:20') => {

  return cors(() => {

    db.ref("/reminders").on("value", snapshot => {
    var emails = (snapshot.val() && snapshot.val().users) || false;

    const msg = {
        to: emails,
        from: 'hello@bubbleupapp.com',
        templateId: TEMPLATE_ID
    };

    sgMail.setApiKey(API_KEY);
    sgMail.send(msg);
    res.status(200).send("success");
  }).catch(() => {
    res.status(500).send("error");
  });
});
