var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var dateFormat = require('dateformat');
 
router.get('/',function(req, res, next) {
    res.redirect('boardList');
});
 
var config = {
    apiKey: "AIzaSyAsuqJ-7DH6YCl3zoi90u7DqsD6vIL_PV0",
    authDomain: "fir-ex-63c1a.firebaseapp.com",
    databaseURL: "https://fir-ex-63c1a.firebaseio.com",
    projectId: "fir-ex-63c1a",
    storageBucket: "fir-ex-63c1a.appspot.com",
    messagingSenderId: "912304737763",
    appId: "1:912304737763:web:fa199b4e434c11b27864d6",
    measurementId: "G-6P274N0X3F"
};
firebase.initializeApp(config);
var db = firebase.firestore();
 
router.get('/boardList',function(req, res, next) {
    db.collection('board').orderBy("brddate","desc").get()
        .then((snapshot) => {
            var rows = [];
            snapshot.forEach((doc) => {
                var childData = doc.data();
                childData.brddate = dateFormat(childData.brddate,"yyyy-mm-dd");
                rows.push(childData);
            });
            res.render('board2/boardList', {rows: rows});
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});
 
router.get('/boardRead',function(req, res, next) {
    db.collection('board').doc(req.query.brdno).get()
        .then((doc) => {
            var childData = doc.data();
             
            childData.brddate = dateFormat(childData.brddate,"yyyy-mm-dd hh:mm");
            res.render('board2/boardRead', {row: childData});
        })
});
 
router.get('/boardForm',function(req,res,next){
    if (!req.query.brdno) {// new
        res.render('board2/boardForm', {row:""});
        return;
    }
     
    // update
    db.collection('board').doc(req.query.brdno).get()
          .then((doc) => {
              var childData = doc.data();
              res.render('board2/boardForm', {row: childData});
          })
});
 
router.post('/boardSave',function(req,res,next){
    var postData = req.body;
    if (!postData.brdno) { // new
        postData.brddate = Date.now();
        var doc = db.collection("board").doc();
        postData.brdno = doc.id;
        doc.set(postData);
    }else {               // update
        var doc = db.collection("board").doc(postData.brdno);
        doc.update(postData);
    }
     
    res.redirect('boardList');
});
 
router.get('/boardDelete',function(req,res,next){
    db.collection('board').doc(req.query.brdno).delete()
 
    res.redirect('boardList');
});
 
module.exports = router;
