
var sidebarOpen = false;
function handleRequest(request){
	
	if (request.callFunction == "toggleSidebar") {
		if(sidebarOpen){
			toggleSidebar();
		}else{
			chrome.runtime.sendMessage({message: 'tokenValidRequest'}, function(response){
				if(response == 'success'){
					saveHtml = saveHtml2
					myGuideBookHtml = myGuideBookHtml2
					loginOutHtml = logoutHtml;
				}else{
					saveHtml = '';
					myGuideBookHtml = '';
					loginOutHtml = loginHtml;
				}
				toggleSidebar();
			});
		}
		
	}else if(request.callFunction == "insertImage"){
		//https://imgur링크를 src에 넣으면 pdf에 이미지가 저장이 안됨   http:// 는 됨 --?
		var imgsrc = (request.url).replace('https://','http://');
		var img = document.createElement('img'); 
        img.setAttribute('src', imgsrc);
		document.getElementById('my-editor').appendChild(img)
	}

}

chrome.extension.onRequest.addListener(handleRequest);
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
		var extViewJs = chrome.runtime.getURL('/view/js/bootstrap3.3.6.js');
		$('head').append($('<link>')
			.attr("rel","stylesheet")
			.attr("type","text/css")
			.attr("href", extViewCss_pcc));
		$('head').append($('<script>')
			.attr("type","text/javascript")
			.attr("charset","utf-8")
			.attr("src", extViewJs));
		
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
		sidebar.id = "mySidebar";
		sidebar.innerHTML = "\
		<ul id='pcss3mm' class='pcss3mm'>\
				<!-- home -->\
				<li>\
					<a href='#'><i class='icon-home'></i>Home</a>\
				</li>\
				<!--/ home -->\
				<!-- 저장 -->\
				"+saveHtml+"\
				"+myGuideBookHtml+"\
				<!--/ share -->\
				<!-- pin or unpin -->\
				"+loginOutHtml+"\
				<!--/ pin or unpin -->\
			</ul>\
		<iframe id='my_iframe' style='display:none;'></iframe>\
		<ul class='pagination' id='pageNaviii'>\
		<li class='active'><a href='#' >1</a></li>\
		<li id='createPage'><a href='#'>+</a></li>\
		</ul>\
		<input type='button' id='btn1' value='총길이'>\
		<input type='button' id='btn2' value='스토리지삭제'>\
		<input type='button' id='btn3' value='페이지삭제'>\
		<input type='button' id='btn10' value='요청'>\
		<input type='button' id='btn110' value='파이어베이스 요청'>\
		<input type='button' id='sendMessage' value='메세지 보내기'>\
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
		document.body.appendChild(sidebar);
		sidebarOpen = true;
		
		chrome.runtime.sendMessage({message: "sidebar"}, null);

		//확장이 로딩되는 모습을 안보여주기 위함
		$('#mySidebar').hide();		
		
	}
}



{/* <li><a href='#'>&laquo;</a></li>\
<li><a href='#'>&raquo;</a></li>\ */}



var saveHtml2 = "\
<li class='dropdown'>\
<a href='#'><i class='icon-briefcase'></i>저장</a><b></b>\
<div class='grid-container3'>\
	<ul>\
		<li id='extGBE-saveToLocal'><a href='' onclick='return false'><i class='icon-lemon'></i>로컬저장</a></li>\
		<li id='extGBE-saveToServer'><a href='' onclick='return false'><i class='icon-globe'></i>서버저장</a></li>\
		<li id='extGBE-saveToPDF'><a href='#'><i class='icon-th-large'></i>PDF저장</a></li>\
	</ul>\
</div>\
</li>\
"

var myGuideBookHtml2 = "\
<!-- 내 가이드북 -->\
<li class='dropdown'>\
	<a href='#'><i class='icon-briefcase'></i>내 가이드북</a><b></b>\
	<div class='grid-container3'>\
		<ul>\
			<li><a href='#'><i class='icon-lemon'></i>로컬저장</a></li>\
			<li><a href='#'><i class='icon-globe'></i>서버저장</a></li>\
			<li><a href='#'><i class='icon-th-large'></i>PDF저장</a></li>\
		</ul>\
	</div>\
</li>\
<!--/ 공유 -->\
<li class='right dropdown'>\
	<a href='#'><i class='icon-bullhorn'></i>Share</a><b></b>\
	<div class='grid-container3'>\
		<ul>\
			<li><a href='#'><i class='icon-twitter'></i>Twitter</a></li>\
			<li><a href='#'><i class='icon-facebook-sign'></i>Facebook</a></li>\
			<li><a href='#'><i class='icon-pinterest'></i>Pinterest</a></li>\
			<li><a href='#'><i class='icon-envelope-alt'></i>Email</a></li>\
		</ul>\
	</div>\
</li>\
"

var loginHtml = "<li class='right' id='extGBE-login'>\
<a href='' onclick='return false' ><i class='icon-bullhorn'></i>로그인</a><b></b>\
</li>";
var logoutHtml = "<li class='right' id='extGBE-logout'>\
<a href='' onclick='return false' ><i class='icon-bullhorn'></i>로그아웃</a><b></b>\
</li>";










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