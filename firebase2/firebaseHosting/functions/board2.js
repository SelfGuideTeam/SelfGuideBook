var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
 

const admin = require('firebase-admin');
const functions = require('firebase-functions');

// require 경로에 .. 있으면 deploy안됨 
admin.initializeApp({
    credential: admin.credential.cert(require('./ajaxtest-882ac-firebase-adminsdk-6ruzm-2eae10b6c1.json'))
});

var db = admin.firestore();
db.settings({timestampsInSnapshots: true})

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
            console.log('ss')
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





module.exports = router;

