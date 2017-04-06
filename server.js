var express = require('express');
var app = express();

var path = require("path");

//加载路由
var route = require('./route/route');


//配置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));

//路由设置
app.use("/",route);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('listening at http://%s:%s', host, port);

});