function fetchBreeds() {
  return fetch('https://api.thecatapi.com/v1/breeds').then(response => {
    if (!response.ok) {
      throw new Error(
        'Oops! Something went wrong! Try reloading the page!(first fetch)'
      );
    }
    return response.json();
  });
}

// Отримує повну інформацію про котана через два запити:
// перший щоби дізнатись ідентифікатор
// другий щоби отримати обєкт з інформацією
function fetchCatByBreed(breedId) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
  )
    .catch(err => {
      throw new Error(
        'Oops! Something went wrong! Try reloading the (Помилка запиту, перевір мережу)'
      );
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(
          'Oops! Something went wrong! Try reloading the(Помилка при отримані ID)'
        );
      }

      return response.json();
    })
    .then(data => {
      return fetch(`https://api.thecatapi.com/v1/images/${data[0].id}`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(
          'Oops! Something went wrong! Try reloading the (Помилка при отримані вмісту)'
        );
      }
      return response.json();
    });
}

export { fetchBreeds, fetchCatByBreed };
