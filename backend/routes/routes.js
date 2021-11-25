const newsRoutes = require('./news');

const appRouter = (app, fs) => {
  
  app.get('/', (req, res) => {
    res.send('welcome to the backend api-server');
  });

  newsRoutes(app, fs);
};

// this line is unchanged
module.exports = appRouter;