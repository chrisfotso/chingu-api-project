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
    if (inputValue === '' || inputValue.replace(/\s/, '') === '') {
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
        let cardDiv = document.createElement('div'), 
        let textSubDiv = document.createElement('div');
        cardDiv.className = 'card';
        textSubDiv.className = 'text-div';
        populateCardDiv(book, cardDiv, textSubDiv);
        mainDiv.appendChild(cardDiv);
    })
}

function populateCardDiv(bookInfo, parentDiv, childDiv) {
    const {volumeInfo: {authors, infoLink, publisher, title}} = bookInfo;
    const thumbnail = bookInfo.volumeInfo.imageLinks.thumbnail ? bookInfo.volumeInfo.imageLinks.thumbnail : null;

    (function addCoverArtImage(url, infoLink, parentDiv) {
        let coverArt = document.createElement('img');
        let googleBooksAnchorElem = document.createElement('a');
        googleBooksAnchorElem.href = infoLink;
        googleBooksAnchorElem.target = '_blank';
        coverArt.src = url || null;
        coverArt.className = 'cover-art';
        googleBooksAnchorElem.appendChild(coverArt);
        parentDiv.appendChild(googleBooksAnchorElem);
    })(thumbnail, infoLink, parentDiv);

    (function addTextInfo(title, authors, publisher, parentDiv) {
        let titleElem = document.createElement('p');
        titleElem.textContent = title;
        titleElem.className = 'book-title';
        childDiv.appendChild(titleElem);

        let authorElem = document.createElement('p');
        authorElem.textContent = `by: ${authors[0] || 'Unknown'}`;
        authorElem.className = 'book-author';
        childDiv.appendChild(authorElem);

        let publisherElem = document.createElement('p');
        publisherElem.textContent = `Published by: ${publisher || 'Unknown'}`;
        publisherElem.className = 'book-publisher';
        childDiv.appendChild(publisherElem);
    })(title, authors, publisher, parentDiv);

    parentDiv.appendChild(childDiv);
}

