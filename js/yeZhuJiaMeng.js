function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
$(function () {
    //加载头部
    $("#header_item").load("header.html",function () {
        setmenu(5);
    });
    //加载底部
    $("#footBottom").load("footer.html");
});
$("#jiameng").click(function () {
    layer.open({
        type: 1,
        closeBtn: 0, //不显示关闭按钮
        shadeClose: true, //开启遮罩关闭
        title:false,
        area: ['540px', '670px'], //宽高
        content: $("#jiaMengContent")
    });
});

$("#jiaMeng-submit").click(function () {
    //用户姓名
    var $userName = $("#jiaMeng-userName");
    //用户电话
    var $userPhone = $("#jiaMeng-userPhone");
    //面积
    var $mianji = $("#jiaMeng-mianJi");
    //日期
    var $riQi = $("#jiaMeng-date");
    //备注
    var $beiZhu = $("#jiaMeng-neirong");
    //性别
    var $xingBie = $("input[name='sex']:checked");
    //室
    var $shi = $("#jiaMeng-shi").find("option:selected");
    //厅
    var $ting = $("#jiaMeng-ting").find("option:selected");
    //卫
    var $wei = $("#jiaMeng-wei").find("option:selected");
    //租金
    var $zujin = $("#jiaMeng-zuJin");
    //小区名字
    var $xiaoQuName = $("#jiaMeng-xiaoQuName");
    $jiaMeng.userName = $userName.val();
    $jiaMeng.userPhone = $userPhone.val();
    $jiaMeng.mianji = $mianji.val();
    $jiaMeng.date = $riQi.val();
    $jiaMeng.beizhu = $beiZhu.val();
    $jiaMeng.sex = $xingBie.val();
    $jiaMeng.huxingShi = $shi.val();
    $jiaMeng.huxingTing = $ting.val();
    $jiaMeng.huxingWei = $wei.val();
    $jiaMeng.zujin = $zujin.val();
    $jiaMeng.xiaoQuName = $xiaoQuName.val();
    if(isNull($userName.val())){
        layui.layer.alert("姓名还没有填哦！");
        $userName.focus();
    }else if(isNull($userPhone.val())){
        layui.layer.alert("电话还没有填哦！");
        $userPhone.focus();
    }else if(isNull($xiaoQuName.val())){
        layui.layer.alert("小区名字还没有填哦！");
        $xiaoQuName.focus();
    }else if(isNull($mianji.val())){
        layui.layer.alert("面积还没有填哦！");
        $mianji.focus();
    }else if(isNull($zujin.val())){
        layui.layer.alert("租金还没有填哦！");
        $zujin.focus();
    }else{
        chuZuDengJi();
    }
});