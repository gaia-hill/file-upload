var express = require('express');
var router = express.Router();
var path = require("path");

var multer  = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
  	var filenameArr = file.originalname.split(".");
  	var fileExtension = filenameArr.pop();
  	var filename = filenameArr.join(".");
    cb(null, filename + '-' + Date.now() + "." + fileExtension);
  }
});
var upload = multer({ storage: storage })


//主页
router.get('/', function (req, res, next) {
	res.redirect('/index.html');
});

//文件上传接口
router.post('/upload',upload.array('upfiles',12),function (req, res, next) {
	// console.log("===============================================");
	console.log(req.files,req.body);

	var files = [];
	for(var i=0;i<req.files.length;i++){
		files.push({
			originalname:req.files[i].originalname,
			filename:req.files[i].filename,
			path:"http://localhost:3000/uploads/"+req.files[i].filename,
		})
	}

	res.set('Content-Type', 'text/html');
	res.set('X-Frame-Options', 'SAMEORIGIN');
	res.send({
		code:200,
		files:files,
		message:"ok",
	});
});


module.exports = router;