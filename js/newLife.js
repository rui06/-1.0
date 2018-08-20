function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
$(function () {
    //加载头部
    $("#header_item").load("header.html",function () {
        setmenu(3);
    });
    //加载底部
    $("#footBottom").load("footer.html");

    //banner动态加载
    getBanner();
    //租客生活列表页
    newLiftList();
});
