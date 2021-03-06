const newsArticles = document.querySelector('main');
const statusElement = document.getElementById('status');
const apiUrl = 'https://api4.vibbidi.com/v4.1/artists/794881599030348/singles?items_to_get=5&start_point=0&mpk=e429d5baeb58a5608e28c5f241e3e500e74f064b2&muid=966313229108987'

var sourceVideos;
var currentItem;

// document.getElementById('version').innerHTML = CACHE_VERSION;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('service-worker.js') // sw.js
      .then(registration => console.log('Service Worker registered'))
      .catch(err => console.error('SW registration failed: ' + err)));

      // https://beebole.com/blog/building-pwa-web-app-android-ios/
      navigator.serviceWorker.addEventListener('controllerchange', function() {
        console.log( 'Service worker status changed: ', this.controller.state );
        // Listen for changes in the state of our ServiceWorker
        navigator.serviceWorker.controller.addEventListener('statechange', function() {
          // If the ServiceWorker becomes "activated", let the user know they can go offline!
          if (this.state === 'activated') {
              window.location.reload( true );
          }
        });
      });
}

function createMediaSession(source) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: source.title,
      artist: source.creator,
      album: null,
      artwork: [
        { src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
        { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
        { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
        { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
        { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
        { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
      ]
    });
  
    navigator.mediaSession.setActionHandler('play', function() {
      currentItem.play();
    });
    navigator.mediaSession.setActionHandler('pause', function() {
      currentItem.pause();
    });
    navigator.mediaSession.setActionHandler('previoustrack', function() {
      playPrev(currentItem, currentItem.tagName.toLowerCase());
    });
    navigator.mediaSession.setActionHandler('nexttrack', function() {
      playNext(currentItem, currentItem.tagName.toLowerCase())
    });
  }
}

// window.addEventListener('load', e => fetchVibbidi());

//Check if a new cache is available on page load.
window.addEventListener('load', function( ) {
  fetchVibbidi();
  window.applicationCache.addEventListener('updateready', function( ) {
    console.log( 'Service worker status changed: ', this.controller.state );
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        window.applicationCache.swapCache();
        window.location.reload( true );
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);
}, false);


window.addEventListener('online', () => fetchVibbidi());

async function fetchVibbidi() {
  try {
    const response = await fetch(apiUrl)
  const json = await response.json();
  sourceVideos = json.videos;
  newsArticles.innerHTML = 
     json.videos.map(createVibbidi).join('\n');
  statusElement.innerHTML = "Fetch API success";
  } catch (err) {
    statusElement.innerHTML = "Fail " + err;
  }
}

document.addEventListener("play", function(e) {
  if (currentItem && currentItem != e.target) {
      currentItem.pause();
  }
  currentItem = e.target;

  var items;
  if (currentItem.tagName.toLowerCase() === 'audio') {
     items = document.getElementsByTagName('audio');
  } else {
     items = document.getElementsByTagName('video');
  }

  for(var i = 0, len = items.length; i < len;i++){
    if(items[i] == currentItem) {
      createMediaSession(sourceVideos[i]);
    } 
  };

  e.target.addEventListener("ended", function(evt) {
    playNext(evt.target, evt.target.tagName.toLowerCase());
  });
}, true);

function playPrev(currentItem, type) {
  var items;
  if (type === 'audio') {
     items = document.getElementsByTagName('audio');
  } else {
     items = document.getElementsByTagName('video');
  } 

  for(var i = 0, len = items.length; i < len;i++){
    if(items[i] == currentItem) {
      if (i-1 >= 0){
        items[i-1].play();
      } else {
        items[len - 1].play();
      }
    } 
}
}

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

// function createVibbidiImage(item) {
//   var mp4url = item.uri.replace("http", "https");
//   return `
//   <div class="image-wrapper">
//       <h2>${item.id}</h2>
//       <img src="${mp4url}.jpg" />
//   </div>
//   `;
// }

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

// async function test() {
//   const response = await fetch('https://node-hnapi.herokuapp.com/show?page=1');
//   const json = await response.json();
//   console.log('Pre-fetching complete.' + json);
// }

// this line is just for testing