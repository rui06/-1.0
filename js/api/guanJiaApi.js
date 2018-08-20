function myGuanJia($this,$guanjiaName,$guanjiaPhone){
    $($this).find(".guanjiaPic").find("img").attr("src","images/guanjiaImages.jpg");
    $($this).find(".guanjiaName").find("dt").html($guanjiaName);
    $($this).find(".guanjiaWeiXin").find("dt").html("暂无");
    $($this).find(".guanjiaPhone").find("dd").html($guanjiaPhone);
    $($this).find(".gongzuoTime").find("dd").html("08:00 - 20:00");
}
