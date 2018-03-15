const newsArticles = document.querySelector('main');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
      .then(registration => console.log('Service Worker registered'))
      .catch(err => console.error('SW registration failed: ' + err)));
}

window.addEventListener('load', e => fetchVibbidi());

window.addEventListener('online', () => fetchVibbidi());

async function fetchVibbidi() {
  newsArticles.innerHTML = '';
  const response = await fetch(`http://v4-api.vibbidi.com:8018/v4.1/artists/794881599030348/singles?items_to_get=21&start_point=0&mpk=e429d5baeb58a5608e28c5f241e3e500e74f064b2&muid=966313229108987`)
  const json = await response.json();
  newsArticles.innerHTML = 
     json.videos.map(createVibbidi).join('\n');

}

function createVibbidi(item) {
  return `
  <div class="video-wrapper">
      <h2>${item.id}</h2>
      <video controls poster="${item.uri}.jpg">
        <source src="${item.uri}" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <audio controls>
        <source src="${item.uri}.mp3" type="audio/mpeg" />
        Your browser does not support HTML5 audio.
      </audio>
  </div>
  `;
}

// <video controls poster="${item.uri}.jpg" style="margin: 0 0 1em 0; max-width: 100%; width: 480px;">