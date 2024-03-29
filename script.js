function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const cartItems = '.cart__items';

const saveLocalStorage = () => {
  localStorage.setItem('cart', document.querySelector(cartItems).innerHTML);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function getId(sku) {
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json())
  .then((response) => (response))
  .catch((error) => error);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Para resolver os requisitos 2 e 5 obtive ajuda do meu colega de turma Leandro Reis, consultando seu PR para entender a lógica por trás desse requisito. src: https://github.com/tryber/sd-010-b-project-shopping-cart/pull/6
// sustring / indexOf src: https://www.devmedia.com.br/javascript-substring-selecionando-parte-de-uma-string/39232

function sumAndSub() {
  const items = document.getElementsByClassName('cart__item');
  let result = 0;
  for (let index = 0; index < items.length; index += 1) {
    const price = items[index].innerText.substring(items[index].innerText.indexOf('$') + 1);
    result += parseFloat(price);
  }
  const finalPrice = document.querySelector('.total-price');
  finalPrice.innerText = Math.round(result * 100) / 100;
}

async function cartItemClickListener(event) {
  const removeItem = event.target;
  removeItem.parentNode.removeChild(removeItem);
  sumAndSub();
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const parent = event.target.parentElement;
  const id = getSkuFromProductItem(parent);
  const item = await getId(id);
  const add = createCartItemElement({
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  });
  document.querySelector(cartItems).appendChild(add);
  saveLocalStorage();
  sumAndSub();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addItem = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addItem.addEventListener('click', addToCart);
  section.appendChild(addItem);

  return section;
}

const load = () => {
  const itemSection = document.querySelector('.items');
  const text = document.createElement('span');
  text.className = 'loading';
  text.innerText = 'loading...';
  itemSection.appendChild(text);
};

function removeLoad() {
  document.querySelector('.loading').remove();
}

const fetchItems = async () => {
  load();
  const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const jSon = await result.json();
  const final = await jSon.results;
  removeLoad();
  return final;
};

const showItems = async () => {
  const itemData = await fetchItems();
  const itemList = document.querySelector('.items');
  itemData.forEach((item) => {
    itemList.appendChild(createProductItemElement({
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    }));
  });
};

const removeAllItems = () => {
  const emptyBtn = document.querySelector('.empty-cart');
  const cart = document.querySelector(cartItems);

  function removeCart() {
    cart.innerHTML = '';
    const getPrice = document.querySelector('.total-price');
    getPrice.innerText = 0;
    localStorage.clear();
    saveLocalStorage();
  }
  emptyBtn.addEventListener('click', removeCart);
};

// Requisito 6 feito com a ajuda do meu colega Aladino Borges, da turma 10-B, dando uma conferida no seu Pull Request para entender melhor a lógica desse Requisito.
// src: https://github.com/tryber/sd-010-b-project-shopping-cart/pull/119

const getCart = () => {
  const saved = localStorage.getItem('cart');
  document.querySelector(cartItems).innerHTML = saved;
};

window.onload = function onload() {
  showItems();
  getCart();
  removeAllItems();
  cartItemClickListener();
};