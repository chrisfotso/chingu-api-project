const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');
const mainDiv = document.getElementById('main');
const API_KEY = 'AIzaSyCHzFyndY3mRU0WOqvBwTxnCCrwL1wam54';

(() => {
    searchBox.value = '';
})();

searchButton.addEventListener('click', handleSearch);
searchBox.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) handleSearch();
});

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
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&key=${APIKey}`);
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
    books.forEach(book => {
        let cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        populateCardDiv(book, cardDiv);
        mainDiv.appendChild(cardDiv);
    })
}

function populateCardDiv(bookInfo, parentDiv) {
    const {volumeInfo: {authors, infoLink, publisher, title}} = bookInfo;
    const thumbnail = bookInfo.volumeInfo.imageLinks.thumbnail ? bookInfo.volumeInfo.imageLinks.thumbnail : null;

    (function addCoverArtImage(url, parentDiv) {
        let coverArt = document.createElement('img');
        coverArt.src = url;
        coverArt.className = 'cover-art';
        parentDiv.appendChild(coverArt);
    })(thumbnail, parentDiv);

    (function addTextInfo(title, authors, publisher, parentDiv) {
        let titleElem = document.createElement('p');
        titleElem.textContent = title;
        titleElem.className = 'book-title float-right';
        parentDiv.appendChild(titleElem);

        let authorElem = document.createElement('p');
        authorElem.textContent = `by: ${authors[0]}`;
        authorElem.className = 'book-author float-right';
        parentDiv.appendChild(authorElem);

        let publisherElem = document.createElement('p');
        publisherElem.textContent = `Published by: ${publisher}`;
        publisherElem.className = 'book-publisher float-right';
        parentDiv.appendChild(publisherElem);
    })(title, authors, publisher, parentDiv);
}

