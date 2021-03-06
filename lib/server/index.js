"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackConfigDev = require("../../webpack/webpack.config.dev.js");

var _webpackConfigDev2 = _interopRequireDefault(_webpackConfigDev);

var _secrets = require("./config/secrets");

var _secrets2 = _interopRequireDefault(_secrets);

var _passport3 = require("./config/passport");

var _passport4 = _interopRequireDefault(_passport3);

var _express3 = require("./config/express");

var _express4 = _interopRequireDefault(_express3);

var _users = require("./controllers/users");

var _users2 = _interopRequireDefault(_users);

var _games = require("./controllers/games");

var _games2 = _interopRequireDefault(_games);

require("./models/user");

require("./models/game");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------

var app = (0, _express2.default)();

var isDev = process.env.NODE_ENV === "development";

// if in development mode set up the middleware required for hot reloading and rebundling
if (isDev) {

	var compiler = (0, _webpack2.default)(_webpackConfigDev2.default);

	app.use(require("webpack-dev-middleware")(compiler, {
		noInfo: true,
		publicPath: _webpackConfigDev2.default.output.publicPath
	}));

	app.use(require("webpack-hot-middleware")(compiler));
}

// -------------------------------------------

(0, _passport4.default)(app, _passport2.default);
(0, _express4.default)(app, _passport2.default);

// -------------------------------------------

//Reg/login
app.post("/login", _users2.default.login);
app.get("/logout", _users2.default.logout);
app.post("/register", _users2.default.register);

//Game
app.post('/user/:id', function (req, res) {
	console.log('POST savegame tangerine');
	_games2.default.saveGame(req, res);
});

//Get new friend matches
app.put('/myprofile', _users2.default.getMatches);

app.put('/user/:id', function (req, res) {
	_games2.default.deleteGame(req, res);
});

var cors = require('cors');
app.use(cors());

app.get('/games', _games2.default.find);
app.get('/users', _games2.default.userFind);

//Mail
var nodemailer = require('nodemailer');

app.post('/contact', handleSayHello); // handle the route at yourdomain.com/sayHello

function handleSayHello(req, res) {
	console.log(req.body);
	console.log('cucumber');
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'letsplayapp123@gmail.com',
			pass: 'megmatty123'
		}
	});
	var mailOptions = {
		from: req.user.email, // sender address
		to: req.body.to,
		subject: "Let's Play - Friend Match", // Subject line
		html: "Hello " + req.body.name + "! <br /> <p>Let's Play user " + req.user.name + " plays <b>" + req.body.game + "</b> and would like to play with you!</p> <p>" + req.user.name + " says: \"" + req.body.message + "\".</p> <p><a href=\"mailto:" + req.user.email + "\">Click here to email them and get playing!</a></p> <br />-Let's Play"
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			res.json({ yo: 'error' });
		} else {
			console.log('Message sent: ' + info.response);
			res.redirect('/');
		};
	});
}

app.get("*", function (req, res, next) {

	// if we are in production mode then an extension will be provided, usually ".min"
	var minified = process.env.MIN_EXT || "";

	// this is the HTML we will send to the client when they request any page. React and React Router
	// will take over once the scripts are loaded client-side
	var appHTML = "<!doctype html>\n\t\t<html lang=\"\">\n\t\t<head>\n\t\t\t<meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\" />\n\t\t\t<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,maximum-scale=1\" />\n\t\t\t<link href=\"https://fonts.googleapis.com/css?family=Roboto:300,400,500\" rel=\"stylesheet\">\n\t\t\t<link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\" rel=\"stylesheet\">\n\t\t\t<title>Let's Play</title>\n\t\t</head>\n\t\t<body>\n\t\t\t<div id=\"app\"></div>\n\t\t\t<script src=\"https://fb.me/JSXTransformer-0.13.3.js\"></script>\n\t\t\t\n\t\t\t<script src=\"/assets/app" + minified + ".js\"></script>\n\t\t\t<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>\n\t\t</body>\n\t\t</html>";
	res.status(200).end(appHTML);
});

// this function connects to our database, then starts the server
var server = void 0;

// // this function connects to our database, then starts the server
var PORT = process.env.PORT || 3000;
var DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/letsplay';
function runServer() {
	var databaseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DATABASE_URL;
	var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PORT;

	console.log(databaseUrl);
	console.log('pajamas');
	return new Promise(function (resolve, reject) {
		_mongoose2.default.connect(databaseUrl, function (err) {
			console.log(port);
			console.log('peanuts');
			if (err) {
				console.log(err);
				return reject(err);
			}
			server = app.listen(port, function () {
				console.log("Your app is listening on port " + port);
				resolve();
			}).on('error', function (err) {
				console.log(err);
				_mongoose2.default.disconnect();
				reject(err);
			});
		});
	});
}

// // this function closes the server, and returns a promise. we'll
// // use it in our integration tests later.
function closeServer() {
	return _mongoose2.default.disconnect().then(function () {
		return new Promise(function (resolve, reject) {
			console.log('Closing server');
			server.close(function (err) {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

// // if server.js is called directly (aka, with `node server.js`), this block
// // runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
	runServer().catch(function (err) {
		return console.error(err);
	});
} else if (isDev) {
	runServer();
};

module.exports = { app: app, runServer: runServer, closeServer: closeServer };