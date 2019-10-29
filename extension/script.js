
function handleRequest(request){
	if (request.callFunction == "toggleSidebar") {
		toggleSidebar();
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
		// var menuImage = chrome.runtime.getURL('menu.png');
		// var menuImage1 = chrome.runtime.getURL('sample.jpg');
		// var sideBarImage = chrome.runtime.getURL('Sidebar-Menu.png');
		// var url = chrome.runtime.getURL('js/jquery/jquery.js');
		//var quillUrl = chrome.runtime.getURL('/js/quill-1.3.6/quill.js')
		//var quillSnowUrl = chrome.runtime.getURL('/js/quill-1.3.6/themes/snow.js')
		//var mmyscript = chrome.runtime.getURL('/js/myscript.js');


		sidebar.id = "mySidebar";
		sidebar.innerHTML = "\
		<style>\
		#editor-container {height: 700px;}\
		#editor {\
			border: 1px solid #ccc;\
		}\
		#my-editor{\
			height: 700px;\
		}\
		#counter {\
			border: 1px solid #ccc;\
			border-width: 0px 1px 1px 1px;\
			color: #aaa;\
			padding: 5px 15px;\
			text-align: right;\
		}\
		</style>\
		<input type='button' value='캡쳐' id='btn1'>\
		<input type='button' value='초기화' id='btn2'>\
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
		//script.parentNode.removeChild(script);
		chrome.runtime.sendMessage({message: "sidebar"}, null);




	}
}

