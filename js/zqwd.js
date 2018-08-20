function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
$(function () {
    //加载头部
    $("#header_item").load("header.html",function () {
        setmenu(4);
    });
    //加载底部
    $("#footer_item").load("footer.html");

});

/*$("#close").click(function (){
    $("#con_input").val("");
    $("#con_phone").val("");
    $("#tiWen").hide();
//	$("#tiWen").css("display", "none");
    $("#mask").hide();
});*/

$("#myQuestions").click(function (){
    layer.open({
        type: 1,
        title:"我要提问",
        area: ['520px', '310px'], //宽高
        content: $("#tiWen")
    });
    /*$("#mask").width($(document).width());
    $("#mask").height($(document).height());

    $("#mask").toggle();
    $("#tiWen").toggle();*/
});

$("#bunTijiao").click(function (){
    $conInput=$("#con_input");
    $conPhone=$("#con_phone");
    if($conInput.val()==""){
        layui.layer.alert("请填写提问内容！");
        $conInput.focus();
    }else if($conPhone.val()==""){
        layui.layer.alert("请填写联系电话！");
        $conPhone.focus();
    }else{
        submitWenTi($conInput,$conPhone);
    }
});


