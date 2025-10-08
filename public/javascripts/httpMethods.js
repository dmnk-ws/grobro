// PUT Method
$("#editButton").click( (e) => {
  $target = $(e.target);
  const id = $target.attr("name");                                  // grab name attribute of #editButton for product id
  $.ajax({
    url: "/products/edit/" + id,
    type: "PUT",
    dataType: "json",
    data: {
      name: $("#nameInput").val(),
      quantity: $("#quantityInputEdit").val(),
      bestBefore: $("#expiryDateInput").val(),
      ingredients: $("#ingredientsInput").val()
    },
    success: function(response) {
      alert("Produktdetails werden geändert!");
      window.location = "/list";
    },
    error: function(err) {
      console.log(err);
      $("#error-group").css("display", "block");
      let errorsContainer = $("#error");
      errorsContainer.innerHTML = "";
      let len = err.responseJSON;
      errorsContainer.innerHTML = "";
      let errorsList = "";
      for (let i = 0; i < len.length; i++) {
        errorsList += "<br>" + "<li>" + err.responseJSON[i] + "</li>";
      }
      errorsContainer.html(errorsList);
    }
  });
});


// PUT Method for Single Product Route - decrease quantity
$("#decreaseQuantity").click( (e) => {
  $target = $(e.target);
  const id = $target.attr("name");                                   // grab name attribute of #decreaseQuantity for product id
  let currentQuantity = parseInt($("#quantityInput").val());         // grab current quantity and decrease it by 1 if it is a number
  if (!isNaN(currentQuantity)) {
    $("#quantityInput").val(currentQuantity - 1);
  }
  $.ajax({
    url: "/products/" + id,
    type: "PUT",
    dataType: "json",
    data: {
      quantity: parseInt($("#quantityInput").val()),                 // parse string to int
    },
    error: function(err) {
      console.log(err);
    }
  });
});


// PUT Method for Single Product Route - increase quantity
$("#increaseQuantity").click( (e) => {
  $target = $(e.target);
  const id = $target.attr("name");                                  // grab name attribute of #increaseQuantity for product id
  let currentQuantity = parseInt($("#quantityInput").val());        // grab current quantity and increase it by 1 if it is a number
  if (!isNaN(currentQuantity)) {
    $("#quantityInput").val(currentQuantity + 1);
  }
  $.ajax({
    url: "/products/" + id,
    type: "PUT",
    dataType: "json",
    data: {
      quantity: parseInt($("#quantityInput").val()),                // parse string to int
    },
    error: function(err) {
      console.log(err);
    }
  });
});


// DELETE Method for Single Product Route if quantity is 0
$("#decreaseQuantity").click( (e) => {
  $target = $(e.target);
  const id = $target.attr("name");                                  // grab name attribute of #decreaseQuantity for product id
  if ($("#quantityInput").val() == 0) {                             // delete product, only if quantity is 0
    $.ajax({
      url: "/products/" + id,
      type: "DELETE",
      dataType: "json",
      data: {
      },
      success: function(response) {
        window.location = "/list";
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
});


// DELETE Method
$("#deleteButton").click( (e) => {
  $target = $(e.target);
  const id = $target.attr("name");                                  // grab name attribute of #deleteButton for product id
  $.ajax({
    url: "/products/" + id,
    type: "DELETE",
    dataType: "json",
    data: {
    },
    success: function(response) {
      alert("Produkt wird gelöscht!");
      window.location = "/list";
    },
    error: function(err) {
      console.log(err);
    }
  });
});


// POST Method
$("#addButton").click(() => {
  $.ajax({
    url: "/add",
    type: "POST",
    dataType: "json",
    data: {
      ean: $("#eanInput").val(),
      quantity: $("#quantityInputAdd").val(),
      bestBefore: $("#expiryDateInput").val()
    },
    success: function(response) {
      alert("Produkt wird hinzugefügt!");
      window.location = "/list";
    },
    error: function(err) {
      console.log(err);
      $("#error-group").css("display", "block");
      let errorsContainer = $("#error");
      errorsContainer.innerHTML = "";
      let len = err.responseJSON;
      errorsContainer.innerHTML = "";
      let errorsList = "";
      for (let i = 0; i < len.length; i++) {
        errorsList += "<br>" + "<li>" + err.responseJSON[i] + "</li>";
      }
      errorsContainer.html(errorsList);
    }
  });
});