class Product extends HTMLDivElement {
  #template = `
    <img src="img/logo-transparent.png" alt="Logo" />
    <span id="title" class="bold">An Item</span>
    <span id="price" class="bold"></span>
  `;

  // Use [is="shop-product"] to scope the styling so it only styles
  // elements intended for use with this component.
  #styles = `div[is="shop-product"] {
    position: relative;
    display: flex;
    flex-flow: column;
    flex: 1 1 33%;
    align-items: center;
    justify-content: center;
    margin: 10px;
    padding: 10px;
    border: 3px solid transparent;
    border-radius: 4px;
    background-color: #F5EEDC;
    text-align: center;
    transition: background-color 150ms ease;
    cursor: pointer;
  }

  div[is="shop-product"]:hover {
    border: 3px solid black;
    background-color: #97BFB4;
  }
  
  div[is="shop-product"] img {
    width: 200px;
  }
  
  div[is="shop-product"] #title {
    margin-top: 5px;
  }
  
  .added-to-basket {
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

  constructor() {
    self = super();

    self.innerHTML = this.#template;

    let img = this.#replaceImg(self);
    let name = this.#replaceName(self);
    let price = this.#replacePrice(self);
    let el = self;

    self.addEventListener("click", () => this.addToBasket(el, img, name, price));

    applyStyles(this.#styles);
  }

  addToBasket(mainEl, img, name, price) {
    blur(mainEl);

    let overlay = document.createElement("div");
    overlay.innerHTML = "Added To Basket!";
    overlay.classList.add("added-to-basket");

    mainEl.appendChild(overlay);

    addToRealBasket(img, name, price);

    setTimeout(() => {
      overlay.remove();
      blur(mainEl, true);
    }, 1000);
  }

  #replaceImg(mainEl) {
    let imgEl = mainEl.getElementsByTagName("img")[0];
    let imgNameProp = mainEl.getAttribute("img-name");

    if (imgEl && imgNameProp) {
      imgEl.src = `img/${imgNameProp}`;
      return `img/${imgNameProp}`;
    }

    // If didn't return above, img tag couldn't be found
    console.error("Couldn't find image tag, so was unable to replace it's src.");
  }

  #replaceName(mainEl) {
    let titleEl = mainEl.querySelector("#title");
    let toReplaceWith = mainEl.getAttribute("title");

    if (titleEl && toReplaceWith) {
      titleEl.innerHTML = toReplaceWith;
      return toReplaceWith;
    }

    console.info("No title on product component, so using default.");
  }

  #replacePrice(mainEl) {
    let el = mainEl.querySelector("#price");
    let prop = mainEl.getAttribute("price");

    if (el && prop) {
      el.innerHTML = `$${prop}`;
      return prop;
    }

    console.info("Couldn't replace product price.");
  }
}

customElements.define("shop-product", Product, { extends: "div" });
