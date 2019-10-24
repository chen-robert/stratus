var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const session = require("express-session");

const PORT = 3000 || process.env.PORT;

var app = express();

// Sessions
app.use(session({
  name: "session",
  secret: process.env.SECRET || "cas-project ihs",
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.urlencoded({ extended: false }));
app.use(require("less-middleware")(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));

const requireAuth = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    req.session.error = "Login required";
    res.redirect("/login");
  }
};

// https://stackoverflow.com/questions/5251520/how-do-i-escape-some-html-in-javascript/5251551
function escapeHTML (s) {
  return s.replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

app.use(function (req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;

  res.locals.message = "";
  if (err) res.locals.message = '<p class="msg error">' + escapeHTML(err) + "</p>";
  if (msg) res.locals.message = '<p class="msg success">' + escapeHTML(msg) + "</p>";
  next();
});

app.use("/login", require("./server/routes/login"));
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.use(requireAuth);
app.use("/", require("./server/routes/index"));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
