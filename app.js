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
  const response = await fetch(`https://api4.vibbidi.com/static/artists_794881599030348_singles_2items.json`)
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