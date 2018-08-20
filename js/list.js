function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}

/*var viewData = {
    pageNo: '1',
    pageSize: '',
    houseType: listDate.isSub,
    quyuAId: listDate.quyuAId,
    zujinBegin: listDate.zuJinMin,
    zujinEnd: listDate.zuJinMax,
    likeName: listDate.areaName,
    taizhang: listDate.houseId,
    shi: listDate.shi,
    tese:listDate.teseAId,
    gcid: listDate.gcid,
    houseStatus: '21'
};*/
$(function () {
    //加载头部
    $("#header_item").load("header.html", function () {
        setmenu(1);
    });
    //加载底部
    $("#footBottom").load("footer.html");
    //获取房源列表信息
    getHouseList();
});

/**
 * 获取房源信息
 */
function getHouseList() {
    shaixuan();
}

//切换搜索框
$("#qieHuan").click(function () {
    var $type = $(this).attr("type");
    if($type == 1){
        $("#roomName").css("display","none");
        $("#roomId").css("display","block");
        $("#roomName").val("");
        $(this).attr("type","2");
    }else{
        $("#roomName").css("display","block");
        $("#roomId").css("display","none");
        $("#roomId").val("");
        $(this).attr("type","1");
    }
});

//价格筛选
$("#price a").click(function () {
    //添加条件小标签
    if($(this).attr("value") == "-"){
        addTiaoJian("price","");
    }else{
        addTiaoJian("price",$(this).html());
    }
    //清空搜索框内容
    $("#roomName").val("");
    $(this).addClass("cur").siblings().removeClass("cur");
    $("#zuJin").val($(this).attr("value"));
    shaixuan();
});

//户型筛选
$("#huXing a").click(function () {
    //添加条件小标签
    if($(this).attr("value") == ""){
        addTiaoJian("huXing","");
    }else{
        addTiaoJian("huXing",$(this).html());
    }
    //清空搜索框内容
    $("#roomName").val("");
    $(this).addClass("cur").siblings().removeClass("cur");
    $("#huXingName").val($(this).attr("value"));
    shaixuan();
});

//租住方式筛选
$("#zuZhuFangShi a").click(function () {
    //添加条件小标签
    if($(this).attr("value") == ""){
        addTiaoJian("zuZhuFangShi","");
    }else{
        addTiaoJian("zuZhuFangShi",$(this).html());
    }
    //清空搜索框内容
    $("#roomName").val("");
    $(this).addClass("cur").siblings().removeClass("cur");
    $("#zuZhuFangShiName").val($(this).attr("value"));
    shaixuan();
});

//添加条件
function addTiaoJian($id,$value){
    //动态插入选中条件
    if(isNull($value)){
        $("#yiXuanTiaoJian li a[type='"+$id+"']").parent("li").remove();
    }else{
        if(!isNull($("#yiXuanTiaoJian li a[type='"+$id+"']").html())){
            $("#yiXuanTiaoJian li a[type='"+$id+"']").html($value);
        }else{
            $("#yiXuanTiaoJian").append('<li type="'+$id+'"><a type="'+$id+'" href="javaScript:;">'+$value+'</a><span xx="1" class="guanBi">×</span></li>');
        }
    }
    //判断是否有已选条件
    if(isNull($("#yiXuanTiaoJian").html())){
        $("#allClose").hide();
        $("#noTiaojian").css("display","inline-block");
    }else{
        $("#allClose").css("display","inline-block");
        $("#noTiaojian").hide();
    }
    //关闭选中条件
    $("#yiXuanTiaoJian li .guanBi").click(function () {
        $(this).parent("li").remove();
        $("#"+$(this).parent("li").attr("type")).find("[no-search]")[0].click();
    });
}

function splitstr(targetstr,types){//types=1返回大，types=0返回小
    if(targetstr!=null&&types!=null){
        var strs = new Array();
        strs = targetstr.split("-");
        if(types==1){
            return strs[1];
        }else if(types==0){
            return strs[0];
        }
    }
}
//搜索框
$("#selectRoom").click(function () {
    shaixuan();
});
//搜索框回车键
$('#roomName').keydown(function(e){
    if(e.keyCode==13){
        shaixuan();
    }
});

//筛选条件
function shaixuan() {
    listDate.pageNo = 1;
    //搜索框小区名
    if($("#qieHuan").attr("type") == "1"){   //搜索小区名
        listDate.areaName = strFormat($("#roomName").val());
        listDate.taizhang = '';
        listDate.houseStatus = '21';
        listDate.quyuAId = $("#quYuName").val();   //区域Name
        var $zuJin = $("#zuJin").val();            //租金
        listDate.zuJinMin = strFormat(splitstr($zuJin,0));
        listDate.zuJinMax = strFormat(splitstr($zuJin,1));
        listDate.shi = strFormat($("#huXingName").val());    //户型Name
        listDate.isSub = strFormat($("#zuZhuFangShiName").val());    //租住方式Name
        listDate.houseId = strFormat($("#roomId").val());     //搜索框房源编号
        listDate.teseAId = strFormat($("#teseName").val());   //特色
    }else{     //搜索台账号
        listDate.taizhang = strFormat($("#roomId").val());
        //清空其它搜索条件
        listDate.areaName = '';
        listDate.houseStatus = '';
        listDate.quyuAId = '';
        listDate.zuJinMin = '';
        listDate.zuJinMax = '';
        listDate.shi = '';   //户型Name
        listDate.isSub = '';     //租住方式Name
        listDate.houseId = '';    //搜索框房源编号
        listDate.teseAId = '';    //特色
    }
    housesList(listDate.pageNo);
}

//清空全部
$("#allClose").click(function () {
    $("#yiXuanTiaoJian li").remove();
    $("#allClose").hide();
    $("#noTiaojian").css("display","inline-block");
    window.location.href = "list.html";
});
