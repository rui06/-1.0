function submitWenTi($conInput,$conPhone){
    var dataJson={
        method:"saveOrUpdate",
        params:{
            "gcid":gcid,
            "source":"租户",
            "sbumitquestion":$conInput.val(),
            "submitPeople":strFormat(getItems("zukeName")),
            "submitPeoplePhone":$conPhone.val()
        }
    };
    $.ajax({
        url : ipstr+'/tableOnlineAnswer/request.action',
        type:"post",
        dataType:"jsonp",
        data:toRequestData(dataJson),
        beforeSend:function(XMLHttpRequest){
            //加载前
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp:"callback",
        jsonpCallback:"saveOrUpdate",
        success:function(jsonp){
            if(jsonp.status.code == 200){
                layui.layer.closeAll();
                layui.layer.msg("反馈成功，请耐心等待管家与您联系!");
                $conInput.val("");
                $conPhone.val("");
            }else{
                layui.layer.closeAll();
                alert(jsonp.status.msg);
            }
        }
    });
}