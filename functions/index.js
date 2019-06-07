const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const uuidv4 = require('uuid/v4');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();


// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var itemsRef = db.collection('items');

app.post('/api/items', async (req, res) => {
    console.log("Hola, amigo");
    let uuid = "";
    do {
        uuid = uuidv4();
        var records = itemsRef.doc(uuid);
        var doc = await records.get();
    }
    while (doc.exists);

    try {

        // let querySnapshot = await itemsRef.get();
        // let numRecords = querySnapshot.docs.length;
        let item = {
            id: uuid,
            title: req.body.title,
            description: req.body.description,
            path: req.body.path
        };
        console.log("item.id: ", item.id);
        console.log("item.title: ", item.title);
        
        itemsRef.doc(item.id.toString()).set(item);
        res.send(item);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
    try{
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

app.delete('/api/items/:id', async (req,res) => {
    
    // console.log("req.params.id: ", req.params.id.toString());

    let id = req.params.id.toString();

    try {
        var documentToDelete = itemsRef.doc(id);
        var doc = await documentToDelete.get();
        if(!doc.exists) {
            res.status(404).send("Sorry, that item doesn't exist");
            return;
        }
        else{
            documentToDelete.delete();
            res.status(200).send("Jerk. You successfully deleted my close friend, id# " + req.params.id);
            return;
        }
    }catch(err){
        res.status(500).send("Error deleting document: ", err);
    }
});

app.put('/api/items/:id', async (req,res) => {
    
    // console.log("req.params.id: ", req.params.id.toString());

    let id = req.params.id.toString();

    try {

        var documentToEdit = itemsRef.doc(id);

        
        var doc = await documentToEdit.get();
        // documentToEdit.title = req.body.title;

        if(!doc.exists){
            res.status(404).send("Sorry, that item doesn't exist");
            return;
        }
        else {
            
            documentToEdit.update({title: req.body.title, description: req.body.description});
            res.status(200).send("Successfully updated item with id# " + req.params.id);
            return;
        }

    }catch(err){
        res.status(500).send("Error deleting document: ", err);
    }
});

exports.app = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
