# -*- coding: utf-8 -*-
from flask import Flask
from flask import request
from flask import jsonify
import json
import config
from base import require_args,require_json
import socket, requests
import time,os,sys
import threading

app = Flask(__name__)

app.config.from_object(config)
app.config['UPLOAD_FOLDER'] = os.getcwd() + '/static/pic'

#停止机器
@app.route('/api/stopRobot',methods=['POST'])
def stopRobot():
  print('stopRobot')
  return jsonify(status=200, msg='success', data=None), 200

#启动机器
@app.route('/api/startRobot',methods=['POST'])
# @require_json('image')
def startRobot():
  print('startRobot')
  return jsonify(status=200, msg='success', data=None), 200

#重启机器
@app.route('/api/restartRobot',methods=['POST'])
# @require_json('image')
def adjustRobot():
  print('restartRobot')
  return jsonify(status=200, msg='success', data=None), 200


'''
{
  "hostname": "ubuntu",
  "cpu":{
    "count": 2,
    "percent": "20%"
  },
  "memory":{
    "total": "200",
    "percent": "50%"
  },
  "containers":[{
    "id":"dfasgfhjk",
    "name":"mysql",
    "status": "running"
  }]
}
'''
import psutil
import socket
import docker
from time import sleep
def resource_monitor_thread(t, server):
  print('资源监控线程启动')
  dockerClient=docker.DockerClient(base_url='unix://var/run/docker.sock', version='1.35')
  url = server+'/api/host'
  while True:
    try:
      containers=[]
      containet_list = dockerClient.containers.list(all=1)
      for item in containet_list:
        container={
          "id": item.short_id,
          "name": item.name,
          "status": item.status,
          "image": item.image.tags,
          "labels": json.dumps(item.labels)
        }
        containers.append(container)

      memory=psutil.virtual_memory()
      data={  
          "hostname":socket.gethostname(),
          "cpu":{
            "count": psutil.cpu_count(),
            "percent": psutil.cpu_percent(interval=2)
          },
          "memory":{
            "total": round(memory.total/1000000000,2),
            "percent": memory.percent
          },
          "containers": containers
        }
      print(data)
      r=requests.post(url, data = json.dumps(data))
      if r.status_code == 400:
        print("信息上传失败")
    except Exception as e:
      print('resuorce send error', e)
    sleep(t)

def picture_monitor_thread(t, server, order):
  print('图片监控线程启动')
  url = server+'/api/pic'
  while(True):
    try:
      rootdir = 'static/pic/'
      filenames = os.listdir(rootdir) #列出文件夹下所有的目录与文件
      for filename in filenames: 
        path = os.path.join(rootdir,filename)
        print(path)
        if os.path.isfile(path):
          files = {'file':open(path,'rb')}
          r = requests.post(url, data = {'order':order}, headers={}, files = files)
          if r.status_code == 200:
            os.remove(path)
          time.sleep(t)
    except Exception as e:
          print('pic send error', e)
    time.sleep(t)

def picture_error_thread(t, server):
  print('未识别图片发送线程启动')
  url = server+'/api/pic_error'
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
          if r.status_code == 200:
            os.remove(path)
          time.sleep(t)
    except Exception as e:
          print('pic send error', e)
    
if __name__ == '__main__':
  order = 1
  if len(sys.argv) > 1:
    start(sys.argv[1])
  print('服务器地址：'+app.config['SERVER'])
  t1=threading.Thread(target=resource_monitor_thread,args=(3, app.config['SERVER']))
  t1.setDaemon(True)
  t1.start()
  t2=threading.Thread(target=picture_monitor_thread,args=(1, app.config['SERVER'], order))
  t2.setDaemon(True)
  t2.start()
  t3=threading.Thread(target=picture_error_thread,args=(3, app.config['SERVER']))
  t3.setDaemon(True)
  t3.start()
  app.run(host='0.0.0.0',port=app.config['AGENT_PROT'],debug=False,threaded=True)
