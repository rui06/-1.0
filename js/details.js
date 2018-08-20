//预约数据
var yuYueShuju = {
    "yuYueHouseId":"",       //预约房源id
    "yuYueName":"",         //预约人姓名
    "yuYuePhone":"",        //预约人电话
    "yuYueDate":""         //预约入住时间
};
//费用配置
var feiYongPeiZhi = {
    "heZuSHF":"170",
    "zhengZuSHF":"170",
    "yueFuZheKou":"1.06",
    "jiFuZheKou":"1",
    "banNianZheKou":"0.98",
    "nianFuZheKou":"0.96"
};
function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
$(function () {
    //加载头部
    $("#header_item").load("header.html",function () {
        setmenu(1);
    });
    //加载底部
    $("#footBottom").load("footer.html");
    //动态加载banner
    getBanner();
});
$(".shiYou ul li").mouseover(function () {
    $(".shiYouContent").css("top","0");
});
$(".shiYou").mouseout(function () {
    $(".shiYouContent").css("top","-240px");
});
$("#yuYueSubmit").click(function () {
    if($("#yuYueName").val() == ""){
        layui.layer.msg("请填写您的姓名！");
        return;
    }else if($("#yuYueTime").val() == ""){
        layui.layer.msg("请填写预约看房时间！");
        return;
    }else if($("#yuYuePhone").val() == ""){
        layui.layer.msg("请填写您的联系方式！");
        return;
    }else{
        yuYueShuju.yuYueName = $("#yuYueName").val();
        yuYueShuju.yuYuePhone = $("#yuYuePhone").val();
        yuYueShuju.yuYueDate = $("#yuYueTime").val();
        upyuyue();
    }
});

$("#LiJiYuDing").click(function () {
    var $yuDingName = $("#yuDingName");       //预订人姓名
    var $yuDingPhone = $("#yuDingPhone");     //预定人电话
    var $dingJin = $("#yuDingDingJin");       //定金
    var $ruZhuDate = $("#ruZhuDate");         //预计入住时间
    var $beizhu = $("#yuDingBeiZhu");         //备注
    detailsShuju.yudingName = $yuDingName.val();
    detailsShuju.yudingPhone = $yuDingPhone.val();
    detailsShuju.dingjin = $dingJin.val();
    detailsShuju.ruZhuDate = $ruZhuDate.val();
    detailsShuju.beizhu = $beizhu.val();
    if(isNull($yuDingName.val())){
        layui.layer.msg("请填写您的姓名！");
    }else if(isNull($yuDingPhone.val())){
        layui.layer.msg("请填写您的联系方式！");
    }else{
        layui.layer.closeAll();
        //location.href = "https://auth.alipay.com/login/index.htm";
        layui.layer.msg('我们正在努力开放"在线预定"功能，敬请期待！');
    }
});
//判断星座代码
function xingzuo(tmpStr) {
    var month = tmpStr.substring(5, 7);
    var date = tmpStr.substring(8);
    var $xingZuo = "";
    if(month<=12 &&month>0){
        if (month == 1 && date >=20 || month == 2 && date <=18) {$xingZuo = "水瓶座";}
        if (month == 1 && date > 31) {$xingZuo = "···";}
        if (month == 2 && date >=19 || month == 3 && date <=20) {$xingZuo = "双鱼座";}
        if (month == 2 && date > 29) {$xingZuo = "···";}
        if (month == 3 && date >=21 || month == 4 && date <=19) {$xingZuo = "白羊座";}
        if (month == 3 && date > 31) {$xingZuo = "···";}
        if (month == 4 && date >=20 || month == 5 && date <=20) {$xingZuo = "金牛座";}
        if (month == 4 && date > 30) {$xingZuo = "···";}
        if (month == 5 && date >=21 || month == 6 && date <=21) {$xingZuo = "双子座";}
        if (month == 5 && date > 31) {$xingZuo = "···";}
        if (month == 6 && date >=22 || month == 7 && date <=22) {$xingZuo = "巨蟹座";}
        if (month == 6 && date > 30) {$xingZuo = "···";}
        if (month == 7 && date >=23 || month == 8 && date <=22) {$xingZuo = "狮子座";}
        if (month == 7 && date > 31) {$xingZuo = "···";}
        if (month == 8 && date >=23 || month == 9 && date <=22) {$xingZuo = "处女座";}
        if (month == 8 && date > 31) {$xingZuo = "···";}
        if (month == 9 && date >=23 || month == 10 && date <=22) {$xingZuo = "天秤座";}
        if (month == 9 && date > 30) {$xingZuo = "···";}
        if (month == 10 && date >=23 || month == 11 && date <=21) {$xingZuo = "天蝎座";}
        if (month == 10 && date > 31) {$xingZuo = "···";}
        if (month == 11 && date >=22 || month == 12 && date <=21) {$xingZuo = "射手座";}
        if (month == 11 && date > 30) {$xingZuo = "···";}
        if (month == 12 && date >=22 || month == 1 && date <=19) {$xingZuo = "摩羯座";}
        if (month == 12 && date > 31) {$xingZuo = "···";}
    }else{
        $xingZuo = '···';
    }

    return $xingZuo;
}
//验证身份证号并获取出生日期
function getBirthdatByIdNo(iIdNo) {
    var tmpStr = "";
    var strReturn = "";
    iIdNo = trim(iIdNo);
    if ((iIdNo.length != 15) && (iIdNo.length != 18)) {
        strReturn = "0";
        return strReturn;
    }
    if (iIdNo.length == 15) {
        tmpStr = iIdNo.substring(6, 12);
        tmpStr = "19" + tmpStr;
        tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
        return tmpStr;
    }
    else {
        tmpStr = iIdNo.substring(6, 14);
        tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
        return tmpStr;
    }
}

//验证男女
function isNanNv(iIdNo) {
    var tmpStr = "";
    var strReturn = "";
    iIdNo = trim(iIdNo);
    if ((iIdNo.length != 15) && (iIdNo.length != 18)) {
        return "1";
    }else{
        if (iIdNo.length == 15) {
            tmpStr = iIdNo.substring(14, 15);
            if((tmpStr%2) == 0){
                strReturn = "0";
            }else{
                strReturn = "1";
            }
            return strReturn;
        }else {
            tmpStr = iIdNo.substring(16, 17);
            if((tmpStr%2) == 0){
                strReturn = "0";
            }else{
                strReturn = "1";
            }
            return strReturn;
        }
    }
}

