## 后端部署步骤
1. 安装mongodb: sudo apt-get install mongodb

2. 输入： mongo 进入mongodb命令行

3. 创建robot数据库： use mydb

4. 添加一个用户
db.user_set.insert({
    "username" : "admin",
    "name" : "admin",
    "password" : "admin"
})

检查是否添加成功: db.user_set.find()

5. 启动服务：python run.py


docker 启动： docker run -p 8081:80 -v /home/elk/labelme/Images:/var/www/LabelMeAnnotationTool/Images/ -v /home/elk/labelme/Annotations:/LabelMeAnnotationTool/Annotations -t cannin/labelme

注：/home/elk/labelme/Images /home/elk/labelme/Annotations 路径要开放权限 chmod 777 ***