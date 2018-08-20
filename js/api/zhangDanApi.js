//合同缴费列表
function gethtdetail_list($zukeName,$zukePhone,$heTongId) {
    var data_json = {
        method: "getListByPhoneWeb",
        params: {
            "indentChengZuId": $heTongId,
            "zukeName": $zukeName,
            "pageNo": 1,
            "pageSize": 50,
            "gcid": gcid,
            "zukePhone": $zukePhone
        }
    };
    var $zhangDanList = "";
    $.ajax({
        url: ipstr + '/webChengzu/request.action',
        type: 'post',
        dataType: 'jsonp',
        data: toRequestData(data_json),
        beforeSend:function(XMLHttpRequest){
            //加载前
            xhr.setRequestHeader("gcid", gcid);
        },
        jsonp: "callback",
        jsonpCallback: "getListByPhoneWeb",
        success: function (json) {
            if (json.status.code == 200) {
                if(json.result.list.length > 0){
                    $.each(json.result.list,function (n,value) {
                        //展示预计支出，预计收入不展示（type == 2）
                        if(value["type"] == 1){
                            $zhangDanList += '<dl class="zhangDanCon"><dt class="zdXq">';
                            $zhangDanList += '<strong class="zdShijian">'+value["begingTime"]+'－'+value["endTime"]+'<span>'+value["ziDian"]["key"]+'</span></strong>';
                            $zhangDanList += '<span class="zdJiaoKuan">预计交款日期：'+value["predictTime"]+'</span>';
                            //是否支付租金
                            if(isNull(value["gotoTime"])){
                                $zhangDanList += '<span class="zdZhiFu">支付日期：未支付</span>';
                            }else{
                                $zhangDanList += '<span class="zdZhiFu">支付日期：'+value["gotoTime"]+'</span>';
                            }
                            $zhangDanList += '</dt><dd class="zdMoney">'+value["money"]+'元</dd>';
                            //判断租金或押金是否已支付
                            if(value["indentType"] == 2){
                                $zhangDanList += '<dd class="zdZhuangTai">已支付</dd>';
                            }else{
                                $zhangDanList += '<dd class="zdZhuangTai weiZhifu">立即支付</dd>';
                            }
                            $zhangDanList += '</dl>';
                        }
                    });
                }else{
                    $zhangDanList += '<div style="width: 100%; height: 200px; line-height: 200px; font-size: 14px; text-align: center;">赞无账单信息哟！</div>';
                }
                $("#hetongCon").find('li[heTongId="'+$heTongId+'"]').find("div[name='zhangDanList']").html($zhangDanList);
                $(".zdZhuangTai").click(function () {
                    layui.layer.msg('我们正在努力开放"在线预定"功能，敬请期待！');
                    //location.href = "https://auth.alipay.com/login/index.htm";
                });
            }
        }
    });
}
