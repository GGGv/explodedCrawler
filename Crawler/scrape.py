import requests
import json
import urllib3
import re
import os
import time
from bs4 import BeautifulSoup


BASE_URL='https://{user_name}.skyrock.com/'
USER_NAME='kate-rizzoli-isles'

def scrape(name):
	#make folder
	cur_folder=os.getcwd()
	img_folder=cur_folder+'/skyrock/'+USER_NAME
	if(not os.path.exists(img_folder)):
		os.makedirs(img_folder)
		print 'create new folder'+img_folder
	#start crawling
	main_url=BASE_URL.format(user_name=name)
	#find url of friends
	r=requests.get(main_url)
	soup=BeautifulSoup(r.content,'lxml')#use lxml as parser
	"""
	friend_classes=soup.find(id="favoris").ul
	for friend in friend_classes.children:
		print friend.a['href']"""
	#start crawling images
	page=1
	#go through all pages
	while(True):
		img_classes=soup.find_all(attrs={"class":"text-image-container"})
		for img_class in img_classes:
			img_url=img_class.img['src']
			img_data=requests.get(img_url)
			fp=open("{folder}/{time}.jpg".format(folder=img_folder,time=time.time()),'wb')
			fp.write(img_data.content)
			fp.close()
		page+=1
		#check if there is next page
		nxt_class=soup.find(attrs={"class":"next next-icon"})
		if(nxt_class==None):
			break
		url=main_url+nxt_class.a['href']
		print url
		r=requests.get(url)
		soup=BeautifulSoup(r.content,'lxml')#use lxml as parser		

def main():
	r = requests.get('http://ec2-18-212-51-18.compute-1.amazonaws.com:8000/api/get/1/')
	url_list  = json.loads(r.text)

	for url in url_list:
		print(url)
		# url = 'https://www.paypal.com/us/selfhelp/home'
		scrape(url)
		break

if __name__ == '__main__':
	scrape(USER_NAME)