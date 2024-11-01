export default function httpRequest(key, text) {
  return fetch(
    `https://pixabay.com/api/?key=${key}&q=${text}&image_type=photo&orientation=horizontal&safesearch=true`
  );
}
