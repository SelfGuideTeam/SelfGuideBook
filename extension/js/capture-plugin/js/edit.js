$(document).ready(function() {
    var e = "Unknown OS"; - 1 != navigator.appVersion.indexOf("Win") && (e = "Windows"), -1 != navigator.appVersion.indexOf("Mac") && (e = "MacOS"), "Windows" == e && ($("#save-to-voila").remove(), $(".theme-btn").css({
        width: "96%"
    }), $(".save-btn .icon").css({
        margin: "0px 0px 0px 50px"
    }), $("#iframe").attr("src", "https://www.globaldelight.net/voila_web_extension/advertise_for_windows.php")), $("#iframe").on("load", function() {
        $("#loader").hide()
    })
}), $(function() {
    function e() {
        $("#editcanva").width(l.width()).height(l.height()), r = $("#editcanva").canvasPaint(), r.loadBackgroundImage(i, function() {
            $("#loadingDiv").hide();
            var e = document.getElementById("canvasfon");
            $("#image_dimensions").text(e.width + " x " + e.height);
            var a = document.getElementById("canvasbg"),
                o = document.createElement("canvas");
            o.width = e.width, o.height = e.height;
            var r = o.getContext("2d");
            r.drawImage(e, 0, 0), r.drawImage(a, 0, 0);
            var i = (new Date).getTime() + "screenshot.",
                s = localStorage.format || "png";
            i += s, c = o.toDataURL("image/" + s, localStorage.imageQuality / 100); {
                var d = chrome.extension.getBackgroundPage().screenshot;
                d.path + i
            }
            d.createBlob(c, i, function(e) {
                var a = (e / 1e3).toFixed(2);
                1e3 > a ? a = a.toString().replace(",", ".").replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + " KB" : (a = (a / 1024).toFixed(2), a = a.toString().replace(",", ".").replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + " MB"), $("#image_size").text(a)
            });
            var m = d.getFileName(g, !0),
                h = m.split(".png");
            $("#image_name_text").val(h[0]), $("#filename_ext").text("." + s), $("#image_url").text(t(localStorage.url));
            var u = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"),
                v = new Date,
                w = v.getDate(),
                p = v.getMonth(),
                f = v.getFullYear();
            $("#image_date").text(u[p] + " " + w + " " + f + ", " + n()), l.height() >= 800 && $("#imageedit").css({
                position: "relative"
            })
        }), a(), $("#canvasbg, #canvascurrent").hide(), window.devicePixelRatio >= 2 && $("#editcanva").css({
            zoom: "50%"
        })
    }

    function a() {
        $("#save-img"), $("#background");
        $("#save-image").click(function() {
            var e = document.getElementById("canvasfon"),
                a = document.getElementById("canvasbg"),
                t = document.createElement("canvas");
            t.width = e.width, t.height = e.height;
            var n = t.getContext("2d");
            n.drawImage(e, 0, 0), n.drawImage(a, 0, 0);
            var o = $("#imgfordownload"),
                r = (new Date).getTime() + "screenshot.",
                i = localStorage.format || "png";
            r += i, c = t.toDataURL("image/" + i, localStorage.imageQuality / 100);
            var g = chrome.extension.getBackgroundPage().screenshot,
                l = g.path + r;
            g.createBlob(c, r, function() {
                o.attr("href", l);
                var e = chrome.extension.getBackgroundPage().screenshot;
                e.download({
                    url: $("#imgfordownload").attr("href"),
                    pageinfo: $("#image_name_text").val() + $("#filename_ext").text()
                })
            })
        }), 
        $("#insert-image").click(function() {
        }), 
        $("#save-to-imgur").click(function() {
            $("#iframe").css({
                "margin-bottom": "178px"
            });
            var e = document.getElementById("canvasfon"),
                a = document.getElementById("canvasbg"),
                t = document.createElement("canvas");
            t.width = e.width, t.height = e.height;
            var n = t.getContext("2d");
            n.drawImage(e, 0, 0), n.drawImage(a, 0, 0);
            var o = ($("#imgfordownload"), (new Date).getTime() + "screenshot."),
                r = localStorage.format || "png";
            o += r, 

            c = t.toDataURL("image/" + r, localStorage.imageQuality / 100) 
            c = c.substring(22)

            var i = chrome.extension.getBackgroundPage().screenshot,
                l = i.getFileName(g, !0);
            l = $("#image_name_text").val() + $("#filename_ext").text();
            $.ajax({
                url: "https://api.imgur.com/3/image",
                headers: {
                    'Authorization': 'Client-ID 1264088c861551b'
                },
                type: "POST",
                data: {
                    'image': c,
                    'type': 'base64', 
                    'title': 'image'
                },
                success: function(data) {
                    // imageSelected = null;
                    // chrome.tabs.create({
                    //     url: data.data.link
                    // });

                    var e = chrome.extension.getBackgroundPage().screenshot;
                    e.insertImage({
                        url: data.data.link
                    })
                    chrome.tabs.getCurrent(function(tab) {
                        chrome.tabs.remove(tab.id, function() { });
                    });

                },
                error: function(e) {
                    var a = $.parseJSON(e.responseText);
                    alert(a.error);
                }
            });
        })
    }

    function t(e) {
        var e = $.trim(e),
            a = e.split("/"),
            t = a[0] + "//" + a[2];
        return t
    }

    function n() {
        var e = new Date,
            a = e.getHours(),
            t = e.getMinutes(),
            n = a >= 12 ? " pm" : " am";
        a %= 12, a = a ? a : 12, t = 10 > t ? "0" + t : t;
        var o = a + ":" + t + n;
        return o
    }

    function o() {
        var e = new XMLHttpRequest,
            a = "http://www.globaldelight.com/",
            t = Math.round(1e4 * Math.random());
        e.open("HEAD", a + "?rand=" + t, !1);
        try {
            return e.send(), e.status >= 200 && e.status < 304 ? !0 : !1
        } catch (n) {
            return !1
        }
    } {
        var r, i = localStorage.imgdata,
            g = (localStorage.screenname, JSON.parse(localStorage.pageinfo || "{}")),
            c = null,
            l = $("#imageedit");
        ! function() {
            var e = window.location.href.match(/\?(\w+)$/);
            return e && e[1] || ""
        }()
    }
    1 == o() ? ($("#iframe").show(), $("#bannerNoConnection").hide()) : 0 == o() && ($("#iframe, #loader").hide(), $("#bannerNoConnection").show()), l.load(function() {
        e()
    }), l.attr("src", i)
});