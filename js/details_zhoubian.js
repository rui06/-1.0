var currentJS = {
    loaded: function () {
        win.getCookie("username") && $.get("/account/room/collected", {room_id: $(".J_collection").attr("data-id")}, function (a) {
            1 == a.status && $(".J_collection").addClass("checked")
        }, "json");
        var a = $(".J_side"), e = a.offset().top;
        $(window).bind("scroll resize", function () {
            $(document).scrollTop() >= e ? a.css({
                position: "fixed",
                top: 0,
                left: $(window).width() / 2 + 310
            }) : a.css({position: "relative", top: "auto", left: "auto"})
        })
    }
};
$(function () {
    function a(a, e, n) {
        $.ajax({
            type: "GET",
            url: "http://api.map.baidu.com/place/v2/search",
            dataType: "jsonp",
            data: {
                query: e,
                location: n_lat + "," + n_lng,
                radius: 1500,
                page_size: 20,
                output: "json",
                scope: 2,
                ak: baiduKey
            },
            success: function (e, n, o) {
                function i(a, e) {
                    e.addEventListener("click", function (e) {
                        t(a, e)
                    })
                }

                function t(e, n) {
                    var o = n.target, i = new BMap.Point(o.getPosition().lng, o.getPosition().lat), t = new BMap.InfoWindow(e, s);
                    a.openInfoWindow(t, i)
                }

                if ("ok" == e.message) {
                    var s = {width: 120, height: 70, enableMessage: !0};
                    $.each(e.results, function (e, n) {
                        var o = new BMapLib.RichMarker("<label class='mapIcon0'></label>", new BMap.Point(n.location.lng, n.location.lat));
                        window.markerArry.push(o);
                        var t = "<p style='color:#40c2ff;font-size:14px;font-weight:bold;margin-bottom:2px;'>" + n.name + "</p><span style='color:#777778;font-size:12px;'>" + n.address + "</span>";
                        a.addOverlay(o), i(t, o)
                    }), $(".mapIcon0").parent().css({background: "none"})
                } else console.log("抱歉服务器错误！")
            }
        })
    }

    currentJS.loaded(), $(".J_preview").ms_preview(), $(".actionWrap .lineSearch ul").on("click", "li", function () {
        $(this).find("i").hasClass("checked") || ($(".actionWrap .lineSearch ul li i").removeClass("checked"), $(this).find("i").addClass("checked"))
    }), $("li.empty i.goto").click(function () {
        location.href = "/room/" + $(this).attr("data")
    }), $(".J_collection").on("click", function () {
        if (win.getCookie("username")) {
            var a;
            _this = $(this), a = {room_id: _this.attr("data-id")}, _this.hasClass("checked") && (a.type = "delete"), a.csrfmiddlewaretoken = win.getCookie(), $.post("/account/room/collections", a, function (a) {
                _this.toggleClass("checked")
            }, "json")
        } else win.login()
    }), $(".mapWrap li").click(function () {
        $(".mapWrap li").removeClass("current"), $(this).addClass("current"), $(".map").removeClass("dn"), 1 == $(this).index() ? $("#map").addClass("dn") : $("#allMap").addClass("dn")
    });
    var e = new BMap.Panorama("allMap");
    e.setPosition(new BMap.Point(n_lng, n_lat)), window.markerArry = [], window.map = new BMap.Map("map", {
        enableMapClick: !1,
        minZoom: 10
    });
    var n = new BMap.Point(n_lng, n_lat);
    window.map.centerAndZoom(n, 17), window.map.disableScrollWheelZoom();
    var o = new BMapLib.RichMarker("<label class='mapIcon'></label>", new BMap.Point(n_lng, n_lat));
    window.map.addOverlay(o), $(".mapIcon").parent().css({background: "none"});
    var i = 14 * n_name.length / 2 - 16, t = {
        position: n,
        offset: new BMap.Size(-i, -24)
    }, s = new BMap.Label(n_name, t);
    s.setStyle({
        color: "#49bff5",
        fontSize: "14px",
        height: "20px",
        border: "0",
        lineHeight: "20px",
        fontFamily: "黑体"
    }), s.disableMassClear(), window.map.addOverlay(s), $(".actionWrap ul.action").on("click", "li", function () {
        if ($(this).find("i").hasClass("checked") || ($(".actionWrap ul.action li").removeClass("current"), $(".actionWrap ul.action li i").removeClass("checked"), $(this).addClass("current").find("i").addClass("checked")), $(".BMap_pop,.BMap_shadow").hide(), $.each(window.markerArry, function (a, e) {
                map.removeOverlay(e)
            }), $(this).hasClass("default"))window.map.centerAndZoom(n, 16); else {
            var e = $(this).find("span").attr("data-query");
            a(window.map, e)
        }
    }), $("#searchBtn,.lineSearch ul li").click(function (a) {
        var e = $("#searchInput").val(), n = $(a.target).attr("data-type");
        "searchBtn" === a.target.id && (n = $(".lineSearch .checked").attr("data-type"));
        var o = "";
        if ("" != e) {
            if ("transit" == n) {
                var i = new BMap.TransitRoute(map, {renderOptions: {map: window.map, panel: "r-result"}});
                o = i.search(n_name, e)
            } else if ("driving" == n) {
                var t = new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: !0}});
                o = t.search(n_name, e)
            } else {
                var s = new BMap.WalkingRoute(map, {
                    renderOptions: {
                        map: window.map,
                        panel: "r-result",
                        autoViewport: !0
                    }
                });
                o = s.search(n_name, e)
            }
            $("#r-result").removeClass("dn")
        }
    })
});