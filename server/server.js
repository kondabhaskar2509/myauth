import express from "express";
import cors from "cors";
import mongodb from "mongodb";
import setupOAuth from "./oauth.js";
import setupAuth from "./auth.js";

const app = express();
const MongoClient = mongodb.MongoClient;
const url ="mongodb://localhost:27017/";
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(url, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    const oauthcollection = client.db("booking").collection("oauthdata");
    const oauthtokenscollection = client.db("booking").collection("oauthtoken");
    const oauthlogincollection = client.db("booking").collection("oauthlogin");
   

    setupOAuth(app, oauthcollection ,oauthtokenscollection ,oauthlogincollection);
    setupAuth(app, oauthlogincollection);

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  });
