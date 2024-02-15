const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

// Handlebars setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Express session setup
app.use(session({
  secret: 'super secret string',
  cookie: { maxAge: 1800000 }, // Session expires after 30 minutes of inactivity
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  }),
}));

// Routes
app.use(routes);

// Start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
});