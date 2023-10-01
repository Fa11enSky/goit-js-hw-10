// api key: live_zjktP70bUEcCwtKHt678pfCqUHuR5MGDhhd1Id3WRSMDaX7PH9iv5scgUh3N6TwV
//End poin: https://api.thecatapi.com/v1/breeds
import Notiflix from 'notiflix';
import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api.js';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

axios.defaults.headers.common['x-api-key'] =
  'live_zjktP70bUEcCwtKHt678pfCqUHuR5MGDhhd1Id3WRSMDaX7PH9iv5scgUh3N6TwV';

const refs = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  errorMessage: document.querySelector('.error'),
  container: document.querySelector('.cat-info'),
};
refs.select.addEventListener('change', handleChange);

start(fetchBreeds);

// ! Стартова функція, яка викликає всі інші приймає як колбек функію яка повертає проміс
function start(fetchFunction) {
  fetchFunction()
    .then(createMarkup)
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    })
    .finally(() => {
      visibilityControl(refs.loader, 'none');
      const slimSelect = new SlimSelect({
        select: refs.select,
      });
    });
}

//! створення полів в селекті
function createMarkup(obj) {
  const markup = obj
    .map(el => {
      return `
          <option value="${el.id}">${el.name}</option>`;
    })
    .join('');
  refs.select.innerHTML = markup;
  // видимість додаю тут бо якщо додавати після промісу в кінець, то воно відпрацьовує
  // коли розмітка ще не відмальована
  refs.select.classList.remove('visually-hidden');
}

//! контроль видимості завантаження
function visibilityControl(loader, status) {
  loader.style.display = status;
}

//! слухач для поля селект
//! Викликає дві функції, перша отримує id для пошуку повної інформації
//! Друга створює блок, з обєкта який повертає перша
function handleChange(ev) {
  visibilityControl(refs.loader, 'block');
  fetchCatByBreed(ev.target.value)
    .then(data => {
      createCatBlock(data, refs.container);
    })
    .then(() => {
      visibilityControl(refs.loader, 'none');
    })
    .catch(error => {
      visibilityControl(refs.loader, 'none');
      console.dir(error);
      Notiflix.Notify.failure(error.message);
    });
}

//! Для створення блоку з інформацією про котана
//! Приймає об'єкт і блок в який потрібно вставити розмітку
function createCatBlock(catObj, blockToInner) {
  const markup = `
  <div class="thumb"><img src="${catObj.url}" alt="${catObj.breeds[0].name}" width="${catObj.breeds[0].width}" height="${catObj.breeds[0].height}"></div>
 <div class="description">
   <h2>${catObj.breeds[0].name}</h2> 
   <p>${catObj.breeds[0].description}</p>
   <p><strong>Temperament:</strong>${catObj.breeds[0].temperament}</p>
    
 </div>`;
  blockToInner.innerHTML = markup;
}
