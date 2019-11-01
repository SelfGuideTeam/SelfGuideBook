
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
		<style>\
		#editor-container {height: 800px;}\
		#editor {\
			border: 1px solid #ccc;\
		}\
		#my-editor{\
			height: 800px;\
		}\
		#counter {\
			border: 1px solid #ccc;\
			border-width: 0px 1px 1px 1px;\
			color: #aaa;\
			padding: 5px 15px;\
			text-align: right;\
		}\
		.pagination{display:inline-block;padding-left:0;margin:5px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;margin-left:-1px;line-height:1.42857143;color:#337ab7;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{z-index:2;color:#23527c;background-color:#eee;border-color:#ddd}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-top-left-radius:4px;border-bottom-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-top-right-radius:4px;border-bottom-right-radius:4px}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{z-index:3;color:#fff;cursor:default;background-color:#337ab7;border-color:#337ab7}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#777;cursor:not-allowed;background-color:#fff;border-color:#ddd}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-top-left-radius:6px;border-bottom-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-top-left-radius:3px;border-bottom-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-top-right-radius:3px;border-bottom-right-radius:3px}.pager{padding-left:0;margin:20px 0;text-align:center;list-style:none}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;\
		</style>\
		<iframe id='my_iframe' style='display:none;'></iframe>\
		<ul class='pagination'>\
		<li><a href='#'>1</a></li>\
		<li><a href='#'>2</a></li>\
		<li><a href='#'>3</a></li>\
		<li><a href='#'>4</a></li>\
		<li><a href='#'>5</a></li>\
		<li><a href='#'>+</a></li>\
	  	</ul>\
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