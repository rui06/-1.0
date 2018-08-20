function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
$(function () {
    //加载头部
    $("#header_item").load("header.html",function () {
        setmenu(0);
    });
    //加载底部
    $("#footBottom").load("footer.html");
    //房源风格点击事件
    $(".roomList").click(function () {
        window.location.href="list.html";
    });
    //动态加载banner
    getBanner();
    //房源列表
    //getHouseList();
    //租客生活加载
    renWzList();
});