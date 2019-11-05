
function handleRequest(request){
	if (request.callFunction == "toggleSidebar") {
		toggleSidebar();
	}else if(request.callFunction == "insertImage"){
		//https://imgur링크를 src에 넣으면 pdf에 이미지가 저장이 안됨   http:// 는 됨 --?
		var imgsrc = (request.url).replace('https://','http://');
		var img = document.createElement('img'); 
        img.setAttribute('src', imgsrc);
		document.getElementById('my-editor').appendChild(img)
	}

}

chrome.extension.onRequest.addListener(handleRequest);
var sidebarOpen = false;
function toggleSidebar() {
	if(sidebarOpen) {
		var el = document.getElementById('mySidebar');
		el.parentNode.removeChild(el);
		sidebarOpen = false;
	}
	else {
		var sidebar = document.createElement('div');

		sidebar.id = "mySidebar";
		sidebar.innerHTML = "\
		<iframe id='my_iframe' style='display:none;'></iframe>\
		<ul class='pagination' id='pageNaviii'>\
		<li class='active'><a href='#' >1</a></li>\
		<li id='createPage'><a href='#'>+</a></li>\
		</ul>\
		<input type='button' id='btn1' value='총길이'>\
		<input type='button' id='btn2' value='스토리지삭제'>\
		<input type='button' id='btn3' value='페이지삭제'>\
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
		
		
	}
}



{/* <li><a href='#'>&laquo;</a></li>\
<li><a href='#'>&raquo;</a></li>\ */}















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