
var sidebarOpen = false;
let tab;

function getShadowEl(element){
	return shadow.querySelector(element);
}


function handleRequest(request, sender, sendResponse){
	if (request.callFunction == "toggleSidebar") {
		tab = request.tab;
		if(sidebarOpen){
			myGuideBooks = undefined;
			toggleSidebar();
		}else{
			chrome.runtime.sendMessage({message: 'tokenValidRequest'}, function(response){
				if(response == 'success'){
					saveHtml = saveHtml2
					myGuideBookHtml = myGuideBookHtml2
					loginOutHtml = logoutHtml;
					isLogined = true;
				}else{
					saveHtml = '';
					myGuideBookHtml = '';
					loginOutHtml = loginHtml;
					isLogined = false
				}
				toggleSidebar();
			});
		}
	}else if(request.callFunction == "insertImage"){
		//https://imgur링크를 src에 넣으면 pdf에 이미지가 저장이 안됨   http:// 는 됨 --?
		var imgsrc = (request.url).replace('https://','http://');
		var img = document.createElement('img'); 
        img.setAttribute('src', imgsrc);
		getShadowEl('#my-editor').appendChild(img)
	}else if(request.callFunction == "getMyGuideBooks"){
		if(sidebarOpen) getMyGuideBooks();
	}

}

chrome.extension.onRequest.addListener(handleRequest);


function changeLoginHtml(){
	$(getShadowEl('#pcss3mm')).empty();
	$(getShadowEl('#pcss3mm')).html(homtHtml+loginHtml);
	$(getShadowEl('#extGBE-login')).click(login);
}

function changeLogoutHtml(){
	$(getShadowEl('#pcss3mm')).empty();
	$(getShadowEl('#pcss3mm')).html(homtHtml+myGuideBookHtml2+saveHtml2+logoutHtml);
	setListeners();
	//$('#extGBE-logout').click(logout);
}





function toggleSidebar() {
	if(sidebarOpen) {
		var el = document.getElementById('mySidebar');
		el.parentNode.removeChild(el);
		sidebarOpen = false;
	}
	else {
		var sidebar = document.createElement('div');
		var extViewCss = chrome.runtime.getURL('/view/assets/bootstrap3.3.6.css');
		var extViewCss_pcc = chrome.runtime.getURL('/view/assets/pcss3mm.css');
		var pdfTestCss = chrome.runtime.getURL('/view/assets/pdfTest.css');
		var extViewJs = chrome.runtime.getURL('/view/js/bootstrap3.3.6.js');

		var trumbowygCss = chrome.runtime.getURL("apis/Trumbowyg-master/dist/ui/trumbowyg.css")
		var editorCss = chrome.runtime.getURL("editorCSS.css")

		

		sidebar.id = "mySidebar";
		document.body.appendChild(sidebar);
		

		shadowEl = document.querySelector("#mySidebar");
		shadow = shadowEl.attachShadow({mode: 'open'});
		// const link = document.createElement("ul");
		// link.innerHTML = $('#pcss3mm').html();
		//shadow.appendChild(link);
		shadow.innerHTML = "\
		<!-- pdf다운로드 -->\
		<iframe id='my_iframe' style='display:none'></iframe>\
		<ul id='pcss3mm' class='pcss3mm'>\
			"+homtHtml+"\
			<!-- 저장 -->\
			"+myGuideBookHtml+"\
			<!-- 저장 -->\
			"+saveHtml+"\
			<!--/ share -->\
			<!-- pin or unpin -->\
			"+loginOutHtml+"\
			<!--/ pin or unpin -->\
		</ul>\
		<h1 style='padding-left:10px; padding:3px;'></h1>\
		<div id='my-editor'></div>\
		";
		sidebar.style.cssText = "\
		position:fixed;\
		top:0px;\
		right:0px;\
		width:350px;\
		height:100%;\
		background:white;\
		z-index:999999;\
		";

		$(shadow).append($('<link>')
			.attr("rel","stylesheet")
			.attr("type","text/css")
			.attr("href", extViewCss_pcc));
		$(shadow).append($('<link>')
			.attr("rel","stylesheet")
			.attr("type","text/css")
			.attr("href", trumbowygCss));
		$(shadow).append($('<link>')
			.attr("rel","stylesheet")
			.attr("type","text/css")
			.attr("href", editorCss));
		$(shadow).append($('<script>')
			.attr("type","text/javascript")
			.attr("charset","utf-8")
			.attr("src", extViewJs));
			

		
		chrome.runtime.sendMessage({message: "sidebar"}, null);
		sidebarOpen = true;

		//확장이 로딩되는 모습을 안보여주기 위함
		//$('#mySidebar').hide();		
	}
}



{/* <li><a href='#'>&laquo;</a></li>\
<li><a href='#'>&raquo;</a></li>\ */}
// <input type='button' id='btn1' value='총길이'>\
// <input type='button' id='btn2' value='스토리지삭제'>\
// <input type='button' id='btn3' value='페이지삭제'>\
// <input type='button' id='btn10' value='요청'>\
// <input type='button' id='btn110' value='파이어베이스 요청'>\
// <input type='button' id='sendMessage' value='메세지 보내기'>\


var myGuideBookHtml2 = "\
<!-- 내 가이드북 -->\
<li class='dropdown' id='extGBE-myGuideBooksli'>\
	<a href='' onclick='return false' id='extGBE-guideBookTitleArea' ><i class='icon-saveOk' id='icon-saveOk'></i>내 가이드북</a><b></b>\
	<div class='grid-container3'>\
		<ul id='myGuideBookList'>\
		</ul>\
	</div>\
</li>\
"

var saveHtml2 = "\
<!-- title -->\
<li id='extGBE-title' class='container1' style='display:none'>\
<a id='extGBE-titleArea' href='' onclick='return false'><i class='icon-home'></i>...</a>\
</li>\
<!--/ title -->\
<li class='dropdown'>\
<a href='' onclick='return false'><i class='icon-briefcase'></i>저장</a><b></b>\
<div class='grid-container2'>\
	<ul>\
		<li id='extGBE-saveToLocal'><a href='' onclick='return false'><i class='icon-lemon'></i>로컬저장</a></li>\
		<li id='extGBE-saveToServer'><a href='' onclick='return false'><i class='icon-globe'></i>서버저장</a></li>\
		<li id='extGBE-saveToPDF'><a href='' onclick='return false'><i class='icon-th-large'></i>PDF저장</a></li>\
	</ul>\
</div>\
</li>\
<li class='dropdown'>\
<a href='' onclick='return false'><i class='icon-briefcase'></i>삭제</a><b></b>\
<div class='grid-container2'>\
	<ul>\
		<li id='extGBE-deleteOnePage'><a href='' onclick='return false'><i class='icon-lemon'></i>현재 페이지</a></li>\
		<li id='extGBE-deleteAllPage'><a href='' onclick='return false'><i class='icon-globe'></i>전체 페이지</a></li>\
	</ul>\
</div>\
</li>\
<!-- 새로고침 -->\
<li class='dropdown'>\
<a href='' onclick='return false' id='extGBE-refreshOneGB'>새로고침</a><b></b>\
<div class='grid-container2'>\
	<ul>\
		<li id='extGBE-refreshAllGB'><a href='' onclick='return false'><i class='icon-lemon'></i>전체 새로고침</a></li>\
	</ul>\
</div>\
</li>\
<!--/ 새로고침 -->\
"


// <!--/ 공유 -->\
// <li class='right dropdown'>\
// 	<a href='#'><i class='icon-bullhorn'></i>Share</a><b></b>\
// 	<div class='grid-container3'>\
// 		<ul>\
// 			<li><a href='#'><i class='icon-twitter'></i>Twitter</a></li>\
// 			<li><a href='#'><i class='icon-facebook-sign'></i>Facebook</a></li>\
// 			<li><a href='#'><i class='icon-pinterest'></i>Pinterest</a></li>\
// 			<li><a href='#'><i class='icon-envelope-alt'></i>Email</a></li>\
// 		</ul>\
// 	</div>\
// </li>\
var homtHtml = "<!-- home -->\
<li class='container1' >\
	<a href='https://fir-ex-63c1a.firebaseapp.com/' target='_blank'><i class='icon-home'></i>Home</a>\
</li>\
<!--/ home -->";

var loginHtml = "<li class='right' id='extGBE-login'>\
<a href='' onclick='return false' ><i class='icon-bullhorn'></i>로그인</a><b></b>\
</li>";
var logoutHtml = "<li class='right' id='extGBE-logout'>\
<a href='' onclick='return false' ><i class='icon-bullhorn'></i>로그아웃</a><b></b>\
</li>";






// var tuiColorPicker_css= chrome.runtime.getURL('/apis/tui-image-editor/css/tui-color-picker.css');
		// var tuiImageEditor_css= chrome.runtime.getURL('/apis/tui-image-editor/tui-image-editor.css')
		// var fabric_js = chrome.runtime.getURL('/apis/tui-image-editor/js/fabric3.3.2.js');
		// var tuiCodeSnippet_js = chrome.runtime.getURL('/apis/tui-image-editor/js/tui-code-snippet.min1.5.0.js');
		// var tuiColorPicker_js = chrome.runtime.getURL('/apis/tui-image-editor/js/tui-color-picker2.2.3.js');
		// var FileSaver_js = chrome.runtime.getURL('/apis/tui-image-editor/js/FileSaver.min1.3.0.js');
		// var tuiImageEditor_js= chrome.runtime.getURL('/apis/tui-image-editor/tui-image-editor.js')
		// var tuiBlackTheme_js = chrome.runtime.getURL('/apis/tui-image-editor/js/theme/black-theme.js')


		// $('head').append($('<link>').attr("type", "text/css").attr("rel", "stylesheet").attr("href", tuiColorPicker_css))
		// $('head').append($('<link>').attr("type", "text/css").attr("rel", "stylesheet").attr("href", tuiImageEditor_css))
		// $('head').append($('<script>').attr("type", "text/javascript").attr("charset", "utf-8").attr("src", fabric_js))
		// $('head').append($('<script>').attr("type", "text/javascript").attr("charset", "utf-8").attr("src", tuiCodeSnippet_js))
		// $('head').append($('<script>').attr("type", "text/javascript").attr("charset", "utf-8").attr("src", tuiColorPicker_js))
		// $('head').append($('<script>').attr("type", "text/javascript").attr("charset", "utf-8").attr("src", FileSaver_js))
		// $('head').append($('<script>').attr("type", "text/javascript").attr("charset", "utf-8").attr("src", tuiImageEditor_js))
		// $('head').append($('<script>').attr("type", "text/javascript").attr("charset", "utf-8").attr("src", tuiBlackTheme_js))
		// $('head').append($('<script>')
		// 	.attr("type","text/css")
		// 	.attr("charset","utf-8")
		// 	.attr("media", "screen,print")
		// 	.attr("src", pdfTestCss));
		
		// <nav class='navbar navbar-default'>\
		// 	<div class='container-fluid'>\
		// 		<div class='navbar-header'>\
		// 		<a class='navbar-brand' href='#'>SPLessons</a>\
		// 		</div>\
		// 		<ul class='nav navbar-nav'>\
		// 		<li><a href='#'>Home</a></li>\
		// 		<li class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown' href='#' >Web Designing <span class='caret'></span></a>\
		// 			<ul class='dropdown-menu'>\
		// 			<li><a href='#'>HTML</a></li>\
		// 			<li><a href='#'>JavaScript</a></li>\
		// 			<li><a href='#'>Bootstrap</a></li>\
		// 			</ul>\
		// 		</li>\
		// 		<li><a href='#'>Web Development</a></li>\
		// 		<li><a href='#'>Databases</a></li>\
		// 		</ul>\
		// 		<ul class='nav navbar-nav navbar-right'>\
		// 		<li><a href='#'><span class='glyphicon glyphicon-user'></span> Sign Up</a></li>\
		// 		<li><a href='#'><span class='glyphicon glyphicon-log-in'></span> Login</a></li>\
		// 		</ul>\
		// 	</div>\
		// </nav>\

		// <iframe id='my_iframe' style='display:none;'></iframe>\
		// <ul class='pagination' id='pageNaviii'>\
		// <li class='active'><a href='#' >1</a></li>\
		// <li id='createPage'><a href='#'>+</a></li>\
		// </ul>\
// sidebar.innerHTML = "\
		// <!-- pdf다운로드 -->\
		// <iframe id='my_iframe' style='display:none'></iframe>\
		// <ul id='pcss3mm' class='pcss3mm'>\
		// 	"+homtHtml+"\
		// 	<!-- 저장 -->\
		// 	"+myGuideBookHtml+"\
		// 	<!-- 저장 -->\
		// 	"+saveHtml+"\
		// 	<!--/ share -->\
		// 	<!-- pin or unpin -->\
		// 	"+loginOutHtml+"\
		// 	<!--/ pin or unpin -->\
		// </ul>\
		// <h1 style='padding-left:10px; padding:3px;'></h1>\
		// <div id='my-editor'></div>\
		// ";
		// sidebar.style.cssText = "\
		// position:fixed;\
		// top:0px;\
		// right:0px;\
		// width:350px;\
		// height:100%;\
		// background:white;\
		// z-index:999999;\
		// ";



		// var menuImage = chrome.runtime.getURL('menu.png');
		// var menuImage1 = chrome.runtime.getURL('sample.jpg');
		// var sideBarImage = chrome.runtime.getURL('Sidebar-Menu.png');
		// var url = chrome.runtime.getURL('js/jquery/jquery.js');
		//var quillUrl = chrome.runtime.getURL('/js/quill-1.3.6/quill.js')
		//var quillSnowUrl = chrome.runtime.getURL('/js/quill-1.3.6/themes/snow.js')
		//var mmyscript = chrome.runtime.getURL('/js/myscript.js');



		// var actualCode = [ 'var toggle = (function () { var visible = false, ele = document.getElementById("mymenu"), btn = document.getElementById("menuBarToggle");function flip() {var display = ele.style.display;ele.style.display = (display === "block" ? "none" : "block");visible = !visible;}btn.addEventListener("click", flip);ele.addEventListener("click", function (e) {e.stopPropagation();});document.addEventListener("click", function (e) {if (visible && e.target !== btn) flip();});ele.style.display = "none";return flip;}());'
		// + 'var slideBar = (function () {ele1 = document.getElementById("mySidebar"), btn1 = document.getElementById("sideBarToggle");function slideInOut() {var webkitTransform = ele1.style.webkitTransform;ele1.style.webkitTransform = (webkitTransform === "translateX(-361px)" ? "translateX(0px)" : "translateX(-361px)");}btn1.addEventListener("click", slideInOut);ele1.addEventListener("click", function (e) {e.stopPropagation();});return slideInOut;}()); ' ].join('\n');
		// var myScript = document.createElement('script');
		// myScript.id= "myScript";
		//myScript.textContent = actualCode;
		//(document.head||document.documentElement).appendChild(myScript);


		// var myScript2 = document.createElement('script');
		// myScript2.id= "myScript2";
		// myScript2.textContent = ""
		// myScript2.textContent = "var quill = new Quill("+aaaaaaa
		// "'#editor-container', {"+
		// "modules: {"+
		// "toolbar: [[{ header: [1, 2, false] }],['bold', 'italic', 'underline'],['image', 'code-block']]}"+
		// ",placeholder: 'Compose an epic...',theme: 'snow'  });";
		//document.body.appendChild(myScript2);