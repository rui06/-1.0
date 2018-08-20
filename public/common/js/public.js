//服务器IP地址
var ipstr = "http://fangqian.pms.odfly.com";
//var ipstr = "http://oldpms.mianhuagongyu.com";   //老系统地址
//var ipstr1 = "http://pms.mianhuagongyu.com";     //新系统地址
// var ipstr ="http://test.odfly.com";
//  var ipstr1="http://192.168.103.25:52001";
 var ipstr1="http://test.fq.pms.efanghang.com"; //测试
//var ipstr1="http://fq.pms.efanghang.com"; //正式
// var gcid = "0100099";
var gcid = "025001";
var cityCode = "025";   //南京city
var cityName = "南京市";
var cityLat = "32.061553";
var cityLng = "118.779319";
/*var gcid="0100099";
var cityCode = "010";
var cityName = "北京市";
var cityLng = "116.232929";
var cityLat = "39.542415";*/
//json参数封装
function toRequestData(json){
	return "data="+encodeURI(JSON.stringify(json));
}
//字符判空
function isEmpty(arg1)
{
 return !arg1 && arg1!==0 && typeof arg1!=="boolean"?true:false;
}
//如果字符串为null则转换为空
function strFormat(arg1)
{
	if(isEmpty(arg1)){
		return "";
	}
	return arg1;
}
//信息弹出框提示-系统默认
function alertTip(arg1){
	if(isEmpty(arg1)){
		alert("请认真填写必填项信息");
	}else{
		alert(arg1);
	}
}
//自能检测未填项，并提示用户
function checkValue(listArg){
	for(var i=0;i<listArg.length;i++){
		//如果对象是input框
		if($(listArg[i]).is('input')){
			if(isEmpty(listArg[i].val())){
				alertTip(listArg[i].attr("mustfileid"));
				listArg[i].focus();
				return false;
			}
		}
		//如果对象是select选择器
		else if($(listArg[i]).is('select')){
			// TODO
		}
	}
	return true;
}
//判断是否登录
/*function isLogin(){
	var phone = getItems("zukePhone");
	var sfz = getItems("zukeSFZ");
	if(isNull(phone) || isNull(sfz)){
		window.location.href="login.html";
	}
	else{
		return true;
	}
}*/
//-----------------------cookie-user-info----------------------------
// 两个参数，一个是cookie的名子，一个是值
function setItems(name, value)
{	
	if(window.localStorage){
		window.localStorage.setItem(name,value);
	}else{
	 	setCookie(name, value);
	}
}
// 取cookies函数
function getItems(name)
{
	var value = "";
	if(window.localStorage){
		value =  window.localStorage.getItem(name);
	}else{
	 	value = getCookie(name);
	}
	return value;
}
// 删除cookie
function delItems(name)
{
	if(window.localStorage){
		window.localStorage.removeItem(name);
	}else{
	 	delCookie(name);
	}
	
}
function clearItems(){
	try{
		window.localStorage.clear();
	}catch(e){
		clearCookie();
	}
	
}
//去除字符串空格
String.prototype.NoSpace = function()
{
	return this.replace(/\s+/g, "");
};
//退出
function exit(){
	clearItems();
	window.location.href="../../../index.html";
}

// 判断某个值是否为空，为空返回true，否则返回false
function isNull(value) {
	if($.trim(value).length == 0 || $.trim(value) == "undefined" || $.trim(value) == "" || $.trim(value) == "null") {
		return true;
	}
	return false;
}

//获取地址栏参数
function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]);
	return null;
}
//休眠
function sleep(n) { //n表示的毫秒数
	var start = new Date().getTime();
	while (true) if (new Date().getTime() - start > n) break;
}
//清空
function trim(s) { return s.replace(/[ ]/g,"") };

function splitstr(targetstr, types) {//types=1返回大，types=0返回小
	if (targetstr != null && types != null) {
		var strs = new Array();
		strs = targetstr.split(",");
		if (types == 1) {
			return strs[1];
		} else if (types == 0) {
			return strs[0];
		}
	}else{
		return "";
	}
}
//随机数
function getnumber() {
	return parseInt(Math.random() * 5 + 1);
}

/**
 * 加法
 * @param a
 * @param b
 */
function calculateAdd(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch (f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (calculateMul(a, e) + calculateMul(b, e)) / e;
}
/**
 * 减法
 * @param a
 * @param b
 */
function calculateSub(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch (f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (calculateMul(a, e) - calculateMul(b, e)) / e;
}
/**
 * 乘法
 * @param a
 * @param b
 * @returns {number}
 */
function calculateMul(a, b) {
	var c = 0,
		d = a.toString(),
		e = b.toString();
	try {
		c += d.split(".")[1].length;
	} catch (f) {}
	try {
		c += e.split(".")[1].length;
	} catch (f) {}
	return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
/**
 * 除法
 * @param a
 * @param b
 */
function calculateDiv(a, b) {
	var c, d, e = 0,
		f = 0;
	try {
		e = a.toString().split(".")[1].length;
	} catch (g) {}
	try {
		f = b.toString().split(".")[1].length;
	} catch (g) {}
	return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), calculateMul(c / d, Math.pow(10, f - e));
}

