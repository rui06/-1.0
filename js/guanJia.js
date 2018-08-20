
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
$("#geren li").click(function () {
    $(this).addClass("conActive").siblings().removeClass("conActive");
});
