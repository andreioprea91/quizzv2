if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Config
require("./config/passport")(passport);

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//database
mongoose.connect(process.env.DATABASE_URL, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

//routes
app.use("/", require("./routes/index"));
app.use("/questions", require("./routes/questions"));
app.use("/users", require("./routes/users.js"));

app.listen(process.env.PORT || 3000);
