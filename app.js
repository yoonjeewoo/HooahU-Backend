const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const mysql = require('mysql');
const cors = require('cors');
const config = require('./config');

// const conn = mysql.createConnection(config);

/* =======================
 LOAD THE CONFIG
 ==========================*/
const port = process.env.PORT || 3000;

/* =======================
 EXPRESS CONFIGURATION
 ==========================*/
const app = express();
app.use(cors())
// process.on('uncaughtException', function(err) {
// 	console.log('Caught exception: ' + err);
// });
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
// parse JSON and url-encoded query
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


app.use(express.static('apidoc'));
app.get('/', (req, res) => {
	res.send('index.html')
});
// print the request log on console
app.use(morgan(':remote-addr'), function (req, res, next) {
	next();
});

app.use(morgan(':method'), function (req, res, next) {
	next();
});

app.use(morgan(':url'), function (req, res, next) {
	next();
});

app.use(morgan(':date'), function (req, res, next) {
	next();
});

app.use(morgan(':status'), function (req, res, next) {
	next();
});

// set the secret key variable for jwt
app.set('jwt-secret', config.secret);
// index page, just for testing

app.use('/api', require('./routes/api'));

// open the server
app.listen(port, () => {
	console.log(`Express is running on port ${port}`)
});
