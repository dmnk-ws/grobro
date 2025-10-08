const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const products = require("../constants/products");
const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric"
};

// GET Home Page Route
router.get("/", (req, res) => {
  res.render("index", { 
    title: "Grocery Brother" 
  });
});


// GET About Route
router.get("/about", (req, res) => {
  res.render("about", {
    title: "Über uns"
  });
});

// GET About-Philosophy Page Route
router.get("/about/philosophy", (req, res) => {
  res.render("philosophy", {
    title: "Unsere Philosophie"
  });
});

// GET Search Product Route
router.get("/search", (req, res) => {
  res.render("searchProduct", {
    title: "Bestandssuche",
  });
});

// GET products in JSON-format (necessary for searchProduct.js)
router.get("/products", (req, res) => {
  JSON.stringify(products);
  res.send(products);
});

// GET List Route
router.get("/list", (req, res) => {
  res.render("listProducts", {
    title: "Aktueller Bestand",
    products: products
  });
});

// GET Single Product Route
router.get("/products/:productId", (req, res) => {
  let product = products.find(c => c.id === parseInt(req.params.productId));
  if (!product) { // check if product is a number, if not set product = 0
    res.status(404).render("error", { // and send error + status(404) to client
      title: "Das Produkt wurde nicht gefunden!",
      status: "Status 404",
    });
    return;
  }
  res.render("singleProduct", { 
    title: "Produktdetails",
    product: product 
  });
});

// GET Create Product Route
router.get("/add", (req, res) => {
  res.render("createProduct", {
    title: "Produkt hinzufügen"
  });
});

// GET Edit Product Route
router.get("/products/edit/:productId", (req, res) => {
  let product = products.find(c => c.id === parseInt(req.params.productId));
  if (!product) { // check if product is a number, if not set product = 0
    res.status(404).render("error", { // and send error + status(404) to client
      title: "Das Produkt wurde nicht gefunden!",
      status: "Status 404",
    });
    return;
  }

  let dateParts = product.bestBefore.split(" "); // parsing bestBefore variable into yyyy-MM-dd format
  let day = dateParts[1].substring(0,2)
  let month = dateParts[1].substring(3,5);
  let year = dateParts[1].substring(6)
  if (dateParts[1].substring(1,2) === ".") {
    day = "0" + dateParts[1].substring(0,1);
    if (dateParts[1].substring(3,4) === ".") {
      month = "0" + dateParts[1].substring(2,3);
      year = dateParts[1].substring(4);
    } else {
      month = dateParts[1].substring(2,4);
      year = dateParts[1].substring(5);
    }
  }
  if (dateParts[1].substring(4,5) === ".") {
    month = "0" + dateParts[1].substring(3,4);
    year = dateParts[1].substring(5)
  }
  let dateFormat = year + "-" + month + "-" + day;
  
  res.render("editProduct", {
    title: "Produktdetails ändern",
    product: product,
    dateFormat: dateFormat // use parsed  dateFormat for passing variable to pug input form
  });
});

// POST Create Product Route
router.post("/add", (req, res) => {
  let errCount = 0;
  let errArr = [];
  const regexDate = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;
  const regexEAN = /^[0-9]{13}$/;

  if (!req.body.ean) { // check validation of form-inputs and save errors into array with increasing counter
    errArr[errCount] = "EAN-Code ist erforderlich!"; // if errCount is > 0, the list gets send to the client with status(400)
    errCount++;                                                                     
  } else if (!regexEAN.test(req.body.ean)) {
    errArr[errCount] = "EAN-Code ist nicht korrekt!";
    errCount++;
  }
  for (let i = 0; i < products.length; i++) {
    if (req.body.ean === products[i].ean) {
      errArr[errCount] = "Produkt ist bereits im Bestand!";
      errCount++;
    }
  }
  if (req.body.quantity <= 0) {
    errArr[errCount] = "Die Anzahl muss mindestens 1 betragen!";
    errCount++;
  }
  if (!req.body.bestBefore) {
    errArr[errCount] = "Ein Mindesthaltbarkeitsdatum wird benötigt!"
    errCount++;
  } else if (!regexDate.test(new Date(req.body.bestBefore).toLocaleDateString("de-DE", {year: "numeric", month: "numeric", day: "numeric"}))) {
    errArr[errCount] = "Das Datum ist nicht zulässig!";
  }
  if (errCount > 0) {
    res.status(400).send(errArr);
  } else { // add product, if inputs are correct
    let url = "https://world.openfoodfacts.org/api/v0/product/" +  req.body.ean + ".json";
    let settings = { method: "Get" };
    let bestBeforeDate = new Date(req.body.bestBefore).getTime();
    let expirationDays = Math.round(((bestBeforeDate - Date.now()) / 1000 / 3600 / 24) + 1);

    let max = 0; // generates simple unique id for the product
    for (var i = 0; i < products.length; i++) {
      var cid = products[i].id;
      if (max < cid) {
        max = cid;
      }
    }
  
    const item = {                                                                  // new item to add to products array
      id: max + 1,
      pictureListURL: "",
      pictureSingleURL: "",
      pictureBarcodeURL: "https://api-bwipjs.metafloor.com/?bcid=ean13&text=" + req.body.ean + "&includetext",
      name: "",
      ean: req.body.ean,
      bestBefore: new Date(req.body.bestBefore).toLocaleDateString("de-DE", options),
      daysBeforeExpiry: expirationDays,
      quantity: req.body.quantity,
      ingredients: "",
      nutrients: {
        energyValue: "",
        carbohydrates: "",
        sugar: "",
        fat: "",
        protein: "",
        salt: ""
      }
    }
  
    fetch(url, settings) // fetch product information from JSON api of world.openfoodfacts with pre-defined url and settings
    .then(res => res.json())
    .then((json) => { // check if json-data is available and set the item variables
      if (json.product.product_name != null) {
        item.name = json.product.product_name.substring(0,50);
      } else {
        item.name = "";
      }
      if (json.product.image_front_small_url != null) {
        item.pictureListURL = json.product.image_front_small_url;
      } else {
        item.pictureListURL = "/images/no_image.jpg"; // Quelle für no_image: https://www.dreamstime.com/no-image-available-icon-photo-camera-flat-vector-illustration-image132483296
      }
      if (json.product.image_front_url != null) {
        item.pictureSingleURL = json.product.image_front_url;
      } else {
        item.pictureSingleURL = "/images/no_image.jpg";
      }
      if (json.product.ingredients_text_de != null) {
        item.ingredients = json.product.ingredients_text_de;
      } else {
        item.ingredients = "";
      }
      if (json.product.nutriments.energy != null) {
        item.nutrients.energyValue = json.product.nutriments.energy +" kJ";
        if (json.product.nutriments.energy_value != null && json.product.nutriments.energy_value != json.product.nutriments.energy) {
          item.nutrients.energyValue += " (" + json.product.nutriments.energy_value + " kcal)";
        }
      } else {
        item.nutrients.energyValue = "?";
      }
      if (json.product.nutriments.carbohydrates_100g != null) {
        item.nutrients.carbohydrates = json.product.nutriments.carbohydrates_100g + " g";
      } else {
        item.nutrients.carbohydrates = "?";
      }
      if (json.product.nutriments.sugars_100g != null) {
        item.nutrients.sugar = json.product.nutriments.sugars_100g + " g";
      } else {
        item.nutrients.sugar = "?";
      }
      if (json.product.nutriments.fat_100g != null) {
        item.nutrients.fat = json.product.nutriments.fat_100g + " g";
      } else {
        item.nutrients.fat = "?";
      }
      if (json.product.nutriments.proteins_100g != null) {
        item.nutrients.protein = json.product.nutriments.proteins_100g + " g";
      } else {
        item.nutrients.protein = "?";
      }
      if (json.product.nutriments.salt_100g != null) {
        item.nutrients.salt = json.product.nutriments.salt_100g + " g";
      } else {
        item.nutrients.salt = "?";
      }
      products.push(item); // appends the new item
      res.status(200).send(products); // send status(200) to the client
    });
  }
});

// PUT Edit Product Route
router.put("/products/edit/:productId", (req, res) => {
  let product = products.find(c => c.id === parseInt(req.params.productId));
  let errCount = 0;
  let errArr = [];
  const regexDate = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;
                                                                              
  if (!product) { // check validation of form-inputs and save errors into array with increasing counter
    errArr[errCount] = "Das Produkt wurde nicht gefunden!"; // if errCount is > 0, the list gets send to the client with status(400)
    errCount++; // or status(404), but only if product was not found
  }
  if (errCount > 0) {
    res.status(404).send(errArr);
    return;
  }
  if (!req.body.name) {
    errArr[errCount] = "Der Name wird benötigt!";
    errCount++;
  } else if (req.body.name.length > 50) {
    errArr[errCount] = "Für den Namen sind maximal 50 Zeichen zulässig!";
    errCount++;
  }
  if (!req.body.ingredients) {
    errArr[errCount] = "Die Inhaltstoffe müssen eingetragen werden!";
    errCount++;
  }
  if (req.body.quantity <= 0) {
    errArr[errCount] = "Die Anzahl muss mindestens 1 betragen!";
    errCount++;
  }
  if (!req.body.bestBefore) {
    errArr[errCount] = "Ein Mindesthaltbarkeitsdatum wird benötigt!"
    errCount++;
  } else if (!regexDate.test(new Date(req.body.bestBefore).toLocaleDateString("de-DE", {year: "numeric", month: "numeric", day: "numeric"}))) {
    errArr[errCount] = "Das Datum ist nicht zulässig!";
  }
  if (errCount > 0) {
    res.status(400).send(errArr);
  } else {  // edit product, if inputs are correct
    bestBeforeDate = new Date(req.body.bestBefore).getTime();
    product.name = req.body.name;
    product.quantity = req.body.quantity;
    product.bestBefore = new Date(req.body.bestBefore).toLocaleDateString("de-DE", options);
    product.daysBeforeExpiry = Math.round(((bestBeforeDate - Date.now()) / 1000 / 3600 / 24) + 1);
    product.ingredients = req.body.ingredients;
    res.status(200).send(product);
  }
});

// PUT Single Product Route
router.put("/products/:productId", (req, res) => {
  let product = products.find(c => c.id === parseInt(req.params.productId));
  if (!product) { // check if product is a number, if not set product = 0
    res.status(404).send("Das Produkt wurde nicht gefunden!"); // and send error + status(404) to client
    return;
  }
  product.quantity = req.body.quantity;
  res.status(200).send(product); // send status(200) to the client
});

// DELETE Product Route
router.delete("/products/:productId", (req, res) => {
  let product = products.find(x => x.id === parseInt(req.params.productId));
  if (!product) { // check if product is a number, if not set product = 0
    res.status(404).send("Das Produkt wurde nicht gefunden!"); // and send error + status(404) to client
    return;
  }
  if (product.quantity === 0) { // check if quantity is 0 to delete product
    let index = products.indexOf(product); // save the index of the requested productID
    products.splice(index, 1); // starts to delete at "index" up to the count 1
    res.status(200).send(product);
    return;
  }
  let index = products.indexOf(product); // delete product if delete button was pressed
  products.splice(index, 1);
  res.status(200).send(products);
});

module.exports = router;