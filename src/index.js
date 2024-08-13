import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  form: document.querySelector('.search-form'),
  cardDiv: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
};

const BASE_URL = 'https://pixabay.com/api/';
let pageCounter = 1;
let lightbox;

selectors.form.addEventListener('submit', formSubmit);
selectors.btnMore.addEventListener('click', fetchMore);

function formSubmit(e) {
  e.preventDefault();
  selectors.cardDiv.innerHTML = '';
  const inputValue = e.currentTarget.elements[0].value;
  pageCounter = 1;
  fetchGetUser(inputValue)
    .then(({ hits, totalHits }) => {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      selectors.cardDiv.innerHTML = hits.map(createMarkup).join('');
      lightbox = new SimpleLightbox('.photo-card a', {
        /* options */
      });
      selectors.btnMore.classList.remove('hidden');
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function fetchGetUser(value) {
  return axios
    .get(
      `${BASE_URL}?key=45402382-bdda8f309a8fc5b626a41cecf&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCounter}`
    )
    .then(res => res.data);
}

function createMarkup(hits) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = hits;
  return `
  <div class="photo-card">
  <a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" width="300" heigth="300"  loading="lazy" /> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
}

function fetchMore() {
  selectors.btnMore.classList.add('hidden');
  const inputValue = selectors.form.elements[0].value;
  pageCounter += 1;
  fetchGetUser(inputValue)
    .then(({ hits, totalHits }) => {
      selectors.cardDiv.insertAdjacentHTML(
        'beforeend',
        hits.map(createMarkup).join('')
      );
      lightbox.refresh();
      selectors.btnMore.classList.remove('hidden');
      if (pageCounter * hits.length >= totalHits) {
        selectors.btnMore.classList.add('hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}
