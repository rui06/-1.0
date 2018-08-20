var detailsShuju = {
    "yudingName":"",         //预订人姓名
    "yudingPhone":"",        //预定人电话
    "dingjin":"",            //定金
    "ruZhuDate":"",          //预计入住时间
    "beizhu":""              //备注
};
var $id = GetQueryString("id");
var $parentid = GetQueryString("parentId");
//房源详情
getdetail($id);
//房源配置
//getpzlist($parentid);
//房源其他房间信息
childHouses($id,$parentid);
var $value = "";
//房源详情页房源详情---------------------
function getdetail(idstr) {
    var data_json = {
        // method: "getInfoById",
        params: {
            id: idstr,
            "gcid": gcid
        }
    };
    $.ajax({
        url: ipstr1 + '/v2/web/house/get_by_id',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        // jsonp: "callback",
        // jsonpCallback: "getInfoById",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        success: function (json) {
            if (json.status.code == 200) {
               $value = json.result;
                var $lng = json.result.lng;
                var $lat = json.result.lat;
                var $quyuName = strFormat(json.result.quyuAName)+strFormat(json.result.quyuBName)+strFormat(json.result.quyuCName);
                //加载地图
                chushihua($lat,$lng,$quyuName);
                //房源详情图片
                detailImg();
                //详细信息
                xiangqing();
            }
            else {
                alert("服务器繁忙，稍后再试");
            }
        },
        error: function () {
            //加载错误
        },
        complete: function () {
            //加载完成
        }
    })
}
//初始化地图
function chushihua($lat,$lng,$quyuName) {
    // 百度地图API功能
    var map = new BMap.Map("detailmap");
    var $jingDu = $lng;
    var $WeiDu = $lat;
    //没有经纬度则解析地址
    if(isNull($lat) || $lat == "0.0" || isNull($lng) || $lng == "0.0"){
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint($quyuName, function(point){
            if (point) {
                $jingDu = point.lng;
                $WeiDu = point.lat;
                map.centerAndZoom(point, 15);
                // 创建标注
                var marker = new BMap.Marker(point);
                map.addOverlay(marker);
                //跳动的动画
                marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            }else{
                alert("您选择地址没有解析到结果!");
            }
        }, cityName);
    }else{
        var points = new BMap.Point($lng, $lat);
        //将解析的坐标设置成地图中心点
        map.centerAndZoom(points, 15);
        // 创建标注
        var marker = new BMap.Marker(points);
        // 将标注添加到地图中
        map.addOverlay(marker);
        //跳动的动画
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    }
    var point = new BMap.Point($jingDu, $WeiDu);
    //房源所在位置
    ziJiSuoZaiMarker(map,point);
    //周边配套设施
    peiTaoSheShi(map,point);
    $("#searchBtn").click(function () {
        //根据经纬度查询公交路线
        zhongDianJingWeiDu(map , point);
    });

    //公交面板
    $("#transit").click(function () {
        $("#gongjiao").show();
        $("#jiacheng").hide();
        $("#buxing").hide();
        //清除地图覆盖物
        map.clearOverlays();
        //插入自己所在位置标注
        ziJiSuoZaiMarker(map,point);
        // 百度地图API功能
        var startAddress = point;
        var endAddress = "";
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint($("#searchInput").val(), function(point){
            if (point) {
                endAddress = new BMap.Point(point.lng,point.lat);
                //公交面板
                var transit = new BMap.TransitRoute(map, {
                    renderOptions: {map: map, panel: "gongjiao"}
                });
                transit.search(startAddress, endAddress);
            }else{
                layui.layer.msg("您要去的地方没有找到!");
            }
        }, cityName);
    });
    //驾车面板
    $("#driving").click(function () {
        $("#gongjiao").hide();
        $("#jiacheng").show();
        $("#buxing").hide();
        //清除地图覆盖物
        map.clearOverlays();
        //插入自己所在位置标注
        ziJiSuoZaiMarker(map,point);
        // 百度地图API功能
        var startAddress = point;
        var endAddress = "";
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint($("#searchInput").val(), function(point){
            if (point) {
                endAddress = new BMap.Point(point.lng,point.lat);
                //驾车面板
                var driving = new BMap.DrivingRoute(map, {
                    renderOptions: {map: map, panel: "jiacheng", autoViewport: true}
                });
                driving.search(startAddress, endAddress);
            }else{
                layui.layer.msg("您要去的地方没有找到!");
            }
        }, cityName);
    });
    //步行面板
    $("#walking").click(function () {
        $("#gongjiao").hide();
        $("#jiacheng").hide();
        $("#buxing").show();
        //清除地图覆盖物
        map.clearOverlays();
        //插入自己所在位置标注
        ziJiSuoZaiMarker(map,point);
        //公交面板显示
        $("#gongjiao").show();
        // 百度地图API功能
        var startAddress = point;
        var endAddress = "";
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint($("#searchInput").val(), function(point){
            if (point) {
                endAddress = new BMap.Point(point.lng,point.lat);
                //步行面板
                var walking = new BMap.WalkingRoute(map, {
                    renderOptions: {map: map, panel: "buxing", autoViewport: true}
                });
                walking.search(startAddress, endAddress);
            }else{
                layui.layer.msg("您要去的地方没有找到!");
            }
        }, cityName);
    });
}
//自己所在位置标注点
function ziJiSuoZaiMarker(map,point) {
    // 创建自己所在点标注
    var marker = new BMap.Marker(point);
    // 将标注添加到地图中
    map.addOverlay(marker);
    //跳动的动画
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
}
//检索周边配套设施
function peiTaoSheShi(map,point) {
    //周边设施点击事件
    $("#detail_zhoubian li").click(function () {
        //清除地图覆盖物
        map.clearOverlays();
        //初始地图缩放比例
        map.centerAndZoom(point, 15);
        //插入自己所在位置标注
        ziJiSuoZaiMarker(map,point);
        var local = new BMap.LocalSearch(map, {
            renderOptions:{map: map, autoViewport:false}
        });
        local.searchNearby($(this).find("span").text(),point,1000);
    });
}
//根据起终点经纬度查询公交路线
function zhongDianJingWeiDu(map ,point) {
    //清除地图覆盖物
    map.clearOverlays();
    //插入自己所在位置标注
    ziJiSuoZaiMarker(map,point);
    //公交面板显示
    $("#gongjiao").show();
    // 百度地图API功能
    var startAddress = point;
    var endAddress = "";
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint($("#searchInput").val(), function(point){
        if (point) {
            endAddress = new BMap.Point(point.lng,point.lat);
            //公交面板
            var transit = new BMap.TransitRoute(map, {
                renderOptions: {map: map, panel: "gongjiao"}
            });
            transit.search(startAddress, endAddress);
        }else{
            layui.layer.msg("您要去的地方没有找到!");
        }
    }, cityName);
}



//周边配套设施
/*function ditu(lng, lat ,startAddress ,map) {
    var point = new BMap.Point(lng, lat);
    //自己所在位置标注点
    function ziJiSuoZaiMarker() {
        // 创建自己所在点标注
        var marker = new BMap.Marker(point);
        // 将标注添加到地图中
        map.addOverlay(marker);
        //跳动的动画
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    }
    //周边设施点击事件
    $("#detail_zhoubian li").click(function () {
        map.clearOverlays();
        //自己所在位置标注点
        ziJiSuoZaiMarker();
        //获取点击周边设施名称
        var facilities = $(this).find("span");
        //调用筛选周边设施方法
        sheshi(facilities.text());
    });
    //筛选周边设施
    function sheshi(facilities) {
        var circle = new BMap.Circle(point, 1000, {
            fillColor: "red",
            strokeWeight: 1,
            fillOpacity: 0.15,
            strokeOpacity: 0.15
        });
        map.addOverlay(circle);
        var local = new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});
        local.searchNearby(facilities, point, 1000);
    }

    var endAddress = $("#searchInput").val();
    $("#searchBtn").click(function () {
        endAddress = $("#searchInput").val();
        if(!isNull(endAddress)){
            map.clearOverlays();
            //自己所在位置标注点
            ziJiSuoZaiMarker();
            //var end = endAddress;
            $("#gongjiao").css("display","block");
            //公交路线显示面板
            var transit = new BMap.TransitRoute(map, {
                renderOptions: {map: map, panel: "gongjiao"}
            });
            transit.search(startAddress, endAddress);
        }else{
            layui.layer.alert("请输入要到达的地址！");
        }
    });

    $("#transit").click(function () {
        //清除覆盖物
        map.clearOverlays();
        //自己所在位置标注点
        ziJiSuoZaiMarker();
        //公交路线显示面板
        var transit = new BMap.TransitRoute(map, {
            renderOptions: {map: map, panel: "gongjiao"}
        });
        transit.search(startAddress, endAddress);

        $("#gongjiao").css("display","block");
        $("#jiacheng").css("display","none");
        $("#buxing").css("display","none");
    });
    $("#driving").click(function () {
        map.clearOverlays(); //清除覆盖物
        //自己所在位置标注点
        ziJiSuoZaiMarker();
        //驾车路线显示面板
        var driving = new BMap.DrivingRoute(map, {
            renderOptions: {map: map, panel: "jiacheng", autoViewport: true}
        });
        driving.search(startAddress, endAddress);

        $("#gongjiao").css("display","none");
        $("#jiacheng").css("display","block");
        $("#buxing").css("display","none");
    });
    $("#walking").click(function () {
        //清除覆盖物
        map.clearOverlays();
        //自己所在位置标注点
        ziJiSuoZaiMarker();
        //步行路线显示面板
        var walking = new BMap.WalkingRoute(map, {
            renderOptions: {map: map, panel: "buxing", autoViewport: true}
        });
        walking.search(startAddress, endAddress);

        $("#gongjiao").css("display","none");
        $("#jiacheng").css("display","none");
        $("#buxing").css("display","block");
    });
}*/

//房源详情图片
function detailImg() {
    var $imagesList = $value.picList;
    var $smallImgList = "";
    var $bigImages = new Array();
    if($imagesList.length >0){
        $.each($imagesList, function (n, value) {
            $bigImages[n] = value["big"];
            $smallImgList += '<li><img bimg="' + $bigImages[n] + '" src="' + $bigImages[n] + '" onmousemove="preview(this);"></li>';
        });
    }else {
        $bigImages[0] = "images/img1.jpg";
        $smallImgList += '<li><img bimg="'+$bigImages[0]+'" src="'+$bigImages[0]+'" onmousemove="preview(this);"></li>';
    }
    //大图
    $("#bigImg").html('<img jqimg="'+$bigImages[0]+'" src="'+$bigImages[0]+'" />');
    //轮播小图
    $("#smallImg").html($smallImgList);
}
//房源详情
function xiangqing() {
    var $xQlist = "";
    if ($value != "") {
        var $jushi = $value["shi"] + '室' + $value["ting"] + '厅' + $value["wei"] + '卫';
        $xQlist += '<h4>￥<strong>' + strFormat($value["zujin"]) + '</strong>元/月</h4>';
        $xQlist += '<div class="huxing"><strong>'+strFormat($value["quyuAName"])+'-'+strFormat($value["quyuCName"])+'-' + strFormat($value["shi"]) + '居室-';
        if($value["parentId"] == $value["id"]){
            $xQlist += '<span>整租</span>';
        }else{
            $xQlist += '<span>卧室'+strFormat($value["fangjianName"])+'</span>';
        }
        $xQlist += '</strong></div>';
        $xQlist += '<div class="xiangxi"><p><span>编号</span>'+strFormat($value["taizhang"])+'</p>';
        $xQlist += '<p><span>楼层</span>第' + $value["loucengA"] + '层/共' + $value["loucengB"] + '层</p><p><span>面积</span>' + $value["mianji"] + 'm²</p>';
        $xQlist += '<p><span>朝向</span>' + $value["chaoxiang"]["key"] + '</p><p><span>居室</span>' + $jushi + '</p><p><span>小区</span>' + strFormat($value["quyuCName"]) + '</p></div>';
        $xQlist += '<div class="xiangQingteSe">';
        if(!isNull($value["zhuangXiuTypeName"])){
            $xQlist += '<strong class="list_tese01">'+$value["zhuangxiuType"]["key"]+'</strong>';
        }
        if(!isNull($value["chaoXiang"])){
            $xQlist += '<strong class="list_tese02">朝向'+$value["chaoxiang"]["key"]+'</strong>';
        }
        //$xQlist += '<strong class="list_tese03">独卫</strong>';
        $xQlist += '</div>';
        $xQlist += '<div class="house"><a href="javaScript:;" class="checkHouse">预约看房</a>';
        $xQlist += '<a href="javaScript:;" class="zuHouse">在线预定</a>';
        $xQlist += '</div>';
        $("#xiangQing").html($xQlist);
        $("#qiAddress").val(strFormat($value["quyuCName"]));
        $(".checkHouse").click(function () {
            yuYueShuju.yuYueHouseId = strFormat($value["id"]);
            //页面层
            layui.layer.open({
                title: '预约看房',
                type: 1,
                area: ['480px', '330px'], //宽高
                content: $("#yuYueKanFang")
            });
        });
        $(".zuHouse").click(function () {
            //页面层
            layer.open({
                title:'合租吧在线预订协议',
                type: 1,
                //skin: 'layui-layer-rim', //加上边框
                area: ['580px', 'auto'], //宽高
                content: $("#yudingNeiRong")
            });
        });
        $("#jiXuYuDing").click(function () {
            layer.closeAll();
            //页面层
            layer.open({
                title:'在线预定条款',
                type: 1,
               // skin: 'layui-layer-rim', //加上边框
                area: ['480px', '520px'], //宽高
                content: $("#zaiXianZuFang")
            });
        });
        //计算付款方式
        if($value["id"] == $value["parentId"]){
            var $shi = strFormat($value["shi"]);  //居室
            var $zuJin = Math.round($value["zujin"]);
            //整租月付算法
            var $yueFuZuJin = calculateMul($zuJin,feiYongPeiZhi.yueFuZheKou); //月付租金
            var $yueShengHuoFei = calculateMul(feiYongPeiZhi.zhengZuSHF,$shi); //月生活费
            var $yaJin = calculateAdd($yueFuZuJin,$yueShengHuoFei); //押金
            //整租季付算法
            var $jiFuYueZuJin = calculateMul($zuJin,feiYongPeiZhi.jiFuZheKou);
            var $yueFuYaJin = calculateAdd($jiFuYueZuJin,$yueShengHuoFei);
            //整租半年付算法
            var $banNianZuJin = calculateMul($zuJin,feiYongPeiZhi.banNianZheKou);
            var $banNianYaJin = calculateAdd($banNianZuJin,$yueShengHuoFei);
            //整租年付算法
            var $nianFuZuJin = calculateMul($zuJin,feiYongPeiZhi.nianFuZheKou);
            var $nianYaJin = calculateAdd($nianFuZuJin,$yueShengHuoFei);
            //月付
            $("#fuKuan tr[name='fuKuan-yueFu']").find("td[name='zuJin']").html($yueFuZuJin+' 元/月');
            $("#fuKuan tr[name='fuKuan-yueFu']").find("td[name='yueShenghuofei']").html($yueShengHuoFei+' 元/月');
            $("#fuKuan tr[name='fuKuan-yueFu']").find("td[name='yaJin']").html($yueFuYaJin+' 元');
            $("#fuKuan tr[name='fuKuan-yueFu']").find("td[name='oneFuKuan']").html(calculateAdd(calculateAdd($yueFuZuJin,$yueFuYaJin),$yueShengHuoFei)+' 元');
            //季付
            $("#fuKuan tr[name='fuKuan-jiFu']").find("td[name='zuJin']").html($jiFuYueZuJin+' 元/月');
            $("#fuKuan tr[name='fuKuan-jiFu']").find("td[name='yueShenghuofei']").html($yueShengHuoFei+' 元/月');
            $("#fuKuan tr[name='fuKuan-jiFu']").find("td[name='yaJin']").html($yueFuYaJin+' 元');
            $("#fuKuan tr[name='fuKuan-jiFu']").find("td[name='oneFuKuan']").html(calculateAdd(calculateMul(calculateAdd($jiFuYueZuJin,$yueShengHuoFei),3),$yueFuYaJin)+' 元');
            //半年付
            $("#fuKuan tr[name='fuKuan-banNianFu']").find("td[name='zuJin']").html($banNianZuJin+' 元/月');
            $("#fuKuan tr[name='fuKuan-banNianFu']").find("td[name='yueShenghuofei']").html($yueShengHuoFei+' 元/月');
            $("#fuKuan tr[name='fuKuan-banNianFu']").find("td[name='yaJin']").html($yueFuYaJin+' 元');
            $("#fuKuan tr[name='fuKuan-banNianFu']").find("td[name='oneFuKuan']").html(calculateAdd(calculateMul(calculateAdd($banNianZuJin,$yueShengHuoFei),6),$yueFuYaJin)+' 元');
            //全年付
            $("#fuKuan tr[name='fuKuan-nainFu']").find("td[name='zuJin']").html($nianFuZuJin+' 元/月');
            $("#fuKuan tr[name='fuKuan-nainFu']").find("td[name='yueShenghuofei']").html($yueShengHuoFei+' 元/月');
            $("#fuKuan tr[name='fuKuan-nainFu']").find("td[name='yaJin']").html($yueFuYaJin+' 元');
            $("#fuKuan tr[name='fuKuan-nainFu']").find("td[name='oneFuKuan']").html(calculateAdd(calculateMul(calculateAdd($nianFuZuJin,$yueShengHuoFei),12),$yueFuYaJin)+' 元');
        }else{
            var $yueZuJin = Math.round($value["zujin"]); //租金
            var $yueShengHuoFei = feiYongPeiZhi.heZuSHF; //月生活费
            //合租月付算法
            var $yueFuZuJin = calculateMul($yueZuJin,feiYongPeiZhi.yueFuZheKou);
            var $yaJin = calculateAdd($yueFuZuJin,$yueShengHuoFei); //押金
            //合租季付算法
            var $jiFuYueZuJin = calculateMul($yueZuJin,feiYongPeiZhi.jiFuZheKou);
            var $yueFuYaJin = calculateAdd($jiFuYueZuJin,$yueShengHuoFei);
            //合租半年付算法
            var $banNianZuJin = calculateMul($yueZuJin,feiYongPeiZhi.banNianZheKou);
            var $banNianYaJin = calculateAdd($banNianZuJin,$yueShengHuoFei);
            //合租年付算法
            var $nianFuZuJin = calculateMul($yueZuJin,feiYongPeiZhi.nianFuZheKou);
            var $nianYaJin = calculateAdd($nianFuZuJin,$yueShengHuoFei);
            //月付
            $("#fuKuan tr[name='fuKuan-yueFu']").find("td[name='zuJin']").html($yueFuZuJin+' 元/月');
            $("#fuKuan tr[name='fuKuan-yueFu']").find("td[name='yueShenghuofei']").html($yueShengHuoFei+' 元/月');
            $("#fuKuan tr[name='fuKuan-yueFu']").find("td[name='yaJin']").html($yueFuYaJin+' 元');
            $("#fuKuan tr[name='fuKuan-yueFu']").find("td[name='oneFuKuan']").html(calculateAdd(calculateAdd($yueFuZuJin,$yueFuYaJin),$yueShengHuoFei)+' 元');
            //季付
            $("#fuKuan tr[name='fuKuan-jiFu']").find("td[name='zuJin']").html($jiFuYueZuJin+' 元/月');
            $("#fuKuan tr[name='fuKuan-jiFu']").find("td[name='yueShenghuofei']").html($yueShengHuoFei+' 元/月');
            $("#fuKuan tr[name='fuKuan-jiFu']").find("td[name='yaJin']").html($yueFuYaJin+' 元');
            $("#fuKuan tr[name='fuKuan-jiFu']").find("td[name='oneFuKuan']").html(calculateAdd(calculateMul(calculateAdd($jiFuYueZuJin,$yueShengHuoFei),3),$yueFuYaJin)+' 元');
            //半年付
            $("#fuKuan tr[name='fuKuan-banNianFu']").find("td[name='zuJin']").html($banNianZuJin+' 元/月');
            $("#fuKuan tr[name='fuKuan-banNianFu']").find("td[name='yueShenghuofei']").html($yueShengHuoFei+' 元/月');
            $("#fuKuan tr[name='fuKuan-banNianFu']").find("td[name='yaJin']").html($yueFuYaJin+' 元');
            $("#fuKuan tr[name='fuKuan-banNianFu']").find("td[name='oneFuKuan']").html(calculateAdd(calculateMul(calculateAdd($banNianZuJin,$yueShengHuoFei),6),$yueFuYaJin)+' 元');
            //全年付
            $("#fuKuan tr[name='fuKuan-nainFu']").find("td[name='zuJin']").html($nianFuZuJin+' 元/月');
            $("#fuKuan tr[name='fuKuan-nainFu']").find("td[name='yueShenghuofei']").html($yueShengHuoFei+' 元/月');
            $("#fuKuan tr[name='fuKuan-nainFu']").find("td[name='yaJin']").html($yueFuYaJin+' 元');
            $("#fuKuan tr[name='fuKuan-nainFu']").find("td[name='oneFuKuan']").html(calculateAdd(calculateMul(calculateAdd($nianFuZuJin,$yueShengHuoFei),12),$yueFuYaJin)+' 元');
        }
    }
}
//获取配置列表
function getpzlist(houseid) {
    var data_json = {
        method: "getPeiZhiPageList",
        "params": {
            "houseId": houseid,
            "pageNo": 1,
            "pageSize": 50,
            "gcid": gcid
        }
    };
    var pzlist = '';
    $.ajax({
        url: ipstr + '/webHouse/request.action',//  /house/request.action
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp: "callback",
        jsonpCallback: "getPeiZhiPageList",
        success: function (json) {
            try {
                if (json.status.code == 200) {
                    if(json.result.list.length > 0){
                        $.each(json.result.list, function (n, value) {
                            pzlist += '<dl><dt><img src="images/smenu.jpg" /></dt><dd>' + value["peiZhiKey"] + '</dd></dl>';
                        });
                    }else {
                        pzlist += '<div style="width: 100%;height: 50px;line-height: 50px; text-align: center; font-size: 14px;">我们正在努力配置中···</div>';
                    }
                    $("#peiZhiList").html(pzlist);
                } else {
                    alert(json.status.msg);
                }
            } catch (e) {
                alert("服务器繁忙，稍后再试");
            }
        }
    });
}
/**
 * 室友信息
 * @param parentid  房间id
 */
function childHouses($houseId,$parentid){
    var data_json = {
        // method: "getPageList",
        "params": {
            // pageNo: 1,
            // pageSize: 100,
            parentId: $parentid,
            gcid: gcid
        }
    };
    var houseListA = "";
    var houseListB = "";
    $.ajax({
        url: ipstr1 + '/v2/web/house/get_list_by_parent_id',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        // jsonp: "callback",
        // jsonpCallback: "getPageList",
        success: function (json) {
            try {
                if(json.status.code == 200){
                    if(json.result.list.length >0 ){
                        $.each(json.result.list,function (n,value) {
                            var houseZt = value["chengZuId"];
                            if(value["id"] == $houseId){
                                houseListA += '<li class="dangQian"><a href="javaScript:;"><dl class="roomXiangQing"><dt class="dangQianImg">';
                                houseListA += '<span>?</span>';
                                houseListA += '</dt><dd class="roomType">';
                                if(value["id"] == value["parentId"]){
                                    houseListA += '<strong>整租</strong>';
                                }else{
                                    houseListA += '<strong>房间'+value["fangjianName"]+'</strong>';
                                }
                                houseListA += '<span>当前房源</span>';
                                houseListA += '</dd>';
                                houseListA += '</dl><div class="peopleContent"><p class="xingZuo"><strong>···</strong><span>星座</span></p>';
                                houseListA += '<p class="zhiYe"><strong>···</strong><span>职业</span></p></div>';
                                houseListA += '<div class="roomDetails">';
                                houseListA += '<p class="roomZujin">'+value["zujin"]+'元/月</p>';
                                houseListA += '<p class="roomChaoXiang">朝'+value["chaoxiang"]["key"]+'/'+value["mianji"]+'m²</p>';
                                houseListA += '</div></a></li>';
                            }else{
                                if(houseZt == ""){
                                    houseListB += '<li class="dangQian"><a href="details.html?id='+value["id"]+'&parentId='+value["parentId"]+'"><dl class="roomXiangQing"><dt class="dangQianImg">';
                                    houseListB += '<span>?</span>';
                                    houseListB += '</dt><dd class="roomType">';
                                    if(value["id"] == value["parentId"]){
                                        houseListB += '<strong>整租</strong>';
                                    }else{
                                        houseListB += '<strong>房间'+value["fangjianName"]+'</strong>';
                                    }
                                    houseListB += '<span>可入住</span>';
                                    houseListB += '</dd>';
                                    houseListB += '</dl><div class="peopleContent"><p class="xingZuo"><strong>···</strong><span>星座</span></p>';
                                    houseListB += '<p class="zhiYe"><strong>···</strong><span>职业</span></p></div>';
                                    houseListB += '<div class="roomDetails">';
                                    houseListB += '<p class="roomZujin">'+value["zujin"]+'元/月</p>';
                                    houseListB += '<p class="roomChaoXiang">朝'+value["chaoxiang"]["key"]+'/'+value["mianji"]+'m²</p>';
                                    houseListB += '</div></a></li>';
                                }else if(houseZt != ""){
                                    var $zuKeSFZ = value["chengzu"]["zukeSfz"];
                                    //生日
                                    var $shengRi = getBirthdatByIdNo(trim($zuKeSFZ));
                                    //星座
                                    var $xingZuo = xingzuo($shengRi);
                                    //判断男女
                                    var $nanNv = isNanNv($zuKeSFZ);
                                    //入住时间
                                    var $ruZhuTime = value["chengzu"]["startTime"];
                                    //结束时间
                                    var $endTime = value["chengzu"]["endTime"];
                                    //判断男女
                                    if($nanNv == 0){
                                        houseListB += '<li class="yiRuZhu"><a href="javaScript:;"><dl class="roomXiangQing"><dt class="dangQianImg">';
                                        houseListB += '<span class="nvPic"></span>';
                                    }else{
                                        houseListB += '<li class="yiRuZhu sexNan"><a href="javaScript:;"><dl class="roomXiangQing"><dt class="dangQianImg">';
                                        houseListB += '<span class="nanPic"></span>';
                                    }
                                    houseListB += '</dt><dd class="roomType">';
                                    if(value["id"] == value["parentId"]){
                                        houseListB += '<strong>整租</strong>';
                                    }else{
                                        houseListB += '<strong>房间'+value["fangjianName"]+'</strong>';
                                    }
                                    houseListB += '<span>已入住</span>';
                                    houseListB += '</dd>';
                                    houseListB += '</dl><div class="peopleContent"><p class="xingZuo"><strong>'+$xingZuo+'</strong><span>星座</span></p>';
                                    houseListB += '<p class="zhiYe"><strong>···</strong><span>职业</span></p></div>';
                                    houseListB += '<div class="roomDetails">';
                                    houseListB += '<p class="roomZujin">'+value["zujin"]+'元/月</p>';
                                    houseListB += '<p class="roomChaoXiang">朝'+value["chaoxiang"]["key"]+'/'+value["mianji"]+'m²</p>';
                                    houseListB += '</div></a></li>';
                                }
                            }
                        });

                    }else{
                        houseListB += '<li style="width: 700px; height: 40px; line-height: 40px; text-align: center; font-size: 16px; background: #ffffff; border: 0;">没有其他房源信息哟！</li>';
                    }
                    $("#danjian").html(houseListA+houseListB);
                }else {
                    alert(json.status.msg);
                }
            }catch (e){
                alert("网络异常，请稍后重试！");
            }
        }
    });
}

//预约
function upyuyue() {
    var data_json = {
        // "method": "guestSubscribeHouse",
        // "cityCode": cityCode,
        "params": {
            "houseId": yuYueShuju.yuYueHouseId,
            "phone": yuYueShuju.yuYuePhone,
            "name": yuYueShuju.yuYueName,
            "seeTime": yuYueShuju.yuYueDate,
            "gcid": gcid
        }
    };
    $.ajax({
        url: ipstr1 + '/v2/web/resource/get_order',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        // jsonp: "callback",
        // jsonpCallback: "guestSubscribeList",
        success: function (json) {
            try {
                if (json.status.code == 200) {
                    layui.layer.closeAll();
                    layer.msg("预约成功！请耐心等待管家与您联系...");
                }
                else {
                    layui.layer.msg(json.status.msg);
                }
            } catch (e) {
                layui.layer.msg("网络开了一会小差，请稍后重试！");
            }
        }
    });
}
//banner动态加载
function getBanner() {
    var data_json = {
        params: {
            equipment: '1',// false number 类型：1.电脑，2.手机
            location: '2',// false number 位置：1，网页端；2，微信端,3.房间详情
            gcid: gcid,// false string 公司id
            departmentId: '',// false string 部门id
            houseId: GetQueryString("id")// false string houseid
        }
    };
    var $bannerList = "";
    var $item = "";
    $.ajax({
        url: ipstr1 + '/v2/bannerManager/banner_pic/get_manager_list',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        success: function (json) {
            if (json.status.code == 200){
                if(json.result.list.length > 0){
                    $(".detail-banner").show();
                    $.each(json.result.list,function (n,value) {
                        var $imageSrc = "";
                        if(value["bannerHref"] != ""){
                            $imageSrc = value["picUrl"];
                        }
                        $bannerList += '<div class="slide">';
                        var $bannerLianJie = strFormat(value["picBindLink"]);
                        if(isNull($bannerLianJie) || $bannerLianJie == "#"){
                            //$bannerLianJie = "javaScript:;";
                            $bannerList += '<a href="javaScript:;">'
                        }else{
                            $bannerList += '<a href="'+$bannerLianJie+'" target="_blank">'
                        }
                        $bannerList += '<img src="'+$imageSrc+'" /></a></div>';
                        if(n == 0){
                            $item += '<a class="cur" stat="item100'+(n+1)+'" href="javascript:;"></a>';
                        }else{
                            $item += '<a href="javascript:;" stat="item100'+(n+1)+'"></a>';
                        }
                    });
                    $("#slideContent").html($bannerList);
                    $("#bannerItem").html($item);
                    //重新渲染banner
                    initBanner();
                }else{
                    $(".detail-banner").hide();
                }

            }
        },
        error: function () {
            //加载错误
        },
        complete: function () {
            //加载完成
        }
    });
}