import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

admin.initializeApp();

export const reminder = functions.pubsub.schedule('every saturday 21:00').onRun(async context => {

  let reminderList = false
  let emails:string[] = []

  var ref = await admin.database().ref("users");
  ref.orderByChild('reminders').equalTo(true).on("value", function(snapshot) {
      reminderList = snapshot.val()
      Object.entries(reminderList).map(member => emails.push(member[1].email))
  });

    const msg = {
      to: emails,
      from: 'hello@bubbleupapp.com',
      templateId: TEMPLATE_ID
    };

    return sgMail.sendMultiple(msg);

});
