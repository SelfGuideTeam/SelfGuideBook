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
          $('#mySidebar').css('width', '900px');
        }else{
          $('#mySidebar').css('width', '350px');
        }
        //alert('ggg')
        //chrome.runtime.sendMessage({message: "domCapture"}, null);
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



//저장된 데이터를 가져와서 입력
getData();
$('#my-editor').blur(function(){
  chrome.storage.sync.set({key: $('#my-editor').html()}, function() {
    //console.log('Value is set to ' + $('#my-editor').html());
  });
})

$('#btn1').click(function(){
  var html = $('#my-editor').html();
  SejdaJsApi.htmlToPdf({
    filename: 'out.pdf',
    /* leave blank for one long page */
    pageSize: 'a4',
    publishableKey: 'api_public_y0urap1k3yh3r3',
    htmlCode: html,
    /* url: window.location.href */
    always: function() {
      alert('success')
      // PDF download should have started
    },
    error: function(err) {
      console.error(err);
      alert('An error occurred');
    }
  });


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
})

$('#btn2').click(function(){
  chrome.storage.sync.set({key: ''}, function() {
  });
})


function getData(){
  var rr= chrome.storage.sync.get(['key'], function (result) {
    $('#my-editor').html(result.key)
    //returnData = result.key;
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



