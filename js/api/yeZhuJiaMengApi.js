//业主加盟数据
var $jiaMeng = {
    "userName":"",   //业主姓名
    "userPhone":"",   //业主电话
    "mianji":"",   //出租面积
    "zujin":"",   //出租租金
    "xiaoQuName":"", //小区名字
    "sex":"",        //业主性别
    "date":"",      //起租日期
    "huxingShi":"",   //户型（室）
    "huxingTing":"",   //户型（厅）
    "huxingWei":"",   //户型（卫）
    "beizhu":""   //备注
};

//动态加载banner
getBanner();
//banner动态加载
function getBanner() {
    var data_json = {
        method: "webGetList",
        params: {
            "pageNo": 1,
            "gcid": gcid,
            "bigType": "1",       //1   web端  2 手机端
            "pageSize": 2,
            "type": "4"            //1  首页   2 租客生活 3 人物日志
        }
    };
    var $bannerList = "";
    var $item = "";
    $.ajax({
        url: ipstr + '/webMangerBannerInfo/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        jsonp: "callback",
        jsonpCallback: "webGetList",
        beforeSend:function(XMLHttpRequest){
            //加载前
            XMLHttpRequest.setRequestHeader("gcid", gcid);
        },
        success: function (json) {
            if (json.status.code == 200){
                if(json.result.list.length > 0){
                    $.each(json.result.list,function (n,value) {
                        var $imageSrc = "";
                        if(value["bannerHref"] != ""){
                            $imageSrc = value["bannerHref"];
                        }else{
                            $imageSrc = "images/banner/indexBanner/banner001.jpg";
                        }
                        $bannerList += '<div class="slide"><img src="'+$imageSrc+'" /></div>';
                        if(n == 0){
                            $item += '<a class="cur" stat="item100'+(n+1)+'" href="javascript:;"></a>';
                        }else{
                            $item += '<a href="javascript:;" stat="item100'+(n+1)+'"></a>';
                        }
                    });
                }
                $("#slideContent").html($bannerList);
                $("#bannerItem").html($item);
                //重新渲染banner
                initBanner();
            }
        }
    });
}

//业主加盟
function chuZuDengJi(){
    var data_json = {
        method : "saveOrUpdate",
        params : {
            "username":$jiaMeng.userName,
            "phone":$jiaMeng.userPhone,
            "rentsTime":$jiaMeng.date,
            "communtiyName":$jiaMeng.xiaoQuName,  //小区名字
            "room":$jiaMeng.huxingShi,  //室
            "hall":$jiaMeng.huxingTing,  //厅
            "kitchen":"1",
            "guard":$jiaMeng.huxingWei,  //卫
            "intentionRents":$jiaMeng.zujin,  //意向租金
            "states":1,
            "gender":$jiaMeng.sex,
            "remark":$jiaMeng.beizhu,
            "recommendedphone":strFormat(getItems("zukePhone")),
            "gcid":gcid
        }
    };
    var sonlist="";
    $.ajax({
        url:ipstr+'/inforRecommend/request.action',
        type:'post',
        dataType:'jsonp',
        data:toRequestData(data_json),
        beforeSend:function(XMLHttpRequest){
            //加载前
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp: "callback",
        jsonpCallback:"saveOrUpdate",
        success:function(json){
            try{
                if(json.status.code==200){
                    layui.layer.closeAll();
                    layui.layer.msg("提交成功！请耐心等待管家与您联系哟！");
                    //用户姓名
                    $("#jiaMeng-userName").val("");
                    //用户电话
                    $("#jiaMeng-userPhone").val("");
                    //面积
                    $("#jiaMeng-mianJi").val("");
                    //日期
                    $("#jiaMeng-date").val("");
                    //备注
                    $("#jiaMeng-neirong").val("");
                    /*//性别
                    $("input[name='sex']:checked").val("");
                    //室
                    $("#jiaMeng-shi").find("option:selected").val("");
                    //厅
                    $("#jiaMeng-ting").find("option:selected").val("");
                    //卫
                    $("#jiaMeng-wei").find("option:selected").val("");*/
                    //租金
                    $("#jiaMeng-zuJin").val("");
                    //小区名字
                    $("#jiaMeng-xiaoQuName").val("");
                }else{
                    layui.layer.closeAll();
                    layui.layer.alert("网络错误！请稍后重试！");
                }
            }catch(e){
                alert("网络错误！请稍后重试！");
            }
        }
    })
}
