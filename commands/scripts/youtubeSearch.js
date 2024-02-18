
const {google} = require('googleapis');

const api = 'insert api key here';


// Initialize the YouTube API client
const youtube = google.youtube({
    version: 'v3',
    auth: api,
  });
  
  const searchYouTube = (searchQuery, maxResults) => {
    return new Promise((resolve, reject) => {
      const youtube = google.youtube({
        version: 'v3',
        auth: api,
      });
  
      youtube.search.list({
        q: searchQuery,
        part: 'id,snippet',
        maxResults: 1,
      }, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
  
        const searchResults = response.data.items;
        const videos = searchResults.map(result => {
          const videoTitle = result.snippet.title;
          const videoId = result.id.videoId;
          const videoImg = result.snippet.thumbnails;
          const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
          return {
            title: videoTitle,
            url: videoURL,
            img: videoImg,
          };
        });
  
        resolve(videos);
      });
    });
  };
  

  module.exports = searchYouTube;