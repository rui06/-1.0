//修改资料数据
var ziliaoShuju = {
    "shengFenZheng":"",        //用户姓名
    "phone":"",       //手机号
    "nickName":"",    //昵称
    "sex":"",         //性别
    "shengri":"",     //生日
    "zhiye":"",       //职业
    "aihao":""        //爱好
}
//加载头部文件
function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
$(function () {
    //加载头部
    $("#header_item").load("header.html",function () {
        setmenu(6);
    });
    //加载底部
    $("#footBottom").load("footer.html");

});
$("#geren li").click(function () {
    $(this).addClass("conActive").siblings().removeClass("conActive");
});
//签约
$("#yuDingContent").find("span[name='lijiQianYue']").click(function () {
    layui.layer.alert("非常抱歉，暂不支持网上签约，请您联系管家！");
});
/*//个人资料修改保存
$("#baocun").click(function () {
    var $ziLiao = $("#xiuGaiZiLiao");
    //昵称
    var $userName = $ziLiao.find("input[name='nickName']").val();
    //性别
    var $sex = $ziLiao.find('input[name="sex"]:checked').val();
    //生日
    var $shengri = $ziLiao.find('input[name="shengr"]').val();
    //职业
    var $zhiye = $ziLiao.find('input[name="zhiye"]').val();
    //爱好
    var $aihao = $ziLiao.find('input[name="aihao"]').val();
    ziliaoShuju.phone = getItems("zukePhone");
    ziliaoShuju.shengFenZheng = getItems("zukeSFZ");
    ziliaoShuju.nickName = $userName;
    ziliaoShuju.sex = $sex;
    ziliaoShuju.shengri = $shengri;
    ziliaoShuju.zhiye = $zhiye;
    ziliaoShuju.aihao = $aihao;
    if(isNull($userName)){
        layui.layer.alert("请输入昵称！");
    }else if(isNull($shengri)){
        layui.layer.alert("请输入生日！");
    }else{
        //修改资料
        xiuGaiZiliao();
    }
});*/
$(".addTousu").click(function () {
    //页面层
    layui.layer.open({
        title:'投诉',
        type: 1,
        area: ['420px', '240px'], //宽高
        content: $("#addts")
    });
});
$("#addWeixiu").click(function () {
    $("#wx_zukePhone").val("17701311856");
    //页面层
    layui.layer.open({
        title:'维修',
        type: 1,
        area: ['480px', '400px'], //宽高
        content: $("#addwx")
    });
});

//添加维修
$("#wxSubmit").click(function () {
    if($("#wx_zukePhone").val() == ""){
        layui.layer.msg("请填写期联系方式！");
        return;
    }else if($("#expectCompletionTime").val() == ""){
        layui.layer.msg("请填写期望处理时间！");
        return;
    }else if($("#repairContent").val() == ""){
        layui.layer.msg("请填写维修内容！");
        return;
    }else{
        addwx();
    }
});
/*
//修改资料
$("#uploadPic").click(function () {
    picUpload();
});
//初始化图片上传
function picUpload(){
    // 初始化Web Uploader
    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,
        // swf文件路径
        swf:'/webUploader/Uploader.swf',
        // 文件接收服务端。
        server: '/UploadHouseServlet?server=upload&',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/!*'
        }
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadAccept', function(obj, ret ) {
        if(ret.success==true){
            var temp = '<img src="'+ret.urlSmall+'" urlBig="'+ret.url+'"></div>';
            $("#touXiangPic").append(temp);
        }
    });
}
*/
