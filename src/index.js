const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const userRoutes = require("./routes/userRoutes");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
//connect to the database
dbConnect();

// middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server API is running..." });
});

//Start the server
app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
