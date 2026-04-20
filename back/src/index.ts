import app from './app';
import http from 'http';
import { Client } from 'pg';
import { umzug } from './db/migrate';
import models = require('./db/models');
import logger from './utils.ts/logger';

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
    logger.error(`Refusing to create database: invalid name "${dbName}"`);
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
      logger.info(`Database "${dbName}" not found, creating it...`);
      await client.query(`CREATE DATABASE "${dbName}";`);
      logger.info(`Database "${dbName}" created successfully.`);
    }
  } catch (error) {
    logger.error('Error ensuring database exists:', error);
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
    const SiteSettingsModel = models.sequelize.models.SiteSettings;
    const existing = await SiteSettingsModel.findOne();
    if (!existing) {
      await SiteSettingsModel.create({ totalMinPoints: 300 });
      logger.info('Default site settings created (totalMinPoints: 300)');
    }
  } catch (error) {
    logger.error('Failed to seed site settings:', error);
  }

  server.listen(PORT, () => {
    logger.info(`API listening on port ${PORT}`);
  });
});
