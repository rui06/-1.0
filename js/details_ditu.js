var win={loaded:function(){$.timeHover(".u-select"),$("img").lazyload({effect:"fadeIn",threshold:200,skip_invisible:!1})},setHeader:function(){var e="";win.getCookie("username")?0==$(".J_userCenter").size()&&($(".J_headerNav").find(".J_login").remove(),e+='<li class="J_userCenter">',e+='<em class="ico ico-user-g fl mr-5"></em> 我的住好点',e+="<ul>",e+='<em class="ico ico-userArrow-up"></em>',e+='<li><a href="/account">个人中心</a></li>',e+='<li><a href="/account/needrooms">我的预约</a></li>',e+='<li><a href="/account/room/collections">我的收藏</a></li>',e+="<li><span></span></li>",e+='<li><a href="javascript:;" onclick="win.logout();">退出登录</a></li>',e+="</ul>",e+="</li>",$(".J_headerNav").append(e),$.timeHover(".J_userCenter")):0==$(".J_login").size()&&($(".J_headerNav").find(".J_userCenter").remove(),e+='<li class="J_login">',e+='<a href="javascript:;" onclick="win.login(0);">登录</a>',e+="<span>/</span>",e+='<a href="javascript:;" onclick="win.login(1);">注册</a>',e+="</li>",$(".J_headerNav").append(e))},getCookie:function(e){_name=e||"csrftoken";var n=null;if(document.cookie&&""!=document.cookie)for(var i=document.cookie.split(";"),o=0;o<i.length;o++){var r=jQuery.trim(i[o]);if(r.substring(0,_name.length+1)==_name+"="){n=decodeURIComponent(r.substring(_name.length+1));break}}return n},getFormData:function(e){var n=$(e).serializeArray(),i={};return $.each(n,function(e,n){i[n.name]=n.value}),i},getPar:function(e){var n=document.location.href,i=n.indexOf(e+"=");if(-1==i)return!1;var o=n.slice(e.length+i+1),r=o.indexOf("&");return-1!=r&&(o=o.slice(0,r)),o=decodeURIComponent(o)},logout:function(){$.get("/logout",{},function(){window.location.href="/"})},needroom:function(){var e=win.getCookie("username")?587:709;$(".J_modal").ms_modalPicker({body:'<iframe src="/needroom" class="loading" scrolling="no" frameborder="0" width="850" height="'+e+'"></iframe>'})},watchroom:function(e){var n=win.getCookie("username")?418:540;$(".J_modal").ms_modalPicker({body:'<iframe src="/watchroom?id='+e+'" class="loading" scrolling="no" frameborder="0" width="850" height="'+n+'"></iframe>'})}};$(function(){win.loaded(),win.setHeader(),$(".entrust_room").on({mouseenter:function(){$(".entrust_room_content").fadeIn(250)},mouseleave:function(){$(".entrust_room_content").fadeOut(250)}})}),$.hover=function(e,n){var i=n||"hover";$(e).hover(function(){$(this).addClass(i)},function(){$(this).removeClass(i)})},$.timeHover=function(e,n){var i=n||"hover",o=null;$(e).hover(function(){var e=$(this);o=setTimeout(function(){e.parent().children().removeClass(i),e.addClass(i)},100)},function(){$(this).removeClass(i),o&&clearTimeout(o)})},$.tab=function(e,n,i,o){$(n).children("li").hide();var r=o||0;$(e).find("li:eq("+r+")").addClass("current").show(),$(n).find("li:eq("+r+")").show(),$(e).children("li").on(i,function(){$(this).addClass("current").siblings("li").removeClass("current");var i=$(e).children("li").index(this);return $(n).children().eq(i).fadeIn().siblings().hide(),!1})};