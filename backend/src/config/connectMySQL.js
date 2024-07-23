import mysql from 'mysql2/promise';
import configEnv from './config.js';

const { host, user, port, password, database } = configEnv.mysql;

const config = {
    host,
    user,
    port,
    password,
    database
}

const connection = await mysql.createConnection(config);

export default connection;

