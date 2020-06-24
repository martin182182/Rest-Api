import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const dbTurns = "turns";

interface Turn {
  date: Date
  responsi: String
}

interface Detail {
  descrip: String
  cost: Number
}


routes.post('/turns',async(req,res)=>{
  try{
    const turn:Turn = {
      date: new Date(),
      responsi: req.body['responsi']
    }
    const newTurn = await firebaseHelper.firestore
                            .createNewDocument(db,dbTurns,turn);
    res.status(200).send(`Turn with id ${newTurn.id} was added successfully`);
  }
  catch(err){
    res.status(404).send(`An error has ocurred ${err}`);
  }
});

routes.get('/turns',(req,res)=>{
  firebaseHelper.firestore.backup(db,dbTurns).then(result=> res.status(200).send(result))
  .catch(err => res.status(404).send(`An error has ocurred ${err}`));
});

routes.get('/turns/:id',async(req,res)=>{
  firebaseHelper.firestore.getDocument(db,dbTurns,req.params.id)
  .then(doc => res.status(200).send(doc))
  .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.patch('/turns/:id',async(req,res)=>{
  try{
    let id = req.params.id
    await firebaseHelper.firestore.updateDocument(db,dbTurns,id,req.body);
    res.status(200).send(`Turn with id ${id} was updated`)
  }
  catch(err){
    res.status(400).send(`An error has ocurred ${err}`);
  }
});

routes.delete('/turns/:id',async(req,res)=>{
  try{
    let id = req.params.id;
    await firebaseHelper.firestore.deleteDocument(db,dbTurns,id);
    res.status(200).send(`Turn ${id} was deleted`);
  }
  catch(err){
    res.status(400).send(`An error has ocurred ${err}`);
  }
});

routes.post('/turns/:id/detail',(req,res)=>{
  const newDetail : Detail = {
    descrip: req.body['descrip'],
    cost: req.body['cost']
  };

  let detailRegistration = db.collection(dbTurns).doc(req.params.id);

  detailRegistration.collection('details').add(newDetail).then(detailAdded => {
      res.status(201).send(`Detail added with id ${detailAdded.id}`);
  }).catch(err => {
      res.status(400).send(`An error has ocurred ${err}`);
  });
})

export{ routes };
