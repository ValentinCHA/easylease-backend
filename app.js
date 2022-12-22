require("dotenv").config();
require("./models/connection");
const fileUpload = require("express-fileupload");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var clientRouter = require("./routes/client");
var scenaryRouter = require("./routes/scenary");
var contratRouter = require("./routes/contrat");
var interlocutorRouter = require("./routes/interlocutor");
var cloudinaryRouter = require("./routes/cloudinary");

var app = express();

const cors = require("cors");

app.use(cors());
app.use(fileUpload());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/scenary", scenaryRouter);
app.use("/client", clientRouter);
app.use("/contrat", contratRouter);
app.use("/interlocutor", interlocutorRouter);
app.use("/cloudinary", cloudinaryRouter);

module.exports = app;
