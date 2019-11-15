


//브라우저 창이 닫히거나 React Native에서 활동이 폐기된 경우에도 상태가 유지됨을 나타냅니다. 이 상태를 삭제하려면 명시적으로 로그아웃해야 합니다. Firebase 인증 웹 세션은 단일 호스트 출처이며 단일 도메인의 경우에만 유지된다는 점에 유의하세요. https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=ko#supported_types_of_auth_state_persistence
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        //chrome.runtime.sendMessage('mcbcpehojgnomagjldjkiciklakkgkhi',{message: user}, null);
        var obj = JSON.parse(JSON.stringify(user));
        window.parent.postMessage(obj, "*");   // '*' on any domain  
        //console.log(user)
        //alert('loginGG')
        // User is signed in.
    } else {
        //alert('not login')
        // No user is signed in.
    }
});

// 구글 인증 기능 추가
var provider = new firebase.auth.GoogleAuthProvider();

// function redirectGoogleLogin(){
//     //로그인 페이지로 리디렉션해서 로그인하려면 다음과 같이 signInWithRedirect를 호출합니다.
//     firebase.auth().signInWithPopup(provider).then(function(result) {
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         var token = result.credential.accessToken;
//         // The signed-in user info.
//         var user = result.user;
//         // ...
//         return;
//       }).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // The email of the user's account used.
//         var email = error.email;
//         // The firebase.auth.AuthCredential type that was used.
//         var credential = error.credential;
//         // ...
//       });
//     //firebase.auth().signInWithRedirect(provider);

// }

function googleLogout(){
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  return;
  }).catch(function(error) {
  // An error happened.
  });
}



// $('#btnGoogleLogin').click(redirectGoogleLogin)
// $('#btnGoogleLoout').click(googleLogout);

$(document).ready(function(){
    console.log('logout')
    googleLogout()
    //페이지 로드가 완료되면 getRedirectResult를 호출해서 Google 제공업체의 OAuth 토큰을 가져올 수도 있습니다.
    // firebase.auth().getRedirectResult().then(function(result) {
    // if (result.credential) {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     var token = result.credential;
    //     var user = result.user;

    //     $('#accessToken').html('accessToken : '+token.accessToken)
    //     $('#idToken').html('idToken : '+token.idToken)
    //     $('#displayName').html('displayName : '+user.displayName)
    //     $('#email').html('email : '+user.email)
    //     $('#refreshToken').html('refreshToken : '+user.refreshToken)
    //     $('#uid').html('uid : '+user.uid)

    // }
    // // The signed-in user info.
    // }).catch(function(error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // The email of the user's account used.
    //     var email = error.email;
    //     // The firebase.auth.AuthCredential type that was used.
    //     var credential = error.credential;
    //     // ...
    // });
});






  
  //firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    //// Handle Errors here.
    //var errorCode = error.code;
    //var errorMessage = error.message;
    //// ...
  //});
  
  
    // 인증하기
    // firebase.auth().signInWithPopup(provider).then(function(result) {
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   var token = result.credential.accessToken;
    //   // The signed-in user info.
    //   var user = result.user;
      
    //   $('#user').html(user.displayName);
    //   console.log(user.displayName)		// 인증 후 어떤 데이터를 받아오는지 확인해보기 위함.
    //   //window.location.href = 'http://www.TestTestTestabc.com/'+user.displayName;
    // // ...
    // }).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    //   var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   // ...
    // });
  



