// Creating a ratingsystem for the user to rate the books
import { loggedInMode } from "./loginMode.js";

export const rateBook = async () => {
          
let rateButton = document.querySelectorAll(".rateBook");
for (let button of rateButton) {
  button.addEventListener("click", async (e) => {
e.preventDefault();


    // ratingAntal = book.attributes.reviews
let ratingSelect = e.target.parentElement;
let ratingValue = ratingSelect.querySelector("select").value;
ratingAntal++;
sumOfRatings += parseInt(ratingValue);
ratingValue = sumOfRatings / ratingAntal;
ratingValue = Math.round(ratingValue);

console.log(ratingAntal);
let books = e.target.id.replace("rateBook", "");



await axios.put(`http://localhost:1339/api/books/${books}`, {
data: {
rating: ratingValue,
reviews: ratingAntal,
sumOfRatings: sumOfRatings
}

});
// console.log(ratingValue);


book.attributes.rating = ratingValue + "/10";
ratingSelect.querySelector(".ratingsP").innerHTML = `Rating: ${book.attributes.rating}`;
});

}
};