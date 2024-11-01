import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import httpRequest from './js/pixabay-api.js';
import createMarkup from './js/render-functions.js';

const key = '46849088-f4247fdb1b297b5b75b98a0ef';
const form = document.querySelector('.form');
const list = document.querySelector('.list');

form.addEventListener('submit', searchHandler);
function searchHandler(evt) {
  list.innerHTML = '';
  const text = evt.target.elements.input.value.trim();
  evt.preventDefault();
  if (text != 0) {
    form.insertAdjacentHTML('afterend', '<span class="loader"></span>');
    const loader = document.querySelector('.loader');
    httpRequest(key, text)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        const photos = data.hits;
        if (photos.length !== 0) {
          list.insertAdjacentHTML('beforeend', createMarkup(photos));
          const lightbox = new SimpleLightbox('.list a', {
            captions: true,
            captionType: 'attr',
            captionsData: 'alt',
            captionPosition: 'bottom',
            captionDelay: 250,
          });
          lightbox.refresh();
        } else {
          iziToast.show({
            class: 'toast',
            position: 'topRight',
            icon: 'icon',
            iconUrl: err,
            iconColor: 'white',
            messageColor: 'white',
            message: `Sorry, there are no images matching your search query. Please try again!`,
            backgroundColor: 'red',
          });
        }
      })
      .catch(error => {
        iziToast.show({
          class: 'toast',
          position: 'topRight',
          icon: 'icon',
          iconUrl: err,
          iconColor: 'white',
          messageColor: 'white',
          title: 'Error',
          titleColor: 'white',
          message: `Please try again!`,
        });
        if (error.response) {
          console.error('Server error:', error.response.status);
        } else if (error.request) {
          console.error('No response from server');
        } else {
          console.error('Unknown error:', error.message);
        }
      })
      .finally(() => (loader.style.display = 'none'));
    form.reset();
  }
}
