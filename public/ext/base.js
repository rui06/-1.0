/*
 * 使用方法
 * var tmp="我今年{0}岁了，我住{1}";
 * var value=tmp.format("20","深圳");
 * 或
 * var tmp="我叫{name},我住{address}";
 * var value=tmp.format({name:"石头",address:"深圳"})
 */
String.prototype.format = function(args) {
	var result = this;
	if (arguments.length > 0) {
		if (arguments.length == 1 && typeof(args) == "object") {
			for (var key in args) {
				if (args[key] != undefined) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {　　　　　　　　　
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
}

　　
String.prototype.trim = function() {　　
	return this.replace(/(^\s*)|(\s*$)/g, "");　　
}　　
String.prototype.ltrim = function() {　　
	return this.replace(/(^\s*)/g, "");　　
}　　
String.prototype.rtrim = function() {　　
	return this.replace(/(\s*$)/g, "");　　
}

/**
 * 日期时间格式化
 * @param {Object} mask
 */

Date.prototype.Format = function(fmt)   
{ 
	var o = {   
	    "M+" : this.getMonth()+1,                 //月份   
	    "d+" : this.getDate(),                    //日   
	    "h+" : this.getHours(),                   //小时   
	    "m+" : this.getMinutes(),                 //分   
	    "s+" : this.getSeconds(),                 //秒   
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
	    "S"  : this.getMilliseconds()             //毫秒   
	};   
	if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	return fmt;   
}  

/**
 * 删除数组指定的元素
 * @param {Object} m   下标 整数
 */
Array.prototype.ArrRemove = function(m) {　　
	if (isNaN(m) || m > this.length) {
		return false;
	}　　
	this.splice(m, 1);
}

/*
 * 将JSON 转化为 URL 参数
 */
function JsonTOurlParam(jsonOBJ) {
	var str = "";
	for (var field in jsonOBJ) {
		str += "&" + field + "=" + eval("jsonOBJ." + field);
	}
	return str;
}

/*
 * 向head中加入新的样式文件
 */
function AddCssFile(path) {
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = path;
	document.getElementsByTagName("head")[0].appendChild(link);
}

function AddCssFileToTOP(path) {
	var link = top.document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = path;
	top.document.getElementsByTagName("head")[0].appendChild(link);
}

function RemoveCssFile(path) {
	var link = "link[href='{0}']".format(path);
	$(link).remove();
}

function RemoveCssFileFormTOP(path) {
	var link = "link[href='{0}']".format(path);
	$(link,top.document).remove();
}

function isNull(value) {
	if (value == null || value == undefined || value == "" || value.length==0) {
		return true;
	} else {
		return false;
	}
}


