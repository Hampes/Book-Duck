export const yourPageMode = () => {
  let userDiv = document.getElementById("userDiv");
  let heroDiv = document.getElementById("heroDiv");
  document.getElementById("logAndRegDiv").classList.add("hidden");
  document.getElementById("logAndRegDiv").classList.remove("logAndRegDiv");

  let bookDiv = document.getElementById("booksDiv");
  bookDiv.innerHTML = "";
  savedBooks.innerHTML = "";

  if (sessionStorage.getItem("token")) {
    userDiv.classList.remove("hidden");
    heroDiv.classList.add("hidden");

    let showSavedBooks = async () => {
      let loginID = sessionStorage.getItem("id");
      let response = await axios.get(
        `http://localhost:1333/api/users/${loginID}?populate=deep,3`,
        {
          headers: {
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      let userName = sessionStorage.getItem("user").replace(/"/g, "");
      userName = userName.charAt(0).toUpperCase() + userName.slice(1);
      userDiv.innerHTML = `
  <h2 class="userH2">Välkommen <span class="user">${userName}</span></h2><br><br>
  <div>
    <h3>HHär kan du se dina sparade böcker</h3><br>
    <div class="sortBtnDiv">
      <button class="showSavedBooksButton">Visa sparade böcker</button>
      <button class="showRatedBooksButton">Visa betygsatta böcker</button>
    </div>
  </div>
  <div id="sortBtn" class="hidden">
    <button class="sortButton" id="sortTitle">Sortera på Titel</button>
    <button class="sortButton" id="sortAuthor">Sortera på Författare</button>
    <button class="sortButton" id="sortRating">Sortera på betyg</button>
  </div>
  <div id="savedBooks"></div>
</div>`;

      let showSavedBooksButton = document.querySelector(
        ".showSavedBooksButton"
      );

      function sortBooks(books, sortBy) {
        if (sortBy === "title") {
          return books.sort((a, b) =>
            a.attributes.books.data[0].attributes.title.localeCompare(
              b.attributes.books.data[0].attributes.title
            )
          );
        } else if (sortBy === "author") {
          return books.sort((a, b) =>
            a.attributes.books.data[0].attributes.author.localeCompare(
              b.attributes.books.data[0].attributes.author
            )
          );
        } else if (sortBy === "rating") {
          return books.sort(
            (a, b) =>
              b.attributes.books.data[0].attributes.rating -
              a.attributes.books.data[0].attributes.rating
          );
        }
        return books;
      }

      let showRatedBooks = async (sortBy = "title") => {
        let userId = sessionStorage.getItem("id");
        let response = await axios.get(
          `http://localhost:1333/api/user-ratings?filter[users]=${userId}&populate=deep,3`,
          {
            headers: {
              authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        let ratedBooks = response.data.data;
        ratedBooks = sortBooks(ratedBooks, sortBy);
        let ratedBooksDiv = document.getElementById("ratedBooksDiv");
        ratedBooksDiv.innerHTML = "";

        let displayedBookIds = new Set();

        for (let ratedBook of ratedBooks) {
          let book = ratedBook.attributes.books.data[0].attributes;
          let user = ratedBook.attributes.users_permissions_users.data[0];

          let bookId = book.title;

          let rating = "";
          if (book.rating == null) {
            rating = "No rating yet";
          } else if (book.rating != null) {
            rating = book.rating + "/5";
          }

          if (!displayedBookIds.has(bookId) && user.id == userId) {
            ratedBooksDiv.innerHTML += `
              <div class="titleImgDiv">
              <div class="bookInfoDiv">
                <h3><span class="boldInfo">Titel:</span> ${book.title}</h3>
                <p><span class="boldInfo">Författare:</span> ${book.author}</p>
                <p><span class="boldInfo">Antal sidor:</span> ${book.numberOfPages}</p>
                <p><span class="boldInfo">Utgivningsdatum:</span> ${book.bookReleased}</p>
      
                <p class="ratingsP"><span class="boldInfo">Betyg:</span> ${rating}</p>
                </div>
                <img class="booksImages" src="http://localhost:1333${book.bookImg.data.attributes.url}" alt="">
                </div>
              `;
            displayedBookIds.add(bookId);
          }
        }
      };

      let savedBookFunction = async () => {
        let savedBooks = document.getElementById("savedBooks");
        savedBooks.innerHTML = "";
        document.getElementById("ratedBooksDiv").innerHTML = "";
        savedBooks.classList.remove("hidden");
        document.getElementById("sortBtn").classList.add("hidden");

        for (let book of response.data.books) {
          let rating = "";
          if (book.rating == null) {
            rating = "No rating yet";
          } else if (book.rating != null) {
            rating = book.rating + "/5";
          }

          savedBooks.innerHTML += `
                        <div class="titleImgDiv">
        <div class="bookInfoDiv">
          <h3><span class="boldInfo">Titel:</span> ${book.title}</h3>
          <p><span class="boldInfo">Författare:</span> ${book.author}</p>
          <p><span class="boldInfo">Antal sidor:</span> ${book.numberOfPages}</p>
          <p><span class="boldInfo">Utgivningsdatum:</span> ${book.bookReleased}</p>
          <p class="ratingsP"><span class="boldInfo">Betyg:</span> ${rating}</p>
          <button id="deleteBook${book.id}" class="deleteBook bookBtn">Remove</button>
          </div>
          <img class="booksImages" src="http://localhost:1333${book.bookImg.url}" alt="">
          </div>
                      `;
        }
        await deleteBtnFunction();
      };
      showSavedBooksButton.addEventListener("click", async (e) => {
        e.preventDefault();
        document.getElementById("sortBtn").classList.remove(".sortBtn");
        await savedBookFunction();
      });
      let deleteBtnFunction = async () => {
        let deleteBook = document.querySelectorAll(".deleteBook");
        for (let button of deleteBook) {
          button.addEventListener("click", async (e) => {
            e.preventDefault();
            let bookId = e.target.id.replace("deleteBook", "");
            bookId = parseInt(bookId);
            let loginID = sessionStorage.getItem("id");

            try {
              const response = await axios.put(
                `http://localhost:1333/api/books/${bookId}`,
                {
                  data: {
                    users: {
                      disconnect: [loginID],
                    },
                  },
                }
              );
              await savedBookFunction(); // Uppdatera savedBooks efter att du har tagit bort en bok
            } catch (error) {}
          });
        }
      };

      let showRatedBooksButton = document.querySelector(
        ".showRatedBooksButton"
      );
      showRatedBooksButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("savedBooks").innerHTML = "";
        document.getElementById("booksDiv").classList.add("hidden");
        document.getElementById("ratedBooksDiv").classList.add("ratedBooksDiv");
        document.getElementById("ratedBooksDiv").classList.remove("hidden");
        document.getElementById("sortBtn").classList.remove("hidden");

        // Lägg till event listeners för sortering
        document
          .getElementById("sortTitle")
          .addEventListener("click", () => showRatedBooks("title"));
        document
          .getElementById("sortAuthor")
          .addEventListener("click", () => showRatedBooks("author"));
        document
          .getElementById("sortRating")
          .addEventListener("click", () => showRatedBooks("rating"));

        showRatedBooks();
      });
    };

    showSavedBooks();
  } else if (sessionStorage.getItem("token") == null) {
    userDiv.innerHTML = `<h2 class="userH2">You need to be logged in to see this page</h2>`;
    userDiv.classList.remove("hidden");
    heroDiv.classList.remove("heroDiv");
    heroDiv.classList.add("hidden");
  }
};

yourPage.addEventListener("click", (e) => {
  e.preventDefault();

  yourPageMode();
});
