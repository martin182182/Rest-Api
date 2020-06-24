import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const dbCars = "cars";

interface Car {
  color: String
  anio: String
  placa: String
}

interface Brand {
  name: String,
  country: String
}

routes.post('/cars',async(req,res)=>{
  try{
    const car:Car = {
      color: req.body['color'],
      anio: req.body['anio'],
      placa: req.body['placa']
    }
    const newCar = await firebaseHelper.firestore
                            .createNewDocument(db,dbCars,car);
    res.status(200).send(`Car with id ${newCar.id} was added successfully`);
  }
  catch(err){
    res.status(404).send(`An error has ocurred ${err}`);
  }
});

routes.get('/cars',(req,res)=>{
  firebaseHelper.firestore.backup(db,dbCars).then(result=> res.status(200).send(result))
  .catch(err => res.status(404).send(`An error has ocurred ${err}`));
});

routes.get('/cars/:id',async(req,res)=>{
  firebaseHelper.firestore.getDocument(db,dbCars,req.params.id)
  .then(doc => res.status(200).send(doc))
  .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.patch('/cars/:id',async(req,res)=>{
  try{
    let id = req.params.id
    await firebaseHelper.firestore.updateDocument(db,dbCars,id,req.body);
    res.status(200).send(`Car with id ${id} was updated`)
  }
  catch(err){
    res.status(400).send(`An error has ocurred ${err}`);
  }
});

routes.delete('/cars/:id',async(req,res)=>{
  try{
    let id = req.params.id;
    await firebaseHelper.firestore.deleteDocument(db,dbCars,id);
    res.status(200).send(`Car ${id} was deleted`);
  }
  catch(err){
    res.status(400).send(`An error has ocurred ${err}`);
  }
});

routes.post('/cars/:id/brand',(req,res)=>{
  const newBrand : Brand = {
    name: req.body['name'],
    country: req.body['country']
  };

  let brandRegistration = db.collection(dbCars).doc(req.params.id);

  brandRegistration.collection('brands').add(newBrand).then(brandAdded => {
      res.status(201).send(`Brand added with id ${brandAdded.id}`);
  }).catch(err => {
      res.status(400).send(`An error has ocurred ${err}`);
  });
})

export{ routes };
