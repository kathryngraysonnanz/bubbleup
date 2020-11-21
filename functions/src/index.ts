import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const reminder =  functions.pubsub.schedule('every saturday 14:00').onRun(async context => {

    const msg = {
      to: 'songgrl7@yahoo.com',
      from: 'hello@bubbleupapp.com',
      templateId: TEMPLATE_ID
    };

    return sgMail.send(msg);

});
