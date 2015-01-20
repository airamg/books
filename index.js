var controller = require("./controller");
var urlResponseHandlers = require("./urlResponseHandlers");

// Load the express library, which we installed using npm
var express = require("express");
var app = express();

// Tell Express we want to serve static files from a 
// particular directory, in this case `./public`. In 
// this app, we're serving the CSS files from `./public/css`
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
	// If "/" is requested we have to make a redirect to index.html
	res.redirect("index.html");
});

app.get('/indexLogin', function(req, res) {
	console.log("Login");
	controller.dispatch(urlResponseHandlers.indexLogin, req, res);
});

app.get('/indexTopBooks', function(req, res) {
	console.log("Top books");
	controller.dispatch(urlResponseHandlers.indexTopBooks, req, res);
});

app.get('/indexUserList', function(req, res) {
	console.log("User list");
	controller.dispatch(urlResponseHandlers.indexUserList, req, res);
});

app.get('/indexBookList', function(req, res) {
	console.log("Book list");
	controller.dispatch(urlResponseHandlers.indexBookList, req, res);
});

app.get('/indexNewUser', function(req, res) {
	console.log("New user");
	controller.dispatch(urlResponseHandlers.indexNewUser, req, res);
});

app.get('/indexAllUsers', function(req, res) {
	console.log("All user list");
	controller.dispatch(urlResponseHandlers.indexAllUsers, req, res);
});

app.get('/indexNewsTimeline', function(req, res) {
	console.log("Last news in the timeline");
	controller.dispatch(urlResponseHandlers.indexNewsTimeline, req, res);
});

app.get('/indexLendBook', function(req, res) {
	console.log("Lending a book");
	controller.dispatch(urlResponseHandlers.indexLendBook, req, res);
});

app.get('/indexAddBook', function(req, res) {
	console.log("Add a new book to my list");
	controller.dispatch(urlResponseHandlers.indexAddBook, req, res);
});

app.get('/indexAllBooks', function(req, res) {
	console.log("All book list");
	controller.dispatch(urlResponseHandlers.indexAllBooks, req, res);
});

app.get('/indexDisconnect', function(req, res) {
	console.log("Disconnect");
	controller.dispatch(urlResponseHandlers.indexDisconnect, req, res);
});

// This is where we actually get the server started. We
// default to port 3000, unless the process has another
// port defined, and we log that we are up and running.
var port = process.env.PORT || 3002;
app.listen(port, function(){
  console.log("Listening on " + port);
});



