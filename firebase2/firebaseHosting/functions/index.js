const functions = require('firebase-functions');
const express = require("express")
const app1 = express();
var path = require('path');

app1.set('view engine', 'ejs');
app1.engine('ejs', require('ejs').__express);


app1.use('/guidebook/extension', require('./board_guidebook'));



app1.use('/js',express.static(path.join(__dirname, 'js')));
app1.use('/assets',express.static(path.join(__dirname, 'assets')));
// console.log(__dirname)
// app1.use("/js", express.static(__dirname, "/js"))

//app1.use(express.static('js'))

const api1 = functions.https.onRequest(app1)

module.exports = {
  api1
}
