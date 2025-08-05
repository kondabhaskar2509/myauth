import { ObjectId } from "mongodb";

function setupOAuth(
  app,
  clientcollection,
  myauthcollection
) {
  app.post("/createclient", async (req, res) => {
    try {
      const {
        appname,
        homepageurl,
        redirecturl,
        description,
        clientId,
        clientSecret,
        email,
        code,
      } = req.body;

      const client = await clientcollection.findOne({ appname, email });
      if (client) {
        return res.json({ status: "error", error: "Client already exists" });
      }
      const result = await clientcollection.insertOne({
        appname,
        homepageurl,
        redirecturl,
        description,
        clientId,
        clientSecret,
        email,
        code,
      });
      res.json({ status: "success", id: result.insertedId });
    } catch (err) {
      console.error("Error in /createclient:", err);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.get("/clients", async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Missing email" });
      }
      const clients = await clientcollection.find({ email }).toArray();
      res.json(clients);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/client", async (req, res) => {
    try {
      const { clientId } = req.query;

      const client = await clientcollection.findOne({ clientId });
      if (client) {
        res.json(client);
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/authorize", async (req, res) => {
    try {
      const { clientId } = req.body;
      if (!clientId) {
        console.log("Missing clientId");
        return res.status(400).json({
          error: "Missing clientId",
        });
      }

      const client = await clientcollection.findOne({
        clientId,
      });
      if (!client) {
        console.log("Invalid client credentials");
        return res.status(401).json({ error: "Invalid client credentials" });
      }
      const email = client.email;
      const user = await myauthcollection.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ error: "User not found" });
      }

      await clientcollection.updateOne(
        { clientId: clientId },
        { $set: { accesstoken: user._id } } 
      );

      res.json({ code : client.code });
    } catch (err) {
      console.error("Error in /authorize:", err);
      res.status(500).json({ error: "Failed to authorize" });
    }
  });

  app.post("/getaccesstoken", async (req, res) => {
    try {
      const { clientid, clientsecret, code } = req.body;
      if (!clientid || !clientsecret || !code) {
        console.log("Missing client_id, client_secret, or code");
        return res
          .status(400)
          .json({ error: "Missing client_id, client_secret, or code" });
      }
      const token = await clientcollection.findOne({
        code,
        clientId: clientid,
        clientSecret: clientsecret,
      });
      if (!token) {
        console.log("Invalid code or client credentials");
        return res
          .status(401)
          .json({ error: "Invalid code or client credentials" });
      }
      res.json({ accesstoken: token.accesstoken });
    } catch (err) {
      console.error("Error in /getaccesstoken:", err);
      res.status(500).json({ error: "Failed to get access token" });
    }
  });

  app.post("/getuserdetails", async (req, res) => {
    try {
      const { accesstoken } = req.body;
      if (!accesstoken) {
        return res.status(400).json({ error: "Missing access token" });
      }
      const userId = new ObjectId(accesstoken);
      const user = await myauthcollection.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ name: user.name, email: user.email });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  });
}

export default setupOAuth;
