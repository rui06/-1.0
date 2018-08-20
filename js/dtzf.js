function setmenu(thisid){
    $("#headerNav li:eq("+ thisid +") a").addClass("headActive");
}
window.height = document.documentElement.clientHeight;
window.width = document.documentElement.clientWidth;

function initMapWindows() {
    $("#content_left").css({"height":($(window).height()-78) + "px"});
    $("#content_right").css({"width": ($(window).width() - 418) + "px","height":($(window).height()-78) + "px"});
}
//随机数
function getnumber() {
    return parseInt(Math.random() * 5 + 1);
}
//监听浏览器可视区域触发事件
$(window).resize(function () {
    $("#content_right").css({"width": ($(window).width() - 420) + "px"});
});
$(function () {
    initMapWindows();
    //加载头部
    $("#header_item").load("header.html",function () {
        setmenu(2);
    });
    //加载底部
    $("#footBottom").load("footer.html");
    //获取当前城市
    getcity();
    //初始化地图
    InitMap();
    //初始化价格控件
    var priceRangeSlider = $("#range_1").ionRangeSlider({
        min: 0,
        max: 10000,
        from:0,
        to: 10000,
        type: 'double',//设置类型
        step: 500,
        prefix: "",//设置数值前缀
        postfix: "元",//设置数值后缀
        prettify: true,
        hasGrid: true,
        onChange: function(obj){        // function-callback, is called on every change
            //alert(obj+"1");
        },
        onFinish: function(obj){        // function-callback, is called once, after slider finished it's work
            $("#zjlist").val(obj.fromNumber+','+obj.toNumber);
            postDataList.zuJinMin = strFormat(obj.fromNumber);
            postDataList.zuJinMax = strFormat(obj.toNumber);
            getdyallist();
            if($("#quyu").find(".active").attr("quyuAId")=="-1"){
                getListTown();
            }else{
                //加载区域对应的小区
                var centerPoint = {
                    lng:$("#quyu").find(".active").attr("lng"),
                    lat:$("#quyu").find(".active").attr("lat")
                }
                postDataList.suofangbili = 15;
                getShoppingArea(1,centerPoint);
            }
        }
    });
    //点击类型筛选
    layui.form().on('select(leixing)', function(data){
        //清空搜索框内容
        clearSeach();
        postDataList.isSub = strFormat(data.value) < 0 ? "" : strFormat(data.value);
        postDataList.pageNo = "1";
        getdyallist();
        if(strFormat(data.value) == "-1" && $("#quyu").find(".active").attr("quyuAId")=="-1" ){
            //InitMap();
            getListTown();
        }else{
            if($("#quyu").find(".active").attr("quyuAId")=="-1"){
                //InitMap();
                getListTown();
            }else {
                var centerPoint = {
                    lng: $("#quyu").find(".active").attr("lng"),
                    lat: $("#quyu").find(".active").attr("lat")
                }
                postDataList.suofangbili = 15;
                getShoppingArea(1,centerPoint);
            }
        }
    });
    //点击户型筛选
    layui.form().on('select(huxing)', function(data){
        //清空搜索框内容
        clearSeach();
        postDataList.shi = strFormat($(data.value)) < 0 ? "" : strFormat(data.value);
        postDataList.pageNo = "1";
        //加载区域对应的地图
        if($("#huxing").find("option:selected").val() == "-1" && $("#quyu").find(".active").attr("quyuAId")=="-1"){
            postDataList.shi = "";
            //InitMap();
            getListTown();
        }else{
            if($("#quyu").find(".active").attr("quyuAId")=="-1"){
                //InitMap();
                getListTown();
            }else{
                //加载区域对应的小区
                var centerPoint = {
                    lng:$("#quyu").find(".active").attr("lng"),
                    lat:$("#quyu").find(".active").attr("lat")
                };
                postDataList.suofangbili = 15;
                getShoppingArea(1,centerPoint);
            }
        }
        //加载列表页
        getdyallist();
    });
    $('#fuJinWeizhi').keydown(function(e){
        if(e.keyCode==13){
            $("#fuJinWeizhiSearch").click();
        }
    });
    $("#fuJinWeizhiSearch").click(function () {
        //点击搜索重置所有筛选条件
        //重置区域筛选
        postDataList.quyuAId = "";
        $('#quyu li[quyuAId="-1"]').addClass("active").siblings().removeClass("active");
        //重置类型
        postDataList.isSub = "";
        $('#leixing').find('option[value="-1"]').attr("selected",true);
        //重置租金
        postDataList.zuJinMax = "";
        postDataList.zuJinMin = "";
        /*$("#range_1").RangeSlider({
            max:10000
        });*/
        /*$("#range_1").ionRangeSlider({
            from: 0,
            to: 10000
        });*/
        //重置户型
        postDataList.shi = "";
        $('#huxing').find('option[value="-1"]').attr("selected",true);
        if($("#fuJinWeizhi").val() != ""){
            //区域筛选重置
            $("#wzlist option[value='']").attr("selected","true");
            layui.form().render("select"); //更新全部
            //getListTown();
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(strFormat($("#fuJinWeizhi").val()), function(point){
                if (point) {
                    window.map.clearOverlays();//清除覆盖物
                    window.map.centerAndZoom(point, 14);
                    window.map.addOverlay(new BMap.Marker(point));
                    //清空小区名称
                    postDataList.areaName = "";
                    //获取周边5公里内的房源
                    postDataList.l = "5";
                    postDataList.lat=point.lat;
                    postDataList.lng=point.lng;
                    //加载左侧列表
                    getdyallist();
                    //在地图上检索小区
                    postDataList.suofangbili = 15;
                    getShoppingArea(1,point);
                }else{
                    layui.layer.msg("找不到您搜索的地址，请换个地址重新搜索...");
                }
            }, cityName);
        }else{
            //getListTown();
            //重置搜索附近房源条件
            postDataList.l = "";
            postDataList.lat="";
            postDataList.lng="";
            //加载左侧列表
            getdyallist();
            //加载区域对应的地图
            if($("#quyu").find(".active").attr("quyuAId")=="-1"){
                //InitMap();
                getListTown();
            }else{
                //加载区域对应的小区
                var centerPoint = {
                    /*lng:$("#wzlist").find("option:selected").attr("lng"),
                    lat:$("#wzlist").find("option:selected").attr("lat")*/
                    lng:$("#quyu").find(".active").attr("lng"),
                    lat:$("#quyu").find(".active").attr("lat")
                };
                postDataList.suofangbili = 15;
                //getShoppingArea(1,centerPoint);
            }
        }
        //getdyallist();
    });
});
function splitstr(targetstr, types) {//types=1返回大，types=0返回小
    if (targetstr != null && types != null) {
        var strs = new Array();
        strs = targetstr.split(",");
        if (types == 1) {
            return strs[1];
        } else if (types == 0) {
            return strs[0];
        }
    }else{
        return "";
    }
}

//创建和初始化地图函数：
function InitMap() {
    window.map = new BMap.Map("content_right", {minZoom: 9});//在百度地图容器中创建一个地图
    var point = new BMap.Point(getItems("cityLng"), getItems("cityLat"));//定义一个中心点坐标
    window.map.centerAndZoom(point, 9);//设定地图的中心点和坐标并将地图显示在地图容器中
    window.map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    window.map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    window.map.enableScrollWheelZoom(true);//关闭双击放大
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));
    getListTown();
    //监听地图放大缩小事件
    var isLocalType = 1;//1：区域级别，2：小区级别
    window.map.addEventListener("zoomend", function(){
        var $suoFangBiLi = this.getZoom();
        if($suoFangBiLi > 12 && isLocalType != "2"){
            isLocalType = 2;//标记为小区
            var center = map.getCenter();
            var centerPoint = {
                lng:center.lng,
                lat:center.lat
            };
            postDataList.lng = centerPoint.lng;
            postDataList.lat = centerPoint.lat;
            postDataList.l = 10;
            postDataList.suofangbili = $suoFangBiLi;
            postDataList.quyuAId = "";
            getShoppingArea(2,centerPoint);
        }else if($suoFangBiLi <= 12 && $suoFangBiLi > 9 && isLocalType != "1"){
            isLocalType = 1;//标记为区域
            postDataList.quyuAId = "";//列表区域ID
            postDataList.areaName = "";//搜索框内容
            postDataList.lat = ""; //清空经纬度
            postDataList.lng = ""; //清空经纬度
            $("#quyu li[quyuAid='-1']").addClass("active").siblings().removeClass("active");
            //加载列表
            getdyallist();
            //加载地图区域
            getListTown();
        }
    });
}
/**
 * 获取对应城市所有区
 */
function getListTown() {
    var data_json = {
        method: "getWebHouseMap",
        params: {
            "level": "2",
            "gcid": postDataList.gcid,
            "isSub":postDataList.isSub,
            "shi":postDataList.shi,
            "maxMoney":postDataList.zuJinMax,
            "minMoney":postDataList.zuJinMin,
            "zhuangTai":postDataList.zhuangTai,
            "cityCode": postDataList.cityCode,
            "teSeId":postDataList.teSeId
        }
    };
    $.ajax({
        url: ipstr + '/house/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        jsonp: 'callback',
        jsonpCallback: "getWebHouseMap",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        success: function (json) {
            try {
                if (json.status.code == 200) {
                    window.map.clearOverlays();//清除覆盖物
                    var town_lnglat = new Array();
                    var all_town = new Array();
                    var town_num = new Array();
                    if (json.result.list.length > 0) {
                        $.each(json.result.list,function(n,value) {
                            town_lnglat[n] = new Array(value["lng"],value["lat"]);
                            all_town[n] = new Array(value["cityId"],value["name"]);
                            town_num[n] = value["size"];
                        });
                    }
                    baiduMapTown(town_lnglat, all_town, town_num);
                } else {
                    alert(json.status.msg);
                }
            } catch (e) {
                layui.layer.msg("服务器繁忙，稍后再试");
            }
        },
        error:function(a,b,c){
            //layui.layer.msg("请重新搜索");
        }
    });
}
//加载所有的区  参数：北京所有区的经纬度   区的名称  每个区房源数量
function baiduMapTown(town_lnglat, all_town, town_num) {
    window.map.clearOverlays();//清除覆盖物
    window.map.setZoom(12);//设置缩放比例
    window.map.setMinZoom(9);//设置最小缩放比例
    window.map.centerAndZoom(new BMap.Point(getItems("cityLng"),getItems("cityLat")));//初始中心点
    for (var i = 0; i < town_lnglat.length; i++) {
        if(town_num[i] != 0){
            var point = new BMap.Point(town_lnglat[i][0], town_lnglat[i][1]);
            var marker = new BMap.Marker(point, {icon: dt_img("1")}); // 创建点
            marker.tag = all_town[i];//区域名称
            marker.num = town_num[i];//房源数量
            marker.addEventListener("mouseover", function () {//添加鼠标悬停事件
                var marker1 = new BMap.Marker(this.point, {icon: dt_img("11")});
                marker1.tag = this.tag;
                marker1.setZIndex("zIndex:8");
                var label = new BMap.Label("<h5>" + this.tag[1] + "</h5><p style='margin-top: 8px;font-size:12px;'>" + this.num + "间</p>", {
                    offset: new BMap.Size(0, 5),
                    point: point
                });
                label.setStyle({//给label设置样式，任意的CSS都是可以的
                    border: 'none',
                    backgroundColor: 'transparent',//背景透明
                    textAlign: 'center',
                    margin: '18px auto 0',
                    padding: '0',
                    display: 'block',
                    width: '84px',
                    color: '#FFFFFF',
                });
                marker1.setLabel(label);
                window.map.addOverlay(marker1); //在相同位置添加一个标注盖住原先的标注  从而实现悬停改变背景色
                marker1.addEventListener("mouseout", function (e) {//鼠标移除移除当前覆盖层标注
                    window.map.removeOverlay(this);
                });
                marker1.addEventListener("click", function () {//标注的点击事件
                    $("#quyu li[quyuAId='"+this.tag[0]+"']").addClass("active").siblings().removeClass("active");
                    //获取区域ID
                    postDataList.levelId = this.tag[0];
                    //加载地图：指定区域小区
                    postDataList.suofangbili = 15;
                    postDataList.quyuAId = this.tag[0];
                    getShoppingArea(1,this.point);
                    //加载左侧房源列表
                    postDataList.quyuAId = this.tag[0];
                    getdyallist();
                });
            });
            window.map.addOverlay(marker);    //增加点
            var label = new BMap.Label("<h5>" + marker.tag[1] + "</h5><p style='margin-top: 8px;font-size:12px;'>" + town_num[i] + "间</p>", {
                offset: new BMap.Size(0, 5),
                point: point
            });
            marker.setLabel(label);
            label.setStyle({//给label设置样式，任意的CSS都是可以的
                border: 'none',
                backgroundColor: 'transparent',//背景透明
                textAlign: 'center',
                margin: '18px auto 0',
                padding: '0',
                display: 'block',
                width: '84px',
                color: '#FFFFFF'
            });
        }
    }
}
/**
 * 获取商圈
 */
/*function shoppingDistrict(centerPoint,cityId) {
    var data_json = {
        method: "getWebHouseMap",
        params: {
            "level": "3",
            "gcid": postDataList.gcid,
            "isSub":postDataList.isSub,
            "shi":postDataList.shi,
            "maxMoney":postDataList.zuJinMax,
            "minMoney":postDataList.zuJinMin,
            "zhuangTai":postDataList.zhuangTai,
            "cityCode": postDataList.cityCode,
            "cityId":cityId
        }
    };
    $.ajax({
        url: ipstr + '/house/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        jsonp: 'callback',
        jsonpCallback: "getWebHouseMap",
        success: function (json) {
            try {
                if (json.status.code == 200) {
                    window.map.clearOverlays();//清除覆盖物
                    if (json.result.list.length > 0) {
                        var town_lnglat = new Array();
                        var all_town = new Array();
                        var town_num = new Array();
                        $.each(json.result.list,function(n,value) {
                            town_lnglat[n] = new Array(value["lng"],value["lat"]);
                            all_town[n] = new Array(value["cityId"],value["name"]);
                            town_num[n] = value["size"];
                        });
                        baiduMapDistrict(town_lnglat, all_town, town_num,centerPoint);
                    }
                } else {
                    alert(json.status.msg);
                }
            } catch (e) {
                layui.layer.msg("服务器繁忙，稍后再试");
            }
        }
    });
}
/!**
 * 加载商圈
 *!/
function baiduMapDistrict(lnglat, address, num, centerPoint) {
    window.map.clearOverlays();//清除覆盖物
    window.map.setZoom(13);//设置缩放比例
    window.map.setMinZoom(11);//设置最小缩放比例
    window.map.centerAndZoom(new BMap.Point(centerPoint.lng, centerPoint.lat), 12);//初始中心点
//	var pointArray = new Array();
    for (var i = 0; i < lnglat.length; i++) {
        var point = new BMap.Point(lnglat[i][0], lnglat[i][1]);
        var marker = new BMap.Marker(point, {icon: dt_img("2")}); // 创建点
        marker.tag = address[i];//商圈名称
        marker.lng = lnglat[i][0];//经度
        marker.lat = lnglat[i][1];//维度
        marker.num = num[i];//房源数量
        marker.addEventListener("mouseover", function () {//添加鼠标悬停事件
            var marker1 = new BMap.Marker(this.point, {icon: dt_img("22")});
            var label = new BMap.Label("<p style='margin-top: 9px;margin-bottom: 9px;font-size:12px;'>" + this.num + "间</p>" + lengthSQ(this.tag[1]), {
                offset: new BMap.Size(0, 5),
                point: point
            });
            marker1.tag = this.tag;//商圈名称
            marker1.lng = this.lng;//经度
            marker1.lat = this.lat;//维度
            marker1.setZIndex('zIndex:50');
            label.setStyle({//给label设置样式，任意的CSS都是可以的
                border: 'none',
                backgroundColor: 'transparent',//背景透明
                textAlign: 'center',
                margin: '0px auto 0',
                padding: '0',
                display: 'block',
                width: '68px',
                color: '#FFFFFF',
                overflow:'hidden',
            });
            marker1.setLabel(label);
            window.map.addOverlay(marker1); //在相同位置添加一个标注盖住原先的标注  从而实现悬停改变背景色
            marker1.addEventListener("mouseout", function (e) {//鼠标移除移除当前覆盖层标注
                window.map.removeOverlay(this);
            });
            marker1.addEventListener("click", function () {//标注的点击事
                $("#wzlist2 option[value='"+this.tag[0]+"']").attr("selected","true");
                $("#wzlist2").change();
                $("#xqselect").attr("value","");
                postDataList.pageNo = "1";
                postDataList.levelId = this.tag[0];
                getShoppingArea(centerPoint);
                getdyallist();
            });
        });
        window.map.addOverlay(marker);    //增加点
        var label = new BMap.Label("<p style='margin-top: 9px;margin-bottom: 9px;font-size:12px;'>" + num[i] + "间</p>" + lengthSQ(marker.tag[1]), {
            offset: new BMap.Size(0, 5),
            point: point
        });
        marker.setLabel(label);
        label.setStyle({//给label设置样式，任意的CSS都是可以的
            border: 'none',
            backgroundColor: 'transparent',//背景透明
            textAlign: 'center',
            margin: '0px auto 0',
            padding: '0',
            display: 'block',
            width: '68px',
            color: '#FFFFFF',
            overflow:'hidden',
        });
    }
    //若没有中心点  让所有点在视野范围内
//	if(centerPoint==null){map.setViewport(pointArray);}
}*/
/**
 * 获取小区
 */
function getShoppingArea(clickTypt,centerPoint) {
    if(postDataList.quyuAId != ""){
        postDataList.lat = "";
        postDataList.lng = "";
    }
    var data_json = {
        method: "getWebHouseMap",
        params: {
            "level": "4",
            "gcid": postDataList.gcid,
            "isSub":postDataList.isSub,
            "shi":postDataList.shi,
            "maxMoney":postDataList.zuJinMax,
            "minMoney":postDataList.zuJinMin,
            "zhuangTai":postDataList.zhuangTai,
            "cityCode": postDataList.cityCode,
            "lat":postDataList.lat,
            "lng":postDataList.lng,
            "l":postDataList.l,
            "teSeId":postDataList.teSeId,
            "tId":postDataList.levelId
        }
    };
    $.ajax({
        url: ipstr + '/house/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp: 'callback',
        jsonpCallback: "getWebHouseMapXiaoQu",
        success: function (json) {
            try {
                if (json.status.code == 200) {
                    window.map.clearOverlays();//清除覆盖物
                    if (json.result.list.length > 0) {
                        var town_lnglat = new Array();
                        var all_town = new Array();
                        var town_num = new Array();
                        $.each(json.result.list,function(n,value) {
                            town_lnglat[n] = new Array(value["lng"],value["lat"]);
                            all_town[n] = value["name"];
                            town_num[n] = value["size"];
                        });
                        baiduMapArea(town_lnglat, all_town, town_num,centerPoint,clickTypt);
                    }else{
                        //layui.layer.msg("附近没有房源哦！");
                        var pointCenter = new BMap.Point(centerPoint.lng, centerPoint.lat);
                        window.map.centerAndZoom(pointCenter, 15);//初始中心点
                        var markerCenter = new BMap.Marker(pointCenter);  // 创建标注
                        window.map.addOverlay(markerCenter);               // 将标注添加到地图中
                        markerCenter.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    }
                } else {
                    alert(json.status.msg);
                }
            } catch (e) {
//              layui.layer.msg("服务器繁忙，稍后再试");
            }
        }
    });
}
/**
 * 小区插点
 * @param lnglat 经纬度
 * @param address 地址
 * @param num 房源间数
 * @param centerPoint 地图中心点坐标
 * @param clickTypt 是放大缩小还是点击
 * @param $suoFangBiLi 滑动放大缩小时地图的放大比例
 */
function baiduMapArea(lnglat, address, num, centerPoint,clickTypt) {
    window.map.clearOverlays();//清除覆盖物
    window.map.setZoom(14);//设置缩放比例
    window.map.setMinZoom(12);//设置最小缩放比例
    if (centerPoint != null) {
    	window.map.centerAndZoom(new BMap.Point(lnglat[0][0], lnglat[0][1]), 14);
//  	alert("!null");
//  	alert(lnglat[0][0])
    	if(lnglat[0][0]=='0'){
    		window.map.centerAndZoom(new BMap.Point(lnglat[1][0], lnglat[1][1]), 14);
    	}
        //window.map.centerAndZoom(new BMap.Point(centerPoint.lng, centerPoint.lat), 14);//初始中心点
    }
    for (var i = 0; i < lnglat.length; i++) {
        var point = new BMap.Point(lnglat[i][0], lnglat[i][1]);
        var marker = new BMap.Marker(point, {icon: dt_img("3")}); // 创建点
        marker.tag = address[i];
        marker.num = num[i];
        var label = new BMap.Label(num[i] + "间", {offset: new BMap.Size(0, 0), point: point});
        label.setStyle({//给label设置样式，任意的CSS都是可以的
            border: 'none',
            backgroundColor: 'transparent',//背景透明
            textAlign: 'center',
            margin: '0px auto 0',
            padding: '0',
            display: 'block',
            height: '38px',
            lineHeight: '42px',
            width: '42px',
            color: '#FFFFFF',
            fontFamily: '微软雅黑',
        });
        marker.setLabel(label);
        window.map.addOverlay(marker);    //增加点
        marker.addEventListener("mouseover", function () {//添加鼠标悬停事件
            var htm = '<font style="width: 42px;height: 42px; line-height:42px; display: block; float: left; font-size: 12px; color: rgb(255, 255, 255);">' + this.num + '间</font><div style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); height: 36px; width: auto; display: inline-table; line-height: 36px; padding: 0px 8px 0px 4px; border-radius: 4px; margin-left: -2px;">' + this.tag + '</div>';
            this.setTop(true);
            var s = this.getLabel();
            s.setContent(htm);
        });
        marker.addEventListener("mouseout", function (e) {
            var s = this.getLabel();
            this.setTop(false);
            s.setContent(this.num + "间");
        });
        marker.addEventListener("click", function () {//增加点的点击事件
            $("#xqselect").attr("value",this.tag);
            postDataList.pageNo = "1";
            postDataList.areaName = this.tag;
            //清空搜索框内容
            clearSeach();
            getdyallist();
        });
    }
    var pointCenter = "";
    if(clickTypt == 1){
        //地图中心点读第一间房子的经纬度
//      if(lnglat[0][0] == 0.0 || lnglat[0][1] == 0.0){
//          //如果第一间房子经纬度为0，则显示区域中心点
//          pointCenter = new BMap.Point(centerPoint.lng, centerPoint.lat);
//      }else{
//          pointCenter = new BMap.Point(lnglat[0][0], lnglat[0][1]);
//      }
    }else{
        pointCenter = new BMap.Point(centerPoint.lng, centerPoint.lat);
    }
    window.map.centerAndZoom(pointCenter, 15);//初始中心点
    var markerCenter = new BMap.Marker(pointCenter);  // 创建标注
    window.map.addOverlay(markerCenter);               // 将标注添加到地图中
    markerCenter.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
}
//地图点的图片样式
function dt_img(type) {
    if (type == "1") {
        return new BMap.Icon('images/findroom/dt_one_lan.png', new BMap.Size(84, 84));
    } else if (type == "11") {
        return new BMap.Icon('images/findroom/dt_one1_lan.png', new BMap.Size(84, 84));
    } else if (type == "2") {
        return new BMap.Icon('images/findroom/dt_two_lan.png', new BMap.Size(68, 60));
    } else if (type == "22") {
        return new BMap.Icon('images/findroom/dt_two1_lan.png', new BMap.Size(68, 60));
    } else if (type == "3") {
        return new BMap.Icon('images/findroom/dt_three_lan.png', new BMap.Size(42, 42));
    } else if (type == "33") {
        return new BMap.Icon('images/findroom/dt_three1_lan.png', new BMap.Size(42, 42));
    }

}
//判断商圈的字数 从而改变显示时的大小
function lengthSQ(str) {
    var fsize = "";
    if (str.length == 5) {
        fsize = "<h6 style='font-size:11px;margin-top:12px;'>" + str + "</h6>";
    } else if (str.length >= 6) {
        fsize = "<h6 style='margin-left: 3px; font-size: 9px;'>" + str + "</h6>";
    } else {
        fsize = "<h5>" + str + "</h5>";
    }
    return fsize;
}
