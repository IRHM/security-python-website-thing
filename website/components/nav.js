class NavBar extends HTMLElement {
  #template = `
  <ul>
    <a href="index.html"><li>Home</li><a/>
    <a href="customers.html"><li>Happy Customers</li><a/>
    <a href="basket.html"><li>Basket</li><a/>
  </ul>
  
  <div class="header">
    <img src="img/logo-transparent.png" alt="Logo" />

    <div class="inner">
      <p class="bold">${this.#getCurrentPage().title}</p>
      <p class="desc">${this.#getCurrentPage().desc}</p>
    </div>
  </div>`;

  #styles = `nav ul {
    display: flex;
    flex-flow: column;
  }

  nav ul {
    display: flex;
    flex-flow: row;
    list-style: none;
    color: white;
    background-color: black;
    cursor: pointer;
  }

  nav ul a {
    color: white;
    text-decoration: none;
  }
  
  nav ul li {
    padding: 10px;
    font-weight: bold;
  }

  nav ul li:hover {
    color: black;
    background-color: white;
  }

  nav .header {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    text-transform: capitalize;
    margin-top: 20px;
  }

  nav .header img {
    width: 120px;
    margin-right: 30px;
  }

  nav .header .inner {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  nav .header .inner p {
    max-width: 250px;
  }

  nav .header .inner .desc {
    margin-top: 3px;
  }
  `;

  constructor() {
    self = super();

    self.innerHTML = this.#template;

    // Add styles
    applyStyles(this.#styles);
  }

  /**
   * TODO: handle if return is null and hide the header
   */
  #getCurrentPage() {
    let curPath = window.location.pathname;

    // The default title and description
    let title = "Our Store";
    let desc = "The only place you'll want for all your electronical needs!";

    if (curPath.endsWith("index.html") || curPath.endsWith("/")) {
      title = "Home Page";
      desc = "The only place you'll want for all your electronical needs!";
    } else if (curPath.endsWith("customers.html")) {
      title = "Our Customers";
      desc = "See what our customers are saying about us.";
    } else if (curPath.endsWith("basket.html")) {
      title = "Your Basket";
      desc = "View the items in your basket before finalizing your order.";
    }

    return {
      title: title,
      desc: desc
    };
  }
}

customElements.define("nav-bar", NavBar, { extends: "nav" });
