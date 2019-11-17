
// Get a reference to the database service
var database = firebase.database();

function writeUserData(userId, name, email, htmlCOde, imageUrl) {
    firebase.database().ref('users/' + 3).set({
        username: name,
        email: email,
        htmlCode : htmlCOde,
        profile_picture : imageUrl
    });
}

function readUserData(){
    return firebase.database().ref('/users/' + '2').once('value').then(function(snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    alert(username)
    // ...
    });
}












$('#insertData').click(function(){
    writeUserData('1', '오혜성', 'naver', 'https://imgur.com')
})

$('#getDataList').click(function(){
    readUserData();
})