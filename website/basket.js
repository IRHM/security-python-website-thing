basketTemplate = `
  <img src="img/logo-transparent.png" alt="Product Picture" />
  <div class="details">
    <p id="name" class="bold"></p>
    <p id="price"></p>
    <button id="remove">Remove From Basket</button>
  </div>
`;

basketStyles = `div#basket-items-wrapper {
  width: 100%;
  max-width: 550px;
}

div#basket-items-wrapper .basket-item  {
  position: relative;
  display: flex;
  flex-flow: row;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 3px solid transparent;
  border-radius: 4px;
  background-color: #F5EEDC;
}

div#basket-items-wrapper .basket-item img  {
  width: 100px;
}

div#basket-items-wrapper .basket-item .details {
  display: flex;
  flex-flow: column;
  width: 100%;
  margin-left: 20px;
}

div#basket-items-wrapper .basket-item .details button {
  margin-top: auto;
}

div#basket-items-wrapper .basket-item .removed-from-basket{
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 25px;
  -webkit-text-stroke: 1px white;
}`;

applyStyles(basketStyles);
const biw = document.getElementById("basket-items-wrapper");
let basketItems = getBasketItems();

if (basketItems && basketItems.length > 0) {
  const replaceBasketItemData = (toApp, item) => {
    if (item) {
      const img = toApp.getElementsByTagName("img")[0];
      const name = toApp.querySelector("#name");
      const price = toApp.querySelector("#price");
      const remove = toApp.querySelector("#remove");

      img.src = item.img;
      name.innerHTML = item.name;
      price.innerHTML = `$${item.price}`;

      remove.addEventListener("click", () => removeFromBasket(toApp, item));
    }
  };

  const removeFromBasket = (el, item) => {
    blur(el);

    let overlay = document.createElement("div");
    overlay.innerHTML = "Removed From Basket!";
    overlay.classList.add("removed-from-basket");

    el.appendChild(overlay);

    removeFromRealBasket(item.name);

    setTimeout(() => {
      el.remove();

      // Get basket items again, and if there are now no items in basket show message
      if (getBasketItems().length <= 0) {
        showNoItemsMsg();
      }
    }, 1000);
  };

  for (let i = 0; i < basketItems.length; i++) {
    const item = basketItems[i];

    const toAppend = document.createElement("div");
    toAppend.classList.add("basket-item");
    toAppend.innerHTML = basketTemplate;

    replaceBasketItemData(toAppend, item);

    biw.appendChild(toAppend);
  }
} else {
  showNoItemsMsg();
}

function showNoItemsMsg() {
  biw.innerHTML = `<p style="text-align: center"><b>No Items In Basket!</b><br /> Find something you like on our store page and add it to your basket.</p>`;
}
