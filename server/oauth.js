import crypto from "crypto";

function setupOAuth(
  app,
  oauthcollection,
  oauthtokenscollection,
  oauthlogincollection
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
      } = req.body;

      const client = await oauthcollection.findOne({ appname, email });
      if (client) {
        return res.json({ status: "error", error: "Client already exists" });
      }
      const result = await oauthcollection.insertOne({
        appname,
        homepageurl,
        redirecturl,
        description,
        clientId,
        clientSecret,
        email,
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
      const clients = await oauthcollection.find({ email }).toArray();
      res.json(clients);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/client", async (req, res) => {
    try {
      const { clientId } = req.query;

      const client = await oauthcollection.findOne({ clientId });
      if (client) {
        res.json(client);
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/authorize", async (req, res) => {
    try {
      const { clientId, clientSecret, redirecturl, email } = req.body;
      if (!clientId || !clientSecret || !redirecturl || !email) {
        return res
          .status(400)
          .json({
            error: "Missing clientId, clientSecret, redirecturl, or email",
          });
      }

      const client = await oauthcollection.findOne({
        clientId,
        clientSecret,
        redirecturl,
      });
      if (!client) {
        return res.status(401).json({ error: "Invalid client credentials" });
      }

 
      const user = await oauthlogincollection.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const code = crypto.randomBytes(32).toString("hex");

      await oauthtokenscollection.insertOne({
        code,
        clientId,
        clientSecret,
        userId: user._id,
        createdAt: new Date(),
      });

      res.json({ code, expires_in: 600 });
    } catch (err) {
      console.error("Error in /authorize:", err);
      res.status(500).json({ error: "Failed to authorize" });
    }
  });

  app.post("/getaccesstoken", async (req, res) => {
    try {
      const { client_id, client_secret, code } = req.body;
      if (!client_id || !client_secret || !code) {
        return res
          .status(400)
          .json({ error: "Missing client_id, client_secret, or code" });
      }
      const tokenDoc = await oauthtokenscollection.findOne({
        code,
        clientId: client_id,
        clientSecret: client_secret,
      });
      if (!tokenDoc) {
        return res
          .status(401)
          .json({ error: "Invalid code or client credentials" });
      }
      res.json({ accesstoken: tokenDoc.userId });
    } catch (err) {
      res.status(500).json({ error: "Failed to get access token" });
    }
  });

  app.post("/getuserdetails", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(400)
          .json({ error: "Missing or invalid Authorization header" });
      }
      const userId = authHeader.split(" ")[1];
      const user = await oauthlogincollection.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ name: user.name, email: user.email });
    } catch (err) {
      res.status(500).json({ error: "Failed to get user details" });
    }
  });
}

export default setupOAuth;
