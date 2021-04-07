import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const firestore = admin.firestore();


const cors = require('cors')({
    origin: true,
});
/*
exports.newPedido = functions.firestore
    .document('/citas/{citaId}')
    .onCreate( async (event) => {
        const pedido = event.data();

        const dataFcm = {
            enlace: '/citas',
        }

        const path = '/Citas/' + uiAdmin;
        const docInfo = await firestore.doc(path).get();
        const dataUser = docInfo.data() as any;
        const token = dataUser.token;
        const registrationTokens = [token];

        const dataFcm - {
            enlace: '/citas',
        }

        const notification: INotification {
        }

});*/

interface INotification{
    data: any;
    tokens: string[];
    notification: admin.messaging.Notification;
}
