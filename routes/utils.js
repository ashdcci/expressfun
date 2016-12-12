var mysql = require('mysql');
var connection =  mysql.createConnection({
		  host: 'localhost',
		  user: 'root',
		  password: 'signity',
		  database: 'test'
		})
connection.connect()
return connection;