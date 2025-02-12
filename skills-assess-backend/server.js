const express = require('express');
const cors = require('cors');
require('dotenv').config();

const auth = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Define a test route for "/"
app.get("/", (req, res) => {
    res.send("Backend is running!");
  });


// ✅ Ensure Auth Routes Are Loaded
const authRoutes = require("./routes/auth"); // Adjust path if needed
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
