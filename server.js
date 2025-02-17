require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/auth", require("./routes/authRoutes"));
app.use("/notes", require("./routes/noteRoutes"));
app.use("/user", require("./routes/userRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
