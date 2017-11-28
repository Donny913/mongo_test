'use strict';

const getDataBtn = document.querySelector('#get-data-btn');
const authorGet = document.querySelector('#authorGet');
const titleGet = document.querySelector('#titleGet');

getDataBtn.addEventListener('click', () => {
  fetch('/api/get-data', {
    method: 'POST',
    body: JSON.stringify({
      author: authorGet.value,
      title: titleGet.value
    })
  })
    .then(response => {
      return response.json();
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.error(err);
    });
});
