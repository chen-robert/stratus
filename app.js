var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

const session = require('express-session');
// Sessions
app.use(session({
  secret: process.env.SECRET || 'cas-project ihs',
  resave: false,
  saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

const requireAuth = (req, res, next) => {
  if(req.session.username){
    next();
  }else{
    req.session.error = "Login required";
    res.redirect("/login");
  }
}

// https://stackoverflow.com/questions/5251520/how-do-i-escape-some-html-in-javascript/5251551
function escapeHTML(s) { 
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + escapeHTML(err) + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + escapeHTML(msg) + '</p>';
  next();
});

app.use('/login', require('./routes/login'));
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

//app.use(requireAuth);
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
