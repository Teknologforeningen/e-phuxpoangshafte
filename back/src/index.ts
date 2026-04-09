import app from './app'
import http from 'http';
import { Client } from 'pg';
var models = require('./db/models');

const server = http.createServer(app)

const PORT = process.env.API_PORT || 8000;

async function ensureDatabaseExists() {
  const dbName = process.env.NODE_ENV !== 'production' ? process.env.DEV_DB : process.env.DB_NAME;
  const user = process.env.NODE_ENV !== 'production' ? process.env.DEV_USERNAME : process.env.DB_USER;
  const password = process.env.NODE_ENV !== 'production' ? process.env.DEV_PASSWORD : process.env.DB_PASSWORD;
  const host = process.env.NODE_ENV !== 'production' ? process.env.DEV_HOST : process.env.DB_HOST;

  if (!dbName) return;

  const client = new Client({
    user,
    password,
    host,
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" not found, creating it...`);
      await client.query(`CREATE DATABASE "${dbName}";`);
      console.log(`Database "${dbName}" created successfully.`);
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
  } finally {
    await client.end();
  }
}

ensureDatabaseExists().then(() => {
  models.sequelize.sync({ alter: true }).then(async () => {
    try {
      const CategoryModel = models.sequelize.models.Category;
      const [totalCategory] = await CategoryModel.findOrCreate({
        where: { name: 'Totala poäng' },
        defaults: {
          description: 'Sammanlagd poänggräns för alla kategorier.',
          minPoints: 300,
          isGlobalCategory: true,
        }
      });
      // Migrate existing row in case it was created before isGlobalCategory existed
      if (!totalCategory.isGlobalCategory) {
        await totalCategory.update({ isGlobalCategory: true });
        console.log('Migrated "Totala poäng" category: set isGlobalCategory = true');
      }
    } catch (error) {
      console.error('Failed to seed default category:', error);
    }

    server.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  });
});
