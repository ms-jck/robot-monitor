## 后端部署步骤
1. 安装mongodb: sudo apt-get install mongodb

2. 输入： mongo 进入mongodb命令行

3. 创建robot数据库： use robot

4. 添加一个用户
db.user_set.insert({
    "username" : "admin",
    "name" : "admin",
    "password" : "admin",
    "email" : "admin@163.com",
    "avatar" : "static/headPic/head.jpg"
})

检查是否添加成功: db.user_set.find()

5. 启动服务：./start.sh

6 启动服务 python pic_client.py 未识别图片发送到标注系统