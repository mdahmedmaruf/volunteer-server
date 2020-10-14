const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
const multer  = require('multer');
const { query } = require('express');
const upload = multer({ dest: 'uploads/' });
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.juysi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 4000;

console.log(process.env.DB_USER);



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollections = client.db(process.config.DB_NAME).collection("VolunteerLists");
  const registrationCollections = client.db(process.config.DB_NAME).collection("RegisterLists");
  
  app.post('/addVolunteerList', (req, res) => {
    const volunteerCollection = req.body;
    volunteerCollections.insertOne(volunteerCollection)
    .then(result => {
      //console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post('/addRegistration', (req, res) => {
    const registrationCollection = req.body;
    registrationCollections.insertOne(registrationCollection)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
      
    });
  });

  app.get('/AllRegisterUsers', (req, res) => {
    registrationCollections.find({})
    .toArray((error, documents) => {
      res.send(documents);
    });
  });

  


  // app.use('/upload', upload.single(), (req, res) => {
  //   const volunteerCollection = req.body.file;
  //   volunteerCollections.insertOne(volunteerCollection)
  //   .then(result => {
  //     res.send(result.insertedCount > 0);
  //   });
  // });

  app.get('/volunteerList', (req, res) => {
    volunteerCollections.find({})
    .toArray((error, documents) => {
      res.send(documents);
    });
  });


  app.get('/singleVolunteerEvent/:id', (req, res) => {
    volunteerCollections.find({_id: ObjectId(req.params.id)})
    .toArray((result) => {
      res.send(result);
    })
  })

  app.get('/userTask', (req, res) => {
    const queryEmail = req.query.email;
    registrationCollections.find({email: queryEmail})
    .toArray((error, documents) => {
      res.send(documents);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    registrationCollections.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    })
  })

  
});


app.get('/', (req, res) => {
  res.send(`<h3>Hello Every One Welcome to Volunteer Network</h3>`);
});

app.listen(process.env.PORT || port);