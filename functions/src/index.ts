import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';


/*admin.initializeApp({
  credential: admin.credential.cert(require('../../serviceAccountKey.json')),
  databaseURL: ""
});*/
admin.initializeApp(functions.config().firebase);






const db = admin.firestore();
db.settings({ignoreUndefinedProperties : true});

const main = express();
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));
main.use('/api', require('./client').routes);
main.use('/api', require('./car').routes);
main.use('/api', require('./turn').routes);

export const api = functions.https.onRequest(main);
export { db };
