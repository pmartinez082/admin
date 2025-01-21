import mysql from 'mysql2/promise';
const dbConnection = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "putxerak",
  database: "putxerappdb",
  port: 3306,
});


export default dbConnection;