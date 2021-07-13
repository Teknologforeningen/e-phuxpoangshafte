import app from './app'
import http from 'http';
var models = require('./db/models');

const server = http.createServer(app)

const PORT = process.env.API_PORT || 8000;
models.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
});
