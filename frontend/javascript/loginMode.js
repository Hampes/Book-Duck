import { yourPageMode } from "./yourPageMode.js";

export const loginMode = () => {
  let loginUsername = document.getElementById("loginUsername");
  let loginPassword = document.getElementById("loginPassword");
  let loginButton = document.getElementById("loginButton");
  let login = async () => {
    try {
      let response = await axios.post("http://localhost:1333/api/auth/local", {
        identifier: loginUsername.value,
        password: loginPassword.value,
      });
      sessionStorage.setItem("token", response.data.jwt);
      sessionStorage.setItem(
        "user",
        JSON.stringify(response.data.user.username)
      );
      sessionStorage.setItem("id", JSON.stringify(response.data.user.id));
      document.getElementById("booksDiv").classList.remove("hidden");

      loginPage.innerHTML = "Logout";

      document.getElementById("login").classList.remove("hidden");
      document.getElementById("register").classList.add("hidden");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Invalid username or password");
      }
    }
  };

  let booksDiv = document.getElementById("booksDiv");

  loginButton.addEventListener("click", async () => {
    await login();
    document.getElementById("logAndRegDiv").classList.add("hidden");
    document.getElementById("logAndRegDiv").classList.remove("logAndRegDiv");
    yourPageMode();
  });

  let loginPage = document.getElementById("loginPage");

  loginPage.addEventListener("click", () => {
    booksDiv.innerHTML = "";
    document.getElementById("savedBooks").innerHTML = "";
    document.getElementById("logAndRegDiv").classList.add("logAndRegDiv");

    document.getElementById("heroDiv").classList.add("hidden");
    document.getElementById("heroDiv").classList.remove("heroDiv");

    document.getElementById("ratedBooksDiv").classList.add("hidden");
    document.getElementById("ratedBooksDiv").classList.remove("ratedBooksDiv");
    document.getElementById("userDiv").innerHTML = "";
  });
};

// Funktion för att visa böcker och hantera betyg
export const loggedInMode = () => {
  // Funktion för att betygsätta en bok
  let rateBook = async (bookId, rating) => {
    try {
      // Skapa en ny användarbetygsinmatning i UserRating-samlingen
      let response = await axios.post(
        `http://localhost:1333/api/user-ratings`,
        {
          data: {
            rating: rating,
            books: {
              connect: [bookId],
            },
            users_permissions_users: {
              connect: [sessionStorage.getItem("id")],
            },
          },
        }
      );

      response = await axios.get(
        `http://localhost:1333/api/user-ratings?filter[books]=${bookId}&populate=books`
      );
      let userRatings = response.data;

      // Gruppera användarbetyg efter bok-ID
      let userRatingsByBook = {};
      userRatings.data.forEach((userRating) => {
        let bookId = userRating.attributes.books.data[0].id;
        if (!userRatingsByBook[bookId]) {
          userRatingsByBook[bookId] = [];
        }
        userRatingsByBook[bookId].push(userRating);
      });

      for (let bookId in userRatingsByBook) {
        let totalRating = 0;
        userRatingsByBook[bookId].forEach((userRating) => {
          totalRating += userRating.attributes.rating;
        });
        let avgRating = totalRating / userRatingsByBook[bookId].length;
        avgRating = Math.round(avgRating);

        // Uppdatera betygskolumnen i boksamlingen med genomsnittsbetyget
        let response = await axios.put(
          `http://localhost:1333/api/books/${bookId}`,
          {
            data: {
              rating: avgRating,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
      }
    } catch (error) {}
  };

  let showBooks = async () => {
    let response = await axios.get(
      "http://localhost:1333/api/books?populate=deep,3"
    );
    let booksDiv = document.getElementById("booksDiv");
    let savedBooks = document.getElementById("savedBooks");
    savedBooks.innerHTML = "";
    booksDiv.innerHTML = "";

    let books = response.data.data;

    for (let book of books) {
      let rating = "No rating yet";

      if (book.attributes.rating != null) {
        rating = book.attributes.rating + "/5";
      }

      booksDiv.innerHTML += `

        <div class="bookCard">

        <div class="titleImgDiv">
        <div class="bookInfoDiv">
          <h3><span class="boldInfo">Titel:</span> ${book.attributes.title}</h3>
          <p><span class="boldInfo">Författare:</span> ${book.attributes.author}</p>
          <p><span class="boldInfo">Antal sidor:</span> ${book.attributes.numberOfPages}</p>
          <p><span class="boldInfo">Utgivninsdatum:</span> ${book.attributes.bookReleased}</p>
          <p class="ratingsP"><span class="boldInfo">Betyg:</span> ${rating}</p>
          </div>
          <img class="booksImages" src="http://localhost:1333${book.attributes.bookImg.data.attributes.url}" alt="">
          </div>
          <select name="rating" id="rating-${book.id}" class="ratingSelect">
            <option value="1">1/5</option>
            <option value="2">2/5</option>
            <option value="3">3/5</option>
            <option value="4">4/5</option>
            <option value="5">5/5</option>
          </select>
          <div class="rateSaveBtn">
          <button data-bookid="${book.id}" id="rateBook${book.id}" class="rateBook bookBtn">Rate</button>
          <button id="saveBook${book.id}" class="saveBook bookBtn">Save</button>
        </div>
        </div>
      `;

      let rateButton = document.querySelectorAll(".rateBook");
      for (let i = 0; i < rateButton.length; i++) {
        rateButton[i].addEventListener("click", async (e) => {
          e.preventDefault();
          let bookId = e.target.dataset.bookid;
          let ratingSelect = document.querySelector(`#rating-${bookId}`);
          let ratingValue = ratingSelect.value;
          await rateBook(bookId, ratingValue);
          await showBooks();
        });
      }

      saveBookFunction();
    }
  };

  let showBooksButton = document.querySelector(".showBooksButton");
  showBooksButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("userDiv").innerHTML = "";
    document.getElementById("heroDiv").classList.add("hidden");
    document.getElementById("booksDiv").classList.remove("hidden");
    document.getElementById("logAndRegDiv").classList.add("hidden");
    document.getElementById("ratedBooksDiv").innerHTML = "";
    showBooks();
  });
};

let saveBookFunction = async () => {
  let saveBook = document.querySelectorAll(".saveBook");
  for (let button of saveBook) {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      let books = e.target.id.replace("saveBook", "");
      books = parseInt(books);
      let loginID = sessionStorage.getItem("id");

      await axios.put(`http://localhost:1333/api/books/${books}`, {
        data: {
          users: {
            connect: [loginID],
          },
        },
      });
    });
  }
};
