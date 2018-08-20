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
    //人物志列表页
    renWzList();
});
