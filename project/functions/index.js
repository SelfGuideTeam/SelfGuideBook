const functions = require("firebase-functions");
const express = require("express");
const app = express();
const http = require("https");
const fs = require("fs");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const cors = require("cors")({
  origin: true
});
// var dateFormat = require('dateformat');
const admin = require("firebase-admin");
let checkRevoked = true;

// require 경로에 ..(상위) 있으면 deploy안됨
admin.initializeApp({
  credential: admin.credential.cert(
    require("./fir-ex-63c1a-firebase-adminsdk-d7x5c-db2abb88bc.json")
  ),
  databaseURL: "https://fir-ex-63c1a.firebaseio.com"
});

//firestore
var db = admin.firestore();
db.settings({
  timestampsInSnapshots: true
});

function validToken(accessToken) {
  return new Promise((resolve, reject) => {
    admin
      .auth()
      .verifyIdToken(accessToken, checkRevoked)
      .then(function (decodedToken) {
        console.log("유효");
        resolve(decodedToken);
        return;
      })
      .catch(function (error) {
        console.log("유효하지않은 토큰");
        reject(error);
        return;
      });
  });
}

function revokeToken(uid) {
  // Revoke all refresh tokens for a specified user for whatever reason.
  // Retrieve the timestamp of the revocation, in seconds since the epoch.
  return new Promise((resolve, reject) => {
    admin
      .auth()
      .revokeRefreshTokens(uid)
      .then(() => {
        return admin.auth().getUser(uid);
      })
      .then(userRecord => {
        return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
      })
      .then(timestamp => {
        console.log("Tokens revoked at: ", timestamp);
        resolve(timestamp);
        return;
      })
      .catch(function (error) {
        reject(error);
        return;
      });
  });
}

app.use(cors);

app.get("/", (req, res) => {
  res.send("aaaa");
});

app.get("/bigben", (req, res) => {
  res.send("asdasd");
});

app.post("/pdfSave", async function (req, res, next) {
  try {
    console.log('pdfSave');
    console.log(req.body.pdf);

    var externalURL = req.body.pdf;






    fs.readFile(externalURL, function (err, data) {
      var fileData = new Buffer(data).toString('base64');
      console.log("A");
      console.log(fileData);

    });



    res.json({
      result: "success"
    });


  } catch (err) {
    res.json({
      result: "fail"
    });
    console.log(err);
    return;
  }
});

app.post("/createGuideBook", async function (req, res, next) {
  try {
    let guideBookRef = db
      .collection("BOARD_GUIDEBOOK")
      .doc(req.body.email)
      .collection("GUIDEBOOKS")
      .doc(req.body.title);
    let getDoc = guideBookRef
      .get()
      .then(doc => {
        if (!doc.exists) {
          guideBookRef
            .set({
              html: req.body.htmlCode,
              created_date: Date.now(),
              modifiyed_date: Date.now()
            })
            .then(function (error) {
              console.log(error);
              var responseData = {
                result: "success"
              };
              res.json(responseData);
              return;
            })
            .catch(function (error) {
              return;
            });
        } else {
          var responseData = {
            result: "overlap"
          };
          res.json(responseData);
          return;
        }
        return;
      })
      .catch(err => {
        console.log(err);
        res.json(err);
        return;
      });
  } catch (err) {
    console.log(err);
    res.json(err);
    return;
  }
});

app.post("/verifyIdToken", async function (req, res, next) {
  try {
    await validToken(req.body.accessToken);
    res.json({
      result: "success"
    });
    return;
  } catch (err) {
    res.json({
      result: "fail"
    });
    console.log(err);
    return;
  }
});

app.post("/logout", async function (req, res, next) {
  try {
    let timestamp = await revokeToken(req.body.uid);
    const metadataRef = admin.database().ref("metadata/" + req.body.uid);
    metadataRef
      .set({
        revokeTime: timestamp
      })
      .then(() => {
        res.json({
          result: "success"
        });
        return;
      })
      .catch(error => {
        console.log(error);
        return;
      });
    return;
  } catch (err) {
    res.json({
      result: "fail"
    });
    console.log(err);
    return;
  }
});

app.post("/setGuideBook", async function (req, res, next) {
  try {
    if (req.body.altTitle === "null") {
      let guideBookRef = db
        .collection("BOARD_GUIDEBOOK")
        .doc(req.body.email)
        .collection("GUIDEBOOKS")
        .doc(req.body.title);
      let getDoc = guideBookRef
        .get()
        .then(doc => {
          if (!doc.exists) {
            var responseData = {
              result: "fail"
            };
            res.json(responseData);
            return;
          } else {
            guideBookRef
              .update({
                html: req.body.htmlCode,
                modifiyed_date: Date.now()
              })
              .then(function (error) {
                console.log(error);
                var responseData = {
                  result: "success"
                };
                res.json(responseData);
                return;
              })
              .catch(function (error) {
                return;
              });
          }
          return;
        })
        .catch(err => {
          console.log(err);
          res.json(err);
          return;
        });
    } else {
      let guideBookRef = db
        .collection("BOARD_GUIDEBOOK")
        .doc(req.body.email)
        .collection("GUIDEBOOKS")
        .doc(req.body.altTitle);
      let getDoc = guideBookRef
        .get()
        .then(doc => {
          if (!doc.exists) {
            guideBookRef
              .set({
                html: req.body.htmlCode,
                created_date: Date.now(),
                modifiyed_date: Date.now()
              })
              .then(function (error) {
                console.log(error);
                var responseData = {
                  result: "success"
                };
                res.json(responseData);
                return;
              })
              .catch(function (error) {
                return;
              });
          } else {
            var responseData = {
              result: "overlap"
            };
            res.json(responseData);
            return;
          }
          return;
        })
        .catch(err => {
          console.log(err);
          res.json(err);
          return;
        });
    }
  } catch (err) {
    console.log(err);
    res.json(err);
    return;
  }
});

app.post("/deleteGuideBook", async function (req, res, next) {
  console.log("req body : ");
  console.log(req.body.titles.length);

  req.body.titles.every(function (title, index) {
    console.log("temp guidebook deleted : " + title);
    db.collection("BOARD_GUIDEBOOK")
      .doc(req.body.email)
      .collection("GUIDEBOOKS")
      .doc(title)
      .delete();
    return true;
  });

  res.json({
    result: "success"
  });
});

app.post("/getGuideBookList", async function (req, res, next) {
  try {
    var guideBooks = new Array();
    let guideBookRef = db
      .collection("BOARD_GUIDEBOOK")
      .doc(req.body.email)
      .collection("GUIDEBOOKS");
    let getDoc = guideBookRef
      .orderBy("created_date")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          //console.log(doc.id, " => ", doc.data());
          var title = {
            title: doc.id
          };
          var data2 = Object.assign(title, doc.data());
          data2 = JSON.stringify(data2);
          guideBooks.push(data2);
        });
        res.json(guideBooks);
        return;
      })
      .catch(err => {
        res.json({
          result: "fail"
        });
        console.log("Error getting document", err);
        return;
      });
    //
  } catch (err) {
    res.json({
      result: "fail"
    });
    console.log(err);
    return;
  }
});

app.post("/insertFromExtension", function (req, res, next) {
  db.collection("board")
    .orderBy("brddate", "desc")
    .get()
    .then(snapshot => {
      var rows = [];
      snapshot.forEach(doc => {
        var childData = doc.data();
        //childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
        console.log(childData);
        rows.push(childData);
      });
      //res.render('board2/boardList', {rows: rows});
      res.send(rows);
      return;
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});

app.post("/getMainBoard", function (req, res, next) {
  try {
    var guideBooks = new Array();
    const criteriaDate = Date.now() - 1209600000; //2주 전의 날짜
    console.log("criteriaDate : " + criteriaDate);
    let guideBookRef = db
      .collection("notes")
      .where("date", ">", criteriaDate)
      .orderBy("date", "desc");

    guideBookRef
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (guideBooks.length < 3) {
            guideBooks.push(doc.data());
          } else {
            guideBooks.every(function (doc2, index) {
              if (doc2.view < doc.data().view) {
                guideBooks[index] = doc.data();
                return false;
              } else {
                return true;
              }
            });
          }
        });
        console.log(guideBooks);
        res.json({
          result: guideBooks
        });
        return;
      })
      .catch(err => {
        console.log("Error getting documents", err);
        return;
      });
  } catch (err) {
    res.json({
      result: "fail"
    });
    console.log(err);
    return;
  }
});

exports.app = functions.https.onRequest(app);