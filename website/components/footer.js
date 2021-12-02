class Footer extends HTMLElement {
  #template = `<ul>
    <li>My Name</li>
    <li>Enrolment Number</li>
    <li>© 2021 My Name</li>
  </ul>`;

  #styles = `footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    color: white;
    background-color: black;
    text-align: center;
  }
  
  footer ul {
    display: flex;
    flex-flow: row;
    list-style: none;
  }
  
  footer ul li:not(:first-child) {
    margin-left: 15px;
    padding-left: 15px;
    border-left: 1px solid gray;
  }`;

  constructor() {
    self = super();

    self.innerHTML = this.#template;
    applyStyles(this.#styles);
  }
}

customElements.define("footer-bar", Footer, { extends: "footer" });
