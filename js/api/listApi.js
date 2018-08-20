//列表请求参数
var listDate = {
    //"city":"025",
    "city":"010",
    "pageNo": "",
    "pageSize": "12",
    "level": "",
    "isSub": "",
    "zhuangTai":"193604ec-ff4d-488c-b1bd-9b247645b028",
    "cityCode": cityCode,  //城市id
    "quyuAId": "",        //区域Id
    "zuJinMin": "",       //租金小
    "zuJinMax": "",       //租金大
    "shi": "",            //居室
    "areaName": "",       //小区名
    "houseId":"",         //房源编号
    "teseAId":"",
    "l":"",
    "gcid": gcid,
    "taizhang":"",
    "houseStatus":""   //房源类型
};
//房屋特色
getHouseTeSe();
//房屋特色获取------
function getHouseTeSe(){
	var data_json = {
		// method: "getAllByParent",
		params: {
			"mark": "04b91d6b-44ca-43ee-870a-e078ac2c6771",
			// appendFirstValue: "请选择特色",
			// selectedFirst: "1",
			"gcid": gcid
		}
	};
	var HouseTeSe = '<a href="javaScript:;" class="cur" teseAId="" lat="" lng="" no-search>不限</a>';
	$.ajax({
		url: ipstr1 + '/v2/web/resource/get_list_by_mark',
		type: 'post',
		dataType: 'json',
		data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
		// jsonp: "callback",
		// jsonpCallback: "getAllByParent",
		success: function(json){
			$.each(json.result.list, function(n, value){
				if(value["id"] == "-1"){
                    HouseTeSe += '';
                }else{
                    HouseTeSe += '<a teseAId="'+value["id"]+'">'+value["key"]+'</a>';
                }
			});
			$('#tese').html(HouseTeSe);
            $("#tese a").bind("click",function () {
	            //添加条件小标签
	            if($(this).attr("teseAId") == ""){
	                addTiaoJian("tese","");
	            }else{
	                addTiaoJian("tese",$(this).html());
	            }
	            //清空搜索框内容
	            $("#roomName").val("");
	            $(this).addClass("cur").siblings().removeClass("cur");
	            $("#teseName").val($(this).attr("teseAId"));
	            shaixuan();
            });
		}
	})
}
getCity();
function getCity(){
    var data_json = {
        // method: "queryAreaList",
        params: {
            // CityCode: cityCode,
            "gcid": gcid
        }
    };
    $.ajax({
        url: ipstr1 + '/v2/sys/resources_adjust/get',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        // jsonp: "callback",
        // jsonpCallback: "queryAreaList",
        success: function (json) {
            if (json.status.code == 200) {
                console.log(json);
                getAreaAlist(json.result.companyCityId);
            }
        }
    })
}
//列表找房页 区域获取------
function getAreaAlist(cityId) {
    var data_json = {
        // method: "queryAreaList",
        params: {
            "cityId": cityId
            // "gcid": gcid
        }
    };
    var AreaAlist = '<a href="javaScript:;" class="cur" quyuAId="" lat="" lng="" no-search>不限</a>';
    $.ajax({
        url: ipstr1 + '/v2/location/town/get_list',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        // jsonp: "callback",
        // jsonpCallback: "queryAreaList",
        success: function (json) {
            if (json.status.code == 200) {
                $.each(json.result.list, function (n, value) {
                    if(value["name"] == "南京周边"){
                        AreaAlist += '';
                    }else if(value["name"] == "高淳"){
                        AreaAlist += '';
                    }else if(value["name"] == "溧水"){
                        AreaAlist += '';
                    }else if(value["name"] == "六合"){
                        AreaAlist += '';
                    }else if(value["name"] == "雨花台"){
                        AreaAlist += '';
                    }else if(value["name"] == "秦淮"){
                        AreaAlist += '';
                    }else if(value["name"] == "大厂"){
                        AreaAlist += '';
                    }else if(value["name"] == "下关"){
                        AreaAlist += '';
                    }else{
                        AreaAlist += '<a quyuAId="'+value["id"]+'">'+value["name"]+'</a>';
                    }
                });
                $('#quyu').html(AreaAlist);
                $("#quyu a").bind("click",function () {
                    //添加条件小标签
                    if($(this).attr("quyuAId") == ""){
                        addTiaoJian("quyu","");
                    }else{
                        addTiaoJian("quyu",$(this).html());
                    }
                    //清空搜索框内容
                    $("#roomName").val("");
                    $(this).addClass("cur").siblings().removeClass("cur");
                    $("#quYuName").val($(this).attr("quyuAId"));
                    shaixuan();
                });
            }
            else {
                layui.layer.msg("服务器繁忙，稍后再试");
            }
        }
    })
}

//房源显示
function housesList($pageNo) {
    var data_json = {
        // method: "getPageList",
        params: {
            "pageNo": $pageNo,
            "pageSize": listDate.pageSize,
            "houseType": listDate.isSub,
            // "cityCode": listDate.cityCode,
            "quyuAId": listDate.quyuAId,
            "zujinBegin": listDate.zuJinMin,
            "zujinEnd": listDate.zuJinMax,
            "likeName": listDate.areaName,
            "taizhang": listDate.taizhang,    //台账号
            "shi": listDate.shi,
            // "l":listDate.l,
            "tese":listDate.teseAId,
            "gcid": listDate.gcid,
            "houseStatus": listDate.houseStatus
        }
    };
    var houseList = "";
    $.ajax({
        url: ipstr1 + '/v2/web/house/get_list',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        // jsonp: "callback",
        // jsonpCallback: "getPageList",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        success: function (json) {
            if (json.status.code == 200) {
                if(json.result.list.length > 0){

                    $.each(json.result.list, function (n, value) {
                        if(!isNull(value)){
                            var $images = value["picList"];
                            if (isNull($images)){
                                $images = "images/guanwang_moren.jpg";
                            }else{
                                $images = value["picList"][0]["big"];
                            }
                            var $shiTingWei = strFormat(value["shi"])+'室'+strFormat(value["ting"])+'厅'+strFormat(value["wei"])+'卫';

                            houseList += '<li><a href="details.html?id='+value["id"]+'&parentId='+value["parentId"]+'" target="_blank">';
                            houseList += '<div class="imgbox"><img src="'+$images+'" /></div>';
                            houseList += '<h3><span class="shenLue">'+strFormat(value["quyuCName"])+''+strFormat(value["louNo"])+'栋</span>-'+strFormat(value["shi"])+'居室';
                            houseList += '<span class="price"><i class="f20">'+strFormat(value["zujin"])+'</i>元/月</span></h3>';
                            houseList += '<p class="xiangQing">';
                            if(value["id"] == value["parentId"]){
                                houseList += '整租<span class="mlr5">|</span>整租<span class="mlr5">|</span>';
                            }else{
                                houseList += '单间<span class="mlr5">|</span>合租<span class="mlr5">|</span>';
                            }
                            houseList += ''+strFormat(value["mianji"])+'M²<span class="mlr5">|</span>';
                            houseList += strFormat(value["loucengA"])+'/'+strFormat(value["loucengB"])+'<span class="fr">';
                            houseList += '<i class="location"></i>'+strFormat(value["quyuAName"])+'区-'+strFormat(value["quyuBName"])+'附近';
                            //houseList += ''+strFormat(value["quyuCName"])+'';
                            houseList += '</span></p><p class="tese">';
                            houseList += '<span class="tese01">精装</span>';
                            //判断装修是否为空
//                      if(!isNull(strFormat(value["zhuangXiuTypeName"]))){
//                          houseList += '<span class="tese01">'+strFormat(value["zhuangXiuTypeName"])+'</span>';
//                      }
                            //判断朝向是否为空
//                      if(!isNull(strFormat(value["chaoXiang"]))){
//                          houseList += '<span class="tese02">朝'+strFormat(value["chaoXiang"])+'</span>';
//                      }
                            //判断特色是否为空
                            if(!isNull(value["tese"])){
                                $.each(value["tese"], function(n,valuee) {
                                    houseList += '<span class="tese03">'+strFormat(valuee["key"])+'</span>';
                                });
                            }
                            houseList += '</p></a></li>';
                        }
                    });
                }else{
                    houseList = '<li style="width: 100%; height: auto;"><dl class="noFyuan"><dt style="width: 130px; height: 80px; line-height: 24px; font-size: 14px; text-align: center;border: 1px solid #333333;border-radius: 50%;float: left;padding: 20px 10px 0 10px;">没有找到房源哦！<br />换个<span>条件</span>试试...</dt><dd style="width: 200px; height: 200px; float: right;"><img style="width: 200px; height: 200px;" src="images/nofangyuan.png"/></dd></dl></li>';
                }
                $("#list").html(houseList);
                //分页
                layui.laypage({
                    cont: 'map_list_ul_page'
                    ,pages: json.result.totalPage
                    ,curr:json.result.pageNo
                    ,groups: 3 //连续显示分页数
                    ,skin: '#008cd6'
                    ,prev: '<em><</em>'
                    ,next: '<em>></em>'
                    ,jump: function(obj, first){
                        if(!first){
                            layer.msg('第 '+ obj.curr +'页');
                            housesList(obj.curr);
                            //回到顶部
                            var speed=500;//滑动的速度
                            $('body,html').animate({ scrollTop: 0 }, speed);
                        }
                    }
                });
            }else{
                layui.layer.msg("网络异常，请稍后重试！");
            }
        },
        error: function () {
            //加载错误
            layui.layer.msg("网络异常，请稍后重试！");
        },
        complete: function () {
            //加载完成
        }
    });
}
