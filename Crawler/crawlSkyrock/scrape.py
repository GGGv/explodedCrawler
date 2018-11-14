import requests
import json
import urllib3
import re
import os
import time
import sys
from bs4 import BeautifulSoup


BASE_URL='https://{user_name}.skyrock.com/'
USER_NAME='lexa-heda'
Q=[]

def getUrl():
	if(len(Q)==0):
		print 'No more URL'
		sys.exit()
	urls=[]
	cnt=1
	while(len(Q)>0 and cnt<=10):
		urls.append(Q.pop())
		cnt+=1
	return urls

def post(urls):
	for url in urls:
		Q.append(url)

def scrape(main_url):
	print 'Crawling '+main_url
	#make folder
	cur_folder=os.getcwd()
	user_name=re.match('https://(.*).skyrock.com',main_url).group(1)
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
					#skip video 
					with open("{folder}/{time}.jpg".format(folder=img_folder,time=time.time()),'wb') as fp:
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
			print 'crawling '+nxt_class.a['href']	
		except Exception, e:
			print 'No image on this website'
			print e
        	s = sys.exc_info()
        	print s
        	#print "Error '%s' happened on line %d" % (s[1],s[2].tb_lineno)


def main():
	r = requests.get('http://ec2-18-212-51-18.compute-1.amazonaws.com:8000/api/get/1/')
	url_list  = json.loads(r.text)

	for url in url_list:
		print(url)
		# url = 'https://www.paypal.com/us/selfhelp/home'
		scrape(url)
		break

if __name__ == '__main__':
	main_url=BASE_URL.format(user_name=USER_NAME)
	Q.append(main_url)
	while(True):
		urls=getUrl()
		for url in urls:
			scrape(url)