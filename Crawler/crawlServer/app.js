'use strict';
const express = require('express');
var mysql = require('promise-mysql')
var connection;
const app = express();
var multer  = require('multer');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');

app.listen(8080);

app.use('/', express.static('public'));
app.get('/api/urls/getAll', getAllUrls);
// app.get('/api/urls/get', getAllUrls);

/* Write to file
var storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, '/')
    },
    filename: function(req, file, cb){
      console.log("file name:")
      console.log(file.originalname);
      cb(null, file.originalname)
      //cb(null, Date.now() + '-'+file.originalname)
    } 
})
var upload = multer({ storage: storage });
*/

app.post('/api/urls/add', addUrls);
app.post('/api/urls/delete', deleteUrls);

function deleteUrls(req, res){
    console.log(req.body);
    mysql.createConnection({
        host: 'localhost',
        user     : 'cosey',
        password : 'urlServer',
        database : 'URL'
    }).then(function(conn){
        connection = conn;
        let querStr = 'DELETE FROM current_url WHERE url = "' + (req.body.url) +'"';
        console.log(querStr);
        connection.query(querStr, function(err, row, fields){
            res.send("Ok");
        });
        connection.end();
    }).catch(function(error){
        
        if (connection && connection.end) connection.end();
        console.log("Error inserting url");
        console.log(error);
        res.send("#");
    });

}
function addUrls(req, res){
    console.log(req.body);
    mysql.createConnection({
        host: 'localhost',
        user     : 'cosey',
        password : 'urlServer',
        database : 'URL'
    }).then(function(conn){
        connection = conn;
        let querStr = 'INSERT INTO current_url (url) VALUES ("' + (req.body.url) +'")';
        console.log(querStr);
        connection.query(querStr, function(err, row, fields){
            res.send("Ok");
        });
        connection.end();
    }).catch(function(error){
        
        if (connection && connection.end) connection.end();
        console.log("Error inserting url");
        console.log(error);
        res.send("#");
    });

}


function getAllUrls(req, res){
    /* var getNum = 5;
    if(req.query.num){
        getNum = req.query.num;
    }*/ 
    mysql.createConnection({
        host: 'localhost',
        user     : 'cosey',
        password : 'urlServer',
        database : 'URL'
    }).then(function(conn){
        connection = conn;
        connection.query('SELECT * FROM current_url', function(err, row, fields){
            console.log(row);
            res.send(row);
        });
        connection.end();
    }).catch(function(error){
        
        if (connection && connection.end) connection.end();
        console.log("Error getting url");
        console.log(error);
        res.send("#");
    });
}

process.on( 'SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    if(connection)
        connection.end();
    process.exit( );
})



