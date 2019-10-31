var firebase = require("firebase");
require("firebase/auth");
require("firebase/firestore");

// cloud firestore 인스턴스 초기화
firebase.initializeApp({
    apiKey: "AIzaSyAsuqJ-7DH6YCl3zoi90u7DqsD6vIL_PV0",
    authDomain: "fir-ex-63c1a.firebaseapp.com",
    databaseURL: "https://fir-ex-63c1a.firebaseio.com",
    projectId: "fir-ex-63c1a",
    storageBucket: "fir-ex-63c1a.appspot.com",
    messagingSenderId: "912304737763",
    appId: "1:912304737763:web:fa199b4e434c11b27864d6",
    measurementId: "G-6P274N0X3F"
});
var db = firebase.firestore();

//데이터 추가
// 컬렉션에 저장되는 문서에 데이터를 저장. 문서에 데이터를 처음 추가할 때 
// Cloud Firestore에서 암시적으로 컬렉션과 문서를 만든다. 컬렉션이나 문서를
// 명시적으로 만들 필요가 없다.
db.collection("users").add({
    first:"aa",
    lass:"love",
    born:1815
}).then(function(docRef){
    console.log("Document written with ID: ", docRef.id);
}).catch(function(error){
    console.error("Error adding document : ", error);
});
// users컬렉션에 다른 문서를 추가한다. 첫번째 문서에는 타나자이 않는 키밸류 쌍이
// 문서에 포함된다는 점에 유의. 컬렉션의 문서에는 다른 정보의 집합이 포함될 수
// 있다.
db.collection("users").add({
    first:"alan",
    middle:"Mathison",
    last:"Turing",
    born:1912
}).then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
