//这些都是dependency
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

//globals 里面加入了 passport config（gethub）那个，所以要放前面
const globals = require('./config/globals')

//passport start here

// passport这些是要放在controller之前的，因为要先登录才能具体用
// passport for auth, express-session for session mgmt
const passport = require('passport')
const session = require('express-session')

// configure passport BEFORE referencing controllers since controllers will need to use passport
// 1 - configure app to use sessions w/some required options
app.use(session({
    secret: 'someRandomString@123',
    resave: true,
    saveUninitialized: false
}))

// 2 - enable passport w/session support
//因为我们需要用session去记录登录信息（类似php，）这一步结束后，我们去model建立user model
app.use(passport.initialize())
app.use(passport.session())

//第三步把建立的user model连接到passport
// 3 - link passport to User model with extends passport-local-mongoose
const User = require('./models/user')
passport.use(User.createStrategy())

//第四步是读取 和改写 session数据
// 4 - set passport to read/write User data to/from the session object
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//passport Github config
const gitHub = require('passport-github2').Strategy

passport.use(new gitHub({
        clientID: globals.gitHub.clientID,
        clientSecret: globals.gitHub.clientSecret,
        callbackURL: globals.gitHub.callbackURL
    }, async (accessToken, refreshToken, profile, callback) => {
        try {
            //查一下，是不是这个github user已经在了，
            // check if GitHub user already exists in our db
            const user = await User.findOne({ oauthId: profile.id })
            if (user) {
                return callback(null, user) // user already exist so return user object and continue
            }
            else {
                // 如果没有了，那么就建立一下存入db
                // create new GitHub user in our db and return the new user object to the calling function
                const newUser = new User({
                    username: profile.username,
                    oauthProvider: 'GitHub',
                    oauthId: profile.id
                })
                const savedUser = await newUser.save()
                callback(null, savedUser)
            }
        }
        catch (err) {
            callback(err)
        }
    }
))

//passport config end here




//加入controllers
var indexRouter = require('./controllers/index');
var usersRouter = require('./controllers/users');
var artistsRouter = require('./controllers/artists');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置这些controller的路径
//这个意思是说，如果是进入了homepage/那么就用这个 controller，如果是进入了homepage/users这个就用usercontroller
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/artists', artistsRouter);


// mongodb connection w/mongoose
const mongoose = require('mongoose')

//这里如果是测试，是不是能连接上服务器
mongoose.connect(globals.db,{
  useNewUrlParser: true,
  useUnifiedTopology: true

}).then(
    (res) => {
      console.log('Connected to MongoDB')
    }
).catch(() => {
  console.log('Could not connect to MongoDB')
})





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
