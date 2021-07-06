import { Client } from 'pg';

const client = new Client({
  user: process.env.POSTGRES_USER || 'ephuxpoang',
  password: process.env.POSTGRES_PASSWORD || 'ephuxpoang',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB || 'phuxdb',
});

export const connectionTest = () => {
  client
    .connect()
    .then(() => {
      console.log(client);
      console.log('Connected succesfuly to the database');
    })
    .catch(e => {
      console.error(e);
    })
    .finally(() => {
      client.end();
    });
};
