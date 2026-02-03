import express from "express";
import cors from "cors";
import mongodb from "mongodb";
import setupOAuth from "./oauth.js";
import setupAuth from "./auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGODB_URI;
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


(async () => {
  try {
    const client = await MongoClient.connect(url, {
      maxPoolSize: 50,
      wtimeoutMS: 2500,
    });

    console.log("Connected to MongoDB");

    const db = client.db("booking");
    const clientcollection = db.collection("clientdata");
    const myauthcollection = db.collection("myauthusers");

    setupOAuth(app, clientcollection, myauthcollection);
    setupAuth(app, myauthcollection);

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Mongo connection error:", err);
    process.exit(1);
  }
})();
