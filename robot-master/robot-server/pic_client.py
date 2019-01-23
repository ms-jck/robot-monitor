# -*- coding: utf-8 -*-
# 未识别图片发送到标注系统
import json
import requests
import os
import time

SERVER = 'http://localhost:7001'

print('未识别图片发送标注系统启动')
url = SERVER+'/api/pic_error'
while(True):
  try:
    rootdir = 'static/error'
    filenames = os.listdir(rootdir) #列出文件夹下所有的目录与文件
    for filename in filenames: 
      path = os.path.join(rootdir,filename)
      print(path)
      if os.path.isfile(path):
        files = {'file':open(path,'rb')}
        r = requests.post(url, headers={}, files = files)
        print 'r:',r.status_code
        if r.status_code == 200:
          os.remove(path)
        time.sleep(1)
  except Exception as e:
        print('pic send error', e)