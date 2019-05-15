const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');
const bookShowcase = document.getElementById('main');
// I know having the API key exposed is dangerous; however, there 
// is no way for me to hide it if I'm deploying the app on Github Pages.
const API_KEY = 'AIzaSyCHzFyndY3mRU0WOqvBwTxnCCrwL1wam54';

searchButton.addEventListener('click', handleSearch);
searchBox.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) handleSearch();
});

async function handleSearch() {
  const inputValue = searchBox.value;

  if (inputValue === '' || inputValue.replace(/\s/, '') === '') {
    alert('Please enter a search term.');
    return;
  }

  const data = await getData(inputValue, API_KEY);
  handleAndDisplayData(data);
}

async function getData(query, APIKey) {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&key=${APIKey}`);
  const data = await response.json();
  return data;
}

function handleAndDisplayData(data) {
  const books = data.items;

  if (!books) {
    bookShowcase.innerHTML = 'Sorry, no books found!';
    return;
  }

  bookShowcase.innerHTML = '';

  books.forEach(book => {
    const cardDiv = document.createElement('div');
    const cardText = document.createElement('div');

    cardDiv.className = 'card';
    cardText.className = 'text-div';

    addCoverArtImage(book, cardDiv);
    addTextInfo(book, cardDiv, cardText);

    bookShowcase.appendChild(cardDiv);
  })
}

function addCoverArtImage(bookInfo, cardDiv) {
  const { volumeInfo: { infoLink } } = bookInfo;
  
  const thumbnail = bookInfo.volumeInfo.imageLinks ?
                    bookInfo.volumeInfo.imageLinks.thumbnail :
                    'https://i.imgur.com/izBfTfO.png'

  const coverArt = document.createElement('img');
  const anchorElem = document.createElement('a');

  anchorElem.href = infoLink;
  anchorElem.target = '_blank';

  coverArt.src = thumbnail;
  coverArt.className = 'cover-art';

  anchorElem.appendChild(coverArt);

  cardDiv.appendChild(anchorElem);
}

function addTextInfo(bookInfo, cardDiv, textDiv) {
  const {
    volumeInfo: {
      authors,
      infoLink,
      publisher,
      title
    }
  } = bookInfo;

  const titleElem = document.createElement('p');
  titleElem.textContent = title;
  titleElem.className = 'book-title';
  textDiv.appendChild(titleElem);

  const authorElem = document.createElement('p');
  authorElem.textContent = `by: ${authors ? authors[0] : 'Unknown'}`;
  authorElem.className = 'book-author';
  textDiv.appendChild(authorElem);

  const publisherElem = document.createElement('p');
  publisherElem.textContent = `Published by: ${publisher || 'Unknown'}`;
  publisherElem.className = 'book-publisher';
  textDiv.appendChild(publisherElem);

  cardDiv.appendChild(textDiv);
}