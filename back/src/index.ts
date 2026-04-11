import app from './app';
import http from 'http';
import { Client } from 'pg';
import { umzug } from './db/migrate';
var models = require('./db/models');

const server = http.createServer(app);

const PORT = process.env.API_PORT || 8000;

const SAFE_DB_NAME_RE = /^[A-Za-z0-9_]+$/;

async function ensureDatabaseExists() {
  if (process.env.NODE_ENV === 'production') return;

  const dbName = process.env.DEV_DB;
  const user = process.env.DEV_USERNAME;
  const password = process.env.DEV_PASSWORD;
  const host = process.env.DEV_HOST;

  if (!dbName) return;

  if (!SAFE_DB_NAME_RE.test(dbName)) {
    console.error(`Refusing to create database: invalid name "${dbName}"`);
    return;
  }

  const client = new Client({
    user,
    password,
    host,
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`,
      [dbName],
    );
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

ensureDatabaseExists().then(async () => {
  // sync() (no alter) creates tables for fresh environments; schema changes are handled by migrations
  await models.sequelize.sync();
  // Run all pending migrations — safe in every environment
  await umzug.up();

  try {
    const CategoryModel = models.sequelize.models.Category;
    const globalCategoryValues = {
      name: 'Totala poäng',
      description: 'Sammanlagd poänggräns för alla kategorier.',
      minPoints: 300,
      isGlobalCategory: true,
    };

    let totalCategory = await CategoryModel.findOne({
      where: { isGlobalCategory: true },
    });

    if (!totalCategory) {
      await CategoryModel.create(globalCategoryValues);
    } else if (
      totalCategory.name !== globalCategoryValues.name ||
      totalCategory.description !== globalCategoryValues.description ||
      totalCategory.minPoints !== globalCategoryValues.minPoints ||
      !totalCategory.isGlobalCategory
    ) {
      await totalCategory.update(globalCategoryValues);
      console.log('Ensured seeded global category values are up to date');
    }
  } catch (error) {
    console.error('Failed to seed default category:', error);
  }

  server.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
});
