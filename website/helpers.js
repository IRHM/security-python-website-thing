/**
 * Apply string of css to a new <style> tag in the document.
 * @param {string} stylesStr CSS String of styles.
 */
function applyStyles(stylesStr) {
  let navStyle = document.createElement("style");
  document.head.appendChild(navStyle);
  navStyle.textContent = stylesStr;
}

/**
 * Blur each element inside element separately,
 * so that we can add a new element that won't be blurred after.
 * @param {*} mainEl Parent element.
 * @param {*} remove If should remove blur.
 */
function blur(mainEl, remove = false) {
  for (const e in mainEl.children) {
    if (Object.hasOwnProperty.call(mainEl.children, e)) {
      const el = mainEl.children[e];

      if (remove) el.classList.remove("blur");
      else el.classList.add("blur");
    }
  }
}

/**
 * Check if localStorage is available in the browser.
 * @returns If localStoarge is available.
 */
function lsAvailable() {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return true;
  } catch (e) {
    return false;
  }
}

function addToRealBasket(img, name, price) {
  if (lsAvailable()) {
    let bskt = localStorage.getItem("basket");

    if (bskt == null) {
      const defBskt = `[{ "img": "${img}", "name": "${name}", "price": "${price}"}]`;
      localStorage.setItem("basket", defBskt);
      bskt = defBskt;
    }

    jsonBskt = JSON.parse(bskt);

    // Add item to array in localStorage, providing it isn't already listed in it
    if (jsonBskt.filter((e) => e.name === name).length <= 0) {
      jsonBskt.push({ img: img, name: name, price: price });
      localStorage.setItem("basket", JSON.stringify(jsonBskt));
    }
  } else {
    console.error("Local Storage is unavailable in this browser, so basket functionality won't work.");
    return null;
  }
}

function removeFromRealBasket(name) {
  if (lsAvailable()) {
    let bskt = localStorage.getItem("basket");

    // Basket is null, so item can't be in it
    if (bskt == null) return;

    jsonBskt = JSON.parse(bskt);
    elInx = jsonBskt.findIndex((e) => e.name === name);

    console.log(elInx);

    // Add item to array in localStorage, providing it isn't already listed in it
    if (elInx !== undefined) {
      console.log(elInx);
      jsonBskt.splice(elInx, 1);
      localStorage.setItem("basket", JSON.stringify(jsonBskt));
    }
  } else {
    console.error("Local Storage is unavailable in this browser, so basket functionality won't work.");
    return null;
  }
}

function getBasketItems() {
  if (lsAvailable()) {
    let bskt = localStorage.getItem("basket");

    if (bskt) return JSON.parse(bskt);
    else return null;
  } else {
    console.error("Local Storage is unavailable in this browser, so basket functionality won't work.");
    return null;
  }
}
