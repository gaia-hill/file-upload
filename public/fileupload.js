
var fileupload = function(selector,option,callback){
	
	/*
	 *
	 * 默认属性
	 * url：上传使用的接口，注意、注意、注意：后端接口的 Content-Type 需要设置为 text/html，不然在IE中会下载返回的json数据
	 * method：接口方法
	 * type：支持的文件类型，格式为["image/png","image/jpeg","image/jpg"]
	 * maxsize：文件最大尺寸，单位为字节（1M 即写成 1*1024*1024）
	 * success：接口访问成功执行的方法，参数为返回的数据
	 * error：文件格式或内容出错时执行的方法，参数为错误信息
	 *
	 */
	var _option = {
		url:option.url?option.url:"#",
		method:option.method?option.method:"post",
		type:option.type?option.type:["image/png","image/jpeg","image/jpg"],
		maxsize:option.maxsize?option.maxsize:2*1000*1000,
		success:option.success?option.success:(function(){}),
		error:option.error?option.error:(function(){}),
	};

	/*
	 * 点击上传按钮的事件
	 */
	document.getElementById(selector).addEventListener("click",function(){

		//清除原先添加的iframe
		var oldBox = document.getElementsByClassName("uploadBox");
		for(var i=0;i<oldBox.length;i++){
			document.body.removeChild(oldBox[i]);
		}
		

		//创建一个iframe
		var iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.className = "uploadBox";

		//将iframe放到body中
		document.body.appendChild(iframe);

		//获取iframe的document对象
		var iframeDoc = iframe.document||iframe.contentDocument;

		//触发一下iframe document的load事件（不然在firefox中不能设置iframe中body的innerHTML）
		iframeDoc.open();
		iframeDoc.close();

		//在iframe中添加上传文件的表单
		// iframeDoc.head.innerHTML = "";
		iframeDoc.body.innerHTML = [
			'<form id="uploadForm" action="'+_option.url+'" target="_self" method="'+_option.method+'" enctype="multipart/form-data">',
				'<input id="uploadBtn" type="file" multiple="multiple" name="upfiles" onchange="window.select(this)" />',
			'</form>',
		].join("");

		//定义iframe的onload事件，用来处理上传接口返回的数据
		iframe.onload = function(){
			
			//重新获取一次iframe的document，之前的document内容已过期
			var doc = iframe.document||iframe.contentDocument;

			//获取iframe中body的内容（接口返回的数据）
			var content = doc.body.innerHTML;
			
			if(content[0]=="{"){
				document.body.removeChild(iframe);
				_option.success(JSON.parse(content));
			}
		};
		
		//定义iframe中input框选择文件后执行的操作
		iframe.contentWindow.select=function (_this){
			var filename = "";
			var isRight = true;

			//存储出错的文件名
			var typeError = [];
			var sizeError = [];

			var files = _this.files;

			//判断文件格式和文件大小
			for(var i=0;i<files.length;i++){
				if(files[i].name.lastIndexOf(".") != -1){
					if(_option.type.indexOf(files[i].type)!=-1){
		     			if(files[i].size > _option.maxsize){
		     				sizeError.push(files[i].name);
		     				isRight = false;
		     			}
		        	}else{
		        		typeError.push(files[i].name);
		        		isRight = false;
		        	}
				}else{
					typeError.push(files[i].name);
					isRight = false;
				}
			}

			if(isRight){
				//文件未出错时，提交表单
				iframeDoc.getElementById("uploadForm").submit();
			}else{
				//出错后收集错误信息并执行回调函数
				var error={
					type:_option.type,
					maxsize:_option.maxsize,
					typeError:typeError,
					sizeError:sizeError,
				}
				_option.error(error);
			}		
		}

		//触发iframe中input[type=file]的点击事件，弹出选择文件对话框
		iframeDoc.getElementById("uploadBtn").click();

	});
}
