//banner动态加载
function getBanner() {
    var data_json = {
        params: {
            equipment: '1',// false number 类型：1.电脑，2.手机
            location: '1',// false number 位置：1，网页端；2，微信端,3.房间详情
            gcid: gcid,// false string 公司id
            departmentId: ''// false string 部门id
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
                    $.each(json.result.list,function (n,value) {
                        var $imageSrc = "";
                        if(value["picUrl"] != ""){
                            $imageSrc = value["picUrl"];
                        }else{
                            $imageSrc = "images/banner/indexBanner/banner001.jpg";
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
                }else{
                    $bannerList += '<div class="slide"><img src="images/banner/indexBanner/banner001.jpg" /></div>';
                    $item += '<a class="cur" stat="item1001" href="javascript:;"></a>';
                }
                $("#slideContent").html($bannerList);
                $("#bannerItem").html($item);
                //重新渲染banner
                initBanner();
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

//人物志
function  renWzList() {
    var data_json = {
        "gcid":gcid,
        "params":{
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
        beforeSend: function (xhr) {
            xhr.setRequestHeader("gcid", gcid);
        },
        success: function (json) {
            if(json.status.code == 200){
                if(json.result.list.length > 0){
                    $.each(json.result.list,function (n,value) {
                        var $images = value["pics"];
                        if($images == ""){
                            $images = "images/renwu.jpg";
                        }
                        renWzList += '<li targerid='+value["id"]+'>';
                        renWzList += '<a href="javaScript:;" title='+value["name"]+'>';
                        renWzList += '<img src="'+$images+'"  alt='+value["name"]+'>';
                        renWzList += '<p>'+value["name"]+'</p>';
                        renWzList += '</a> </li>';
                    });
                    $("#zukeShengHuo").html(renWzList);
                    $("#zukeShengHuo li").click(function () {
                        window.open('renWuZhiDetails.html?id='+$(this).attr("targerid"));
                    });
                }else{
                    renWzList += '<li style="font-size: 16px;">还没有租客生活信息哦！</li>';
                    $("#zukeShengHuo").html(renWzList);
                    $("#zukeShengHuo li").click(function () {

                    });
                }
            }else{
                for(i=0;i<4;i++){
                    renWzList += '<li>';
                    renWzList += '<a href="javaScript:;" title="123456">';
                    renWzList += '<img src="images/img1.jpg" alt="Roeland!">';
                    renWzList += '<p>6789dsf23456787654365ghjhgfdfghgfd09</p>';
                    renWzList += '</a></li>';
                }
                $("#zukeShengHuo").html(renWzList);
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
