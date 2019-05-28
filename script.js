const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const bookShowcase = document.getElementById("main");

// I know having the API key exposed is dangerous; however, there
// is no way for me to hide it if I'm deploying the app on Github Pages.
const API_KEY = "AIzaSyCHzFyndY3mRU0WOqvBwTxnCCrwL1wam54";

searchButton.addEventListener("click", handleSearch);

//Triggers search if user presses enter
searchBox.addEventListener("keydown", function(e) {
  if (e.keyCode === 13) handleSearch();
});

async function handleSearch() {
  const inputValue = searchBox.value;

  if (inputValue === "" || inputValue.replace(/\s/, "") === "") {
    alert("Please enter a search term.");
    return;
  }

  //Querying the API with the input value of the text box
  const data = await getData(inputValue, API_KEY);
  handleAndDisplayData(data);
}

async function getData(query, APIKey) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&key=${APIKey}`
  );
  const data = await response.json();
  return data;
}

function handleAndDisplayData(data) {
  const books = data.items;

  if (!books) {
    bookShowcase.innerHTML = "Sorry, no books found!";
    return;
  }

  //Clears the current books in the showcase every time a search is made
  bookShowcase.innerHTML = "";

  books.forEach(book => {
    const cardDiv = document.createElement("div"); //Div representing the entire card component
    const cardText = document.createElement("div"); //Div inside of card component that has text info - author, title, etc.

    cardDiv.className = "card";
    cardText.className = "text-div";

    addCoverArtImage(book, cardDiv);
    addTextInfo(book, cardDiv, cardText);

    bookShowcase.appendChild(cardDiv);
  });
}

function addCoverArtImage(bookInfo, cardDiv) {
  const {
    volumeInfo: { infoLink } //Destructuring the book object to get a link to more info about the book
  } = bookInfo;

  // The book object may or may not have a picture of the book
  // If cover art is present I'll use that, else I am using a placeholder image
  const thumbnail = bookInfo.volumeInfo.imageLinks
    ? bookInfo.volumeInfo.imageLinks.thumbnail
    : "https://i.imgur.com/izBfTfO.png";

  const coverArt = document.createElement("img");
  const anchorElem = document.createElement("a");

  anchorElem.href = infoLink; // The cover art on each card is a link to a page with more info about the book
  anchorElem.target = "_blank";

  coverArt.src = thumbnail;
  coverArt.className = "cover-art";

  anchorElem.appendChild(coverArt); //Making the cover art a child of the anchor elem so it is a clickable link

  cardDiv.appendChild(anchorElem); //Appending the cover art (which is now a clickable link) to the entire card component
}

function addTextInfo(bookInfo, cardDiv, textDiv) {
  //bookInfo is the individual book object
  //cardDiv is the card component
  //textDiv contains all the text — which is added to the div in this function
  const {
    volumeInfo: { authors, infoLink, publisher, title }
  } = bookInfo;

  const titleElem = document.createElement("p");
  titleElem.textContent = title;
  titleElem.className = "book-title";
  textDiv.appendChild(titleElem);

  const authorElem = document.createElement("p");
  authorElem.textContent = `by: ${authors ? authors[0] : "Unknown"}`; //Authors is an array; if authors are given I will use the first author in the array
  authorElem.className = "book-author";
  textDiv.appendChild(authorElem);

  const publisherElem = document.createElement("p");
  publisherElem.textContent = `Published by: ${publisher || "Unknown"}`; //Same logic as above, uses the publisher name if there is a publisher, else uses unkown
  publisherElem.className = "book-publisher";
  textDiv.appendChild(publisherElem);

  cardDiv.appendChild(textDiv); //Appending all the text info to the card component
}
