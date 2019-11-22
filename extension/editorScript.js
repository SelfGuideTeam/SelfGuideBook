
var guideBookIdx = -1

$('#my-editor').trumbowyg({
  disabled: false, 
  resetCss: true,
  removeformatPasted: true,
  lang : 'ko',
  tagsToRemove: ['script', 'link'],
  svgPath : chrome.runtime.getURL('/apis/Trumbowyg-master/dist/ui/icons.svg'),
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
      //deprecated
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
    ['lineheight'],
    ['fontfamily'],
    ['link'],
    ['removeformat'],
    ['image'],
    ['superscript', 'subscript'],
    ['fullscreen']
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

if(isLogined){
  getMyGuideBooks(false, true)
  //$('#my-editor').trumbowyg('disable')
}
$('#my-editor').trumbowyg('disable')
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
      $('#my-editor').trumbowyg('enable')
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#my-editor').trumbowyg('enable')
    }
  });
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
  if(guideBookIdx==-1){
    return;
  }

  var title = '';
  while(true){
    if(title==''){
      title = prompt( '가이드북 제목을 입력해 주세요(공백X).', $('#extGBE-guideBookTitleArea').attr('value') );
    }else if(title == null){
      return;
    }else{
      break;
    }
  }

  var html =$('#my-editor').html();
  var data = {'title' : title,
              'htmlCode' : html };

  chrome.runtime.sendMessage({message: 'guideBookSaveRequest', data : data}, 
  function (response) {
    if(response=='success'){
      try{
        myGuideBooks2[0]; //존재여부 체크
        myGuideBooks[guideBookIdx] = myGuideBooks2[guideBookIdx];
      } catch(err){

      }
      getMyGuideBooks(true);
    }else{
      alert('서버저장 실패')
    }
    //console.log('Response From API', response);
  });

}

function getMyGuideBooks(refresh, init){
  chrome.runtime.sendMessage({message: 'guideBookListRequest'}, function(response){ 
    if(isLogined==false){ //수정
      console.log('로그인 먼저 해주세요')
      //alert('로그인 먼저 해주세요')
      return;
    }else{
      $('#extGBE-titleArea').html("<i class='icon-home'></i>...")
      try {
        if(refresh) throw 'refresh';
        myGuideBooks[0]
        myGuideBooks2 = response;
        var length = myGuideBooks.length;
        response.forEach(function (item, index, array) {
          let guidBook = JSON.parse(item); //새로 불러온 가이드북
          var guideBook2 = myGuideBooks[index]; //기존의 가이드북
          if(guideBook2 == undefined){ //새로 저장된 가이드북
            //guideBook2 = JSON.parse(myGuideBooks2[index])
            var title = guidBook.title;
            if(title.length > 20) title=(title.substring(0, 20))+'...'
            $('#myGuideBookList').append("<li class='extGBE-guideBook' id="+"extGBE-list-idx"+length+" value="+length+"><a href='' onclick='return false'><i id='extGBE-list-icon-idx"+length+"' class='icon-saveOk'></i>"+title+"</a></li>")
            myGuideBooks.push(item);
            length++;
          }else{
            // 새 가이드북 저장할때
            if( guidBook.modifiyed_date > (JSON.parse(myGuideBooks[index]).modifiyed_date)){
              //myGuideBooks[index] = item;
              //$('#myGuideBookList').append("<li class='extGBE-guideBook' id=extGBE-list-idx"+index+" value="+index+"><a href='' onclick='return false'><i class='icon-saveNok'></i>"+guidBook.title+"</a></li>")
              $('#extGBE-list-icon-idx'+index).attr('class', 'icon-saveNok')
            }
          }
          // else{ //가지고 있는 가이드북들이 최신상태면 그냥 기존거를 추가
          //   $('#myGuideBookList').append("<li class='extGBE-guideBook' id="+"extGBE-list-idx"+index+" value="+index+"><a href='' onclick='return false'><i class='icon-saveOk'></i>"+guidebook2.title+"</a></li>")
          // }
        });
        //myGuideBooks = myGuideBooks2;
      } catch (e) {
        myGuideBooks = response;
        $('#myGuideBookList').empty();
        response.forEach(function (item, index, array) {
          //id='myGuideBookList'
          // <li><a href='#'><i class='icon-lemon'></i>로컬저장</a></li>\
          let guidBook = JSON.parse(item);
          var title = guidBook.title;
          if(title.length > 20) title=(title.substring(0, 20))+'...'
          $('#myGuideBookList').append("<li class='extGBE-guideBook' id="+"extGBE-list-idx"+index+" value="+index+"><a href='' onclick='return false'><i id='extGBE-list-icon-idx"+index+"' class='icon-saveOk'></i>"+title+"</a></li>")
          //console.log(item, index);
        });
          // if (e instanceof ReferenceError) {
          // }else{
          //   console.log(e)
          //   alert('불러오기 기타 에러')
          // }
            
      }
      // if(!myGuideBooks){

      // }else{

      //   //console.log(guidebook2);
      // }
      //불러오고나서 처음에 보여줄 가이드북
      // let guidebook2 = JSON.parse(myGuideBooks[0]);
      // $('#extGBE-titleArea').html("<i class='icon-home'></i>"+guidebook2.title+"")
      // $('#extGBE-titleArea').attr('value', guidebook2.title);
      // $('#my-editor').html(guidebook2.html)
      // //첫번째 가이드북에서 수정중일 때
      // if( $('#extGBE-titleArea').attr('value') != guidebook2.title){
      //   //예전 가이드북에서 수정하고있을때
      //   //최신 가이드북에서 수정하고있을때
      // }else{
      //   //예전 가이드북에서 수정하고있을때
      //   //최신 가이드북에서 수정하고있을때
      //   //alert로 최신으로 바꿀건지 알려줘야되나?
      // }

      setGuideBookListener(init)
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


// if(!isLogined). 로그인안하면 disable

// loginCheck();
//listener -----------------------------------------------------




$('#extGBE-login').click(function(){
  chrome.runtime.sendMessage({message: 'login'}, function (response) {
    if(response.code=="auth/popup-closed-by-user"){ //로그인 안하고 팝업을 껐을때
      isLogined = false;
    }else{
      isLogined = true;
      chrome.storage.sync.set({authInfo: response}, function() {
        chrome.runtime.sendMessage({message: 'toggle'}, null);
        chrome.runtime.sendMessage({message: 'toggle'}, null);
      })
    }
  });
})

$('#extGBE-logout').click(async function(){
  // $("#firebase2").remove();
  // $('#mySidebar').append("<iframe id='firebase2' src='https://ajaxtest-882ac.firebaseapp.com/guidebook/extension/logout-google' style='height:0;width:0;border:0;border:none;visibility:hidden;'></iframe>")
  $('#my-editor').trumbowyg('disable')
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
  isLogined = false;
})

$('#extGBE-saveToServer').click(function(){
  $('#my-editor').trumbowyg('disable')
  saveHtml_Server();
  // getChromeStg('loginToken', saveHtml_Server)
  // saveHtml_Server(title)
})

$('#extGBE-saveToLocal').click(function(){
})

$('#extGBE-saveToPDF').click(function(){
  $('#my-editor').trumbowyg('disable')
  var html = $('#my-editor').html();
  // pages.toArray().forEach(function(element){
  //   html+=element;
  // });
  printHtmlToPdf(html);
  //printHtmlToPdf(html)
})

$('#extGBE-title').click(function(){
  var title = '';
  while(true){
    if(title==''){
      title = prompt( '가이드북 제목을 입력해 주세요(공백X).', $('#extGBE-titleArea').attr('value') );
    }else if(title == null){
      return;
    }else{
      break;
    }
  }
  alert(inputString);
})

$('#extGBE-imageEditorPopup').click(function(){
})

//목록을 추가시킨다음에 리스너를 추가해줘야되니 함수화 DOM
function setGuideBookListener(init){
  
  $('.extGBE-guideBook').click(function(){
    let index = $(this).attr('value');
    let className = $('#extGBE-list-icon-idx'+index).attr('class')
    //console.log(myGuideBooks)
    //console.log(myGuideBooks[index])
    let guideBook = JSON.parse(myGuideBooks[index]);
    $('#my-editor').html(guideBook.html);

    var title = guideBook.title;
    if(title.length > 8) title=(title.substring(0, 8))+'...'
    $('#extGBE-guideBookTitleArea').html("<i class='"+className+"' id='extGBE-title-icon-saveOk'></i>"+title+"")
    $('#extGBE-guideBookTitleArea').attr('value', title);
    //id='extGBE-guideBookTitleArea'><i class='icon-saveOk' id='icon-saveOk'></i>내 가이드북</a>
    //$('#extGBE-titleArea').html("")
    guideBookIdx = index;
    $('#my-editor').trumbowyg('enable')
  })
  if(!init)
    $('#my-editor').trumbowyg('enable')
}

$('#extGBE-refreshOneGB').click(function(){
  $('#my-editor').trumbowyg('disable')
  if(guideBookIdx!=-1){
    $('.extGBE-circle3').remove();
    $('#extGBE-refreshOneGB').html('<div class="extGBE-circle3"></div>'+$('#extGBE-refreshOneGB').html())
    setTimeout(function(){
      $('.extGBE-circle3').remove();
    }, 1000)
  
    $('#extGBE-title-icon-saveOk').attr('class', 'icon-saveOk')
    myGuideBooks[guideBookIdx] = myGuideBooks2[guideBookIdx];
    $('#my-editor').html(JSON.parse(myGuideBooks[guideBookIdx]).html);
    $('#extGBE-list-icon-idx'+guideBookIdx).attr('class', 'icon-saveOk')


  }

  $('#my-editor').trumbowyg('enable')
})













//로딩이 다 됐을 시점에 다시 보여주기
setTimeout(function(){
  $('#mySidebar').show();
},200)





