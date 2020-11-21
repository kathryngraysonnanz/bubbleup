import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const reminder =  functions.pubsub.schedule('every thursday 20:35').onRun(async context => {

    const msg = {
      to: 'songgrl7@yahoo.com',
      from: 'hello@bubbleupapp.com',
      templateId: TEMPLATE_ID
    };

    return sgMail.send(msg);

});
