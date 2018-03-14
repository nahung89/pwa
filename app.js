const youtubeApiKey = 'AIzaSyCuKiLLcCzZSW4Dw1KE0kRK3kOHCykFOig';
const youtubeChannelId = 'UCnUYZLuoy1rq1aVMwx4aTzw';
const newsArticles = document.querySelector('main');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
      .then(registration => console.log('Service Worker registered'))
      .catch(err => 'SW registration failed'));
}

window.addEventListener('load', e => {
  fetchVibbidi();
});

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
  <div class="article">
      <h2>${item.id}</h2>
      <video controls poster="${item.uri}.jpg" style="margin: 0 0 1em 0; max-width: 100%; width: 480px;">
        <source src="${item.uri}" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
  </div>
  `;
}


// async function fetchYoutube() {
//   newsArticles.innerHTML = '';
//   const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${youtubeChannelId}&key=${youtubeApiKey}`)
//   const json = await response.json();
//   newsArticles.innerHTML = 
//      json.items.map(createYoutube).join('\n');
// }


// function createYoutube(item) {
//   return `
//     <div class="article">
//         <h2>${item.id.videoId}</h2>
//         <video id="player-${item.id.videoId}" controls="" src="https://redirector.googlevideo.com/videoplayback?ratebypass=yes&amp;mt=1510077993----SKIPPED----amp;utmg=ytap1,,hd720"><source>Your browser does not support HTML5 video.</video>

//     </div>
//   `;
// }




// function createArticle(article) {
//   return `
//     <div class="article">
//       <a href="${article.url}">
//         <h2>${article.title}</h2>
//         <img src="${article.urlToImage}" alt="${article.title}">
//         <p>${article.description}</p>
//       </a>
//     </div>
//   `;
// }