// Quelle: https://www.youtube.com/watch?v=1iysNUrI3lw

const search = document.getElementById("search");
const matchList = document.getElementById("match-list");


//Search products and filter it
const searchProducts = async searchText => {
  const res = await fetch("/products");
  const products = await res.json();

  //Get matches to current text input
  let matches = products.filter(product => {
    const regex = new RegExp(`^${searchText}`, "gi");
    return product.name.match(regex);
    
  });

  if (searchText.length === 0) {
    matches = [];
    matchList.innerHTML = "";
  }
  outputHtml(matches);
};

//Show autocompleted matches on website with link to singleProduct
const outputHtml = matches => {
  if (matches.length > 0) {
    matchList.innerHTML = matches.map(match =>
      `
      <div class="card">
        <a href="/products/${match.id}" class="btn btn-outline-dark">
          <div class="row g-0 align-items-center">
            <div class="col-md-5">
              <img src=${match.pictureListURL} class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-4">
              <div class="card-body">
                <h5 class="card-title">${match.name}</h5>
                <small id="text">EAN: ${match.ean}</small><br>
                <small id="text">Quantity: ${match.quantity}</small><br>
                <small id="text">Best before: ${match.bestBefore}</small>
              </div>
            </div>
          </div>
        </a>
      </div>
      `
  ).join("");
  }
  if (matches.length === 0 && search.value.length > 0) {
    matchList.innerHTML = `
      <div class="card card-body mb-4">
        <h5>Produkt nicht gefunden</h5>
      </div>
    `;
  }
};


if (search) {
  search.addEventListener("input", () => searchProducts(search.value));
}