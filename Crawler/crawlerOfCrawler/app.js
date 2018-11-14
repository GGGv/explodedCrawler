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

app.listen(8686);

app.use('/', express.static('public'));
app.get('/api/urls/getServer', getUrls);
// app.get('/api/urls/postServer', postUrls);
// app.get('/api/urls/crawlSite', getSite, makeFolder, crawlPage);

var urls = ["https://www.pexels.com/search/nature/", "https://taillexl.skyrock.com/profil/", "https://imgur.com/user/brennankpearson3000", "https://gungnir.skyrock.com/profil/", "https://www.deviantart.com/fox-of-the-road", "https://imgur.com/user/warmyourbeans", "https://www.deviantart.com/fleetingember", "https://www.pexels.com/search/sky/"];

function getUrls(req, res, next){
    console.log(req.query.number);
    console.log(req.query.site);
    console.log(req.query.server);
    if(!req.query.number.match(/^-{0,1}\d+$/)){
			req.query.number = 10;
		}
		if(Number(req.query.number) < 1 || Number(req.query.number) > 9999)
			req.query.number = 10;
		console.log(req.query.number);    
    request({
    uri: "http://ec2-18-212-51-18.compute-1.amazonaws.com:8000/api/get/?N="+req.query.number+"&siteName=q1",
    method: 'GET',
    },function(err, httpRes, body){
		console.log(body);
		let urls = JSON.parse(body);
        for(let i = 0; i < urls.length; i++){
            console.log(urls[i]);
            request({
                uri: "http://127.0.0.1:3001/api/urls/crawlSite?site="+urls[i],
                method: 'GET',
                },function(err, httpRes, body){
            }); 
        }
        /* for(let i = 0; i < urls.length; i++){
            if(urls[i].indexOf('skyrock') != -1){
                console.log("Skyrock " + urls[i]);
            }
            else if(urls[i].indexOf('pexels') != -1){
                console.log(" " + urls[i]);
                request({
                uri: "http://127.0.0.1:3001/api/urls/crawlSite?site="+urls[i],
                method: 'GET',
                },function(err, httpRes, body){
                }); 
            }
        }*/
    }); 
    res.send(JSON.stringify(urls));
}

function postUrls(postThis){
    //console.log(postThis);
    // let keyPost = "http://ec2-18-212-51-18.compute-1.amazonaws.com:8000/api/post/?url_list=" + '["' + postThis + '"]';
	// let postThis = "https://www.pexels.com/search/nature";
    let postArr = '[["' + postThis + '"]]';
	// let postArr = [];
	// let innerArr = [];
    postKey = {siteNameList : '["q1"]', listOfListOfUrls : postArr};
	console.log(postKey);
    request({
        uri: "http://ec2-18-212-51-18.compute-1.amazonaws.com:8000/api/post/",
        method: 'POST',
        body: JSON.stringify(postKey),
        headers: {
            'Content-Type': 'application/json'
        },
        },function(err, httpRes, body){
        if(err)
            console.log(err);
         console.log(body);
        });
    
    console.log(postThis);

}

postUrls("https://www.pexels.com/search/forest");
