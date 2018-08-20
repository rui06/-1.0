//获取人物志id
var $id = GetQueryString("id");
//人物志详情
rwzDetail($id);
function rwzDetail($id) {
    var data_json = {
        "gcid":gcid,
        "params":{
            "id":$id
        }
    };
    var renWzDetail = "";
    // $.ajax({
    //     url: ipstr + '/webMangerTitleInfo/request.action',//  /house/request.action
    //     type: 'post',
    //     dataType: 'jsonp',
    //     data: toRequestData(data_json),
    //     jsonp: "callback",
    //     jsonpCallback: "webGetInfo",
    //     success: function (json) {
    //         if (json.status.code == 200) {
    //             renWzDetail += '<h3><strong>'+json.result.titleName+'</strong><span>'+json.result.titleTwoName+'</span></h3>';
    //             renWzDetail += '<span class="rwzTime">'+json.result.toCt+'</span>';
    //             $("#rwzDetails").html(renWzDetail);
    //             $("#iframeCon").html(json.result.note);
    //         }
    //     }
    // });
    $.ajax({
        url: ipstr1 + '/v2/officialWebsit/hot_events/get_by_id',
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        success: function (json) {
            if (json.status.code == 200) {
                renWzDetail += '<h3><strong>'+json.result.name+'</strong></h3>';
                renWzDetail += '<span class="rwzTime">'+json.result.ct+'</span>';
                $("#rwzDetails").html(renWzDetail);
                $("#iframeCon").html(json.result.content);
            }
    }})
}