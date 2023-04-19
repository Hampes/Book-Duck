export const unauthorized = () => {
  if (sessionStorage.getItem("token") == null) {
    let showBooks = async () => {
      let response = await axios.get(
        "http://localhost:1333/api/books?populate=deep,3"
      );
      let books = response.data.data;
      let booksDiv = document.getElementById("booksDiv");
      booksDiv.innerHTML = "";
      let loginPage = document.getElementById("loginPage");
      loginPage.addEventListener("click", () => {});
      document.getElementById("logAndRegDiv").classList.add("hidden");
      document.getElementById("logAndRegDiv").classList.remove("logAndRegDiv");

      for (let book of books) {
        if (book.attributes.rating == null) {
          book.attributes.rating = "No rating yet";
        } else {
          book.attributes.rating = book.attributes.rating + "/5";
        }
        booksDiv.innerHTML += `
        <div class="bookCard">
        <div class="titleImgDiv">
        <div class="bookInfoDiv">
          <h3><span class="boldInfo">Titel:</span> ${book.attributes.title}</h3>
          <p><span class="boldInfo">Author:</span> ${book.attributes.author}</p>
          <p><span class="boldInfo">Antal sidor:</span> ${book.attributes.numberOfPages}</p>
          <p><span class="boldInfo">Released:</span> ${book.attributes.bookReleased}</p>
          <p class="ratingsP"><span class="boldInfo">Rating:</span> ${book.attributes.rating}</p>
          </div>
          <img class="booksImages" src="http://localhost:1333${book.attributes.bookImg.data.attributes.url}" alt="">
          </div>
        </div>
      `;
      }
    };

    let showBooksButton = document.querySelector(".showBooksButton");
    showBooksButton.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("userDiv").classList.add("hidden");
      document.getElementById("heroDiv").classList.add("hidden");
      document.getElementById("heroDiv").classList.remove("heroDiv");
      document.getElementById("booksDiv").classList.remove("hidden");
      if (document.querySelector(".userH2")) {
        document.querySelector(".userH2").innerHTML = "";
      }

      showBooks();
    });
  }
};
