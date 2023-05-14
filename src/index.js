/*
+ 1. отримати рефси
+ 2. зробити функцію фетч
+ 3.повішати слухач на інпут і робити(передавати запит користувача "назву")  кожні 300мс
+ 4.перевіряти відповіідь сервера
    4.1 якщо негативна (не порожній масив, а помилку зі статусом 404)- виводити помилку
    4.2 якщо більше 10 результатів - інформувати користувача
    4.3 якщо знайшло від 2 до 10 країн - виводити прапор і країну 
    4.4 якщо результат запиту - масив із однією країною - 
    відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови
+ 5. отримаємо результат та перебираємо масив країн і створюємо з нього розмітку(збираємо одну строку)
    5.1 зробити функцію createMarkup
+ 6. показуємо користувачу розмітку (innerHTML)
*/
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  //   console.log('hi');
  const countryName = refs.input.value.trim();
  if (!countryName) {
    clearAll();
    return;
  }
  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      fillMarkup(data);
    })
    .catch(error => {
      clearAll();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMurkupList(data) {
  return data.reduce((acumulator, { name: { official }, flags: { svg } }) => {
    return (
      acumulator +
      `<li class="list"><img src="${svg}" alt="${official}" width='30'><span>${official}</span></li>`
    );
  }, '');
}
function createMarkUpInfo(data) {
  return data
    .map(
      ({
        name: { official },
        flags: { svg },
        capital,
        population,
        languages,
      }) => {
        const langs = Object.values(languages).join(', ');
        return `<img src="${svg}" alt="${official}" width="100"><h5>${official}</h5><p>Capital: ${capital}</p><p>Population: ${population}</p><p>Languages: ${langs}</p>`; // додайте return тут
      }
    )
    .join('');
}
function fillMarkup(data) {
  if (data.length >= 2 && data.length <= 10) {
    refs.list.innerHTML = createMurkupList(data);
  }
  if (data.length === 1) {
    refs.list.innerHTML = createMarkUpInfo(data);
  }
}
function clearAll() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}
