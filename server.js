// External module imports
const express = require('express');
const session = require('express-session');
const path = require('path');

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
  secret: process.env.SESSION_SECRET || 'Super secret secret', 
  cookie: {
    maxAge: 300000, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', 
  },
  resave: false, 
  saveUninitialized: true, 
  store: new SequelizeStore({ 
    db: sequelize
  })
};

// Middleware
app.use(session(sess));

// Set up Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static file serving with cache control
app.use('/', express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true,
}));


app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Trust proxy if behind reverse proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Routes
app.use(routes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    message: 'Page not found',
    logged_in: req.session.logged_in
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).render('error', { 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    status: statusCode
  });
});

// Start server function
const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();