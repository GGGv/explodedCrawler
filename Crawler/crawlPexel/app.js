var Crawler = require("crawler");
const Path = require('path');
var async = require('async')
const download = require('image-downloader')
const Axios = require('axios');
const express = require('express');
var validUrl = require('valid-url');
var robotto = require('robotto');
var bodyParser = require('body-parser');
const app = express();
const normalizeUrl = require('normalize-url');
var fs = require('fs');
var request = require('request');
var mkdirp = require('mkdirp');
const util = require("util");
const writeImage = util.promisify(fs.createWriteStream);
var visited = [];
var urlQueue = [];
var counter = 0;
var result = [];
var level = 0;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');

app.listen(3001);

app.use('/', express.static('public'));
app.get('/api/urls/getServer', getUrls, makeFolder, crawlPage);
app.get('/api/urls/postServer', postUrls);
app.get('/api/urls/crawlSite', getSite, makeFolder, crawlPage);

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

function getSite(req, res, next){
    console.log(req.query.site);
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
				
				// crawl <a> tag
                $("a").each(async function(index, link){
                        var attr = $(this).attr('data-track-action');

                        if (typeof attr !== typeof undefined && attr !== false) {
                            let target = link.attribs.href;
                            if(target.match(/^\/search\//)){
                                var targetarr = target.split("/");
                                // console.log(targetarr[2]);
                                let newuri = "https://www.pexels.com/search/" + targetarr[2];
                                // console.log("related: " + link.attribs.href);
                                if(visited.includes(newuri));
                                else{
                                    visited.push(newuri);
                                    console.log(newuri);
                                    postUrls(newuri);
                                }
                            }

                        }
                        let uri = link.attribs.href;
                        if(visited.includes(uri));
                        else{
                    		if (validUrl.isUri(uri) && ((uri.indexOf("http://") == 0 || uri.indexOf("https://") == 0))){
                            visited.push(uri);
                            // console.log(uri);
                            if(uri.indexOf('jpg') != -1 || uri.indexOf('jpeg') != -1 || uri.indexOf('png') != -1){
                                
                                // console.log("Image: " + uri);
                                // request(uri).on('error', function(err){
//    console.log(err)}).pipe(fs.createWriteStream("./tmp/" + arr[4] + "/" + process.hrtime() + ending));
        // await downloadImage(uri, "./tmp/" + arr[4] + "/" + process.hrtime() + ".jpeg");
        downloadIMG(uri, "./tmp/" + arr[4] + "/" + process.hrtime() + ".jpeg");

/*(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get(uri);
    await driver.findElement(By.name('q'));.sendKeys('webdriver', Key.RETURN);
  } finally {
        await downloadImage(uri, "./tmp/" + arr[4] + "/" + process.hrtime() + ".jpeg");
    await driver.quit();
  }
})();*/


                        	}
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
        for(let j = 1; j <= 10; j++){ 
            visited.push(data[i]+"/?page="+j);
            c.queue(data[i]+"/?page="+j);
        }
    }
    res.send(res.locals.urls);
}


function makeFolder(req, res, next){
    console.log(res.locals.urls);
    let data = res.locals.urls;
    data = JSON.parse(data);
for(let i = 0; i < data.length; i++){
var arr = data[i].split("/");
console.log(arr[4]);
mkdirp('./tmp/' + arr[4], function (err) {
    if (err) console.error(err)
    else{
        console.log('Created ./tmp/' +  arr[4] +   ' folder!');
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


async function downloadImage (url, path) {

  // const url = 'https://unsplash.com/photos/AaEQmoufHLk/download?force=true'
  // const path = Path.resolve(__dirname, 'images', 'code.jpg')

  // axios image download with response type "stream"
  const response = await Axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  })

  // pipe the result stream into a file on disc
  response.data.pipe(fs.createWriteStream(path))

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve()
    })

    response.data.on('error', () => {
      reject()
    })
  })

}


async function downloadIMG(url, path) {
  const options = {
  url: url,
  dest: path                  
}

  try {
    console.log(url);
    console.log(path);
    const { filename, image } = await download.image(options)
    console.log(filename) // => /path/to/dest/image.jpg
  } catch (e) {
    console.error(e)
  }
}

