//获取人物生活id
var $id = GetQueryString("id");
//人物生活详情
newLifeDetail($id);
function newLifeDetail($id) {
    var data_json = {
        "gcid":gcid,
        "params":{
            "gcid": gcid,
            "id":$id
        }
    };
    var renWzDetail = "";
    $.ajax({
        url: ipstr + '/webMangerTitleInfo/request.action',//  /house/request.action
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp: "callback",
        jsonpCallback: "webGetInfo",
        success: function (json) {
            if (json.status.code == 200) {
                renWzDetail += '<h3><strong>'+json.result.titleName+'</strong><span>'+json.result.titleTwoName+'</span></h3>';
                renWzDetail += '<span class="rwzTime">'+json.result.toCt+'</span>';
                $("#rwzDetails").html(renWzDetail);
                $("#iframeCon").html(json.result.note);
            }
        }
    });
}
