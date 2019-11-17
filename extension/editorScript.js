//백그라운드 페이지 가져오기
// var bg = chrome.extension.getBackgroundPage(),
//     bgScreencapture = bg.screenshot,
//     option_icon_state = !1;

// window.addEventListener("message", processFn, false);	



// function processFn(event) {
//   var bla = event.data;
//   console.log(event)

//     //console.log(bla)
//   }
// }


// function sendChildMessage() {	
//   document.getElementById("ifr").contentWindow.postMessage('sent message from parent.html', '*');
// }	


$('#my-editor').trumbowyg({
  resetCss: true,
  removeformatPasted: true,
  lang : 'ko',
  tagsToRemove: ['script', 'link'],
  svgPath : chrome.runtime.getURL('/js/Trumbowyg-master/dist/ui/icons.svg'),
  autogrow: true,
  btnsDef: {
    // Create a new dropdown
    image: {
        dropdown: ['insertImage', 'upload'],
        ico: 'insertImage'
    },
    capture: {
      dropdown : ['SelectedArea', 'EntirePage', 'VisiblePage'],
      title: '캡처',
      ico: 'justifyLeft',
      hasIcon: true
    },
    SelectedArea : {
      title: '선택 캡처',
      ico: 'justifyLeft',
      hasIcon: true,
      fn: function(){
        chrome.runtime.sendMessage({message: "selectCapture"}, null);
      }
    },
    EntirePage : {
      title: '전체 캡처',
      ico: 'justifyLeft',
      hasIcon: true,
      fn: function(){
        chrome.runtime.sendMessage({message: "entireCapture"}, null);
      }
    },
    VisiblePage : {
      title: '영역 캡처',
      ico: 'justifyLeft',
      hasIcon: true,
      fn: function(){
        chrome.runtime.sendMessage({message: "domCapture"}, null);
      }
    },
    fullscreen : {
      title: '전체 크기',
      ico: 'fullscreen',
      hasIcon: true,
      fn: function(){
        if($('#mySidebar').css('width')=='350px'){
          $('#mySidebar').css('width', '870px');
        }else{
          $('#mySidebar').css('width', '350px');
        }
        //alert('ggg')
        //chrome.runtime.sendMessage({message: "domCapture"}, null);
      }
    },
    SaveToPdf : {
      title: 'PDF 저장',
      ico : 'fullscreen',
      hasIcon : true,
      fn : function(){
        var html = '';
        pages.toArray().forEach(function(element){
          html+=element;
        });
        printHtmlToPdf('<html><head><link href="https://fonts.googleapis.com/css?family=Nanum+Gothic:400,700,800&display=swap&subset=korean" rel="stylesheet"></head>'+'<body>'+html+'</body>'+'</html>');
      }
    },
    refreshEditor : {
      title : '에디터 초기화',
      ico : 'fullscreen',
      hasIcon : true,
      fn : function(){
        chrome.storage.sync.set({key: ''}, function() {
        });
      }
    }
  },
  btns: [
    ['viewHTML'],
    ['capture'],
    ['undo', 'redo'], // Only supported in Blink browsers
    ['formatting'],
    ['strong', 'em', 'del'],
    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
    ['unorderedList', 'orderedList'],
    ['horizontalRule'], 
    ['fontfamily'],
    ['superscript', 'subscript'],
    ['link'],
    ['image'],
    ['lineheight'],
    ['removeformat'],
    ['SaveToPdf', 'refreshEditor', 'fullscreen']
  ],
  plugins: {
    // Add imagur parameters to upload plugin for demo purposes
    upload: {
        serverPath: 'https://api.imgur.com/3/image',
        fileFieldName: 'image',
        headers: {
            'Authorization': 'Client-ID 1264088c861551b'
        },
        urlPropertyName: 'data.link'
    },
    fontsize: {
      sizeList: [
          '12px',
          '14px',
          '16px'
      ]
    }
  }
});


// $('#my-editor').on('drop',function(e){
//   e.originalEvent.dataTransfer.items[0].getAsString(function(str)
//   {
//     alert(str)
//   })
// })

$('#btn1').click(getTotalContentHeight)

//한페이지당 최대 사이즈는 850px 
//현재 자식의 자식까지 계산해버림 상위 자식만 계산하도록
function getTotalContentHeight(){
  var childrens = $('#my-editor').children();
  var totalHeight = 0;

  $.each(childrens, function (index, item) { 
    totalHeight+= item.offsetHeight
  })

  alert(childrens.size())
  alert(totalHeight);
  if(totalHeight>840){
    $(childrens).last().remove();
    getTotalContentHeight();
  }else{
    return;
  }
  //alert(totalHeight);
}

$('#btn2').click(function(){
  chrome.storage.sync.set({editorPages: null}, function() {
    //console.log('Value is set to ' + $('#my-editor').html());
});

  


})

$('#btn3').click(deletePage);
$('#sendMessage').click(ajaxTest)

$('#createPage').click(createPage);
$('#pageNaviii').click(navi);



//저장된 데이터를 가져와서 입력
//initPages();
getData();
$('#my-editor').blur(setData)
var currentPage = 1;

function setData(){
  //alert($('#my-editor').html())
  pages.setByIndex(currentPage-1, $('#my-editor').html());
  //alert(pages.toArray());
  chrome.storage.sync.set({editorPages: pages.toArray()}, function() {
    //console.log('Value is set to ' + $('#my-editor').html());
  });
}

function getData(){
  var rr= chrome.storage.sync.get(['editorPages'], function (result) {
    pages = new ArrayList();
    if(result.editorPages==null){
      pages.add('')
    }else{
      var currentPage2 = currentPage+1;
      result.editorPages.forEach(function(item, index) {
        pages.add(item);
        if(index!=1){
          $('<li><a href="#">'+currentPage2+'</a></li>').insertBefore('#createPage');
          currentPage2++;
        }
      });
      // pages = result.editorPages;
      // console.log(result.editorPages);
      // alert(pages.get(0))
      // $('#my-editor').html(pages.get(0))
    }
    $('#my-editor').html(pages.get(0))
    //returnData = result.key;
  });
}

function printHtmlToPdf(html) {
  var endpoint = 'https://v2018.api2pdf.com/chrome/html';
  var apikey = 'ab1ce02b-9a63-48c1-b7a5-a2469f2decc9'; //replace this with your own from portal.api2pdf.com
  //다른 언어도 쓰려면 meta charset 명시
  var payload = {
    "html": "<meta charset='UTF-8'>"+html,
    "inlinePdf": false
  };
  $.ajax({
    url: endpoint,
    method: "POST",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(payload),
    cache: false,
    beforeSend: function (xhr) {
        /* Authorization header */
        xhr.setRequestHeader("Authorization", apikey);
    },
    success: function (data) {
      console.log(data.pdf); //this is the url to the pdf
      document.getElementById('my_iframe').src = data.pdf;
    },
    error: function (jqXHR, textStatus, errorThrown) {
    }
  });
}


var currentPage3 = $('#pageNaviii').children().eq(0)
//$(currentPage3).attr('class', '');
function navi(e){
  if(e.target.innerText!='+'){
    $(currentPage3).attr('class', '');
    currentPage3 = $(e.target).closest('li');
    currentPage3.attr('class','active')
    currentPage = e.target.innerText;
    $('#my-editor').html(pages.get(currentPage-1))
  }

}

// function initPages(){
//   pages = new ArrayList;
//   chrome.storage.sync.get(['key'], function (result) {
//     pages.add(result.key);
//   });
// }

function createPage(){
  pages.add('');
  $('<li><a href="#">'+pages.size()+'</a></li>').insertBefore('#createPage');
}

function deletePage(){
  pages.removeAt(currentPage-1);
  currentPage--;
  setData();

  $('#pageNaviii').empty();
  var currentPage2 = 1;
  var rr= chrome.storage.sync.get(['editorPages'], function (result) {
    $('#pageNaviii').append('<li id="createPage"><a href="#">+</a></li>')
    $('#createPage').click(createPage);
    result.editorPages.forEach(function(item, index) {
      //pages.add(item);
      //if(index!=1){
        $('<li><a href="#">'+currentPage2+'</a></li>').insertBefore('#createPage');
        currentPage2++;
      //}
    });
    $('#pageNaviii').children().eq(0).trigger('click');
    //console.log()
  });

  //$('#pageNaviii').children().eq(0).children().eq(0).trigger('click');
  //$('#pageNaviii').children().eq(0).trigger('click');




}

function savePages(){

}

function ajaxTest(){

  chrome.runtime.sendMessage(
    {contentScriptQuery: 'fetchUrl',
     url: 'http:/192.168.6.18:3000/board2/test/test' },
     response => parsePrice(response));

    function parsePrice(text){
      console.log(text)
    }
}

async function saveHtml_Server(){
  // 입력값을 변수에 담고 문자열 형태로 변환
  var title = '';
  while(true){
    if(title==''){
      title = prompt( '가이드북 제목을 입력해 주세요(공백X).', '' );
    }else if(title == null){
      return;
    }else{
      break;
    }
  }

  var html ='';
  pages.toArray().forEach(function(element){
    html+=element;
  });
  var data = {'title' : title,
              'htmlCode' : html };

  chrome.runtime.sendMessage({message: 'guideBookSaveRequest', data : data}, 
  function (response) {
    if(response=='success'){
      alert('서버저장 완료')
    }else{
      alert('서버저장 실패')
    }
    //console.log('Response From API', response);
  });

}

function getMyGuideBooks(){
  chrome.runtime.sendMessage({message: 'guideBookListRequest'}, function(response){
    if(response=='fail'){ //수정
      alert('로그인 먼저 해주세요')
    }else{
      myGuideBooks = response;
      $('#myGuideBookList').empty();
      response.forEach(function (item, index, array) {
        //id='myGuideBookList'
        // <li><a href='#'><i class='icon-lemon'></i>로컬저장</a></li>\
        let guidBook = JSON.parse(item);
        $('#myGuideBookList').append("<li id='guideBook' value="+index+"><a href='' onclick='return false'><i class='icon-lemon'></i>"+guidBook.title+"</a></li>")
        //console.log(item, index);
      });

    }
  })
}

function getChromeStg(key, func1){
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], result => {
      resolve(result)
    });
  });
  // chrome.storage.sync.get([key], function (result) {
  //   func1(result)
  // });
}

async function loginCheck(){
  let accessToken = (await getChromeStg('loginToken')).loginToken.stsTokenManager.accessToken;

  chrome.runtime.sendMessage({message: 'tokenValidRequest', data : accessToken}, 
  function (response) {
    if(response=='success'){
      alert('로그인 완료')
    }else{
      alert('로그인 실패')
    }
    //console.log('Response From API', response);
  });

  //alert(tab);
}


getMyGuideBooks()

// loginCheck();
//listener -----------------------------------------------------




$('#extGBE-login').click(function(){
  chrome.runtime.sendMessage({message: 'login'}, function (response) {
    console.log(response)
    chrome.storage.sync.set({authInfo: response}, function() {
      chrome.runtime.sendMessage({message: 'toggle'}, null);
      chrome.runtime.sendMessage({message: 'toggle'}, null);
    })
  });
})


$('#extGBE-logout').click(async function(){
  // $("#firebase2").remove();
  // $('#mySidebar').append("<iframe id='firebase2' src='https://ajaxtest-882ac.firebaseapp.com/guidebook/extension/logout-google' style='height:0;width:0;border:0;border:none;visibility:hidden;'></iframe>")

  let uid = (await getChromeStg('authInfo')).authInfo.user.uid;
  chrome.runtime.sendMessage({message: 'logoutRequest', data : uid}, 
  function (response) {
    if(response=='success'){
      //alert('로그아웃 완료')
      chrome.runtime.sendMessage({message: 'toggle'}, null);  
    }else{
      alert('로그아웃 실패')
    }
  });
})

$('#extGBE-saveToServer').click(function(){

  saveHtml_Server();
  // getChromeStg('loginToken', saveHtml_Server)
  // saveHtml_Server(title)
})

$('#btn10').click(function(){

})


// guideBookListRequest

//로딩이 다 됐을 시점에 다시 보여주기
setTimeout(function(){
  $('#mySidebar').show();
},200)














    // var customWindow = window.open('', '_blank', '');
    //   customWindow.close();
    //다시 로그인할때 응답이 여러번옴 삭제된거같아보여도 접속이 남아있는거같음
    //console.log('토글요청!!')
    //alert('로그인 됨!!')
    // chrome.storage.sync.get(['loginToken'], function (result) {
    //   console.log(result)
    //   console.log(result.loginToken.stsTokenManager.accessToken)
    // })
    // if(response=='success'){
    //   alert('로그아웃 완료')
    //   chrome.runtime.sendMessage({message: 'toggle'}, null);  
    // }else{
    //   alert('로그아웃 실패')
    // }
    //console.log('Response From API', response);
  // startSignIn();
  // $("#firebase").remove();
  // $('#mySidebar').append("<iframe id='firebase' src='https://ajaxtest-882ac.firebaseapp.com/guidebook/extension/login-google' style='height:0;width:0;border:0;border:none;visibility:hidden;'></iframe>")

  // var $iframe = $("#firebase").contents();
  // $("body", $iframe).trigger("click");
  //$('#btnGoogleLogin').trigger('click');





// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */



























  // var payload = {
  //   "__html": "<meta charset='UTF-8'>"+'html',
  //   "html" : 'hhttmmll',
  //   "inlinePdf": false
  // };
  // $.ajax({
  //   url: 'https://ajaxtest-882ac.firebaseapp.com/board2/insertFromExtension',
  //   method: "POST",
  //   dataType: "json",
  //   crossDomain: true,
  //   contentType: "application/json; charset=utf-8",
  //   data: JSON.stringify(payload),
  //   cache: false,
  //   beforeSend: function (xhr) {
  //     alert('전송전')
  //       /* Authorization header */
  //       //xhr.setRequestHeader("Authorization", apikey);
  //   },
  //   success: function (data) {
  //     alert('success')
  //     console.log(data); //this is the url to the pdf
  //     //document.getElementById('my_iframe').src = data.pdf;
  //   },
  //   error: function (jqXHR, textStatus, errorThrown) {
  //     alert('error')
  //   }
  // });


    // +
    // encodeURIComponent(request.itemId)

  // // 입력값을 변수에 담고 문자열 형태로 변환
  // var data = {'email' : '"'+$('#my-editor').html()+'"'};
  // data = JSON.stringify(data);



  
  // // content-type을 설정하고 데이터 송신
  // var xhr = new XMLHttpRequest();
  
  // xhr.open('POST', 'http:/192.168.6.44:3002/ajaxTest/test');
  // //https로 해야되는듯?
  // xhr.setRequestHeader('Content-type', "application/json");
  // xhr.send(data);
  

  // // 데이터 수신이 완료되면 표시
  // xhr.addEventListener('load', function(){
  //   console.log(xhr);
  //   var result = JSON.parse(xhr.responseText);
  //   console.log(result);
  //   $('#my-editor').append('<p>'+result.result+'</p>');
  //   //console.log(xhr.responseText);

  












  
  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState === 4) {   // (수신 완료, XMLHttpRequest.DONE : 4)
  //       if (xhr.status === 200) { // (통신 성공)
  //           console.log(xhr.responseText);
  //       } else {
  //           console.log('서버 에러 발생');
  //       }
  //   } else { // 통신 완료 전
  //       console.log('통신중...');
  //   }
  // }


  // xhr.addEventListener("progress", updateProgress);
  // function updateProgress (oEvent) {
  //   if (oEvent.lengthComputable) {
  //     var percentComplete = oEvent.loaded / oEvent.total * 100;
  //     console.log(percentComplete)
  //     // ...
  //   } else {
  //     // Unable to compute progress information since the total size is unknown
  //   }
  // }












// headers: {
//   'Authorization': 'Client-ID 1264088c861551b'
// },
// type: "POST",
// data: {
//   'image': c,
//   'type': 'base64', 
//   'title': 'image'
// },









  // var html = $('#my-editor').html();
  // SejdaJsApi.htmlToPdf({
  //   filename: 'out.pdf',
  //   /* leave blank for one long page */
  //   pageSize: 'a4',
  //   publishableKey: 'api_public_e1a15bbd4fa240ceb8eb01e7e53aaff2',
  //   htmlCode: html,
  //   /* url: window.location.href */
  //   always: function() {
  //     // PDF download should have started
  //   },
  //   error: function(err) {
  //     console.error(err);
  //     alert('An error occurred');
  //   }
  // });

  // $.ajax({
  //   type: "POST",
  //   url: "https://api.html2pdf.app/v1/generate",
  //   data : {
  //     html,
  //     apiKey: 'e764a8d19bf5f878d7482a1ffa5079e91baf649d4dad2917a40e7728a6ff5d96',
  //     email : 'eric2317@naver.com'
  //   },
    
  //   success: function(data) {
  //       // imageSelected = null;
  //       // chrome.tabs.create({
  //       //     url: data.data.link
  //       // });
  //       alert(data.document)
  //       console.log(data)
  //       alert('성공')
  //       // var e = chrome.extension.getBackgroundPage().screenshot;
  //       // e.insertImage({
  //       //     url: data.data.link
  //       // })
  //       // chrome.tabs.getCurrent(function(tab) {
  //       //     chrome.tabs.remove(tab.id, function() { });
  //       // });
  //   },
  //   error: function(e) {
  //       var a = $.parseJSON(e.responseText);
  //       alert(a.error);
  //   }
  // });













// Quill.register('modules/counter', function(quill, options) {
//   var container = document.querySelector('#counter');
//   quill.on('text-change', function() {
//     var text = quill.getText();
//     // There are a couple issues with counting words
//     // this way but we'll fix these later
//     container.innerText = text.split(/\s+/).length;
//   });
// });
// var quill = new Quill('#editor-container', {
//   modules: {
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       ['bold', 'italic', 'underline'],
//       ['image', 'code-block']
//     ],
//     counter: true
//   },
//   placeholder: 'Compose an epic...',
//   theme: 'snow'  // or 'bubble'
// });



