# -*- coding: utf-8 -*-
from flask import Flask
from flask import request, session
from flask import jsonify
import json,os
import config
from flask_pymongo import PyMongo
from base import require_args,require_json
from werkzeug import secure_filename
from flask_cors import CORS
from flask_socketio import SocketIO, emit,send,join_room, leave_room
from threading import Lock
import datetime
from bson.objectid import ObjectId

app = Flask(__name__)

app.config.from_object(config)
CORS(app)
app.config['UPLOAD_FOLDER'] = os.getcwd() + '/static/pic'
socketio = SocketIO(app, async_mode=app.config['ASYNC_MODE'])
mongo = PyMongo(app)

def background_thread():
    socketio.send('dd',broadcast=True)

@app.route('/api/user/login',methods=['POST'])
# @require_json('image')
def login():
    data = json.loads(request.get_data());
    user_set = mongo.db.user_set
    user = user_set.find_one({'username':data.get('username'),'password':data.get('password')})
    if user:
      user['id'] = str(user['_id'])
      user.pop('_id')
      return jsonify([user]), 200
    else:
      return jsonify(None), 400

@app.route('/api/user/getUser',methods=['GET'])
# @require_json('image')
def getUser():
    id = request.args.get('id');
    user_set = mongo.db.user_set
    user = user_set.find_one({'_id':ObjectId(id)})
    if user:
      user['id'] = str(user['_id'])
      user.pop('_id')
      return jsonify([user]), 200
    else:
      return jsonify(None), 400

# @app.route('/api/submitErrorPic',methods=['POST'])
# # @require_json('image')
# def submitErrorPic():
#     data = json.loads(request.get_data().decode('utf-8'))
#     print(data)
#     return jsonify(status=200, msg='success', data=None), 200

#停止机器
@app.route('/api/stopRobot',methods=['POST'])
@require_json('ip')
def stopRobot():
  print('stopRobot',request.get_data())
  return jsonify(status=200, msg='success', data=None), 200

#启动机器
@app.route('/api/startRobot',methods=['POST'])
@require_json('ip')
def startRobot():
  print('startRobot',request.get_data())
  return jsonify(status=200, msg='success', data=None), 200

#重启机器
@app.route('/api/restartRobot',methods=['POST'])
@require_json('ip')
def restartRobot():
  print('restartRobot',request.get_data())
  return jsonify(status=200, msg='success', data=None), 200

@app.route('/api/pic',methods=['POST'])
def upload_file():
    time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    order = request.form.get('order')
    ip=request.remote_addr
    print(ip)
    file = request.files['file']
    filename=secure_filename(file.filename)
    print 'filename= '+filename
    path = 'static/pic/'+filename
    file.save(path)

    user_host_set = mongo.db.user_host_set
    hosts = user_host_set.find({'ip':ip})
    for host in hosts:
      host.pop('_id')
      host['picurl'] = path
      if order:
        host['order'] = int(order)
      host['time'] = time;
      socketio.emit('updatePic', host, room=host['username'], namespace='/socket/client')
    return jsonify(status=200, msg='success', data=None), 200

@app.route('/api/pic_error',methods=['POST'])
def error_pic():
    time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    file = request.files['file']
    filename=secure_filename(file.filename)
    print 'filename= '+filename
    path = 'static/error/'+filename
    file.save(path)
    return jsonify(status=200, msg='success', data=None), 200


@app.route('/api/monitor_host',methods=['POST'])
@require_json('username', 'ip')
def add_monitor_host():
  data = json.loads(request.get_data());
  user_host_set = mongo.db.user_host_set
  if(user_host_set.find_one({'username':data['username'],'ip':data['ip']})):
    return jsonify(status=400, msg='already exist', data=None), 400
  hosts = user_host_set.find({'username':data['username']})
  orders = [1,2,3,4,5,6]
  n = 0
  for host in hosts:
    n = n+1
    orders.remove(host['order'])
  if n >= 6:
    return jsonify(status=400, msg='you need delete some host', data=None), 400

  record = {
    'username': data['username'],
    'ip': data['ip'],
    'order': orders[0]
  }
  record['order'] = orders[0]
  user_host_set.save(record)
  record['_id'] = str(record['_id'])
  return jsonify(status=200, msg='success', data=record), 200

@app.route('/api/monitor_host',methods=['GET'])
@require_args('username')
def get_monitor_host():
  username = request.args.get('username')
  user_host_set = mongo.db.user_host_set
  hosts = user_host_set.find({'username':username})
  data = []
  now = datetime.datetime.now()
  host_set = mongo.db.host_set
  for host in hosts:
    record = host_set.find_one({'_id': host['ip']},{'_id': 1, 'hostname': 1, 'time': 1})
    if(record):
      if(seconds(record['time'],now)>10):
        record['status'] = 'disconnect'
      else:
        record['status'] = 'running'
      record['order'] = host['order']
      record['_id'] = str(record['_id'])
      data.append(record)
  return jsonify(status=200, msg='success', data=data), 200

@app.route('/api/monitor_host',methods=['DELETE'])
@require_json('username', 'ip')
def delete_monitor_host():
  data = json.loads(request.get_data())
  user_host_set = mongo.db.user_host_set
  user_host_set.remove({'username':data['username'],'ip':data['ip']})
  return jsonify(status=200, msg='success', data=None), 200

@socketio.on('message', namespace='/socket/client')
def client_message(message):
    print('recv:'+request.sid)
    print(message)

@socketio.on('connect', namespace='/socket/client')
def client_connect():
    print('client connect:'+request.sid)
    send({'data': 'Connected'})

@socketio.on('disconnect', namespace='/socket/client')
def client_disconnect():
    print('client disconnected')

@socketio.on('join', namespace='/socket/client')
def on_join(data):
  print('entered room:'+data.get('username')+' '+data.get('room'))
  if(data.get('username') and data.get('room')):
    join_room(data.get('room'))
    session[data.get('username')]=data.get('room')
    print(session)
      
@socketio.on('leave', namespace='/socket/client')
def on_leave(data):
  print('leave room:'+data.get('username')+' '+data.get('room'))
  if(date.get('room')):
    leave_room(room)
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
  },{
    "id":"dddsgdhdd",
    "name":"web",
    "status": "exited"
  }]
}
'''
@app.route('/api/host',methods=['POST'])
@require_json('hostname')
def add_host(): 
  data = json.loads(request.get_data());
  ip=request.remote_addr
  time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
  data['_id'] = ip
  data['time'] = time
  host_set = mongo.db.host_set
  host_set.save(data)
  return jsonify(status=200, msg='success', data=None), 200

def seconds(start_time,end_time):
  start_time=datetime.datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
  t=end_time-start_time
  return t.total_seconds()

@app.route('/api/host',methods=['GET'])
@require_args('username')
def get_hosts():
  username = request.args.get('username')

  host_set = mongo.db.host_set
  hosts = host_set.find({})

  user_host_set = mongo.db.user_host_set
  monitors = user_host_set.find({'username':username})
  ips={}
  for monitor in monitors:
    ips[monitor['ip']] = 1

  now = datetime.datetime.now()
  data=[]
  for host in hosts:
    if(seconds(host['time'],now)>10):
      host['status'] = 'disconnect'
    else:
      host['status'] = 'running'
    if ips.has_key(host['_id']):
      host['isMonitor'] = True
    else:
      host['isMonitor'] = False
    host['containerNum'] = len(host['containers'])
    data.append(host)
  return jsonify(status=200, msg='success', data=data), 200

@app.route('/api/host',methods=['PUT'])
def update_host():
  data = json.loads(request.get_data());
  id = data.get('id')
  host_set = mongo.db.host_set
  host_set.update({"_id":id},{"$set":{"remarks":data.get('remarks')}})
  return jsonify(status=200, msg='success', data=None), 200

@app.route('/api/host/<id>',methods=['GET'])
def get_host(id):
  host_set = mongo.db.host_set
  host = host_set.find_one({'_id':id})
  now = datetime.datetime.now()
  if host:
    if(seconds(host['time'],now)>10):
      host['status'] = 'disconnect'
    else:
      host['status'] = 'running'
    host['containerNum'] = len(host['containers'])
  return jsonify(status=200, msg='success', data=host), 200

@app.route('/api/host/<id>',methods=['DELETE'])
def delete_host(id):
  user_host_set = mongo.db.user_host_set
  user_host_set.remove({'_ip':id})
  host_set = mongo.db.host_set
  host_set.remove({'_id':id})
  return jsonify(status=200, msg='success', data=id), 200

if __name__ == '__main__':
    # app.run(host='0.0.0.0',port=5000,debug=False,threaded=True)
    socketio.run(app)

# lock = Lock()
# @app.route('/agent/register',methods=['POST'])
# def agent_register():
#   with lock:
#     ip=request.remote_addr
#     print('register:'+ip)
#     data = json.loads(request.get_data().decode('utf-8'))
#     host_set = mongo.db.host_set
#     num = host_set.find().count()
#     print(num)
#     if num >=6:
#       return jsonify(status=400, msg='host is too much', data=None), 400
#     hosts=host_set.find().sort("order")
#     record={
#       'ip': ip,
#       'hostName': data.get('hostName'),
#       'port': data.get('port')
#     }
#     orders = [1,2,3,4,5,6]
#     for host in hosts:
#       orders.remove(host['order'])
#     record['order'] = orders[0]
#     id = host_set.save(record)
#     record['_id'] = str(id)
#     return jsonify(status=200, msg='add success', data=record), 200
#   return jsonify(status=400, msg='add error', data=None), 400
