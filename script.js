const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');
const mainDiv = document.getElementById('main');
const API_KEY = config.API_KEY;

searchButton.addEventListener('click', handleSearch);

(() => {
    searchBox.value = '';
})();

async function handleSearch() {
    let inputValue = searchBox.value;
    if (inputValue === '') {
        alert('Please enter a search term.');
        return;
    } else {
       let data = await getData(inputValue, API_KEY);
       handleAndDisplayData(data);
    }
}

async function getData(query, APIKey) {
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}?key=${APIKey}`);
    let data = await response.json();
    console.log(data);
    return data;
}

function handleAndDisplayData(data) {
    let books = data.items;
    if (!books) {
        mainDiv.innerHTML = 'Sorry, no books found!';
        return;
    }
    mainDiv.innerHTML = '';
    let booksUl = document.createElement('ul');
    mainDiv.appendChild(booksUl);
    books.forEach(book => {
        let bookLi = document.createElement('li');
        bookLi.textContent = book.volumeInfo.title;
        booksUl.appendChild(bookLi);
    })
}