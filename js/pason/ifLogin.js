/**
 * Created by LW on 2016/7/26.
 */
$(function(){
    //验证是否登录
    if(isLogin()){
        var phone = getItems("zukePhone");
        var sfz = getItems("zukeSFZ");
        //判断是否是提交成功后返回投诉列表
        var yeName=GetQueryString("name");
        if(yeName=="tousu"){
            var gcid=GetQueryString("gcid");
            var pageNo=GetQueryString("pageNo");
            var pageSize=GetQueryString("pageSize");
            var complainantPhone=GetQueryString("complainantPhone");
            var indentNumber=GetQueryString("indentNumber");
            var contractConfigNo=GetQueryString("contractConfigNo");
            var taiZhangNo=GetQueryString("taiZhangNo");
            var fangJianName=GetQueryString("fangJianName");
            var chengJiaoRenIds=GetQueryString("chengJiaoRenIds");
            gettslist(gcid,pageNo,pageSize,complainantPhone,indentNumber);
            return;
        }else if(yeName=="weixiu"){
            var pageNo=GetQueryString("pageNo");
            var pageSize=GetQueryString("pageSize");
            var customerCalls=GetQueryString("customerCalls");
            var contractNumber=GetQueryString("contractNumber");
            var houseid=GetQueryString("houseid");
            getwxlist(pageNo,pageSize,customerCalls,contractNumber,houseid);
            return;
        }else if(yeName=="baojie"){
            var contractNumber=GetQueryString("contractNumber");
            var parameter=GetQueryString("parameter");
            var houseId=GetQueryString("houseId");
            getbjlist(contractNumber,parameter,houseId);
            return;
        }else{
            getzukeinfo(phone,sfz);
        }
    }
});
