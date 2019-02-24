const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');
const mainDiv = document.getElementById('main');
// I know having the API key exposed is dangerous; however, there 
// is no way for me to hide it if I'm deploying the app on Github Pages.
const API_KEY = 'AIzaSyCHzFyndY3mRU0WOqvBwTxnCCrwL1wam54';

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
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=21&key=${APIKey}`);
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
        let textSubDiv = document.createElement('div');
        cardDiv.className = 'card';
        textSubDiv.className = 'text-div';
        populateCardDiv(book, cardDiv, textSubDiv);
        mainDiv.appendChild(cardDiv);
    })
}

function populateCardDiv(bookInfo, parentDiv, childDiv) {
    const {volumeInfo: {authors, infoLink, publisher, title}} = bookInfo;
    let thumbnail;
    if (bookInfo.volumeInfo.imageLinks) {
        thumbnail = bookInfo.volumeInfo.imageLinks.thumbnail;
    } else {
        thumbnail = `https://i.imgur.com/izBfTfO.png`;
    }


    if (thumbnail) {
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
    }

    (function addTextInfo(title, authors, publisher, parentDiv) {
        let titleElem = document.createElement('p');
        titleElem.textContent = title;
        titleElem.className = 'book-title';
        childDiv.appendChild(titleElem);

        if (authors) {
            let authorElem = document.createElement('p');
            authorElem.textContent = `by: ${authors[0] || 'Unknown'}`;
            authorElem.className = 'book-author';
            childDiv.appendChild(authorElem);
        }

        let publisherElem = document.createElement('p');
        publisherElem.textContent = `Published by: ${publisher || 'Unknown'}`;
        publisherElem.className = 'book-publisher';
        childDiv.appendChild(publisherElem);
    })(title, authors, publisher, parentDiv);

    parentDiv.appendChild(childDiv);
}

