//banner动态加载
function getBanner() {
    var data_json = {
        method: "webGetList",
        params: {
            "pageNo": 1,
            "gcid": gcid,
            "BigType": "1",       //1   web端  2 手机端
            "pageSize": 1,
            "type": "2"            //1  首页   2 租客生活 3 人物日志
        }
    };
    var $bannerList = "";
    var $item = "";
    $.ajax({
        url: ipstr + '/webMangerBannerInfo/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        jsonp: "callback",
        jsonpCallback: "webGetList",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        success: function (json) {
            if (json.status.code == 200){
                if(json.result.list.length > 0){
                    $.each(json.result.list,function (n,value) {
                        var $imageSrc = "";
                        if(value["bannerHref"] != ""){
                            $imageSrc = value["bannerHref"];
                        }else{
                            $imageSrc = "images/banner/indexBanner/banner001.jpg";
                        }
                        $bannerList += '<div class="slide"><img src="'+$imageSrc+'" /></div>';
                        if(n == 0){
                            $item += '<a class="cur" stat="item100'+(n+1)+'" href="javascript:;"></a>';
                        }else{
                            $item += '<a href="javascript:;" stat="item100'+(n+1)+'"></a>';
                        }
                    });
                }else{
                    $bannerList += '<div class="slide"><img src="images/banner/indexBanner/banner001.jpg" /></div>';
                    $item += '<a class="cur" stat="item1001" href="javascript:;"></a>';
                }
                $("#slideContent").html($bannerList);
                $("#bannerItem").html($item);
                //重新渲染banner
                initBanner();
            }
        }
    });
}
//租客生活列表页
function newLiftList() {
    var data_json = {
        "gcid":gcid,
        "params": {
            "name": "",
            "status": "",
            "type": "5",
            "forbidden": "",
            "pageSize": "10",
            "pageNo": "1",
            "sortFields": "",
            "sortType": ""
        }
    };
    var renWzList = "";
    $.ajax({
        url: ipstr1 + '/v2/officialWebsit/hot_events/get_where_list',//  /house/request.action
        type: 'post',
        dataType: 'json',
        data: toRequestData(data_json),
        success: function (json) {
            if(json.status.code == 200){
                if(json.result.list.length > 0){
                    $.each(json.result.list,function (n,value) {
                        //去除行内样式
                        var $regex = /style="[^"]*"/g;
                        var $content = value["content"].replace($regex, '');

                        var $images = value["pics"];
                        if($images == ""){
                            $images = "images/renwu.jpg";
                        }
                        renWzList += '<li><dl><dt><img src="'+$images+'" /></dt>';
                        renWzList += '<dd><h3><strong>'+value["name"]+'</strong></h3><span class="rwzTime">'+value["ct"]+'</span>';
                        renWzList += '<div class="rwzList">' + $content + '</div><a href="renWuZhiDetails.html?id='+value["id"]+'" target="_blank">阅读全文</a>';
                        renWzList += '</dd></dl></li>';
                    });
                }else{
                    renWzList += '<li style="line-height:100px; font-size:20px;text-align: center;">还没有租客生活信息哟！</li>';
                }
                $("#rwzList").html(renWzList);
                $("html").css("");
            }
        }
    });
}
(function($) {
    $.fn.stripHtml = function() {
        var regexp = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
        this.each(function() {
            $(this).html( $(this).html().replace(regexp,'') );
        });
        return $(this);
    }
})(jQuery);
//用法，http://www.outofmemory.cn
$('p').stripHtml();