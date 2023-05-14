import Notiflix from 'notiflix';
const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages,',
});
const URL = 'https://restcountries.com/v3.1/name/';
 export function fetchCountries(name) {
  return fetch(
    `${URL}${name}?${searchParams}`
  )
    .then(res => {
        if(res.status===404) {
            Notiflix.Notify.failure(`Error: ${error.message}`);
            throw new Error('Oops, there is no country with that name');
        }
      return res.json();
    })
    
}

