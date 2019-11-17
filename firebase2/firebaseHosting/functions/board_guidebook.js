
var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
 

const admin = require('firebase-admin');
const functions = require('firebase-functions');
let checkRevoked = true;

// require 경로에 ..(상위) 있으면 deploy안됨 
admin.initializeApp({
    credential: admin.credential.cert(require('./fir-ex-63c1a-firebase-adminsdk-d7x5c-db2abb88bc.json')),
    databaseURL: "https://fir-ex-63c1a.firebaseio.com"
});


//firestore
var db = admin.firestore();
db.settings({timestampsInSnapshots: true})

function validToken(accessToken){
    return new Promise((resolve, reject) => {
        admin.auth().verifyIdToken(accessToken, checkRevoked)
        .then(function(decodedToken) {
            console.log(decodedToken)
            let uid = decodedToken.uid;
            // ...
            console.log('유효')
            resolve(decodedToken);
            return;
        }).catch(function(error) {
            console.log('유효하지않은 토큰')
            reject(error);
            return;
        });
    });
}

function revokeToken(uid){
    // Revoke all refresh tokens for a specified user for whatever reason.
    // Retrieve the timestamp of the revocation, in seconds since the epoch.
    return new Promise((resolve, reject) => {
        admin.auth().revokeRefreshTokens(uid)
        .then(() => {
            return admin.auth().getUser(uid);
        })
        .then((userRecord) => {
            return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
        })
        .then((timestamp) => {
            console.log('Tokens revoked at: ', timestamp);
            resolve(timestamp)
            return;
        }).catch(function(error) {
            reject(error);
            return;
        });
    });
}




// router
router.post('/verifyIdToken', async function(req, res, next){
    try{
        await validToken(req.body.accessToken);
        res.json({'result' : 'success'});
        return;
    } catch(err){
        res.json({'result' : 'fail'});
        console.log(err);
        return;
    }
})

router.post('/logout', async function(req, res, next){
    try {
        let timestamp = await revokeToken(req.body.uid);
        const metadataRef = admin.database().ref('metadata/' + req.body.uid);
        metadataRef.set({revokeTime: timestamp})
        .then(() => {
            res.json({'result' : 'success'});
            return; 
        }).catch((error) => {
            console.log(error);
            return;
        });
        return;
    } catch(err) {
        res.json({'result' : 'fail'});
        console.log(err);
        return;
    }
})

router.post('/setGuideBook', async function(req, res, next){
    try{
        let guideBookRef = db.collection('BOARD_GUIDEBOOK').doc(req.body.email).collection('GUIDEBOOKS').doc(req.body.title).set({
            html : req.body.htmlCode,
            created_date : Date.now(),
            modifiyed_date : Date.now()
        }).then(function(error) {
            console.log(error)
            var responseData = {'result' : 'success'}
            res.json(responseData)
            return;
        });

        // let setSf = guideBookRef.doc(req.body.email).set({
        //     title : req.body.title,
        //     html : req.body.htmlCode,
        //     created_date : Date.now(),
        //     modifiyed_date : Date.now()
        // }).then(function(error) {
        //     console.log(error)
        //     var responseData = {'result' : 'success'}
        //     res.json(responseData)
        //     return;
        // });
    } catch(err){
        console.log(err);
        res.json(err)
        return;
    }
});

router.post('/getGuideBookList', async function(req, res, next){
    try{
        var guideBooks = new Array();
        let guideBookRef = db.collection('BOARD_GUIDEBOOK').doc(req.body.email).collection('GUIDEBOOKS');
        let getDoc = guideBookRef.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                var title = {'title' : doc.id};
                var data2 = Object.assign(title, doc.data());
                data2 = JSON.stringify(data2);
                guideBooks.push(data2)
            })
            res.json(guideBooks);
            return;
        })
        .catch(err => {
            res.json({'result' : 'fail'});
            console.log('Error getting document', err);
            return;
        });
        // 
    } catch(err){
        res.json({'result' : 'fail'});
        console.log(err);
        return;
    }
});

router.get('/login-google', function(req, res, next){
    console.log('로그인 요청')
    res.render('board_guidebook/test', {row: ""});
    
    //redirectGoogleLogin();
})

router.get('/logout-google', function(req, res, next){
    console.log('로그아웃 요청')
    res.render('board_guidebook/logout', {row: ""});
    
    //redirectGoogleLogin();
})



router.post('/insertFromExtension', function(req, res, next){
    db.collection('board').orderBy("brddate", "desc").get()
    .then((snapshot) => {
        var rows = [];
        snapshot.forEach((doc) => {
            var childData = doc.data();
            //childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
            console.log(childData)
            rows.push(childData);
        });
        //res.render('board2/boardList', {rows: rows});
        res.send(rows);
        return;
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });


    // // update
    // db.collection('board').doc(req.query.brdno).get()
    // .then((doc) => {
    //     var childData = doc.data();
    //     res.render('board2/boardForm', {row: childData});
    //     console.log(childData)
    //     res.send("welcome! " + childData)
    //     return;
    // })
    // .catch((err) => {
    //     console.log('Error getting documents', err);
    // });
});
























router.get('/',function(req, res, next) {
    console.log('gg')
    res.redirect('boardList');
});

router.get('/boardList', function(req, res, next) {
    db.collection('board').orderBy("brddate", "desc").get()
    .then((snapshot) => {
        var rows = [];
        snapshot.forEach((doc) => {
            var childData = doc.data();
            //childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
            rows.push(childData);
        });
        res.render('board2/boardList', {rows: rows});
        return;
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
});

router.get('/boardRead', function(req, res, next) {
    db.collection('board').doc(req.query.brdno).get()
    .then((doc) => {
        var childData = doc.data();
        
        childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd hh:mm");
        res.render('board2/boardRead', {row: childData});
        return;
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
});

router.get('/boardForm', function(req,res,next){
    if (!req.query.brdno) { // new
        res.render('board2/boardForm', {row: ""});
        return;
    }
   
    // update
    db.collection('board').doc(req.query.brdno).get()
        .then((doc) => {
            var childData = doc.data();
            res.render('board2/boardForm', {row: childData});
            return;
        })
        .catch((err) => {
            console.log('Error getting documents', err);
    });
});

router.post('/boardSave', function(req,res,next){
    var postData = JSON.parse( JSON.stringify(req.body));
    var doc = null;
    if (!postData.brdno) {  // new
        postData.brddate = Date.now();
        doc = db.collection("board").doc();
        postData.brdno = doc.id;
        doc.set(postData);
    } else {                // update
        doc = db.collection("board").doc(postData.brdno);
        doc.update(postData);
    }
   
    res.redirect('boardList');
});

router.get('/boardDelete',function(req,res,next){
    db.collection('board').doc(req.query.brdno).delete()
 
    res.redirect('boardList');
});

module.exports = router;






    //console.log(loginCheck(req.body.accessToken));
    // console.log(loginCheck());
    // admin.auth().verifyIdToken(req.body.accessToken)
    // .then(function(decodedToken) {
    //     console.log(decodedToken)
    //     let uid = decodedToken.uid;
    //     // ...
    //     console.log('유효')
        
    //     // capital: false, population: 860000,
    //     // regions: ['west_coast', 'norcal']
    //     // var postData = JSON.parse( JSON.stringify(req.body));
    //     // var doc = null;
    //     // if (!postData.brdno) {  // new
    //     //     postData.brddate = Date.now();
    //     //     doc = db.collection("BOARD_GUIDEBOOK").doc();
    //     //     postData.brdno = doc.id;
    //     //     doc.set(postData);
    //     // } else {                // update
    //     //     doc = db.collection("BOARD_GUIDEBOOK").doc(postData.brdno);
    //     //     doc.update(postData);
    //     // }
        
    //     return;
    // }).catch(function(error) {
    //     console.log('유효하지않은 토큰')
    //     return;
    // });



// // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
// var provider = new firebase.auth.GoogleAuthProvider();
// //auth
// //브라우저 창이 닫히거나 React Native에서 활동이 폐기된 경우에도 상태가 유지됨을 나타냅니다. 이 상태를 삭제하려면 명시적으로 로그아웃해야 합니다. Firebase 인증 웹 세션은 단일 호스트 출처이며 단일 도메인의 경우에만 유지된다는 점에 유의하세요. https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=ko#supported_types_of_auth_state_persistence
// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         //chrome.runtime.sendMessage('mcbcpehojgnomagjldjkiciklakkgkhi',{message: user}, null);
//         var obj = JSON.parse(JSON.stringify(user));
//         window.parent.postMessage(obj, "*");   // '*' on any domain  
//         console.log(user)
//         // User is signed in.
//     } else {
//         console.log('not login')
//         // No user is signed in.
//     }
// });

// // 구글 인증 기능 추가

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

// function googleLogout(){
//     firebase.auth().signOut().then(function() {
//   // Sign-out successful.
//     console.log('logout')
//     return;
//   }).catch(function(error) {
//   // An error happened.
//   });
// }



// async function loginCheck(accessToken){
//     var bol = false;


//     await 

//     function a(){
//         bol = true;
//     }

//     return bol

// }