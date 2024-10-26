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

export default await mysql.createConnection(config);
