const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const redis = require('redis');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = 'mongodb+srv://alexRosenbach:KlaqWwJaxD4JDD8V@cluster0.xonqb.mongodb.net/DomoMaker';

const mongooseOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to the database');
    throw err;
  }
});

let redisUrl = {
  hostname: "redis-12639.c258.us-east-1-4.ec2.cloud.redislabs.com",
  port: 12639
}

let redisPass = 'x8Clzhm0MfnGKbdsRhpiGD3zAAdS1VT8';

if (process.env.REDISCLOUD_URL) {
  redisUrl = url.parse(process.env.REDISCLOUD_URL);
  [, redisPass] = redisUrl.auth.split(':');
}
let redisClient = redis.createClient({
  host: redisUrl.hostname,
  port: redisUrl.port,
  password: redisPass,
})

const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({ client: redisClient }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Listening on port ${port}`);
});
