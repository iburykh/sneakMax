const catalogProducts = document.querySelector('.catalog__wrap');
const catalogMore = document.querySelector('.catalog__more');
let prodQuantity = 6;
let dataLength = null;

// функция вставляет пробел между разрядами
const normalPrice = (str) => {
	return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

if (catalogProducts) {
	const loadProducts = (quantity = 5) => {
	  fetch('../data/data.json')
		.then((response) => {
		  return response.json();
		})
		.then((data) => {
		  dataLength = data.length;
  
		  catalogProducts.innerHTML = '';
  
		  for (let i = 0; i < dataLength; i++) {
			if (i < quantity) {
			  let item = data[i];
  
				catalogProducts.innerHTML += `
					<article class="catalog-item">
						<div class="catalog-item__img">
							<img src="${item.mainImage}" loading="lazy" alt="${item.title}">
							<div class="catalog-item__btns">
								<button class="catalog-item__btn btn-reset modal-btn" data-id="${item.id}" aria-label="Показать информацию о товаре">
									<svg><use xlink:href="img/sprite.svg#show"></use></svg>
								</button>
								<button class="catalog-item__btn btn-reset" data-id="${item.id}" aria-label="Добавить товар в корзину">
									<svg><use xlink:href="img/sprite.svg#cart"></use></svg>
								</button>
							</div>
						</div>
						<h3 class="catalog-item__title">${item.title}</h3>
						<span class="catalog-item__price">${normalPrice(item.price)} р</span>
					</article>

				`;
			}
		  }
		})
	};
  
	loadProducts(prodQuantity);
  
	catalogMore.addEventListener('click', (e) => {
		//* +3 - добавлять по з карточки товара
		prodQuantity = prodQuantity + 3;

		loadProducts(prodQuantity);

		if (prodQuantity >= dataLength) {
			catalogMore.style.display = 'none';
		} else {
			catalogMore.style.display = 'block';
		}
	});
}