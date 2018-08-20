var $weixiuValue = {
    "houseId":"", //房源id
    "hetongId":"", //合同id
    "zukeName":"",  //租客姓名
    "zukePhone":"", //租客电话
    "chengJiaoNumber":"", ////合同编号
    "pageNo":"1", //当前页
    "pageSize":"10" //每页显示数量
};
//维修列表
function getwxlist($this) {
    var data_json = {
        method: "listPhoneWebMaintain",
        params: {
            "gcid": gcid,
            "pageNo": $weixiuValue.pageNo,
            "pageSize": $weixiuValue.pageSize,
            "customerCalls": $weixiuValue.zukePhone,
            "contractNumber": $weixiuValue.hetongId
        }
    };
    var $wxlist = '';
    $.ajax({
        url: ipstr + '/webChengzu/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        jsonp: "callback",
        jsonpCallback: "listPhoneWebMaintain",
        success: function (json) {
            var $weixiuIdList = new Array();
            if (json.status.code == 200) {
                if (json.result.list.length > 0) {
                    $.each(json.result.list,function (n,value) {
                        $wxlist += '<li class="weiXiuTiao" weiXiuId="'+value["id"]+'"><p class="weiXiuTime"><span>'+value["ct"]+'</span>';
                        if(value["status"]==1){
                            $wxlist += '<strong class="weiXiuDaichuli">未处理</strong>';
                        }
                        else{
                            $wxlist += '<strong>已处理</strong>';
                        }
                        $wxlist += '</p><p class="weiXiuNeirong">'+value["repairContent"]+'</p>';
                        $wxlist += '<div class="weiXiuPic" name="weiXiuPic">';
                        $wxlist += '</div></li>';
                        $weixiuIdList[n] = value["id"];
                    });
                }else{
                    $wxlist += '<li style="height: 200px; line-height: 200px;text-align: center;">暂无维修信息！</li>';
                }
                $("#houseHeTong").find('li[heTongId="'+$weixiuValue.hetongId+'"]').find("ul[name='weiXiuList']").html($wxlist);
                getImg($weixiuIdList);
                $("#houseHeTong").find("span[name='addTouSu']").unbind("click");
                $("#houseHeTong").find("span[name='addWeiXiu']").bind("click",function () {
                    $("#wx_zukePhone").val($weixiuValue.zukePhone);
                    layer.open({
                        type: 1,
                        title:"添加维修",
                        skin: 'layui-layer-rim', //加上边框
                        area: ['600px', '400px'], //宽高
                        content: $("#addwx")
                    });
                });
                $("#wxSubmit").click(function () {
                    addwx($this);
                });
            }
        }
    });
}
//获取图片
function getImg($weixiuIdList) {
    $.each($weixiuIdList,function (n,value) {
        var data_json={
            method:"getList",
            params:{
                "type":6,
                "tblId":value
            }
        };
        $.ajax({
            url:ipstr+'/pic/request.action',
            type:'post',
            dataType:'jsonp',
            data:toRequestData(data_json),
            jsonp: "callback",
            jsonpCallback:"getList",
            success:function (json) {
                try{
                    var $weiXiuImg = "";
                    var tblId = "";
                    if(json.status.code == 200){
                        if(json.result.list.length > 0){
                            $.each(json.result.list,function (n,value) {
                                $weiXiuImg += '<img  src="'+value["big"]+'" tblId="'+value["tblId"]+'"/>';
                                tblId = value["tblId"];
                            });
                        }else{
                            $weiXiuImg = "<div>没有上传图片哟！</div>";
                        }
                        $("#houseHeTong").find('li[weiXiuId="'+tblId+'"]').find("div[name='weiXiuPic']").html($weiXiuImg);
                    }else {
                        alert(json.status.msg);
                    }
                }catch (e){
                    alert("获取图片失败！");
                }

            }
        });
    });
}


//维修添加
function addwx($this){
    var bol=false;
    var data_json = {
        method : "savePhoneWebMaintain",
        params : {
            "houseId":$weixiuValue.houseId,
            "gcid":gcid,
            "customer":$weixiuValue.zukeName,
            "customerCalls":strFormat($("#wx_zukePhone").val()),
            "contractNumber":$weixiuValue.hetongId,//合同编号
            "type":2,//任务来源 1公司 2租户  你那边是租户 默认2
            "expectCompletionTime":strFormat($("#expectCompletionTime").val()),
            "repairContent":strFormat($("#repairContent").val()),//维修内容  原来repairServiceContent这个是维修内容  现在它变为备注
            "repairServiceContent":"",//备注
            "degree":2//紧急程度 1紧急 2一般
        }
    };
    var wxdetail = '';
    $.ajax({
        url:ipstr+'/webChengzu/request.action',
        type:'post',
        dataType:'jsonp',
        data:toRequestData(data_json),
        jsonp: "callback",
        jsonpCallback:"savePhoneWebMaintain",
        success:function(json){
            try{
                if(json.status.code==200){
                    layui.layer.closeAll();
                    layui.layer.alert("您的反馈系统已受理，请耐心等待管家MM的联系！");
                    //刷新列表
                    getwxlist($this)
                }else{
                    layui.layer.alert("请重新提交！");
                }
            }catch(e){
                alert(json.status.msg);
            }

        }
    });
}
/*$("#houseHeTong").find("span[name='addWeiXiu']").bind("click",function () {
    layer.open({
        type: 2,
        title: '添加维修',
        shadeClose: true,
        shade: 0.8,
        area: ['950px', '90%'],
        content: 'https://www.jiandaoyun.com/f/57a3fb90810dc42a2c45b335' //iframe的url
    });
});*/

