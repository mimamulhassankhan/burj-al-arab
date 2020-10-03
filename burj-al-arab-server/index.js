require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require("./configs/burj-al-arab-ltd-firebase-adminsdk-697ml-c0fc9dee98.json");
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tviz5.mongodb.net/burjAlArab?retryWrites=true&w=majority";`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

const app = express();
app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIRE_URL
});



client.connect(err => {
  const bookingCollection = client.db("burjAlArab").collection("bookings");
  
  app.post('/addBookings', (req, res) => {
    const newBooking = req.body;
    bookingCollection.insertOne(newBooking)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })

  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if(bearer && bearer.startsWith('Bearer ')){
      const userToken = bearer.split(' ')[1];
      admin.auth().verifyIdToken(userToken)
      .then(function(decodedToken) {
        if(decodedToken.email == req.query.email){
          bookingCollection.find({email: req.query.email})
          .toArray((err, documents) => {
              res.send(documents);
          })
        }
        else{
          res.status(401).send('Un Authorized!!');
        }
      }).catch(function(error) {
        res.status(401).send('Un Authorized!!');
      });
    }
    else{
      res.status(401).send('Un Authorized!!');
    }
  })

});

app.listen(5000);