// function send(e) {
//     chrome.extension.sendMessage(e, function() {})
// }

function start() {

    function e(e) {//mouse move
        if (n !== e.target) {
            "A" == e.target.tagName && $(e.target).attr("href", "javascript:void(0);").attr("onclick", "javascript:void(0);"), 
            n = e.target, s.top = -window.scrollY, s.left = -window.scrollX;
            for (var t = e.target; t !== document.body;) 
                s.top += t.offsetTop, s.left += t.offsetLeft, t = t.offsetParent;
            s.width = n.offsetWidth, s.height = n.offsetHeight, 
            outline.style.top = s.top - BORDER_THICKNESS + "px", outline.style.left = s.left - BORDER_THICKNESS + "px", 
            outline.style.width = s.width + "px", outline.style.height = s.height + "px", 
            outline.style.pointerEvents = "none", s.top = $(e.target).offset().top - BORDER_THICKNESS, 
            s.left = $(e.target).offset().left - BORDER_THICKNESS
        }
    }

    function t(n) { //mouse up 
        // var target = document.getElementById('target');
        // alert(n.target.innerText);
        // $('#my-editor').trumbowyg('execCmd', {
        //     cmd: 'insertText',
        //     param: 'TextToInsert',
        //     forceCss: false,
        // });
        // $(getShadowEl('.trumbowyg-undo-button')).execCommand('undo', false, null);
        // $(getShadowEl('#my-editor')).on('tbwinit', function() { console.log('INIT') });
        var html = $(getShadowEl('#my-editor')).html();
        // console.log(html)
        var imgHtml = '';
        $($(n.target.outerHTML).find('img')).each(function(index, item){ 
            imgHtml += item.outerHTML
        })

        $($(n.target.outerHTML).find('div')).each(function(index, item){ 
            var imgUrl = $(item.outerHTML).css('background-image');
            if(imgUrl && imgUrl!='none'){
                console.log(imgUrl)
                var itemHtml = imgUrl.substring(5, imgUrl.length-2)
                imgHtml +=  "<img src="+itemHtml+"> " 

            }
        })

        $(getShadowEl('#my-editor')).trumbowyg('html', html+n.target.innerText+imgHtml);
        $(getShadowEl('#my-editor')).trigger('keyup');
        // $(getShadowEl('#my-editor')).trumbowyg('html');append($(n.target.outerHTML).find('img'))
        // $(getShadowEl('#my-editor')).append();
        return "IFRAME" == n.target.tagName ? !1 : void("true" === flashSound ? (o(), $(".domElements div").css({
            background: "rgba(255, 255, 255, 0.5)"
        }), setTimeout(function() {
            $(".domElements div").animate({
                background: "rgba(255, 255, 255, 0)"
            }, 200, function() {
                // $(".domElements").remove(), document.body.removeEventListener("mousemove", e, !1), document.body.removeEventListener("mouseup", t, !1), setTimeout(function() {
                //     send({
                //         type: "up",
                //         dimensions: s
                //     }), setTimeout(function() {
                //         window.location.reload()
                //     }, 500)
                // }, 200)
            })
        }, 100)) : ($(".domElements div").css({
            background: "rgba(255, 255, 255, 0.5)"
        }), setTimeout(function() {
            $(".domElements div").animate({
                background: "rgba(255, 255, 255, 0)"
            }, 200, function() {
                // $(".domElements").remove(), document.body.removeEventListener("mousemove", e, !1), document.body.removeEventListener("mouseup", t, !1), setTimeout(function() {
                //     send({
                //         type: "up",
                //         dimensions: s
                //     }), setTimeout(function() {
                //         window.location.reload()
                //     }, 500)
                // }, 200)
            })
        }, 100)))
    }

    function o() {
        $("body").append('<audio style="display:none;" controls id="capture-flash"><source src="http://d3jbf8nvvpx3fh.cloudfront.net/voila/_resource/web_extension/sound/capture_click.mp3" type="audio/mpeg"></audio>');
        var e = document.getElementById("capture-flash");
        e.play()
    }

    // var tags = $("body").find("a")
    // console.log(tags)

    $('a').click(function(e)
    {
       e.preventDefault();
    });

    // .off("click")
    // $("a").off()
    // $(document).ready(function($) {
    //     $('a').click(function(e) {
    //         e.preventDefault();
    //     });
    // });

    overlay || (overlay = document.createElement("div"), overlay.className = "domElements", overlay.style.position = "fixed", overlay.style.top = "0px", overlay.style.left = "0px", overlay.style.zIndex = "9999", overlay.style.pointerEvents = "none", outline = document.createElement("div"), outline.style.position = "fixed", outline.style.border = BORDER_THICKNESS + "px solid rgba(175, 83, 205, 1)", outline.style.zIndex = "9999", overlay.appendChild(outline)), overlay.parentNode || (document.body.appendChild(overlay), 
    document.body.addEventListener("mousemove", e, !1)
    ,setTimeout(function(){
        document.body.addEventListener("mouseup", t, !1)

    }, 500)
    );
    var n, s = {};
    window.addEventListener("keydown", function(o) {
        o = o || window.event, 27 == o.keyCode && (document.body.removeEventListener("mousemove", e, !1), document.body.removeEventListener("mouseup", t, !1), $(".domElements").remove(), 		$("#mySidebar").show())
    }, !1)
}

function destroy_DOM() {
    document.body.removeEventListener("mousemove", start.mousemove, !1), document.body.removeEventListener("mouseup", start.mouseup, !1), $(".domElements").remove()
}
var flashSound = "";
chrome.extension.onRequest.addListener(function(e, t, o) {
    "start" === e.type ? (flashSound = e.flashSound, $(".domElements div").css({
        background: "none"
    }), start()) : "destroy" === e.type && destroy_DOM(), o({})
});
var BORDER_THICKNESS = 1,
    overlay, outline, flag = !0;