var Crawler = require("crawler");
const express = require('express');
var validUrl = require('valid-url');
var robotto = require('robotto');
var bodyParser = require('body-parser');
const app = express();
const normalizeUrl = require('normalize-url');
var fs = require('fs');
var request = require('request');
var mkdirp = require('mkdirp');
var visited = [];
var urlQueue = [];
var counter = 0;
var result = [];
var level = 0;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');

app.listen(3000);

app.use('/', express.static('public'));
app.get('/api/urls/getServer', getUrls, makeFolder, crawlPage);
app.get('/api/urls/postServer', postUrls);
app.get('/api/urls/crawlSite', getSite, makeFolder, crawlPage);

function postUrls(postThis){
    //console.log(postThis);
    // let keyPost = "http://ec2-18-212-51-18.compute-1.amazonaws.com:8000/api/post/?url_list=" + '["' + postThis + '"]';
    let postArr = '["' + postThis + '"]';
    postKey = {url_list: postArr};
    request({
        uri: "http://ec2-18-212-51-18.compute-1.amazonaws.com:8000/api/post/",
        method: 'POST',
	    body: JSON.stringify(postKey),
        headers: {
            'Content-Type': 'application/json'
        },
        },function(err, httpRes, body){
        //if(err)
        //    console.log(err);
        //console.log(body);
        });
        
}

function getSite(req, res, next){
    res.locals.urls = '["' + req.query.site + '"]';
    console.log(res.locals.urls);
    next();
    // res.send(req.query.site);

}

function getUrls(req, res, next){
    console.log(req.query.number);
    console.log(req.query.server);
    // req.query.server = kimi;
	// if(req.query.server === "kimi"){
		if(!req.query.number.match(/^-{0,1}\d+$/)){
			req.query.number = 10;
		}
		if(Number(req.query.number) < 1 || Number(req.query.number) > 9999)
			req.query.number = 10;
		console.log(req.query.number);
    request({
        uri: "http://ec2-18-212-51-18.compute-1.amazonaws.com:8000/api/get/"+req.query.number+"/",
        method: 'GET',
        },function(err, httpRes, body){
        // console.log(body);
        // postUrls(body);
        res.locals.urls = body;
        next();
        // res.send(body);    
   });
   // }
   //else{
	//res.send("#");
   //}

}


var c = new Crawler({
    maxConnections : 10,
    rateLimit: 1000,

    callback : function (error, res, done) {
        console.log(res.options.uri);
        var arr = (res.options.uri).split("/");
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            if(typeof $ !== "undefined"){
                $("img").each(function(index, link){
                    let uri = link.attribs.src;
                    if (validUrl.isUri(uri) && ((uri.indexOf("http://") == 0 || uri.indexOf("https://") == 0))){
                            if(uri.indexOf('jpg') != -1 || uri.indexOf('jpeg') != -1 || uri.indexOf('png') != -1){
                                //request(uri).pipe(fs.createWriteStream("./tmp/" + arr[2] + "/"+ uri + ".png"));
                            console.log(uri + " from " + res.options.uri);
                                request(uri).on('error', function(err){
    console.log(err)}).pipe(fs.createWriteStream("./tmp/" + arr[2] + "/" + process.hrtime() + '.jpg'));


                }
                }
                });
                $("a").each(function(index, link){
                    let uri = link.attribs.href;
                    if (validUrl.isUri(uri) && ((uri.indexOf("http://") == 0 || uri.indexOf("https://") == 0))){
                            if(uri.indexOf('jpg') != -1 || uri.indexOf('jpeg') != -1 || uri.indexOf('png') != -1){
                            console.log(uri);
                            console.log(uri + " from " + res.options.uri);
                                //request(uri).pipe(fs.createWriteStream("./tmp/" + arr[2] + "/"+ uri + ".png"));
                                request(uri).on('error', function(err){
    console.log(err)}).pipe(fs.createWriteStream("./tmp/" + arr[2] + "/" + process.hrtime() + '.jpg'));

                            }
                        if(visited.includes(uri));
                        else{
                            visited.push(uri);
                            // console.log(uri);

                            postUrls(uri);
                        }
                    }
                });
            }
        }
            
        done();
    }
});

function crawlPage(req, res){
    data = res.locals.urls;
    // console.log(data);
    data = JSON.parse(data);
    // console.log(data[0]);
    for(let i = 0; i < data.length; i++){
        visited.push(data[i]);
        c.queue(data[i]);
    }
    res.send(res.locals.urls);
}


function makeFolder(req, res, next){
    console.log(res.locals.urls);
    let data = res.locals.urls;
    data = JSON.parse(data);
for(let i = 0; i < data.length; i++){
var arr = data[i].split("/");
mkdirp('./tmp/' + arr[2], function (err) {
    if (err) console.error(err)
    else{
        console.log('Created ./tmp/' +  arr[2] +   ' folder!');
    }
});
}
next();
}

mkdirp('./tmp/', function (err) {
    if (err) console.error(err)
    else{
        console.log('Created ./tmp folder!');
    }
});
