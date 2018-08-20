function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
$(function () {
    //加载头部
    $("#header_item").load("header.html",function () {
        setmenu(4);
    });
    //加载底部
    $("#footBottom").load("footer.html");
});
$("#qiyouhui").click(function () {
    layer.open({
        type: 1,
        closeBtn: 0, //不显示关闭按钮
        shadeClose: true, //开启遮罩关闭
        title:false,
        area: ['268px', '402px'], //宽高
        content: $("#quanZiContent")
    });
});
