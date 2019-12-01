
var guideBookIdx = -1
// console.log(shadow)


//console.log(shadowEl)
//console.log(shadow.querySelector('#my-editor'))

// let eeditor = shadow.querySelector('#my-editor');
// shadowEl.querySelector('#my-editor');
$(getShadowEl('#my-editor')).trumbowyg({
  disabled: false, 
  resetCss: true,
  removeformatPasted: true,
  lang : 'ko',
  tagsToRemove: ['script', 'link'],
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
      ico: 'capture',
      hasIcon: true
    },
    SelectedArea : {
      title: '선택 캡처',
      ico: 'capture-select',
      hasIcon: true,
      fn: function(){
        $('#mySidebar').hide();
        chrome.runtime.sendMessage({message: "selectCapture"}, null);
      }
    },
    EntirePage : {
      title: '전체 캡처',
      ico: 'capture-all',
      hasIcon: true,
      fn: function(){
        $('#mySidebar').hide();
        chrome.runtime.sendMessage({message: "entireCapture"}, null);
      }
    },
    VisiblePage : {
      title: '영역 캡처',
      ico: 'capture-dom',
      hasIcon: true,
      fn: function(){
        $('#mySidebar').hide();
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
          $(getShadowEl('#extGBE-homeTitle')).html('<i></i>Home')
          $(getShadowEl('.container1')).attr('class', 'container1-full')
          $(getShadowEl('#my-editor')).css('height', '840px')
        }else{
          $('#mySidebar').css('width', '350px');
          $(getShadowEl('#my-editor')).css('height', '775px')
          if(!isLogined){

          }else{
            $(getShadowEl('#extGBE-homeTitle')).html('<i></i>Travel<br> Books')
            $(getShadowEl('.container1-full')).attr('class', 'container1')
          }
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
    ['undo', 'redo'], // Only supported in Blink browsers
    ['formatting'],
    ['strong', 'em', 'del'],
    ['removeformat'],
    ['justifyLeft', 'justifyCenter', 'justifyRight'/*, 'justifyFull'*/],
    ['unorderedList', 'orderedList'],
    ['horizontalRule'], 
    ['superscript', 'subscript'],
    ['fontfamily'],
    ['capture','image'],
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

$(getShadowEl('#my-editor')).trumbowyg('disable')
if(isLogined){
  $(getShadowEl('#pcss3mm')).children('li').not(getShadowEl('#extGBE-myGuideBooksli')).not(getShadowEl('#extGBE-logout')).not(getShadowEl('#extGBE-home')).addClass('disabled');
  getMyGuideBooks(false, 'init')
  //$('#my-editor').trumbowyg('disable')
}else{
}



// functions -----------------------------------------------------------------

//한페이지당 최대 사이즈는 850px 
//현재 자식의 자식까지 계산해버림 상위 자식만 계산하도록
function getTotalContentHeight(){
  var childrens = $(getShadowEl('#my-editor')).children();
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
  var apikey = '4ca7ff53-eafa-425c-aed2-64a7fd1f5a87'; //replace this with your own from portal.api2pdf.com
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
      $(getShadowEl('#my_iframe')).attr('src',  data.pdf);
      $(getShadowEl('#my-editor')).trumbowyg('enable')
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $(getShadowEl('#my-editor')).trumbowyg('enable')
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

async function saveHtml_Server(init){
  if(myGuideBooks.length>=15){
    alert('임시저장은 15개까지 가능합니다.')
    return;
  }


  $(getShadowEl('#pcss3mm')).addClass('disabled')
  // 입력값을 변수에 담고 문자열 형태로 변환
  if(guideBookIdx==-1){
    return;
  }

  var title = '';
  var blank_pattern = /^\s+|\s+$/g;
  while(true){
    if(title == null){
      if(!init){
        $(getShadowEl('#my-editor')).trumbowyg('enable')
      }
      $(getShadowEl('#pcss3mm')).removeClass('disabled')
      return;
    }else if(title=='' || title.replace( blank_pattern, '' ) == "" || title.length>20){
      title = prompt( '가이드북 제목을 입력해 주세요(20자 이하).', init?'':$(getShadowEl('#extGBE-guideBookTitleArea')).attr('value'));
    }else{
      setChromeStg('currentTitle', title);
      break;
    }
  }

  if(init){
    var html = ''
  }else{
    var html =$(getShadowEl('#my-editor')).html();
  }
  var data = {'title' : title,
              'htmlCode' : html };

  chrome.runtime.sendMessage({message: 'guideBookSaveRequest', data : data}, 
  function (response) {
    if(response=='success'){
      try{
        myGuideBooks2[0]; //존재여부 체크
        myGuideBooks[guideBookIdx] = myGuideBooks2[guideBookIdx];
      } catch(err){
        // console.log('저장된 가이드북 목록 없음');
      }

      if(init){
        getMyGuideBooks(true, 'initSave');
      }else{
        getMyGuideBooks(true, 'save');
      }

    }else{
      alert('서버저장 실패')
    }
    //console.log('Response From API', response);
  });

}

async function deleteGB_server(type){
  $(getShadowEl('#my-editor')).trumbowyg('disable')
  $(getShadowEl('#pcss3mm')).addClass('disabled')
  if(guideBookIdx==-1){
    return;
  }

  if(type=='one'){
    var title = $(getShadowEl('#extGBE-list-icon-idx'+guideBookIdx)).attr('value');
    var inputTitle = '';
    while(true){
      if(inputTitle==''){
        inputTitle = prompt( "삭제하시려면 가이드북 제목을 입력해 주세요(공백X).\n "+$(getShadowEl('#extGBE-list-icon-idx'+guideBookIdx)).attr('value') );
      }else if(inputTitle == null){
        $(getShadowEl('#my-editor')).trumbowyg('enable')
        $(getShadowEl('#pcss3mm')).removeClass('disabled')
        return;
      }else{
        if(title==inputTitle){
          //삭제 실행
          var guidebookTitles = new Array();
          guidebookTitles.push(title);
          chrome.runtime.sendMessage({message: 'guideBookDeleteRequest', data:guidebookTitles}, function(response){ 
            if(response=='success'){
              //$(getShadowEl('#myGuideBookList')).empty();
              getMyGuideBooks(true, 'delete');
              $(getShadowEl('#extGBE-guideBookTitleArea')).html('내 가이드북');
              $(getShadowEl('#pcss3mm')).children('li').not(getShadowEl('#extGBE-myGuideBooksli')).not(getShadowEl('#extGBE-logout')).not(getShadowEl('#extGBE-home')).addClass('disabled');
              guideBookIdx = -1;
              $(getShadowEl('#my-editor')).html('')
              alert(title + '  가이드북이 삭제되었습니다.')
            }else{
              alert('삭제 실패')
            }
          });
          break;
        }else{
          alert('같지 않습니다.')
          inputTitle = ''
        }
      }
    }
  }else if(type=='all'){
    var inputTitle = '';
    while(true){
      if(inputTitle==''){
        inputTitle = prompt( "삭제하시려면 아래의 문자를 입력해주세요.(공백X).\n deleteall");
      }else if(inputTitle == null){
        $(getShadowEl('#my-editor')).trumbowyg('enable')
        $(getShadowEl('#pcss3mm')).removeClass('disabled')
        return;
      }else{
        if('deleteall'==inputTitle){
          var guidebookTitles = new Array();
          myGuideBooks.forEach(function (item, index, array) {
            let guidBook = JSON.parse(item);
            var title = guidBook.title;
            guidebookTitles.push(title)
          });
          chrome.runtime.sendMessage({message: 'guideBookDeleteRequest', data:guidebookTitles}, function(response){ 
            if(response=='success'){
              //$(getShadowEl('#myGuideBookList')).empty();
              myGuideBooks = null;
              getMyGuideBooks(true, 'delete');
              $(getShadowEl('#extGBE-guideBookTitleArea')).html('내 가이드북');
              $(getShadowEl('#pcss3mm')).children('li').not(getShadowEl('#extGBE-myGuideBooksli')).not(getShadowEl('#extGBE-logout')).not(getShadowEl('#extGBE-home')).addClass('disabled');
              guideBookIdx = -1;
              $(getShadowEl('#my-editor')).html('');
              alert('모든 가이드북이 삭제되었습니다.')
            }else{
              alert('삭제 실패')
            }
          });
          break;
        }else{
          alert('같지 않습니다.')
          inputTitle = ''
        }
      }
    }





  }else{

  }

  $(getShadowEl('#pcss3mm')).removeClass('disabled')


}

function getMyGuideBooks(refresh, type){
  chrome.runtime.sendMessage({message: 'guideBookListRequest'}, function(response){ 
    if(isLogined==false){ //수정
      alert('로그인이 필요합니다.')
      $(getShadowEl('#extGBE-logout')).trigger('click');
      return;
    }else{
      $(getShadowEl('#extGBE-titleArea')).html("<i class='icon-home'></i>...")
      try {
        if(refresh) throw 'refresh';
        //일단 한번 켜놓은 상태에서 다시 껐다 키면 throw되서 아래로 감 다시 추가해야되는데 
        myGuideBooks[0]
        myGuideBooks2 = response;
        var length = myGuideBooks.length;
        response.forEach(function (item, index, array) {
          let guidBook = JSON.parse(item); //새로 불러온 가이드북
          var guideBook2 = myGuideBooks[index]; //기존의 가이드북
          if(guideBook2 == undefined){ //새로 저장된 가이드북
            var title = guidBook.title;
            var titleMin = 'null';
            if(title.length > 20) titleMin=(title.substring(0, 20))+'...'
            $(getShadowEl('#myGuideBookList')).append("<li class='extGBE-guideBook' id="+"extGBE-list-idx"+length+" value="+length+"><a href='' onclick='return false'><i id='extGBE-list-icon-idx"+length+"' class='icon-saveOk' value='"+title+"'></i>"+((titleMin=='null')?title:titleMin)+"</a></li>")
            myGuideBooks.push(item);
            length++;
          }else{
            // 새 가이드북 저장할때
            if( guidBook.modifiyed_date > (JSON.parse(myGuideBooks[index]).modifiyed_date)){
              $(getShadowEl('#extGBE-list-icon-idx'+index)).attr('class', 'icon-saveNok')
            }
          }
        });
      } catch (e) {
        myGuideBooks = response;
        $(getShadowEl('#myGuideBookList')).empty();
        $(getShadowEl('#myGuideBookList')).append("<li class='extGBE-addGuideBook'><a href='' onclick='return false'><i  ></i>가이드북 생성</a></li>")
        response.forEach(function (item, index, array) {
          let guidBook = JSON.parse(item);
          var title = guidBook.title;
          var titleMin = 'null';
          if(title.length > 20) titleMin=(title.substring(0, 20))+'...'
          $(getShadowEl('#myGuideBookList')).append("<li class='extGBE-guideBook' id="+"extGBE-list-idx"+index+" value="+index+"><a href='' onclick='return false'><i id='extGBE-list-icon-idx"+index+"' class='icon-saveOk' value='"+title+"'></i>"+((titleMin=='null')?title:titleMin)+"</a></li>")
        });
      }

      setGuideBookListener();
      if(type=='login'){
        $(getShadowEl('#pcss3mm')).removeClass('disabled');
        $(getShadowEl('#pcss3mm')).children('li').not(getShadowEl('#extGBE-myGuideBooksli')).not(getShadowEl('#extGBE-logout')).not(getShadowEl('#extGBE-home')).addClass('disabled');
        //$('#my-editor').trumbowyg('enable')
      }else if(type=='save'){
        $(getShadowEl('#my-editor')).trumbowyg('enable')
        $(getShadowEl('#pcss3mm')).removeClass('disabled')
        //console.log($(getShadowEl('#myGuideBookList')).children('li').last())
      }else if(type=='init'){
        $(getShadowEl('#pcss3mm')).removeClass('disabled');
        $(getShadowEl('#pcss3mm')).children('li').not(getShadowEl('#extGBE-myGuideBooksli')).not(getShadowEl('#extGBE-logout')).not(getShadowEl('#extGBE-home')).addClass('disabled');
      }else if(type=='initSave'){
        $(getShadowEl('#pcss3mm')).removeClass('disabled');
        $(getShadowEl('#pcss3mm')).children('li').not(getShadowEl('#extGBE-myGuideBooksli')).not(getShadowEl('#extGBE-logout')).not(getShadowEl('#extGBE-home')).addClass('disabled');
        $(getShadowEl('#myGuideBookList')).children('li').last().trigger('click');
      }else if(type=='delete'){
        $(getShadowEl('#my-editor')).trumbowyg('disable')
      }
      
      // if(response.length==0){
      //   $(getShadowEl('#myGuideBookList')).append("<li class='extGBE-addGuideBook'><a href='' onclick='return false'><i class='icon-saveOk' ></i>가이드북 생성</a></li>")
      // }
    }
  })
}

function getChromeStg(key){
	return new Promise((resolve, reject) => {
	  chrome.storage.sync.get([key], result => {
		  resolve(result)
	  });
	});
}

function setChromeStg(key, value){
  var obj = {};
  obj[key]=value
  chrome.storage.sync.set(obj, null);
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

function login(){
  $(getShadowEl('#pcss3mm')).addClass('disabled')
  chrome.runtime.sendMessage({message: 'login'}, function (response) {
    if(response.code=="auth/popup-closed-by-user" || response.code== "auth/cancelled-popup-request"){ //로그인 안하고 팝업을 껐을때
      isLogined = false;
      $(getShadowEl('#pcss3mm')).removeClass('disabled')
    }else{
      isLogined = true;
      chrome.storage.sync.set({authInfo: response}, function() {
        changeLogoutHtml();
        $('#mySidebar').css('width', '350px');
        if($('#mySidebar').css('width')=='350px'){
          $(getShadowEl('#extGBE-homeTitle')).html('<i></i>Travel<br> Books')
          $(getShadowEl('.container1-full')).attr('class', 'container1')
        }

        getMyGuideBooks(true, 'login')
      })
    }
  });
}

async function logout(){
  // $("#firebase2").remove();
  // $('#mySidebar').append("<iframe id='firebase2' src='https://ajaxtest-882ac.firebaseapp.com/guidebook/extension/logout-google' style='height:0;width:0;border:0;border:none;visibility:hidden;'></iframe>")
  $(getShadowEl('#my-editor')).html('')
  $(getShadowEl('#my-editor')).trumbowyg('disable')
  $(getShadowEl('#pcss3mm')).addClass('disabled')
  let uid = (await getChromeStg('authInfo')).authInfo.user.uid;
  chrome.runtime.sendMessage({message: 'logoutRequest', data : uid}, 
  function (response) {
    if(response=='success'){
      //alert('로그아웃 완료')
      //console.log(tab)
      //chrome.runtime.sendMessage({message: 'toggle', tab : tab}, null);  
    }else{
      alert('로그아웃 실패')
    }
    changeLoginHtml();
    $(getShadowEl('#extGBE-homeTitle')).html('<i></i>Home')
    $(getShadowEl('.container1')).attr('class', 'container1-full')
    $(getShadowEl('#pcss3mm')).removeClass('disabled')
    
    isLogined = false;
  });
}

function setCurrentGuideBook(){
  let index = $(this).attr('value');
  let className = $(getShadowEl('#extGBE-list-icon-idx'+index)).attr('class')
  //console.log(myGuideBooks)
  //console.log(myGuideBooks[index])
  let guideBook = JSON.parse(myGuideBooks[index]);
  $(getShadowEl('#my-editor')).html(guideBook.html);
  
  var title = guideBook.title;
  setChromeStg('currentTitle', title);
  $(getShadowEl('#extGBE-guideBookTitleArea')).attr('value', title);
  // if(title.length > 8) title=(title.substring(0, 8))+'...'
  $(getShadowEl('#extGBE-guideBookTitleArea')).html("<i class='"+className+"' id='extGBE-title-icon'></i>"+title+"")
  //id='extGBE-guideBookTitleArea'><i class='icon-saveOk' id='icon-saveOk'></i>내 가이드북</a>
  //$('#extGBE-titleArea').html("")
  guideBookIdx = index;
  $(getShadowEl('#pcss3mm')).children('li').not(getShadowEl('#extGBE-myGuideBooksli')).not(getShadowEl('#extGBE-home')).not(getShadowEl('#extGBE-logout')).removeClass('disabled');
  $(getShadowEl('#my-editor')).trumbowyg('enable');


}

//목록을 추가시킨다음에 리스너를 추가해줘야되니 함수화 DOM
async function setGuideBookListener(){
  $(getShadowElAll('.extGBE-guideBook')).click(setCurrentGuideBook)

  var title = await getChromeStg('currentTitle');
  if(title != null)
    $(getShadowEl('#myGuideBookList')).find('[value="'+title.currentTitle+'"]').parent().parent().trigger('click')

  $(getShadowEl('.extGBE-addGuideBook')).click(function(){
    guideBookIdx = 0;
    saveHtml_Server(true);
    //방금만든 가이드북을 선택하는 리스너 트리거해줘야함
  })

}



//listener -----------------------------------------------------
function setListeners(){
  $(getShadowEl('#extGBE-login')).click(login)
  
  $(getShadowEl('#extGBE-logout')).click(logout)
  
  $(getShadowEl('#extGBE-saveToServer')).click(function(){
    $(getShadowEl('#my-editor')).trumbowyg('disable')
    saveHtml_Server();
    // getChromeStg('loginToken', saveHtml_Server)
    // saveHtml_Server(title)
  })
  
  $(getShadowEl('#extGBE-saveToLocal')).click(function(){
    chrome.storage.sync.get(null, function(items){
      var allKeys = Object.keys(items);
      chrome.storage.sync.get(allKeys, function(items){
        console.log(items)
      })
    })
  })
  
  $(getShadowEl('#extGBE-saveToPDF')).click(function(){
    $(getShadowEl('#my-editor')).trumbowyg('disable')
    var html = $(getShadowEl('#my-editor')).html();
    // pages.toArray().forEach(function(element){
    //   html+=element;
    // });
    printHtmlToPdf(html);
    //printHtmlToPdf(html)
  })
  
  $(getShadowEl('#extGBE-title')).click(function(){
    var title = '';
    while(true){
      if(title==''){
        title = prompt( '가이드북 제목을 입력해 주세요(공백X).', $(getShadowEl('#extGBE-titleArea')).attr('value') );
      }else if(title == null){
        return;
      }else{
        break;
      }
    }
    alert(inputString);
  })
  
  $(getShadowEl('#extGBE-imageEditorPopup')).click(function(){
  })
  
  $(getShadowEl('#extGBE-refreshOneGB')).click(async function(){
    // var title = await getChromeStg('currentTitle');
    // console.log(title)
    if(guideBookIdx!=-1){
      $(getShadowEl('.extGBE-circle3')).remove();
      $(getShadowEl('#extGBE-refreshOneGB')).html('<div class="extGBE-circle3"></div>'+$(getShadowEl('#extGBE-refreshOneGB')).html())
      setTimeout(function(){
        $(getShadowEl('.extGBE-circle3')).remove();
      }, 1000)
    
      $(getShadowEl('#extGBE-title-icon-saveOk')).attr('class', 'icon-saveOk')
      myGuideBooks[guideBookIdx] = myGuideBooks2[guideBookIdx];
      $(getShadowEl('#my-editor')).html(JSON.parse(myGuideBooks[guideBookIdx]).html);
      $(getShadowEl('#extGBE-list-icon-idx'+guideBookIdx)).attr('class', 'icon-saveOk')
    }
  })

  $(getShadowEl('#extGBE-deleteOnePage')).click(function(){
    deleteGB_server('one');
  })

  $(getShadowEl('#extGBE-deleteAllPage')).click(function(){
    deleteGB_server('all');
  })

  $(getShadowEl('#my-editor')).keyup(function() {
    delay(function(){
      var title = $(getShadowEl('#extGBE-guideBookTitleArea')).attr('value')
      var content = $(getShadowEl('#my-editor')).html();
  
      // var obj = {};
      // obj[title]={content : content, modifyied_date : Date.now()}
  
      // setChromeStg('tempBooks', obj);
      // myGuideBooks[guideBookIdx].html = content;
      var data = {'title' : title,
      'htmlCode' : content };

      $(getShadowEl('#extGBE-title-icon')).attr('class', 'extGBE-circle3');
      chrome.runtime.sendMessage({message: 'guideBookSaveRequest', data : data}, 
        function (response) {
        if(response=='success'){
          var guidebook = JSON.parse(myGuideBooks[guideBookIdx]);
          guidebook.html = content;
          myGuideBooks[guideBookIdx] = JSON.stringify(guidebook)
          $(getShadowEl('#extGBE-title-icon')).attr('class', 'icon-saveOk');  


          // try{
          //   myGuideBooks2[0]; //존재여부 체크
          //   myGuideBooks[guideBookIdx] = myGuideBooks2[guideBookIdx];
          // } catch(err){
          //   // console.log('저장된 가이드북 목록 없음');
          // }

          // if(init){
          //   getMyGuideBooks(true, 'initSave');
          // }else{
          //   getMyGuideBooks(true, 'save');
          // }
        }else{
          alert('서버저장 실패')
        }
      });


    }, 1000 );
  });


}

setListeners();










var delay = (function(){
  var timer = 0;
  return function(callback, ms){
  clearTimeout (timer);
  timer = setTimeout(callback, ms);
 };
})();


// //로딩이 다 됐을 시점에 다시 보여주기
setTimeout(function(){
  $('#mySidebar').show();
},200)





