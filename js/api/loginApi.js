$("#qieHuanDengLu").click(function () {
	//判断是验证码登录还是身份证登录
	var $value = $(this).attr("yanZheng");
	if($value == 1){
		//切换身份证
		$("#miMa").show();
		$("#yanZhengMa").hide();
		$("#qieHuanDengLu").attr("yanZheng","2");
		$(this).html("非租客登录");
	}else{
		//切换验证码
		$("#miMa").hide();
		$("#yanZhengMa").show();
		$("#qieHuanDengLu").attr("yanZheng","1");
		$(this).html("租客登录");
	}
});
//验证码倒计时
$("#showYZM").click(function () {
	if(isNull($("#phone").val())){
		layui.layer.msg("请输入手机号!");
	}else {
		var $phone = $("#phone").val();
		var code = Math.floor(Math.random() * 9000) + 1000;
		setItems("zukePhone",$phone);
		setItems("yanZhengMa",code);
		//短信验证码接口
		sendLoginCode($phone,code);
	}
});
//验证码计数器
function loginCounter(countdown){
	if (countdown == 0) {
		$("#showYZM").attr("scoke","0").text("重新获取");
	} else {
		$("#showYZM").attr("scoke","1").text(countdown);
		countdown--;
		setTimeout(function() { loginCounter(countdown)},1000)
	}
}
//点击登录
$("#login_btn").click(function () {
	if($("#qieHuanDengLu").attr("yanZheng") == 2){
		//密码登录
		var $phone = $("#phone");
		var $shengFenZ = $("#shenf");
		if($phone.val().length <11){
			layui.layer.msg("手机号输入错误！");
			$phone.focus();
			return;
		}else if($shengFenZ.val().length <6){
			layui.layer.msg("密码错误！");
			$shengFenZ.focus();
			return;
		}else{
			getlogin($phone.val(),$shengFenZ.val());
		}
	}else{
		//验证码登录
		var $phone = $("#phone");
		var $yzmText = $("#yanZhengMaText");
		if($phone.val().length <11) {
			layui.layer.msg("手机号输入错误！");
			$phone.focus();
			return;
		}else if(isNull($yzmText.val())){
			layui.layer.msg("验证码不能为空！");
			$yzmText.focus();
			return;
		}else if($yzmText.val() == getItems("yanZhengMa") ){
			layui.layer.msg("登录成功！");
			setItems("zukePhone",$phone.val());
			//setItems("zukeSFZ",paw);
			//已登录
			if(isNull(strFormat(getItems("zukePhone")))){
				//$("#gerenzhongxin").attr("href","login.html");
				$("#gerenzhongxin").html("登录/注册")
			}else{
				//$("#gerenzhongxin").attr("href","geRenCenter.html");
				$("#gerenzhongxin").html($phone.val());
			}
			window.location.href="geRenCenter.html";
		}else{
			layui.layer.msg("验证码输入错误！");
		}
	}

});
//验证码短信接口
function sendLoginCode(phoneArg,codeArg) {
	var data_json = {
		method: "sendMSGInfoCode",
		params: {
			gcid:gcid,
			phone: phoneArg,
			code: codeArg
		}
	};
	$.ajax({
		url: ipstr + '/message/request.action',
		type: 'post',
		dataType: 'jsonp',
		data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
		jsonp: "callback",
		jsonpCallback: "sendMSGInfoCode",
		success: function(json) {
			if (json.status.code == 200) {
				//倒计时长
				loginCounter(60);
			} else{
				alert("服务器繁忙，稍后再试!");
			}
		}
	});
}
//验证身份证账号
function getlogin(uid, paw) {
	var data_json = {
		method: "zukeLogin",
		params: {
			"zukePhone": uid,
			"zukeSFZ": paw
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
		success: function (json) {
			if (json.status.code == 200) {
				//layui.layer.msg("登录成功！");
				setItems("zukePhone",uid);
				setItems("zukeSFZ",paw);
				if(json.result.list.length > 0){
					//已登录
					if(isNull(strFormat(getItems("zukePhone")))){
						//$("#gerenzhongxin").attr("href","login.html");
						$("#gerenzhongxin").html("登录/注册")
					}else{
						//$("#gerenzhongxin").attr("href","geRenCenter.html");
						$("#gerenzhongxin").html(uid);
					}
					window.location.href="geRenCenter.html";
				}else{
					layui.layer.msg("手机号或身份证错误！");
				}
				//setItems("zukeId",json.result.list[0]["id"]);
			}
		}
	});
}