//백그라운드 페이지 가져오기
// var bg = chrome.extension.getBackgroundPage(),
//     bgScreencapture = bg.screenshot,
//     option_icon_state = !1;

  
$('#my-editor').trumbowyg({
  lang : 'ko',
  svgPath : chrome.runtime.getURL('/js/Trumbowyg-master/dist/ui/icons.svg'),
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
          $('#mySidebar').css('width', '800px');
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
        printHtmlToPdf($('#my-editor').html());
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
    ['superscript', 'subscript'],
    ['link'],
    ['image'],
    ['lineheight'],
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



//저장된 데이터를 가져와서 입력
getData();
$('#my-editor').blur(function(){
  chrome.storage.sync.set({key: $('#my-editor').html()}, function() {
    //console.log('Value is set to ' + $('#my-editor').html());
  });
})

function getData(){
  var rr= chrome.storage.sync.get(['key'], function (result) {
    $('#my-editor').html(result.key)
    //returnData = result.key;
  });
}

function printHtmlToPdf(html) {
  var endpoint = 'https://v2018.api2pdf.com/chrome/html';
  var apikey = 'ab1ce02b-9a63-48c1-b7a5-a2469f2decc9'; //replace this with your own from portal.api2pdf.com
  var payload = {
    "html": html,
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



