# -*- coding: utf-8 -*-
from flask import Flask
from flask import request
from flask import jsonify
import json
import config
from base import require_args,require_json
from werkzeug import secure_filename
import requests
import time
import os
import sys
import datetime
import threading
from pymongo import MongoClient
import shutil

app = Flask(__name__)

app.config.from_object(config)
conn = MongoClient('127.0.0.1', 27017)
db = conn.mydb


#用户登录
@app.route('/api/user/login',methods=['POST'])
def login():
    data = json.loads(request.get_data())
    user_set = db.user_set
    user = user_set.find_one({'username':data.get('username'),'password':data.get('password')})
    if user:
      user['id'] = str(user['_id'])
      user.pop('_id')
      return jsonify(status=200, msg='success', data=None), 200
    else:
      return jsonify(status=400, msg='error', data=None), 400

#未识别照片接收
@app.route('/api/pic_error',methods=['POST'])
def error_pic():
    time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    file = request.files['file']
    filename=secure_filename(file.filename)
    print 'filename= '+filename
    path = os.path.join(app.config['JPG_PATH'],filename)
    # path = '/home/elk/labelme/Images/'+filename
    file.save(path)
    return jsonify(status=200, msg='success', data=None), 200

#任务提取
@app.route('/api/task',methods=['POST'])
def task():
    data = json.loads(request.get_data())
    srcfile = app.config['JPG_PATH']
    dstfile = app.config['JPG_PATH'] + '/' + data['username']
    filenames = os.listdir(srcfile) #列出文件夹下所有的目录与文件
    i = 0
    if not os.path.exists(dstfile):
      os.mkdir(dstfile)
    for filename in filenames: 
      src_path = os.path.join(srcfile,filename)
      if os.path.isfile(src_path) and i < 5:
        des_paht = os.path.join(dstfile,filename)
        shutil.move(src_path,des_paht)
        i += 1
    return jsonify(status=200, msg='success', data=None), 200


#开始标注
@app.route('/api/labelme',methods=['POST'])
def labelme():
    data = json.loads(request.get_data())
    srcfile = app.config['JPG_PATH'] + '/' + data['username']
    filenames = os.listdir(srcfile)
    if not filenames:
      return jsonify(status=400, msg='error,no picture', data=None), 400
    filename = filenames[0]
    url = '%s/?collection=LabelMe&mode=i&folder=%s&image=%s' %(app.config['SERVER'],data['username'],filename)
    return jsonify(status=200, msg='success', data=url), 200

#已标注图片/XML收集
def detect_walk(t,xml_path,jpg_path,lab_pic,lab_xml):
  print '已标注图片收集线程启动'
  while(True):
    try:
      for root, dirs, files in os.walk(xml_path):
          for filename in files:        
              if '.xml' in filename:
                root = str(root)
                path = os.path.join(root,filename)    
                shutil.move(path,lab_xml)
                path1 = path.replace("Annotations", "Images").replace(".xml", ".jpg")
                shutil.move(path1,lab_pic)
      time.sleep(t)
    except Exception as e:
      print "收集标注信息错误",e


if __name__ == '__main__':
  t1=threading.Thread(target=detect_walk,args=(1,app.config['XML_PATH'],app.config['JPG_PATH'],
                                                app.config['LAB_PIC'],app.config['LAB_XML']))
  t1.setDaemon(True)
  t1.start()
  app.run(host='0.0.0.0',port=7001,debug=False,threaded=True)