console.log("injected");
var x = function() { if (!window['YT']) {var YT = {loading: 0,loaded: 0};}if (!window['YTConfig']) {var YTConfig = {'host': 'http://www.youtube.com'};}if (!YT.loading) {YT.loading = 1;(function(){var l = [];
  YT.ready = function(f) {if (YT.loaded) {f();} else {l.push(f);}};window.onYTReady = function() {YT.loaded = 1;for (var i = 0; i < l.length; i++) {try {l[i]();}
  catch (e) {}}};YT.setConfig = function(c) {for (var k in c) {if (c.hasOwnProperty(k)) {YTConfig[k] = c[k];}}};var a = document.createElement('script');a.type = 'text/javascript';a.id = 'www-widgetapi-script';
  a.src = 'https:' + '//s.ytimg.com/yts/jsbin/www-widgetapi-vflcGItZc/www-widgetapi.js';a.async = true;var b = document.getElementsByTagName('script')[0];
  b.parentNode.insertBefore(a, b);})();} };
x();
console.log("stuff happened");
// function onYouTubeIframeAPIReady() {
  // console.log("ready");
// }
var z = document.getElementById("movie_player");
var b = document.getElementById("player-api");
console.log(window);
console.log(z);
console.log(b);

// function test() {
//   console.log(b.getVideoUrl());
// }
// window.setTimeout(test, 2000);
