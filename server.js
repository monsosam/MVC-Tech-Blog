const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const app = express();
const PORT = process.env.PORT || 3001;


const hbs = exphbs.create({ helpers });


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

// Set up Handlebars as the view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(express.static('public'));

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(routes);

// Sync Sequelize models to the database, then start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});