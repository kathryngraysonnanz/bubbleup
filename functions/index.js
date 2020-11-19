import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = firebase.database();

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

// Send a reminder email to all opted-in users
export const weeklyReminder =  functions.pubsub.schedule('every wednesday 21:03').onRun(async context => {

    db.ref("/reminders").on("value", snapshot => {
    var emails = (snapshot.val() && snapshot.val().users) || false;

    const msg = {
        to: emails,
        from: 'hello@bubbleupapp.com',
        templateId: TEMPLATE_ID
    };

    return sgMail.send(msg);

});
