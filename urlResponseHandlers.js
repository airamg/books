var url = require("url");

var cradle = require('cradle');

var connection = new(cradle.Connection)('http://<username>.iriscouch.com', 443, {
      auth: { username: '<admin>', password: '<pass>' }
});
  
//db 
var usersdb = connection.database('users');
usersdb.exists(function (err, exists) {
	if (err) {
		console.log('error', err);
	} else if (exists) {
		console.log('The force is with you.');
	} else {
		console.log('Database does not exists.');
		usersdb.create();
	}
});
var usersXML = "";

var timelinedb = connection.database('timeline');
timelinedb.exists(function (err, exists) {
	if (err) {
		console.log('error', err);
	} else if (exists) {
		console.log('The force is with you.');
	} else {
		console.log('Database does not exists.');
		timelinedb.create();
	}
});
var timelineXML = "";

var booksdb = connection.database('books');
booksdb.exists(function (err, exists) {
	if (err) {
		console.log('error', err);
	} else if (exists) {
		console.log('The force is with you.');
	} else {
		console.log('Database does not exists.');
		booksdb.create();
	}
});
var booksXML = "";

//funciones - MOSTRAR
function topBooks(response) {
	var topbooksXMLTemp = "";
	booksdb.view('vistaslibros/vecesPrestado', {descending: true, limit: 3 }, function (err, res) {
		topbooksXMLTemp = "<books>";
		if (res) {			
			res.forEach(function (row) {				
				if(row.disponible=="0") 
					console.log("%s - %s pertenece a %s y ha sido %s veces prestado; ultimo prestado por: %s", row.autor, row.titulo, row.perteneceA, row.vecesPrestado, row.prestadoPor);
				else						
					console.log("%s - %s pertenece a %s y ha sido %s veces prestado", row.autor, row.titulo, row.perteneceA, row.vecesPrestado); 
				topbooksXMLTemp += ("<book><autor>" + String(row.autor) + "</autor><titulo>" + String(row.titulo) + "</titulo><vecesPrestado>" + String(row.vecesPrestado) + "</vecesPrestado><perteneceA>" + String(row.perteneceA) + "</perteneceA><prestadoPor>" + String(row.prestadoPor) + "</prestadoPor><disponible>" + String(row.disponible) + "</disponible></book>");
			});
			topbooksXMLTemp += "</books>";
			topbooksXML = topbooksXMLTemp;
			console.log("*****" + topbooksXML);
			response.writeHead(200, {"Content-Type": "text/xml", "Cache-Control": "no-cache"});
			var content = topbooksXML;
			console.log("***Response: '" + topbooksXML);
			response.write(content);
			response.end();
		}
	});
}

function indexTopBooks(req, res) {
	topBooks(res);
}

function userList(response) {
	var userlistXMLTemp = "";
	usersdb.view('vistasListaUsuarios/nombre', {descending: true, limit: 5 }, function (err, res) {
		userlistXMLTemp = "<users>";
		if (res) {
			res.forEach(function (row) {
				var conect = "";
				if(row.conectado=="0") 
					conect = "no";
				else
					conect = "si";
				console.log("%s - %s - libros: %s - prestados: %s - conectado: %s.", row.nombre, row.pass, row.numLibros, row.numPrestados, conect);
				userlistXMLTemp += ("<user><nombre>" + String(row.nombre) + "</nombre><pass>" + String(row.pass) + "</pass><numLibros>" + String(row.numLibros) + "</numLibros><numPrestados>" + String(row.numPrestados) + "</numPrestados><conectado>" + String(row.conectado) + "</conectado></user>");
			});
			userlistXMLTemp += "</users>";
			userlistXML = userlistXMLTemp;
			console.log("*****" + userlistXML);
			response.writeHead(200, {"Content-Type": "text/xml", "Cache-Control": "no-cache"});
			var content = userlistXML;
			console.log("***Response: '" + userlistXML);
			response.write(content);
			response.end();
		}
	});
}

function indexUserList(req, res) {
	userList(res);
}

function bookList(response) {
	var booklistXMLTemp = "";
	booksdb.view('vistasListaLibros/disponible', {descending: true, limit: 5 }, function (err, res) {
		booklistXMLTemp = "<books>";
		if (res) {
			res.forEach(function (row) {
				if(row.disponible=="1")				
					console.log("%s - %s pertenece a %s y ha sido %s veces prestado", row.autor, row.titulo, row.perteneceA, row.vecesPrestado); 
				else
					console.log("No hay libros disponibles");
				booklistXMLTemp += ("<book><autor>" + String(row.autor) + "</autor><titulo>" + String(row.titulo) + "</titulo><vecesPrestado>" + String(row.vecesPrestado) + "</vecesPrestado><perteneceA>" + String(row.perteneceA) + "</perteneceA><prestadoPor>" + String(row.prestadoPor) + "</prestadoPor><disponible>" + String(row.disponible) + "</disponible></book>"); 
			});
			booklistXMLTemp += "</books>";
			booklistXML = booklistXMLTemp;
			console.log("*****" + booklistXML);
			response.writeHead(200, {"Content-Type": "text/xml", "Cache-Control": "no-cache"});
			var content = booklistXML;
			console.log("***Response: '" + booklistXML);
			response.write(content);
			response.end();
		}
	});
}

function indexBookList(req, res) {
	bookList(res);
}

function newsTimeline(response) {
	var timelineXMLTemp = "";
	timelinedb.view('timelineviews/bydate', {descending: true, limit: 10 }, function (err, res) {
		timelineXMLTemp = "<timelineList>";
		if (res) {
			res.forEach(function (row) {				
				if(row.accion=="lends") 
					console.log("%s - %s %s %s to %s.", row.bydate, row.username1, row.accion, row.booktitle, row.username2);
				else
					console.log("%s - %s %s a book: %s.", row.bydate, row.username1, row.accion, row.booktitle);
				timelineXMLTemp += ("<timeline><bydate>" + String(row.bydate) + "</bydate><username1>" + String(row.username1) + "</username1><accion>" + String(row.accion) + "</accion><booktitle>" + String(row.booktitle) + "</booktitle><username2>" + String(row.username2) + "</username2></timeline>");
			});
			timelineXMLTemp += "</timelineList>";
			timelineXML = timelineXMLTemp;
			console.log("*****" + timelineXML);
			response.writeHead(200, {"Content-Type": "text/xml", "Cache-Control": "no-cache"});
			var content = timelineXML;
			console.log("***Response: '" + timelineXML);
			response.write(content);
			response.end();
		}
	});
}

function indexNewsTimeline(req, res) {
	newsTimeline(res);
}

function allUsers(response) {
	var allusersXMLTemp = "";
	usersdb.view('vistasListaUsuarios/nombre', {descending: true, limit: 20 }, function (err, res) {
		allusersXMLTemp = "<users>";
		if (res) {
			res.forEach(function (row) {
				var conect = "";
				if(row.conectado=="0") 
					conect = "no";
				else
					conect = "si";
				console.log("%s - %s - libros: %s - prestados: %s - conectado: %s.", row.nombre, row.pass, row.numLibros, row.numPrestados, conect);
				allusersXMLTemp += ("<user><nombre>" + String(row.nombre) + "</nombre><pass>" + String(row.pass) + "</pass><numLibros>" + String(row.numLibros) + "</numLibros><numPrestados>" + String(row.numPrestados) + "</numPrestados><conectado>" + String(row.conectado) + "</conectado></user>");
			});
			allusersXMLTemp += "</users>";
			allusersXML = allusersXMLTemp;
			console.log("*****" + allusersXML);
			response.writeHead(200, {"Content-Type": "text/xml", "Cache-Control": "no-cache"});
			var content = allusersXML;
			console.log("***Response: '" + allusersXML);
			response.write(content);
			response.end();
		}
	});	
}

function indexAllUsers(req, res) {
	allUsers(res);
}

function allBooks(response) {
	var allbooksXMLTemp = "";
	booksdb.view('vistasAllLibros/titulo', {descending: true, limit: 50 }, function (err, res) {
		allbooksXMLTemp = "<books>";
		if (res) {
			res.forEach(function (row) {
				if(row.disponible=="1")				
					console.log("%s - %s pertenece a %s y ha sido %s veces prestado", row.autor, row.titulo, row.perteneceA, row.vecesPrestado); 
				else
					console.log("No hay libros disponibles");
				allbooksXMLTemp += ("<book><autor>" + String(row.autor) + "</autor><titulo>" + String(row.titulo) + "</titulo><vecesPrestado>" + String(row.vecesPrestado) + "</vecesPrestado><perteneceA>" + String(row.perteneceA) + "</perteneceA><prestadoPor>" + String(row.prestadoPor) + "</prestadoPor><disponible>" + String(row.disponible) + "</disponible></book>"); 
			});
			allbooksXMLTemp += "</books>";
			allbooksXML = allbooksXMLTemp;
			console.log("*****" + allbooksXML);
			response.writeHead(200, {"Content-Type": "text/xml", "Cache-Control": "no-cache"});
			var content = allbooksXML;
			console.log("***Response: '" + allbooksXML);
			response.write(content);
			response.end();
		}
	});	
}

function indexAllBooks(req, res) {
	allBooks(res);
}

//funciones - METODO
function login(response, nombre, pass) {	
	console.log("Login...");
	usersdb.view('vistasIDusuario/_id', {descending: true, limit: 50 }, function (err, res) {
		if (res) {
			var nombreUser = nombre;
			res.forEach(function (row) {				
				if(row.nombre==nombreUser)
				{
					console.log("USUARIO: %s - %s", row.nombre, row.pass); 
					save2DBmodifieduser(String(row._id), String(row.nombre), String(row.pass), row.numLibros, row.numPrestados, 1);					
				}
				else
					console.log("No existe usuario");				
			});
			response.end();
		}
	});
	return ".";	
}

function indexLogin(req, res) {
	if (req != undefined) {
		if (req.url != undefined) {
			var _url = url.parse(req.url, true);
			var pathname = _url.pathname;
			var log = "";
			var nombre = "";
			var pass = "";
			if(_url.query) {
				try {
					log = _url.query.login;
					var cadena = log.split(" ");
					nombre = cadena[0];
					pass = cadena[1];
				} catch (e) {
				}
			}
			console.log("Seleccion: " + pathname + " - nombre: " + nombre + " - pass: " + pass);
			login(res, nombre, pass);
			} else {
			return "";
		}
	} else {
		return "";
	}
}

function disconnect(response, nombre, pass) {
	usersdb.view('vistasUsuarioConectado/conectado', {descending: true, limit: 1 }, function (err, res) {
		if (res) {
			res.forEach(function (row) {				
				if(row.conectado=="1")
				{
					save2DBmodifieduser(String(row._id), String(row.nombre), String(row.pass), row.numLibros, row.numPrestados, 0);					
				}
				else
				{
					console.log("No online user.");	
					return "";
				}					
			});
			response.end();
		}
	});
	return ".";	
}

function indexDisconnect(req, res) {
	disconnect(res);
}

function lendBook(response, tit, nom) {
	console.log("Lending a book: " + tit);
	booksdb.view('vistasIDlibros/_id', {descending: true, limit: 50 }, function (err, res) {
		if (res) {
			var libroTit = tit;
			res.forEach(function (row) {				
				if(row.titulo==libroTit)
				{
					if(row.disponible=="1")
					{
						console.log("ID: %s - %s - %s pertenece a %s y ha sido %s veces prestado", row._id, row.autor, row.titulo, row.perteneceA, row.vecesPrestado); 
						var disponible = String(row.disponible);
						var vecesPrestado = row.vecesPrestado; 
						var prestadoPor = nom;	
						disponible = 0;
						vecesPrestado = vecesPrestado+1; 						
						var perteneceA = row.perteneceA;
						var accion = "lends";
						var date;
						var fecha = new Date();
						var a_meses = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
						var dia_mes = fecha.getDate();
						var mes = fecha.getMonth() + 1;
						var anio = fecha.getFullYear();
						date = dia_mes+ "/" +a_meses[mes - 1] + "/" +anio;
						var bydate = date; 
						save2DBmodifiedbook(String(row._id), String(row.autor), String(row.titulo), vecesPrestado, String(row.perteneceA), prestadoPor, disponible);
						save2DBtimeline(response, bydate, perteneceA, accion, libroTit, prestadoPor);	
					}
					else
						console.log("Libro no disponible"); 
				}
				else
					console.log("No existe ese libro");				
			});
			response.end();
		}
	});
	return ".";
}

function indexLendBook(req, res) {
	if (req != undefined) {
		if (req.url != undefined) {
			var _url = url.parse(req.url, true);
			var pathname = _url.pathname;
			var titulo = "";
			if(_url.query) {
				try {
					titulo = _url.query.tit;
				} catch (e) {
				}
			}
			console.log("Seleccion: " + pathname + " - titulo: " + titulo);
			findUserOnline(res, titulo);
			} else {
			return "";
		}
	} else {
		return "";
	}
}

function newUser(response, user, pass) {
	console.log("New user... ");
	save2DBuser(user, pass);
	response.end();	
	return ".";	
}

function indexNewUser(req, res) {
	if (req != undefined) {
		if (req.url != undefined) {
			var _url = url.parse(req.url, true);
			var pathname = _url.pathname;
			var user = "";
			var nombre = "";
			var pass = "";
			if(_url.query) {
				try {
					user = _url.query.user;
					var cadena = user.split(" ");
					nombre = cadena[0];
					pass = cadena[1];
				} catch (e) {
				}
			}
			console.log("Seleccion: " + pathname + " - nombre: " + nombre + " pass: " + pass);
			newUser(res, nombre, pass); 
			} else {
			return "";
		}
	} else {
		return "";
	}
}

function addBook(response, autor, titulo, perteneceA) {
	console.log("Adding a book...");
	var aut = autor;
	var tit = titulo;
	var perten = perteneceA;
	var accion = "add"; 
	var prestadoPor = "";
	var date;
	var fecha = new Date();
	var a_meses = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
	var dia_mes = fecha.getDate();
	var mes = fecha.getMonth() + 1;
	var anio = fecha.getFullYear();
	date = dia_mes+ "/" +a_meses[mes - 1] + "/" +anio;
	var bydate = date; 
	save2DBbook(aut, tit, perten);	
	save2DBtimeline(response, bydate, perten, accion, tit, prestadoPor);
	response.end();	
	return ".";	
}

function indexAddBook(req, res) {
	if (req != undefined) {
		if (req.url != undefined) {
			var _url = url.parse(req.url, true);
			var pathname = _url.pathname;
			var libro = "";			
			var titulo = "";
			var autor = "";
			var response = res;
			if(_url.query) {
				try {
					libro = _url.query.libro;
					var cadena = libro.split("-");
					titulo = cadena[0];
					autor = cadena[1];
				} catch (e) {
				}
			}
			console.log("Seleccion: " + pathname + " - titulo: " + titulo + " autor: " + autor);
			findUserOnlineAddBook(response, autor, titulo); 
			} else {
			return "";
		}
	} else {
		return "";
	}
}

//guardar en db
function save2DBmodifiedbook(id, autor, titulo, vecesPrestado, perteneceA, prestadoPor, disponible) {
	var idBook = id;
	booksdb.save(idBook, {
		'autor': autor,
		'titulo': titulo,
		'vecesPrestado': vecesPrestado,
		'perteneceA': perteneceA,
		'prestadoPor': prestadoPor,
		'disponible': disponible
		}, function (err, res) {
		if (err) {
		  	console.log("Error produced: " + err);
		} else {
		 	console.log("Saved modified book.");			
		}
	});
}

function save2DBbook(autor, titulo, perteneceA) {
	var date = new Date();
	var ts = Math.round(date.getTime() / 100) + date.getTimezoneOffset() * 60;
	var idBook = String(ts)+ "aks32fa5sfk0aqd4678f";
	booksdb.save(idBook, {
		'autor': autor,
		'titulo': titulo,
		'vecesPrestado': 0,
		'perteneceA': perteneceA,
		'prestadoPor': "",
		'disponible': 1
		}, function (err, res) {
		if (err) {
		  	console.log("Error produced: " + err);
		} else {
		 	console.log("Saved book.");			
		}
	});
}

function save2DBmodifieduser(id, nombre, pass, numLibros, numPrestados, conectado) {
	var idUser = id;
	usersdb.save(idUser, {
		'nombre': nombre,
		'pass': pass,
		'numLibros': numLibros,
		'numPrestados': numPrestados,
		'conectado': conectado
		}, function (err, res) {
		if (err) {
		  	console.log("Error produced: " + err);
		} else {
		 	console.log("Saved modified user.");			
		}
	});
}

function save2DBuser(nombre, pass) {
	var date = new Date();
	var ts = Math.round(date.getTime() / 100) + date.getTimezoneOffset() * 60;
	var idUser = String(ts) + "aks32fa5sfk0aqd4678f";
	usersdb.save(idUser, {
		'nombre': nombre,
		'pass': pass,
		'numLibros': 0,
		'numPrestados': 0,
		'conectado': 1
		}, function (err, res) {
		if (err) {
		  	console.log("Error produced: " + err);
		} else {
		 	console.log("Saved user.");			
		}
	});
}

function save2DBtimeline(response, bydate, username1, accion, booktitle, username2) {
	var d = new Date();
	var ts = Math.round(d.getTime() / 100) + d.getTimezoneOffset() * 60;
	var idTimeline = String(ts) + "aks32fa5sfk0aqd4678f";
	timelinedb.save(idTimeline, {
		'bydate': bydate,		
		'username1': username1,
		'accion': accion,
		'booktitle': booktitle,
		'username2': username2
		}, function (err, res) {
		if (err) {
		  	console.log("Error produced: " + err);
		} else {
		 	console.log("Saved timeline.");	
		}
	});
}

exports.indexTopBooks = indexTopBooks;
exports.indexUserList = indexUserList;
exports.indexBookList = indexBookList;
exports.indexNewsTimeline = indexNewsTimeline;
exports.indexLogin = indexLogin;
exports.indexNewUser = indexNewUser;
exports.indexAllUsers = indexAllUsers;
exports.indexLendBook = indexLendBook;
exports.indexAddBook = indexAddBook;
exports.indexAllBooks = indexAllBooks;
exports.indexDisconnect = indexDisconnect;

//otros metodos
function findUserOnline(response, titulo) {
	usersdb.view('vistasUsuarioConectado/conectado', {descending: true, limit: 1 }, function (err, res) {
		if (res) {
			res.forEach(function (row) {				
				if(row.conectado=="1")
				{
					var nom = row.nombre;
					var res = response;
					var tit = titulo;	
					var numPres = row.numPrestados;
					numPres = numPres+1;
					lendBook(res, tit, nom);
					save2DBmodifieduser(String(row._id), String(row.nombre), String(row.pass), row.numLibros, numPres, 1);					
				}
				else
				{
					console.log("No online user.");	
					return "";
				}					
			});			
		}
	});	
}

function findUserOnlineAddBook(response, autor, titulo) {
	usersdb.view('vistasUsuarioConectado/conectado', {descending: true, limit: 1 }, function (err, res) {
		if (res) {
			res.forEach(function (row) {				
				if(row.conectado=="1")
				{
					var nom = row.nombre;
					var res = response;
					var aut = autor;
					var tit = titulo;	
					var numLib = row.numLibros;
					numLib = numLib+1;
					addBook(res, aut, tit, nom);
					save2DBmodifieduser(String(row._id), nom, String(row.pass), numLib, row.numPrestados, 1);					
				}
				else
				{
					console.log("No online user.");	
					return "";
				}					
			});			
		}
	});	
}

function read(req) {
	var content = "";
	var _url = url.parse(req.url, true);
	var pathname = _url.pathname;
	console.log("Request for " + pathname + " received.");
	if(_url.query) {
		content += "<br><br>Ohh! You have also provided me below data - <ul>";
		for(i in _url.query) {
			content += "<li>" + i + " = " + _url.query[i]  +"</li>";
		}
		content += "</ul>";
	}
	return content;
}