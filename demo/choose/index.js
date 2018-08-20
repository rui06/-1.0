$("#area a").bind("click",function () {
    //添加条件小标签
    if($(this).attr("value") == ""){
        addTiaoJian("area","");
    }else{
        addTiaoJian("area",$(this).html());
    }
    //移除同类其他元素class样式
    $(this).addClass("cur").siblings().removeClass("cur");
});

//价格筛选
$("#price a").click(function () {
    //添加条件小标签
    if($(this).attr("value") == "-"){
        addTiaoJian("price","");
    }else{
        addTiaoJian("price",$(this).html());
    }
    //移除同类其他元素class样式
    $(this).addClass("cur").siblings().removeClass("cur");
});
//户型筛选
$("#houseType a").click(function () {
    //添加条件小标签
    if($(this).attr("value") == ""){
        addTiaoJian("houseType","");
    }else{
        addTiaoJian("houseType",$(this).html());
    }
    //移除同类其他元素class样式
    $(this).addClass("cur").siblings().removeClass("cur");
});
//租住方式筛选
$("#rentType a").click(function () {
    //添加条件小标签
    if($(this).attr("value") == ""){
        addTiaoJian("rentType","");
    }else{
        addTiaoJian("rentType",$(this).html());
    }
    //移除同类其他元素class样式
    $(this).addClass("cur").siblings().removeClass("cur");
});

//添加条件
function addTiaoJian($id,$value){
    //动态插入选中条件
    if(isNull($value)){
        $("#selectedCondition li a[type='"+$id+"']").parent("li").remove();
    }else{
        if(!isNull($("#selectedCondition li a[type='"+$id+"']").html())){
            $("#selectedCondition li a[type='"+$id+"']").html($value);
        }else{
            $("#selectedCondition").append('<li type="'+$id+'"><a type="'+$id+'" href="javaScript:;">'+$value+'</a><span xx="1" class="closeCondition">×</span></li>');
        }
    }
    //判断是否有已选条件
    if(isNull($("#selectedCondition").html())){
        $("#allCloseCondition").hide();
        $("#noCondition").css("display","inline-block");
    }else{
        $("#allCloseCondition").css("display","inline-block");
        $("#noCondition").hide();
    }
    //关闭选中条件
    $("#selectedCondition li .closeCondition").click(function () {
        $(this).parent("li").remove();
        $("#"+$(this).parent("li").attr("type")).find("[no-search]")[0].click();
    });
}

//清空全部
$("#allCloseCondition").click(function () {
    $("#selectedCondition li").remove();
    $("#allCloseCondition").hide();
    $("#noCondition").css("display","inline-block");
    window.location.href = "index.html";
});


// 判断某个值是否为空，为空返回true，否则返回false
function isNull(value) {
    if ($.trim(value).length == 0 || $.trim(value) == "undefined" || $.trim(value) == "" || $.trim(value) == "null") {
        return true;
    }
    return false;
}
