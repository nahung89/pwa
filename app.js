const newsArticles = document.querySelector('main');

var items;
var currentItem;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
      .then(registration => console.log('Service Worker registered'))
      .catch(err => console.error('SW registration failed: ' + err)));
}

if ('mediaSession' in navigator) {

  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    artwork: [
      { src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
      { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
      { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
      { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
      { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
      { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
    ]
  });

  navigator.mediaSession.setActionHandler('play', function() {});
  navigator.mediaSession.setActionHandler('pause', function() {});
  navigator.mediaSession.setActionHandler('seekbackward', function() {});
  navigator.mediaSession.setActionHandler('seekforward', function() {});
  navigator.mediaSession.setActionHandler('previoustrack', function() {});
  navigator.mediaSession.setActionHandler('nexttrack', function() {});
}

window.addEventListener('load', e => fetchVibbidi());

window.addEventListener('online', () => fetchVibbidi());

async function fetchVibbidi() {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://api4.vibbidi.com/v4.1/artists/794881599030348/singles?items_to_get=21&start_point=0&mpk=e429d5baeb58a5608e28c5f241e3e500e74f064b2&muid=966313229108987`)
  const json = await response.json();
  items = json.videos;
  newsArticles.innerHTML = 
     json.videos.map(createVibbidi).join('\n');

}

document.addEventListener("play", function(e) {
    if(window.$_currentlyPlaying && window.$_currentlyPlaying != e.target) {
        window.$_currentlyPlaying.pause();
    } 
    window.$_currentlyPlaying = e.target;

    e.target.addEventListener("ended", function(evt) {
      playNext(evt.target, evt.target.tagName.toLowerCase());
    });
}, true);

function playNext(currentItem, type) {
    var items;
     if (type === 'audio') {
        items = document.getElementsByTagName('audio');
     } else {
        items = document.getElementsByTagName('video');
     } 

     for(var i = 0, len = items.length; i < len;i++){
      if(items[i] == currentItem) {
        if (i+1 < items.length){
          items[i+1].play();
        } else {
          items[0].play();
        }
      } 
  }
}

function createVibbidi(item) {
  var mp4url = item.uri.replace("http", "https");
  return `
  <div class="video-wrapper">
      <h2>${item.id}</h2>
      <video controls poster="${mp4url}.jpg" class="my-video">
        <source src="${mp4url}" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <audio controls class="my-audio">
        <source src="${mp4url}.mp3" type="audio/mpeg" />
        Your browser does not support HTML5 audio.
      </audio>
  </div>
  `;
}

// <video controls poster="${item.uri}.jpg" style="margin: 0 0 1em 0; max-width: 100%; width: 480px;">

// document.addEventListener("ended", function(e) {
//   console.log("end: ", e.target);
  // // If audio end
  // if(e.target.tagName.toLowerCase() === 'audio') {
  //   var items = document.getElementsByTagName('audio');
  //   for(var i = 0, len = items.length; i < len;i++){
  //       if(items[i] == e.target) {
  //         if (i+1 < items.length){
  //           items[i+1].play();
  //         } else {
  //           items[0].play();
  //         }
  //       } 
  //   }
  // }
  // // If video end
  // if(e.target.tagName.toLowerCase() === 'video') {
  //   var items = document.getElementsByTagName('video');
  //   for(var i = 0, len = items.length; i < len;i++){
  //       if(items[i] == e.target) {
  //         if (i+1 < items.length){
  //           items[i+1].play();
  //         } else {
  //           items[0].play();
  //         }
  //       } 
  //   }
  // }
// }, true);