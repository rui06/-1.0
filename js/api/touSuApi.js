//add投诉数据
var addtousuDate={
	"chengJiaoRenIds":"",     //被投诉人id即成交人id
	"indentNumber":"",     //合同编号
	"contractConfigNo":"",    //成租编号
	"taizhanghao":"",       //台账号
	"houseId":"",            //房间号
	"tousurenName":"",        //投诉人姓名
	"tousurenPhone":"",      //投诉人电话
	"tousuContent":"",       //投诉内容
	"zukeSfz":""       //租客身份证
};
//验证账号
function getlogin(uid, paw) {
	var data_json = {
		method: "zukeLogin",
		params: {
			"zukePhone": uid,
			"zukeSFZ": paw,
			"gcid": gcid
		}
	};
	$.ajax({
		url: ipstr + '/webChengzu/request.action',
		type: 'post',
		dataType: 'jsonp',
		data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
		jsonp: "callback",
		jsonpCallback: "zukeLogin",
		success: function(json) {
			try{
				if(json.status.code == 200) {
					setItems("zukePhone", uid);
					setItems("zukeSFZ", paw);
					setItems("gcId", json.result.list[0].organizationCode);
					window.location.href = "gerenzhongxin.html";
				}else{
					alert(json.status.msg);
				}
			}catch(e){
				alert("网络开了会小差，请稍后重试！");
				//TODO handle the exception
			}

		}
	});
}
//租客信息
function getzukeinfo(zukePhone, zukeSFZ) {
	var contractNumber = "";
	var data_json = {
		method: "zukeList",
		params: {
			pageNo: 1,
			pageSize: 10,
			"zukePhone": zukePhone,
			"zukeSFZ": zukeSFZ,
			"gcid": gcid
		}
	};
	var htlist = "";
	$.ajax({
		url: ipstr + '/webChengzu/request.action',
		type: 'post',
		dataType: 'jsonp',
		data: toRequestData(data_json),
		jsonp: "callback",
		jsonpCallback: "zukeList",
		beforeSend:function(XMLHttpRequest){
			//加载前
            xhr.setRequestHeader("gcid", gcid);
			$("#loading").show();//loading遮罩
		},
		success: function(json) {
			try{
				if(json.status.code == 200) {
					if(parseInt(json.result.maxSize)>1) {
						//var $index = json.result.list.length -1;
						var $index = 0;
						setItems("zkname", json.result.list[$index]["zukeName"]);
						setItems("zukePhone",zukePhone);
						addtousuDate.chengJiaoRenIds = json.result.list[$index]["chengJiaoRenIds"];
						addtousuDate.indentNumber = json.result.list[$index]["id"];
						addtousuDate.contractConfigNo = json.result.list[$index]["contractConfigNo"];
						addtousuDate.taizhanghao = json.result.list[$index]["house"]["heTong"]["taiZhangNo"];
						addtousuDate.houseId = json.result.list[$index]["house"]["fangJianName"];
						addtousuDate.tousurenName = json.result.list[$index]["zukeName"];
						addtousuDate.tousurenPhone = zukePhone;
						addtousuDate.zukeSfz = zukeSFZ;
						gettslist(gcid, 1, 50, zukePhone, json.result.list[$index]["id"]);
						/*$.each(json.result.list, function(n, value) {
							htlist += '<li class="cf" tagerid="' + value["id"] + '" houseid="' + value["houseId"] + '" zkname="' + value["zukeName"] + '">';
							htlist += '<p class="tit">合同编号：' + value["contractConfigNo"] + '</p>';
							htlist += '<p>房屋地址：' + value["house"].quyuCName + '' + value["house"].louNo + '座' + value["house"].men + '单元' + value["house"].fangNo + '</p>';
							htlist += '<p>房屋租金：' + value["house"].zuJin + '元／月</p><dd><div class="shi">始</div><h4>' + value["startTime"] + '</h4><span>起租日期</span></dd>';
							htlist += '<dt><div class="zhong">终</div><h4>' + value["endTime"] + '</h4><span>中止日期</span></dt>';
							htlist += '<p class="cc" chengJiaoRenIds="' + json.result.list[n]["chengJiaoRenIds"] + '" contractConfigNo="' + json.result.list[n]["contractConfigNo"] + '"';
							htlist += ' fangJianName="' + json.result.list[n]["house"]["fangJianName"] + '" taiZhangNo="' + json.result.list[n]["house"]["heTong"]["taiZhangNo"] + '"';
							htlist += '></p></li>';
						});
						$(".hetlist").html(htlist);

						$(".hetlist li").bind("click", function() {
							$(".wxbtn").attr("hid", $(this).attr("houseid"));
							//$(".wxbtn").attr("zkname",$(this).attr("zkname"));
							var chengJiaoRenIds = $(this).find(".cc").attr("chengJiaoRenIds"),
								contractConfigNo = $(this).find(".cc").attr("contractConfigNo"),
								taiZhangNo = $(this).find(".cc").attr("taiZhangNo"),
								fangJianName = $(this).find(".cc").attr("fangJianName");
							gettslist(gcid, 1, 50, zukePhone, $(this).attr("tagerid"), contractConfigNo, taiZhangNo, fangJianName, chengJiaoRenIds);
						})*/
					} else if(parseInt(json.result.maxSize) == 1) {
						setItems("zkname", json.result.list[0]["zukeName"]);
						setItems("zukePhone",zukePhone);
						addtousuDate.chengJiaoRenIds = json.result.list[0]["chengJiaoRenIds"];
						addtousuDate.indentNumber = json.result.list[0]["id"];
						addtousuDate.contractConfigNo = json.result.list[0]["contractConfigNo"];
						addtousuDate.taizhanghao = json.result.list[0]["house"]["heTong"]["taiZhangNo"];
						addtousuDate.houseId = json.result.list[0]["house"]["fangJianName"];
						addtousuDate.tousurenName = json.result.list[0]["zukeName"];
						addtousuDate.tousurenPhone = zukePhone;
						addtousuDate.zukeSfz = zukeSFZ;
						gettslist(gcid, 1, 50, zukePhone, json.result.list[0]["id"]);
					} else {
						$(".wxbtn").css("display","none");
						$(".hetlist").html("<dl class='noXinxin'><dt><img src='images/noInfo/no.png' /></dt><dd>您还没有投诉记录哦！</dd></dl>");
					}
				}
			}catch(e){
				alert("网络开了会小差，请稍后重试！");
				//TODO handle the exception
			}
		},
		error:function () {
			//加载错误
			$("#loading").hide();
		},
		complete:function () {
			//加载完成
			$("#loading").hide();
		}
	});
}
//投诉列表
function gettslist(gcid,pageNo, pageSize, complainantPhone, indentNumber) {
	var data_json = {
		method: "listPhoneWebComplaint",
		params: {
			"gcid": gcid,
			"indentNumber": indentNumber,
			"complainant": getItems("zkname"),
			"complainantPhone": complainantPhone,
			"pageNo": pageNo,
			"pageSize": pageSize
		}
	};
	var wxlist = '';
	$.ajax({
		url: ipstr + '/webChengzu/request.action',
		type: 'post',
		dataType: 'jsonp',
		data: toRequestData(data_json),
		jsonp: "callback",
		jsonpCallback: "listPhoneWebComplaint",
		beforeSend:function(XMLHttpRequest){
			//加载前
			$("#loading").show();//loading遮罩
		},
		success: function(json) {
			try{
				if(json.status.code == 200) {
					if(json.result.list.length > 0) {
						$.each(json.result.list, function(n, value) {
							var status = "";
							if(value["status"] == 1) {
								status = '<span class="state1">待处理</span>';
							} else {
								status = '<span class="state2">已处理</span>';
							}
							wxlist += '<li targetid="' + value["id"] + '" ><h4>' + value["complainantInfo"] + '</h4>';
							wxlist += '<p>' + value["ct"] + status + '</p></li>';
						});
						$(".hetlist").html("");
						$(".complain").html(wxlist);
						$(".complain li").bind("click", function() {
							window.location.href = "tousudetail.html?id=" + $(this).attr("targetid");
						})

					} else {
						$(".hetlist").html("");
						$(".complain").html("<dl class='noXinxin'><dt><img src='images/noInfo/no.png' /></dt><dd>您还没有任何投诉哦！</dd></dl>");
					}
					$(".backbtn").bind("click",function () {
						window.location.href = "gerenzhongxin.html";
					});
				}else{
					alert(json.status.msg);
				}
				$(".wxbtn").show();
			}catch(e){
				alert("网络开了会小差，请稍后重试！");
			}
		},
		error:function () {
			//加载错误
			$("#loading").hide();
		},
		complete:function () {
			//加载完成
			$("#loading").hide();
		}
	});
}
//投诉详情
function gettsdetail(id) {

	var bol = false;
	var data_json = {
		method: "getPhoneObjById",
		params: {
			"id": id,
			"gcid": gcid
		}
	};
	$.ajax({
		url: ipstr + '/webChengzu/request.action',
		type: 'post',
		dataType: 'jsonp',
		data: toRequestData(data_json),
		jsonp: "callback",
		jsonpCallback: "getPhoneObjById",
		success: function(json) {
			try{
				if(json.status.code == 200) {
					var statu = "";
					if(json.result.status == 1) {
						statu = "待处理";
					} else {
						statu = "已处理";
					}
					$("#desc_info").html(json.result.complainantInfo);
					$("#time_info").html(json.result.ct);
					$("#status_info").html(statu);
					$("#f_time").html(json.result.expectCompletionTime);
					$("#f_phone").html(json.result.customerCalls);
				} else {
					alert(json.status.msg);
				}
			}catch(e){
				alert("网络开了会小差，请稍后重试！");
			}
		}
	});
}
//投诉添加
function addts() {
	var bol = false;
	var data_json = {
		method: "savePhoneWebComplaint",
		params: {
			"byComplainantId": addtousuDate.chengJiaoRenIds, //被投诉人 chengJiaoRenIds
			"indentNumber": addtousuDate.indentNumber, //合同编号id
			"rentNumber": addtousuDate.contractConfigNo, //成租编号contractConfigNo
			"parameter": addtousuDate.taizhanghao, //台账号 taiZhangNo
			"roomNumber": addtousuDate.houseId, //写房间号 fangJianName
			"complainant": addtousuDate.tousurenName, //投诉人姓名 zukeName
			"complainantPhone": addtousuDate.tousurenPhone, //投诉人电话
			"complainantInfo": addtousuDate.tousuContent, //内容
			"gcid": gcid,
			"type": 8
		}
	};
	var wxdetail = '';
	$.ajax({
		url: ipstr + '/webChengzu/request.action',
		type: 'post',
		dataType: 'jsonp',
		data: toRequestData(data_json),
		jsonp: "callback",
		jsonpCallback: "savePhoneWebComplaint",
		success: function(json) {
			try {
				if(json.status.code == 200) {
					var phone=getItems("zukePhone");
					layer.closeAll();
					layui.layer.msg("提交成功！请耐心等待管家MM与您联系···");
					getzukeinfo(addtousuDate.tousurenPhone,addtousuDate.zukeSfz);
					//window.location.href = 'success.html?name=tousu&gcid='+gcid+'&pageNo=1&pageSize=50&complainantPhone='+phone+'&indentNumber='+htid+'&contractConfigNo='+contractConfigNo+'&taiZhangNo='+taiZhangNo+'&fangJianName='+fangJianName+'&chengJiaoRenIds='+chengJiaoRenIds;
				} else {
					alert(json.status.msg);
				}
			} catch(e) {
				alert("网络开了会小差，请稍后重试！");
			}

		}
	});
}