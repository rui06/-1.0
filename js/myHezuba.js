function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
$(function () {
    //加载头部
    $("#header_item").load("header.html");
    //加载底部
    $("#footBottom").load("footer.html");
});
//租期服务
$("#zqfu").click(function () {
    $("#zufuCon").toggle();
});
//品牌介绍
$("#ppjs").click(function () {
    $("#ppjsCon").toggle();
});
//关于我们
$("#gywm").click(function () {
    $("#gywmCon").toggle();
});