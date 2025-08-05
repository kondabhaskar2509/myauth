function setupAuth(app, myauthcollection) {
  app.post("/signup", async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      const user = await myauthcollection.findOne({ email });
      if (user) {
        return res.json({ status: "error", error: "User already exists" });
      }
      const result = await myauthcollection.insertOne({
        name,
        email,
        password,
        confirmPassword,
      });

      res.json({
        status: "success",
        id: result.insertedId,
        user: userObj,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await myauthcollection.findOne({ email });
      if (!user) {
        return res.json({ status: "error", error: "User not found" });
      }
      if (user.password !== password) {
        return res.json({ status: "error", error: "Invalid password" });
      }

      const userObj = {
        name: user.name,
        email: user.email,
      };

      res.json({
        status: "success",
        id: user._id,
        user: userObj,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/userdetails", async (req, res) => {
    try {
      const { email } = req.query;

      const user = await myauthcollection.findOne({ email });
      if(user) {
      res.json({ name: user.name, email: user.email });

      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}

export default setupAuth;
