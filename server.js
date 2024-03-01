// External module imports
const express = require('express');
const session = require('express-session');

// Internal module imports
const routes = require('./controllers'); 
const exphbs = require('express-handlebars'); 
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

// Session configuration
const sess = {
  secret: 'Super secret secret', 
  cookie: {
      maxAge: 300000, 
      httpOnly: true, 
      secure: false, 
      sameSite: 'strict', 
  },
  resave: false, 
  saveUninitialized: true, 
  store: new SequelizeStore({ 
      db: sequelize
  })
}; 

app.use(session(sess));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Start server function
const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();