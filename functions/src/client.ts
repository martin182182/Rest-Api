import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const dbClients = "clients";

interface Client {
  name: String
  ci: String
  direc: String
}

routes.post('/clients',async(req,res)=>{
  try{
    const client:Client = {
      name: req.body['name'],
      ci: req.body['ci'],
      direc: req.body['direc']
    }
    const newClient = await firebaseHelper.firestore
                            .createNewDocument(db,dbClients,client);
    res.status(200).send(`Client ${newClient.id} was added successfully`);
  }
  catch(err){
    res.status(404).send(`An error has ocurred ${err}`);
  }
});

routes.get('/clients',(req,res)=>{
  firebaseHelper.firestore.backup(db,dbClients).then(result=> res.status(200).send(result))
  .catch(err => res.status(404).send(`An error has ocurred ${err}`));
});

routes.get('/clients/:id',async(req,res)=>{
  firebaseHelper.firestore.getDocument(db,dbClients,req.params.id)
  .then(doc => res.status(200).send(doc))
  .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.patch('/clients/:id',async(req,res)=>{
  try{
    let id = req.params.id;
    await firebaseHelper.firestore.updateDocument(db,dbClients,id,req.body);
    res.status(200).send(`Client with id ${id} was updated`)
  }
  catch(err){
    res.status(400).send(`An error has ocurred ${err}`);
  }
});

routes.delete('/clients/:id',async(req,res)=>{
  try{
    let id = req.params.id;
    await firebaseHelper.firestore.deleteDocument(db,dbClients,id);
    res.status(200).send(`Client ${id} was deleted`);
  }
  catch(err){
    res.status(400).send(`An error has ocurred ${err}`);
  }
});

export{ routes };
