from lxml import html
import time
import glob







for a in glob.glob('./*/*.htm', recursive=True):
	print(a)


result = filter(lambda x: x.split("\\")[1], glob.glob('./*/*.htm', recursive=True))
import datetime
print(
    datetime.datetime.fromtimestamp(
        int("1284101485")
    ).strftime('%Y-%m-%d %H:%M:%S')
)
with open(r'from_globeandmail since_2016-02-01 until_2016-03-05 - Twitter Search.htm', "rb") as f:
	page = f.read()
tree = html.fromstring(page)

for a  in tree.xpath("//a"):

for li in tree.xpath("//li[contains(@class, 'original-tweet-container')]"):
	tweetid = li.xpath(".//div[@data-item-id]")[0].get("data-item-id")
	#li.xpath(".//div[contains(@class, 'js-tweet-text-container')][1]//text()") #text within tweet
	#li.xpath(".//div[contains(@class, 'js-tweet-text-container')][1]//a")
	dateTimestamp = int(li.xpath(".//span[@data-time]")[0].get("data-time"))
	dateposted = datetime.datetime.fromtimestamp(dateTimestamp).strftime('%Y-%m-%d')
	likes = int(li.xpath(".//span[contains(@class, 'ProfileTweet-action--favorite')][1]")[0].xpath(".//span[@data-tweet-stat-count]")[0].get("data-tweet-stat-count"))
	retweet = int(li.xpath(".//span[contains(@class, 'ProfileTweet-action--retweet')][1]")[0].xpath(".//span[@data-tweet-stat-count]")[0].get("data-tweet-stat-count"))