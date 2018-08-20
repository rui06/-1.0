//列表请求参数
var postDataList = {
    "pageNo": "",
    "pageSize": "10",
    "level": "",
    "isSub": "",
    "zhuangTai":"193604ec-ff4d-488c-b1bd-9b247645b028",
    "cityCode": cityCode,
    "quyuAId": "",
    "zuJinMin": "",
    "zuJinMax": "",
    "shi": "",
    "areaName": "",
    "lng":"",
    "lat":"",
    "l":"",
    "teSeId":"",
    "gcid": gcid,
    "suofangbili":""
};
//清空搜索框内容
function clearSeach() {
    $("#fuJinWeizhi").val("");
    postDataList.lat = "";
    postDataList.lng = "";
    postDataList.l = "";
}
//定位城市
function getcity(){
    var city = cityName;
    city = getItems("cityname");
    setItems("cityLat",cityLat);
    setItems("cityLng",cityLng);
    //获取一级区域
    getAreaAlist(cityCode);
    //加载房源
    postDataList.pageNo = "1";
    getdyallist();
}
/*-------------------------------------------------------------------------------------*/
//列表找房页获取一级地域------
function getAreaAlist(city) {
    if (isNull(city)) {
        city = cityCode;
    }
    var data_json = {
        method: "queryAreaList",
        params: {
            CityCode: city,
            "gcid": gcid
        }
    };
    var AreaAlist = '<li class="active" quyuAId="-1">全部</li>';
    $.ajax({
        url: ipstr + '/webHouse/request.action',//  /house/request.action
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp: "callback",
        jsonpCallback: "queryAreaList",
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
                        AreaAlist += '<li quyuAId="'+value["id"]+'" lat="'+value["lat"]+'" lng="'+value["lng"]+'">'+value["name"]+'</li>';
                    }
                });
                $('#quyu').html(AreaAlist);
                $("#quyu li").bind("click",function () {
                    //清空搜索框内容
                    clearSeach();
                    $(this).addClass("active").siblings().removeClass("active");
                    if($(this).attr("quyuAId") == "-1"){
                        postDataList.quyuAId = "";//列表区域ID
                        postDataList.areaName = "";
                        postDataList.lat = "";
                        postDataList.lng = "";
                        //加载列表
                        getdyallist();
                        //加载地图区域
                        getListTown();
                    }else{
                        postDataList.quyuAId = $(this).attr("quyuAId");//列表区域ID
                        postDataList.levelId = $(this).attr("quyuAId");//地图区域ID
                        postDataList.pageNo = "1";
                        getdyallist();
                        //加载地图区域
                        var centerPoint = {
                            lng:$(this).attr("lng"),
                            lat:$(this).attr("lat")
                        };
                        postDataList.suofangbili = 15;
                        getShoppingArea(1,centerPoint);
                    }
                });
                //加载地图区域
                getListTown();
            }
            else {
                layui.layer.msg("服务器繁忙，稍后再试");
            }
        }
    })
}
/*-------------列表找房页二级地域房源列表--------------*/
function getdyallist() {
    var data_json = {
        method: "getPageList",
        params: {
            "pageNo": postDataList.pageNo,
            "pageSize": postDataList.pageSize,
            "isSub": postDataList.isSub,
            "cityCode": postDataList.cityCode,
            "quyuAId": postDataList.quyuAId,
            //"quyuBId": dybid,
            "zuJinMin": postDataList.zuJinMin,
            "zuJinMax": postDataList.zuJinMax,
            "shi": postDataList.shi,
            "areaNameKeChuZu": postDataList.areaName,
            "lat":postDataList.lat,
            "lng":postDataList.lng,
            "l":postDataList.l,
            "teSeId":postDataList.teSeId,
            "gcid": postDataList.gcid
        }
    };
    var alllist = "";
    $.ajax({
        url: ipstr + '/webHouse/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp: "callback",
        jsonpCallback: "getPageList",
        success: function (json) {
            if (json.status.code == 200) {
                if(json.result.list.length>0){
                    $.each(json.result.list, function (n, value) {
                        var huxingtu = value["housePics"];
                        if(huxingtu == 0){
                            var numberurl = getnumber();
                            huxingtu = 'images/fyde/' + numberurl + '.png';
                        }else{
                            huxingtu = value["housePics"][0]["small"];
                        }
                        alllist += '<li class="square cf"><a target="_blank" href="details.html?id=' + value["id"] + '&parentId=' + value["parentId"] + '">';
                        alllist += '<dd><img src="' + huxingtu + '" alt=""/></dd><dt>';

                        if(value["parentId"] == value["id"]){
                            alllist += '<h4><p class="fangName"><span>'+value["quyuCName"]+'</span>-'+value["shi"]+'居室-整租</p>';
                            alllist += '<p class="p3 pZheng">整租</p>'
                        }else{
                            alllist += '<h4><p class="fangName"><span>'+value["quyuCName"]+'</span>-'+value["shi"]+'居室-卧室'+value["fangJianName"]+'</p>';
                            alllist += '<p class="p3 pZheng">合租</p>'
                        }
                        alllist += '</h4><p class="p1"><span class="xianLu">'+value["quyuAName"]+''+value["quyuBName"]+''+value["quyuCName"]+'</span></p>';
                        alllist += '<p class="List_zujin"><span>' + strFormat(value["zuJin"]) + '</span>元/月</p>';
                        alllist += '<p class="p2">';
                        alllist += '<strong class="list_tese01">精装</strong>';
//                      if(!isNull(value["zhuangXiuTypeName"])){
//                          alllist += '<strong class="list_tese01">'+value["zhuangXiuTypeName"]+'</strong>';
//                      }
//                      if(!isNull(value["chaoXiang"])){
//                          alllist += '<strong class="list_tese02">朝向'+value["chaoXiang"]+'</strong>';
//                      }
                        //判断特色是否为空
                        if(!isNull(strFormat(value["TeSe"]))){
	                        $.each(value["TeSe"], function(n,valuee) {
		                        alllist += '<strong class="tese03">'+strFormat(valuee["zdKey"])+'</strong>';
	                        });
                        }
                        alllist += '</p></dt></a></li>';
                    })
                    $("#map_list_ul_page").css("display","block");
                    //分页
                    layui.laypage({
                        cont: 'map_list_ul_page'
                        ,pages: json.result.maxPage
                        ,curr:json.result.pageNo
                        ,groups: 3 //连续显示分页数
                        ,skin: '#008cd6'
                        ,prev: '<em><</em>'
                        ,next: '<em>></em>'
                        ,jump: function(obj, first){
                            if(!first){
                                layer.msg('第 '+ obj.curr +'页');
                                postDataList.pageNo = obj.curr;
                                getdyallist();
                            }
                        }
                    });
                }else if(json.result.list.length<=6 && json.result.list.length>0){
                    $(".prev").hide();
                    $(".next").hide();
                    $(".noGengduo").show();
                }else {
                    $(".noGengduo").hide();
                    alllist +='<li class="noFyuan"><dt>没有找到房源哦！<br />换个<span>条件</span>试试...</dt><dd><img src="images/nofangyuan.png"/></dd></li>';
                    $("#map_list_ul_page").css("display","none");
                }
                $("#map_list_ul").html(alllist);
                //隐藏搜索栏
            }
            else {
                layui.layer.msg("服务器繁忙，稍后再试");
            }
        }
    })
}



getHouseTeSe()
//房屋特色获取------
function getHouseTeSe(){
	var data_json = {
		method: "getAllByParent",
		params: {
			parentId: "04b91d6b-44ca-43ee-870a-e078ac2c6771",
			appendFirstValue: "请选择特色",
			selectedFirst: "1",
			"gcid": gcid
		}
	};
	var HouseTeSe = '<option value="-1">特色</option>';
	$.ajax({
		url: ipstr + '/webHouse/request.action',
		type: 'post',
		dataType: 'jsonp',
		data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
		jsonp: "callback",
		jsonpCallback: "getAllByParent",
		success: function(json){
			$.each(json, function(n, value){
//				alert(value["id"])
				if(value["id"] == "-1"){
                    HouseTeSe += '';
                }else{
                    HouseTeSe += '<option lay-value="'+n+'" value="'+value["id"]+'">'+value["key"]+'</option>';
                }
			})
			$('#tese').html(HouseTeSe);
			layui.form().render('select');
			layui.form().on('select(tese)', function(data){
	            //清空搜索框内容
                clearSeach();
                postDataList.teSeId = strFormat(data.value) < 0 ? "" : strFormat(data.value);
                getdyallist();
                getListTown();
            });
		}
	});
}




