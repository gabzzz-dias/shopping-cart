const fetchItems = async () => {
  const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const jSon = await result.json();
  const final = await jSon.results;
  return final;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
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
  document.querySelector('.cart__items').appendChild(add);
}

// Para resolver o requisito 2 obtive ajuda do meu colega de turma Leandro Reis, consultando seu PR para entender a lógica por trás desse requisito. src: https://github.com/tryber/sd-010-b-project-shopping-cart/pull/6

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

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

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

window.onload = function onload() {
  showItems();
};