const catalogProducts = document.querySelector('.catalog__wrap');
const catalogMore = document.querySelector('.catalog__more');
const prodModal = document.querySelector('.modal-prod__content');
const prodModalSlider = prodModal.querySelector('.slider-main__wrapper');
const prodModalPreview = prodModal.querySelector('.slider-min__wrapper');
const prodModalInfo = prodModal.querySelector('.modal-info__wrapper');
const prodModalDescr = prodModal.querySelector('.modal-descr__text');
const prodModalChars = prodModal.querySelector('.modal-char__items');
const prodModalVideo = prodModal.querySelector('.modal-video');
let prodQuantity = 6; // количество карточек на странице изначально
let addQuantity = 3; // количество добавляемых карточек при клике на кнопку "Показать ещё"
let dataLength = null;

// функция вставляет пробел между разрядами
const normalPrice = (str) => {
	return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

// если есть слайдер в модальном окне - инициировать слайдеры в функции modalSlider и объявлять после создания окна
// функция инициализации слайдера
const modalSlider = () => {
	const minSlider = new Swiper('.slider-min', {
		grabCursor: true,
		slidesPerView: 6,
		initialSlide: 0,
		spaceBetween: 20,
		freeMode: true,
	});
	
	const mainSlider = new Swiper('.slider-main', {
		grabCursor: true,
		spaceBetween: 20,
		slidesPerView: 1,
		initialSlide: 0,
		simulateTouch: false,
		effect: 'fade',
		fadeEffect: {
		  crossFade: true
		},
		thumbs: {
			swiper: minSlider,
		}
	});
};

if (catalogProducts) {
	//* функция создания карточек в каталоге товаров
	const loadProducts = async (quantity = 5) => {
		let response = await fetch('../data/data.json');
		if (response.ok) {
			let data = await response.json();

			dataLength = data.length;
		
			catalogProducts.innerHTML = '';

			// формируем сетку из 6 карточек товаров на странице (6 - это число prodQuantity)
			for (let i = 0; i < dataLength; i++) {
				if (i < prodQuantity) {
				let item = data[i];
	
					catalogProducts.innerHTML += `
						<article class="catalog-item">
							<div class="catalog-item__img">
								<img src="${item.mainImage}" loading="lazy" alt="${item.title}">
								<div class="catalog-item__btns">
									<button class="catalog-item__btn btn-reset modal-btn" data-id="${item.id}" aria-label="Показать информацию о товаре">
										<svg><use xlink:href="img/sprite.svg#show"></use></svg>
									</button>
									<button class="catalog-item__btn btn-reset add-to-cart-btn" data-id="${item.id}" aria-label="Добавить товар в корзину">
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
			// функция работы корзины
			cartLogic();
			// функция модального окна
			bindModal('.modal-btn', '.modal-prod', loadModalData);
			//TODO - добавить аргумент func в функцию bindModal(btnSelector, modalSelector, func, animate='fade', speed=300,)
			//TODO - вставить этот код в функцию bindModal (модальное окно) в момент открытия окна после получения lastFocus
			// получение id кнопки
			// if (modalContent.classList.contains('modal-prod')) {
			// 	let openBtnId = lastFocus.dataset.id;
			// 	func(openBtnId);
			// }

			// по клику на кнопку "Показать ещё" добавляем по 3 карточки товара (3 - это число addQuantity) 
			catalogMore.addEventListener('click', (e) => {
				let a = prodQuantity;
				prodQuantity = prodQuantity + addQuantity;
				for (let i = a; i < dataLength; i++) {
					if (i < prodQuantity) {
					let item = data[i];
						catalogProducts.innerHTML += `
							<article class="catalog-item">
								<div class="catalog-item__img">
									<img src="${item.mainImage}" loading="lazy" alt="${item.title}">
									<div class="catalog-item__btns">
										<button class="catalog-item__btn btn-reset modal-btn" data-id="${item.id}" aria-label="Показать информацию о товаре">
											<svg><use xlink:href="img/sprite.svg#show"></use></svg>
										</button>
										<button class="catalog-item__btn btn-reset add-to-cart-btn" data-id="${item.id}" aria-label="Добавить товар в корзину">
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
				if (prodQuantity >= dataLength) {
					catalogMore.style.display = 'none';
				} else {
					catalogMore.style.display = 'block';
				}
				// при добавлении новых товаров перезапускаются функции модального окна и корзины
				cartLogic();
				bindModal('.modal-btn', '.modal-prod', loadModalData);
			});

		} else {
			console.log(('error', response.status));
		}
	};

	loadProducts();

	//* функция создания окна товара
	const loadModalData = async (id = 1) => {
		let response = await fetch('../data/data.json');
		if (response.ok) {
			let data = await response.json();
			// очищаем блоки
			prodModalSlider.innerHTML = '';
			prodModalPreview.innerHTML = '';
			prodModalInfo.innerHTML = '';
			prodModalDescr.textContent = '';
			prodModalChars.innerHTML = '';
			prodModalVideo.innerHTML = '';
			prodModalVideo.style.display = 'none';

			for (let dataItem of data) {
				if (dataItem.id == id) {
					
					// Слайдер с фото товара
					const preview = dataItem.gallery.map((image) => {
						return `
							<div class="slider-min__item swiper-slide">
								<img src="${image}" alt="изображение">
							</div>
						`;
					});
					const slides = dataItem.gallery.map((image) => {
						return `
							<div class="slider-main__item swiper-slide">
								<img src="${image}" alt="изображение">
							</div>
						`;
					});

					prodModalPreview.innerHTML = preview.join('');
					prodModalSlider.innerHTML = slides.join('');

					// Информация о товаре
					const sizes = dataItem.sizes.map((size) => {
						return `
							<li class="modal-info__item-size">
								<button class="btn-reset modal-info__size">${size}</button>
							</li>
						`;
					});

					prodModalInfo.innerHTML = `
						<h3 class="modal-info__title">${dataItem.title}</h3>
						<div class="modal-info__rate">
							<img src="img/star.svg" alt="Рейтинг 5 из 5">
							<img src="img/star.svg" alt="">
							<img src="img/star.svg" alt="">
							<img src="img/star.svg" alt="">
							<img src="img/star.svg" alt="">
						</div>
						<div class="modal-info__sizes">
							<span class="modal-info__subtitle">Выберите размер</span>
							<ul class="modal-info__sizes-list list-reset">
								${sizes.join('')}
							</ul>
						</div>
						<div class="modal-info__price">
							<span class="modal-info__current-price">${dataItem.price} р</span>
							<span class="modal-info__old-price">${dataItem.oldPrice ? dataItem.oldPrice + ' р' : ''}</span>
						</div>
					  `;

					// Описание
					prodModalDescr.textContent = dataItem.description;

					// Характеристики
					let charsItems = '';

					Object.keys(dataItem.chars).forEach(function eachKey(key) {
						charsItems += `<p class="modal-char__item">${key}: ${dataItem.chars[key]}</p>`
					});
					prodModalChars.innerHTML = charsItems;

					// Видео
					if (dataItem.video) {
						prodModalVideo.style.display = 'block';
						prodModalVideo.innerHTML = `
							<iframe src="${dataItem.video}"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen></iframe>
						`;
					}
				}
			}

			modalSlider();

		} else {
			console.log(('error', response.status));
		}

	};
  
	//* по клику на кнопку "Показать ещё" добавляем по 3 карточки товара (с перезагрузкой всех товаров) 
	// catalogMore.addEventListener('click', (e) => {
	// 	prodQuantity = prodQuantity + addQuantity;
	// 	loadProducts(prodQuantity);
	// 	if (prodQuantity >= dataLength) {
	// 		catalogMore.style.display = 'none';
	// 	} else {
	// 		catalogMore.style.display = 'block';
	// 	}
	// });


}
//* работа мини-корзины

const miniCartList = document.querySelector('.mini-cart__list');
const fullPrice = document.querySelector('.mini-cart__summ');
const cartCount = document.querySelector('.cart__count');

// функция удаляет пробел между разрядами
const priceWithoutSpaces = (str) => {
	return str.replace(/\s/g, '');
};

const cartLogic = async () => {
	let response = await fetch('../data/data.json');
	if (response.ok) {
		let data = await response.json();
		let price = 0;		
		const productBtn = document.querySelectorAll('.add-to-cart-btn');

		// при нажатии на кнопку "добавить в корзину" - товар добавляется в корзину
		productBtn.forEach(el => {
			el.addEventListener('click', (e) => {
				const id = e.currentTarget.dataset.id;
				for (let dataItem of data) {
					if (dataItem.id == id) {
						miniCartList.insertAdjacentHTML('afterbegin', `
							<li class="mini-cart__item" data-id="${dataItem.id}">
								<div class="mini-cart__image">
									<img src="${dataItem.mainImage}" alt="${dataItem.title}" width="100" height="100">
								</div>
								<div class="mini-cart__content">
									<h3 class="mini-cart__title">${dataItem.title}</h3>
									<span class="mini-cart__price">${normalPrice(dataItem.price)} p</span>
								</div>
								<button class="mini-cart__delete btn-reset"></button>
							</li>
						`);
		
						// прибавляем цену товара к общей сумме и выводим общую сумму
						price += dataItem.price;
						fullPrice.textContent = `${normalPrice(price)} р`;	
					}
				}
				// получаем количество товара, добавляем его в показаель количества и делаем активным кружочек с количеством
				let num = document.querySelectorAll('.mini-cart__item').length;
				if (num > 0) {
					cartCount.classList.add('cart__count--active');
				}
				cartCount.textContent = num;
		
				// делаем значек корзины доступным для клика
				document.querySelector('.cart').classList.remove('cart--inactive');
				// знак добавления в корзину на товаре делаем недоступным
				e.currentTarget.classList.add('catalog-item__btn--disabled');
			});
		});

		miniCartList.addEventListener('click', (e) => {
			// при клике на кнопку "удалить товар из корзины" удаляем единицу товара, меняем сумму и количество
			if (e.target.classList.contains('mini-cart__delete')) {
				const self = e.target;
				const parent = self.closest('.mini-cart__item');
				let priceDel = parseInt(priceWithoutSpaces(parent.querySelector('.mini-cart__price').textContent));
				const id = parent.dataset.id;
				document.querySelector(`.add-to-cart-btn[data-id="${id}"]`).classList.remove('catalog-item__btn--disabled');
				parent.remove();

				price -= priceDel;
				fullPrice.textContent = `${normalPrice(price)} р`;
		
				// если товаров в корзине нет - закрываем окно корзины, делаем значек корзины недоступным и убираем кружек количества
				let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;
				if (num == 0) {
					cartCount.classList.remove('cart__count--active');
					miniCart.classList.remove('mini-cart--open');
					document.querySelector('.cart').classList.add('cart--inactive');
				}
				cartCount.textContent = num;

			} else if (e.target.closest('.mini-cart__item')) {
				// выделяем товары в корзине при клике на них
				const parent = e.target.closest('.mini-cart__item');
				const cartItems = document.querySelectorAll('.mini-cart__list .mini-cart__item');
				cartItems.forEach(btn => {
					if (!btn.contains(e.target)) {
						btn.classList.remove('mini-cart__item--active');
					}
				});	

				parent.classList.add('mini-cart__item--active');
			}
		});

	}  else {
		console.log(('error', response.status));
	}
};

//* работа корзины в модальном окне
const openOrderModal = document.querySelector('.mini-cart__btn');
const orderModalList = document.querySelector('.modal-cart-order__list');
const orderModalQuantity = document.querySelector('.modal-cart-order__quantity span');
const orderModalSumm = document.querySelector('.modal-cart-order__summ span');
const orderModalShow = document.querySelector('.modal-cart-order__show');


// при клике на кнопку "перейти в корзину" модальное окно корзины заполняется товаром из мини-корзины
// заполняются сумма и количество из мини-корзины
openOrderModal.addEventListener('click', () => {
	const productsMiniCart = document.querySelectorAll('.mini-cart__item');
	const productsQuantity = productsMiniCart.length;
	orderModalList.innerHTML = '';
	productsMiniCart.forEach(el => {
		let productId = el.dataset.id;
		modalCartLoad(productId);
	});

	// закрывать список товаров при открытии окна корзины
	if (orderModalList.classList.contains('modal-cart-order__list--open')) {
		orderModalShow.classList.remove('modal-cart-order__show--active');
		orderModalList.classList.remove('modal-cart-order__list--open');
		orderModalList.style.maxHeight = null;
	}

	// или увеличивать maxHeight - если список должен оставаться закрытым
	// setTimeout(() => {
	// 	if (orderModalList.classList.contains('modal-cart-order__list--open')) {
	// 		orderModalList.style.maxHeight = orderModalList.scrollHeight + 'px';
	// 	}
	// }, 100);

	orderModalQuantity.textContent = `${productsQuantity} шт`;
	orderModalSumm.textContent = fullPrice.textContent;
});

// кнопка открытия-закрытия списка товаров в корзине
orderModalShow.addEventListener('click', () => {
	if (orderModalList.classList.contains('modal-cart-order__list--open')) {
		orderModalShow.classList.remove('modal-cart-order__show--active');
		orderModalList.classList.remove('modal-cart-order__list--open');
		orderModalList.style.maxHeight = null;
	} else {
		orderModalShow.classList.add('modal-cart-order__show--active');
		orderModalList.classList.add('modal-cart-order__list--open');
		orderModalList.style.maxHeight = orderModalList.scrollHeight + 'px';
	}
});

//! доделать ! кнопка добавления товара в корзину остается не активной после удаления товара из окна корзины

// удоление товаров из окна корзины
orderModalList.addEventListener('click', (e) => {
	if (e.target.classList.contains('modal-cart-product__delete')) {
		const self = e.target;
		const parent = self.closest('.modal-cart-product');
		const priceItrm = parseInt(priceWithoutSpaces(parent.querySelector('.modal-cart-product__price').textContent));
		let priseFull = parseInt(priceWithoutSpaces(fullPrice.textContent));
		const id = parent.dataset.id;
		console.log(priseFull);
		
		// удаляем товары в окне и в мини-корзине
		parent.remove();
		document.querySelector(`.mini-cart__item[data-id="${id}"]`).remove();

		// изменяем общую стоимость товаров в окне и в мини-корзине
		priseFull -= priceItrm;
		orderModalSumm.textContent = `${normalPrice(priseFull)} р`;
		fullPrice.textContent = `${normalPrice(priseFull)} р`;

		// изменяем количество товаров в окне, мини-корзине	и кружке с количеством

		let num = document.querySelectorAll('.modal-cart-product').length;
		if (num == 0) {
			cartCount.classList.remove('cart__count--active');
			document.querySelector('.cart').classList.add('cart--inactive');
		}
		cartCount.textContent = num; 

		orderModalQuantity.textContent = `${num} шт`;
	}
  });

// функция заполнения модального окна товароми из мини-корзины
const modalCartLoad = async (id) => {
	let response = await fetch('../data/data.json');
	if (response.ok) {
		let data = await response.json();	
		for (let dataItem of data) {
			if (dataItem.id == id) {
				orderModalList.insertAdjacentHTML('afterbegin', `
					<li class="modal-cart-product" data-id="${dataItem.id}">
						<div class="modal-cart-product__image">
							<img src="${dataItem.mainImage}" alt="${dataItem.title}" width="80" height="80">
						</div>
						<div class="modal-cart-product__content">
							<h3 class="modal-cart-product__title">${dataItem.title}</h3>
							<span class="modal-cart-product__price">${normalPrice(dataItem.price)} p</span>
						</div>
						<button class="modal-cart-product__delete btn-reset">Удалить</button>
					</li>
				`);
			}
		}


	}  else {
		console.log(('error', response.status));
	}
};