let form = document.getElementById("infoControl");
let btnPost = document.getElementById("addButton");
let btnEdit = document.getElementById("editButton");

if (form) {
  form.addEventListener("click", (e) => {
    let messages = [];
    let ean = "";
    let name = "";
    let ingredients = "";
    let quantity = form.quantity.value;
    let date = form.date.value;
    let regexEAN = /^[0-9]{13}$/;
    let errorElement = document.getElementById("error");

    if (form.ean) {
      ean = form.ean.value;
      if (!ean) {
        messages.push("EAN-Code ist erforderlich!");
      }
      if (!regexEAN.test(ean)) {
        messages.push("EAN-Code ist nicht korrekt!");
      }
    }
    if (form.name) {
      name = form.name.value;
      if (!name) {
        messages.push("Der Name wird benötigt!");
      }
    }
    if (quantity <= 0) {
      messages.push("Die Anzahl muss mindestens 1 betragen!");
    }
    if (!date) {
      messages.push("Ein Mindesthaltbarkeitsdatum wird benötigt!");
    }
    if (form.ingredients) {
      ingredients = form.ingredients.value;
      if (!ingredients) {
        messages.push("Die Inhaltstoffe müssen eingetragen werden!");
      }
    }
    if (messages.length > 0) {
      e.preventDefault();
      errorElement.innerText = messages.join("\n\n");
    }
  });
}

function validate() {
  let form = document.getElementById("infoControl");
  let ean = "";
  let name = "";
  let ingredients = "";
  let quantity = form.quantity.value;
  let date = form.date.value;
  let regexEAN = /^[0-9]{13}$/;

  if (form.ean) {
    ean = form.ean.value;
    if (!ean) {
      alert("EAN-Code ist erforderlich!");
    }
    if (!regexEAN.test(ean)) {
      alert("EAN-Code ist nicht korrekt!");
    }
  }
  if (form.name) {
    name = form.name.value;
    if (!name) {
      alert("Der Name wird benötigt!");
    }
  }
  if (!date) {
    alert("Ein Mindesthaltbarkeitsdatum wird benötigt!");
  }
  if (quantity <= 0) {
    alert("Die Anzahl muss mindestens 1 betragen!");
  }
  if (form.ingredients) {
    ingredients = form.ingredients.value;
    if (!ingredients) {
      alert("Die Inhaltstoffe müssen eingetragen werden!");
    }
  }
  return false;
}

// createProduct.pug
if(btnPost) {
  btnPost.addEventListener("click", () => {
    validate();
  });
}


// editProduct.pug
if(btnEdit) {
  btnEdit.addEventListener("click", () => {
    validate();
  });
}