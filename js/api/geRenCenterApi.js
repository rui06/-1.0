//个人信息数据
var ziLiaoDate = {
    "name":"",
    "phone":"",
    "SFZ":""
};

var $zukePhone = getItems("zukePhone");
var $zukeSFZ = getItems("zukeSFZ");

//我的预约
myYuYue();
function myYuYue() {
    var data_json = {
        "params": {
            "phone": $zukePhone,
            "gcid":gcid
        }
    };
    var $yuYueList = "";
    $.ajax({
        url: ipstr1 + '/v2/web/resource/get_customer_list',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        success: function(json) {
            if (json.status.code == 200) {
                if(json.result.list.length > 0){
                    $.each(json.result.list, function(n, value) {
                        var $status = '';     //处理状态 processState  1 待受理   2 已受理   4 无效
                        if(value.processState == '1'){ //待受理
                            $status = '待受理';
                        }else if(value.processState == '2'){   //已受理
                            $status = '已受理';
                        }else if(value.processState == '4'){   //无效
                            $status = '已取消';
                        }
                        var $huxing = '1室1厅1卫';
                        var huxingtu = "";
                        if(!isNull(value["picList"])){
                            if(value["picList"].length){
                                if(value.picList[0].$ref == '$.result.list[2].picList[0]'){
                                    var num = Math.floor(Math.random() * 5 + 1);
                                    huxingtu = 'images/fyde/'+ num +'.png';
                                }else{
                                    huxingtu = value["picList"][0]["small"];
                                }
                            } else {
                                var num = Math.floor(Math.random() * 5 + 1);
                                huxingtu = 'images/fyde/'+ num +'.png';
                            }
                        }

                        $yuYueList += '<li class="yuYue"><dl class="yuyue-oneHt">';
                        $yuYueList += '<dt><img src="'+huxingtu+'"/></dt>';
                        $yuYueList += '<dd class="yuyue-houseXqing">';
                        $yuYueList += '<p class="yuyue-fangName">'+value["needArea"]+value["house"]["quyuBName"]+'－'+value["house"]["quyuCName"]+'－'+$huxing+'－'+value["house"]["mianji"]+'m²';
                        if(value["house"]["id"] == value["house"]["parentId"]){
                            $yuYueList += '<span>整租</span>';
                        }else{
                            $yuYueList += '<span>合租</span>';
                        }
                        $yuYueList += '</p><p class="yuyue-houseGeju"><strong><b>'+value["house"]["zujin"]+'</b>元/月</strong></p>';
                        $yuYueList += '<p class="yuyue-zhuangTai">状态：' + $status + '</p></dd>';
                        $yuYueList += '<dd class="yuyue-chakan">';
                        //$yuYueList += '<span>预定房源</span>';
                        $yuYueList += '<a href="details.html?id=' + value["house"]["id"] + '&parentId=' + value["house"]["parentId"] + '" target="_blank">查看详情 >></a>';
                        $yuYueList += '</dd></dl></li>';
                    });
                }else {
                    $yuYueList += '<li><dl style="width: 300px; height: auto; margin: 120px auto 0;"><dt style="text-align: center;"><img src="images/no.png" /></dt>';
                    $yuYueList += '<dd style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: center; margin-top: 20px;">您还没有预约任何房源哦！</dd></dl></li>';
                }
                $("#yuYueContent").html($yuYueList);
                //分页
                layui.laypage({
                    cont: 'demo2',
                    pages: json.result.maxPage,  //总共多少页
                    curr:json.result.pageNo,
                    groups: 3, //连续显示分页数
                    skin: '#008cd6',  //分页颜色
                    jump: function(obj, first){
                        if(!first){
                            layer.msg('第 '+ obj.curr +'页');
                            myYuYue(obj.curr);
                        }
                    }
                });
            }
        }
    });
}
//租客信息合同列表
getZukeHetong($zukePhone, $zukeSFZ);
function getZukeHetong($zukePhone, $zukeSFZ) {
    var data_json = {
        method: "zukeList",
        params: {
            pageNo: 1,
            pageSize: 10,
            "zukePhone": $zukePhone,
            "zukeSFZ": $zukeSFZ,
            "gcid": gcid
        }
    };
    var $hetongList = "";
    $.ajax({
        url: ipstr + '/webChengzu/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp: "callback",
        jsonpCallback: "zukeList",
        success: function (json) {
            if (json.status.code == 200) {
                if(json.result.list.length > 0){
                    //个人资料数据
                    ziLiaoDate.name = json.result.list[0]["zukeName"];
                    ziLiaoDate.phone = json.result.list[0]["zukePhone"];
                    ziLiaoDate.SFZ = json.result.list[0]["zukeSFZ"];
                    $.each(json.result.list,function (n,value) {
                        var $leixing = "";
                        if(value["house"]["id"] == value["house"]["parentId"]){
                            $leixing = "整租";
                        }else{
                            $leixing = "合租";
                        }
                        $hetongList += '<li class="heTong" name="heTong" zukeName="'+value["zukeName"]+'" zukePhone="'+value["zukePhone"]+'" heTongId="'+value["id"]+'" chengJiaoRenIds="'+value["chengJiaoRenIds"]+'" chengJiaoRenName="'+value["chengZuFZRs"][0]["user"]["nickName"]+'" contractConfigNo="'+value["contractConfigNo"]+'" chengZuPhone="'+value["chengZuFZRs"][0]["user"]["phone"]+'" houseId="'+value["houseId"]+'" taiZhangNo="'+value["house"]["heTong"]["taiZhangNo"]+'" fangJianName="'+value["house"]["fangJianName"]+'">';
                        $hetongList += '<div class="houseXiangQing"><div class="heTitle"><strong class="fangDingdan">订单号：414652319845</strong>';
                        $hetongList += '<span class="fangTimeQian">签约时间：'+value["chengJiaoTime"]+'</span> <span class="fangZhuangTai">签约成功</span></div>';
                        $hetongList += '<dl class="oneHt"><dt><img src="images/fangImages.jpg" /></dt>';
                        $hetongList += '<dd class="houseXq"><p class="fangName">'+value["house"]["quyuCName"]+'<span>'+$leixing+'</span></p>';
                        $hetongList += '<p class="houseGeju">'+value["house"]["louNo"]+'栋－'+value["house"]["men"]+'单元－'+value["house"]["fangNo"]+'<strong><b>'+value["house"]["zuJin"]+'</b>元/月<span>'+value["zhiFuTypeName"]+'</span></strong></p>';
                        $hetongList += '<p class="fangTime">合同周期：'+value["ct"]+'－'+value["endTime"]+'</p></dd>';
                        $hetongList += '<dd class="lookXq"><a href="javaScript:;">查看详情 >></a></dd></dl></div>';
                        $hetongList += '<div class="htContent"><div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief"><ul class="layui-tab-title">';
                        $hetongList += '<li class="layui-this" name="myGuanJia">管家</li><li name="myZhangDan">账单</li>';
                        $hetongList += '<li name="myWeiXiu">维修</li><li name="myTouSu">投诉</li></ul>';
                        $hetongList += '<div class="layui-tab-content" style="height: auto;">';
                        $hetongList += '<div class="layui-tab-item layui-show" name="showGuanJia"></div>';
                        $hetongList += '<div class="layui-tab-item" name="showZhangDan"></div>';
                        $hetongList += '<div class="layui-tab-item" name="showWeiXiu"></div>';
                        $hetongList += '<div class="layui-tab-item" name="showTouSu"></div>';
                        $hetongList += '</div></div></div></li>';
                    });
                    //租客姓名
                    $("#zukeName").html(json.result.list[0]["zukeName"]);
                    //$("#nickName").val(json.result.list[0]["zukeName"]);
                    setItems("zukeName",json.result.list[0]["zukeName"]);
                }else{
                    //租客姓名
                    $("#zukeName").html(getItems("zukePhone"));
                    //$("#nickName").val(json.result.list[0]["zukeName"]);
                    //个人资料数据
                    ziLiaoDate.name = getItems("zukePhone");  //租客姓名
                    ziLiaoDate.phone = getItems("zukePhone"); //租客电话
                    $hetongList += '<li><dl style="width: 300px; height: auto; margin: 120px auto 0;"><dt style="text-align: center;"><img src="images/shibai.png" /></dt>';
                    $hetongList += '<dd style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: center; margin-top: 20px;">您还没有签订任何合同哦！</dd></dl></li>';
                }
                $("#houseHeTong").html($hetongList);
                //我的资料
                myZiLiao();

                //我的管家
                $("#houseHeTong li[name='myGuanJia']").bind("click",function () {
                    $(this).parents("li[name='heTong']").find("div[name='showGuanJia']").load('guanJia.html',function () {
                        //管家姓名
                        var $guanjiaName = $(this).parents("li[name='heTong']").attr("chengJiaoRenName");
                        //管家电话
                        var $guanjiaPhone = $(this).parents("li[name='heTong']").attr("chengZuPhone");
                        var $this = $(this).parents("li[name='heTong']").find("div[name='showGuanJia']");
                        myGuanJia($this,$guanjiaName,$guanjiaPhone);
                    });
                });
                //我的账单
                $("#houseHeTong li[name='myZhangDan']").bind("click",function () {
                    $(this).parents("li[name='heTong']").find("div[name='showZhangDan']").load('zhangDan.html',function() {
                        //租客姓名
                        var $zukeName = $(this).parents("li[name='heTong']").attr("zukeName");
                        //租客电话
                        var $zukePhone = $(this).parents("li[name='heTong']").attr("zukePhone");
                        //动态加载页面调用数据   合同id
                        var $heTongId = $(this).parents("li[name='heTong']").attr("heTongId");
                        gethtdetail_list($zukeName,$zukePhone,$heTongId);
                    });
                });
                //我的维修
                $("#houseHeTong li[name='myWeiXiu']").bind("click",function () {
                    $(this).parents(".htContent").find("div[name='showWeiXiu']").load("weixiu.html");
                    /*$(this).parents(".htContent").find("div[name='showWeiXiu']").load("weixiu.html",function () {

                        //房源id
                        $weixiuValue.houseId = $(this).parents("li[name='heTong']").attr("houseId");
                        //合同id
                        $weixiuValue.hetongId = $(this).parents("li[name='heTong']").attr("heTongId");
                        //租客姓名
                        $weixiuValue.zukeName = $(this).parents("li[name='heTong']").attr("zukeName");
                        //租客电话
                        $weixiuValue.zukePhone = $(this).parents("li[name='heTong']").attr("zukePhone");
                        //合同编号
                        $weixiuValue.chengJiaoNumber = $(this).parents("li[name='heTong']").attr("contractConfigNo");
                        getwxlist($(this).parents(".htContent"));
                    });*/
                });
                //我的投诉
                $("#houseHeTong li[name='myTouSu']").bind("click",function () {
                    $(this).parents(".htContent").find("div[name='showTouSu']").load("touSu.html",function () {
                        //合同id
                        $touSuValue.heTongId = $(this).parents("li[name='heTong']").attr("heTongId");
                        //租客姓名
                        $touSuValue.zukeName = $(this).parents("li[name='heTong']").attr("zukeName");
                        //租客电话
                        $touSuValue.zukePhone = $(this).parents("li[name='heTong']").attr("zukePhone");
                        //成交人ids
                        $touSuValue.chengJiaoRenIds = $(this).parents("li[name='heTong']").attr("chengJiaoRenIds");
                        //成交编号
                        $touSuValue.chengJiaoNumber = $(this).parents("li[name='heTong']").attr("contractConfigNo");
                        //台账号
                        $touSuValue.taiZhangNo = $(this).parents("li[name='heTong']").attr("taiZhangNo");
                        //房间号
                        $touSuValue.fangJianName = $(this).parents("li[name='heTong']").attr("fangJianName");
                        //获取投诉列表
                        getTouSuList($(this).parents(".htContent"));
                    });
                });
                //查看详情
                $("#houseHeTong .lookXq").bind("click",function () {
                    $(this).parents("li").find(".htContent").toggle();
                    $(this).parents("li").find("li[name='myGuanJia']").click();
                });
                //默认打开第一条合同详情
                $("#houseHeTong").find(".lookXq").eq(0).click();
            }
        }
    });
}

//修改资料
function xiuGaiZiliao() {
    
}
//我的资料
function myZiLiao() {
    var $quKongge = ziLiaoDate.SFZ.NoSpace();
    var $shengRi = "";
    if(ziLiaoDate.SFZ != ""){
        if($quKongge.length == 18){
            $shengRi = $quKongge.substring(6,14);
        }else{
            $shengRi = '19'+$quKongge.substring(5,11);
        }
    }else{
        $shengRi = "···";
    }
    var $ziliao = '';
    $ziliao += '<dl><dt>姓名：</dt><dd>'+ziLiaoDate.name+'</dd></dl>';
    $ziliao += '<dl><dt>电话：</dt><dd>'+ziLiaoDate.phone+'</dd></dl>';
    $ziliao += '<dl><dt>生日：</dt><dd>'+$shengRi+'</dd></dl>';
    $("#geRenCon").html($ziliao);
}