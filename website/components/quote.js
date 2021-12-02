class Quote extends HTMLDivElement {
  #template = `
    <p id="text">Very beest good items recieved!!!</p>
    <p id="author">- Customer One</p>
  `;

  #styles = `div[is="customer-quote"] {
    margin: 10px;
    padding: 10px;
    background-color: #F5EEDC;
  }

  div[is="customer-quote"] #author {
    margin-top: 10px;
    font-style: italic;
  }`;

  constructor() {
    self = super();

    self.innerHTML = this.#template;

    this.#replaceQuoteText(self);
    this.#replaceQuoteAuthor(self);

    applyStyles(this.#styles);
  }

  #replaceQuoteText(mainEl) {
    let textEl = mainEl.querySelector("#text");
    let textProp = mainEl.getAttribute("quote-text");

    if (textEl && textProp) {
      textEl.innerHTML = textProp;
      return;
    }

    console.info("Couldn't replace quote text.");
  }

  #replaceQuoteAuthor(mainEl) {
    let el = mainEl.querySelector("#author");
    let prop = mainEl.getAttribute("author");

    if (el && prop) {
      el.innerHTML = `- ${prop}`;
      return;
    }

    console.info("Couldn't replace quote author.");
  }
}

customElements.define("customer-quote", Quote, { extends: "div" });
