from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
import requests
import json
import urllib3
import re
import os
import time
import sys
from bs4 import BeautifulSoup

app = FlaskAPI(__name__)

IMG_TYPES={'jpg','png','jpeg','gif'}

def post(urls):
    for url in urls:
        print url,

def scrape(main_url):
    print '=================================================='
    print 'Crawling '+main_url
    #make folder
    cur_folder=os.getcwd()
    try:
        user_name=re.match('https://(.*).skyrock.com',main_url).group(1)
    except:
        print "find no name"
        print main_url
        user_name=str(time.time())
    img_folder=cur_folder+'/skyrock/'+user_name
    if(not os.path.exists(img_folder)):
        os.makedirs(img_folder)
        print 'create new folder'+img_folder
    #start crawling
    #find url of friends
    r=requests.get(main_url)
    soup=BeautifulSoup(r.content,'lxml')#use lxml as parser
    try:
        friend_classes=soup.find(id="favoris").ul
    except AttributeError:
        print 'No friend section, skip.'
    else:
        friend_urls=[]
        for friend in friend_classes.children:
            friend_urls.append(friend.a['href'])
        post(friend_urls)
    #start crawling images
    #go through all pages
    while(True):
        try:
            img_classes=soup.find_all(attrs={"class":"text-image-container"})
            for img_class in img_classes:
                try:
                    img_url=img_class.img['src']
                except:
                    print 'Skipping video files.'
                else:
                    #skip video and gif
                    try:
                        img_type=re.search('.([a-z]*$)',img_url).group(1)
                    except Exception,e:
                        print "Unable to find image type"
                        print e
                    else:
                        img_type=img_type
                        with open("{folder}/{time}.{type}".format(folder=img_folder,time=time.time(),type=img_type),'wb') as fp:
                            img_data=requests.get(img_url)
                            fp.write(img_data.content)
                        
            #check if there is next page
            nxt_class=soup.find(attrs={"class":"next next-icon"})
            if(nxt_class==None):
                print 'finish '+main_url
                break
            url=main_url+nxt_class.a['href'][1:]
            r=requests.get(url)
            soup=BeautifulSoup(r.content,'lxml')#use lxml as parser 
            # print 'crawling '+nxt_class.a['href']   
        except Exception, e:
            print 'No image on this website'
            # print e
            # s = sys.exc_info()
            # print s
            #print "Error '%s' happened on line %d" % (s[1],s[2].tb_lineno)

@app.route("/", methods=['GET'])
def get_urls():
    if request.method == 'GET':
        urls = str(request.data.get('urls', '')).split(' ')
        for url in urls:
            scrape(url)
        return 'finish all urls'

if __name__ == "__main__":
    app.run(debug=True)