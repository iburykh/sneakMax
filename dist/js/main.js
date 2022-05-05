'use strict';

// forEach Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// lock scroll
function disableScroll() {
	let pagePosition = window.scrollY;
	document.body.classList.add('scroll-lock');
	document.body.dataset.position = pagePosition;
	document.body.style.top = -pagePosition + 'px';
}

function enableScroll() {
	let pagePosition = parseInt(document.body.dataset.position, 10);
	document.body.style.top = '';
	document.body.classList.remove('scroll-lock');
	window.scroll({ top: pagePosition, left: 0 });
	document.body.removeAttribute('data-position');
}


const clearInputs = (selector) => {
	selector.forEach(item => {
		item.value = '';
	});
	let checkboxes = quizForm.querySelectorAll('.custom-checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
};

// window.noZensmooth = true;
const accordions = document.querySelectorAll('.accordion');

accordions.forEach(el => {
	el.addEventListener('click', (e) => {
		const self = e.currentTarget;
		const control = self.querySelector('.accordion__control');
		const content = self.querySelector('.accordion__content');

		//* если необходимо чтобы все блоки закрывались при открытии блока - просто раскоментировать эту часть!
		// accordions.forEach(btn => {
		// 	const control = btn.querySelector('.accordion__control');
		// 	const content = btn.querySelector('.accordion__content');
		// 	if (btn !== self) {
		// 		btn.classList.remove('open');
		// 		control.setAttribute('aria-expanded', false);
		// 		content.setAttribute('aria-hidden', true);
		// 		content.style.maxHeight = null;
		// 	}
		// });

		self.classList.toggle('open');

		// если открыт аккордеон
		if (self.classList.contains('open')) {
			control.setAttribute('aria-expanded', true);
			content.setAttribute('aria-hidden', false);
			content.style.maxHeight = content.scrollHeight + 'px';
		} else {
			control.setAttribute('aria-expanded', false);
			content.setAttribute('aria-hidden', true);
			content.style.maxHeight = null;
		}
	});
});
let menuBody = document.querySelector('.menu');
let menuItem = document.querySelectorAll('.menu__link');
let hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {    
    hamburger.classList.toggle('active');
    menuBody.classList.toggle('active');

    if (hamburger.classList.contains('active')) {
        hamburger.setAttribute('aria-label', 'закрыть навигацию');
        disableScroll();
    } else {
        hamburger.setAttribute('aria-label', 'открыть навигацию');
        enableScroll();
    }

    setTimeout(() => {
        menuBody.focus();
    }, 600);
});

menuItem.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            menuBody.classList.remove('active');
            hamburger.setAttribute('aria-label', 'открыть навигацию');
            enableScroll();
        }
    })
})

let filter = document.querySelector('.catalog__filters');
let filterBtn = document.querySelector('.catalog__btn');
let filterBurger = document.querySelector('.catalog-hamburger');

filterBurger.addEventListener('click', () => {    
    filterBurger.classList.toggle('active');
    filter.classList.toggle('active');
    if (filterBurger.classList.contains('active')) {
        filterBurger.setAttribute('aria-label', 'закрыть фильтр');
    } else {
        filterBurger.setAttribute('aria-label', 'открыть фильтр');
    }
    setTimeout(() => {
        filter.focus();
    }, 600);
});

filterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (filterBurger.classList.contains('active')) {
        filterBurger.classList.remove('active');
        filter.classList.remove('active');
        filterBurger.setAttribute('aria-label', 'открыть фильтр'); 
    }
})

const checkBox = document.querySelectorAll('.catalog-checkbox__label, .custom-checkbox__text');

checkBox.forEach(item => {
	item.addEventListener('keydown', (e) => {
		if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space') {
			let check = e.target.previousElementSibling;
			if (check.type == 'radio') {
				if (check.checked === false) {
					check.checked = true;
				} 
			} else if (check.type == 'checkbox') {
				if (check.checked === false) {
					check.checked = true;
				} else {
					check.checked = false;
				}
			}

		}
	});
});
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
const forms = document.querySelectorAll('form');

if (forms.length > 0) {
	forms.forEach(item => {
		item.addEventListener('submit', (e) => {
			e.preventDefault();
			let form = e.target;	
			let inputs = form.querySelectorAll('input');
			// let fileName = target.querySelector('.file__name'); // если есть загрузка файла (в атрибут добавить file)
			let valid = validInput(form);
			if (valid === 0 && validCheck(form)) {
				formRemoveError(form);

				//* ======== Сообщение об отправке ============
				let textMessage = form.querySelector('.form-message');
				if (textMessage) {
					textMessage.textContent = 'Загрузка...';
					textMessage.classList.add('active');
				}

				//* Запись названия чекбокса в value инпута чекбокса (если есть чекбоксы)
				// inputs.forEach(input => {
				// 	if (input.type == 'checkbox' || input.type == 'radio') {
				// 		input.value = input.nextElementSibling.textContent;
				// 	}
				// });

				//*========= FormData =========================
				const formData = new FormData(item);
				// formData.append('image', formImage.files[0]);

				//* ===== Проверка формы =====
				// for(var pair of formData.entries()) {
				// 	console.log(pair[0]+ ', '+ pair[1]);
				// }

				//*========= Отправка данных ===============
				const postData = async (url, data) => {
					let response = await fetch(url, {
						method: "POST",
						body: data
					});	
					if (response.ok) {

						let result = await response.json(); // json() - для вывода сообщения;
						alert(result.message);

						// let result = await response.text(); // text() - для проверки на сервере, подключить server.php)
						// console.log(result); // это для проверки на сервере

						if (textMessage) {
							textMessage.textContent = 'Спасибо, скоро мы с вами свяжимся!';
							textMessage.classList.add('active');
						}
						clearInputs(inputs);
						setTimeout(() => {
							if (textMessage) {
								textMessage.classList.remove('active');
							}
						}, 5000);
					} else {
						// alert("Ошибка");
						if (textMessage) {
							textMessage.textContent = 'Что-то пошло не так...';
							textMessage.classList.add('active');
						}
						setTimeout(() => {
							if (textMessage) {
								textMessage.classList.remove('active');
							}
						}, 5000);
					}
				};
				postData('../sendmail.php', formData);
				// postData('../server.php', formData) //! убрать (это для проверки на сервере)
			}
		});
	});
}
const lazyImages = document.querySelectorAll('img[data-src],source[data-srcset]');
const loadMap = document.querySelector('.load-map');

window.addEventListener("scroll", () => {
	let scrollY = window.scrollY;
	if (lazyImages.length > 0) {
		lazyImages.forEach(img => {
			let imgOffset = img.getBoundingClientRect().top + pageYOffset;
			
			if (scrollY >= imgOffset - 1000) {
				if (img.dataset.src) {
					img.src = img.dataset.src;
					img.removeAttribute('data-src');
				} else if (img.dataset.srcset) {
					img.srcset = img.dataset.srcset;
					img.removeAttribute('data-srcset');
				}
			}
		});
	}
	//Map
	// if (!loadMap.classList.contains('loaded')) {
	// 	let mapOffset = loadMap.offsetTop;
	// 	if (scrollY >= mapOffset - 200) {
	// 		const loadMapUrl = loadMap.dataset.map;
	// 		if (loadMapUrl) {
	// 			loadMap.insertAdjacentHTML(
	// 				"beforeend",
	// 				`<iframe src="${loadMapUrl}" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
	// 			);
	// 			loadMap.classList.add('loaded');
	// 		}
	// 	}
	// }
});
let flag = 0;

window.addEventListener('scroll', function(){
	let scrollY = window.scrollY;
	let mapOffset = document.querySelector("#map").offsetTop;

	if ((scrollY >= mapOffset - 500) && (flag == 0)) {
		ymaps.ready(init);

		function init(){
			const myMap = new ymaps.Map("map", {
				center: [59.830481, 30.142197],
				zoom: 10,
				controls: []
		
			});
			let myPlacemark  = new ymaps.Placemark([59.830481, 30.142197], {}, {
				iconLayout: 'default#image',
				iconImageHref: 'img/placemark.png',
				iconImageSize: [25, 34],
				iconImageOffset: [-19, -44]
			});			
			myMap.geoObjects.add(myPlacemark);
			myMap.behaviors.disable(['scrollZoom']);
		}

		flag = 1;
	}
});
let setCursorPosition = (pos, elem) => {
    elem.focus();
    if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
        let range = elem.createTextRange();

        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
};
function createMask(event) {
    let matrix = '+7 (___) ___ __ __',
        i = 0,
        def = matrix.replace(/\D/g, ''),
        val = this.value.replace(/\D/g, '');
    if (def.length >= val.length) {
        val = def;
    }
    this.value = matrix.replace(/./g, function(a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
    });
    if (event.type ==='blur') {
        if (this.value.length == 2 || this.value.length < matrix.length) {
            this.value = '';
        }
    } else if (event.type ==='keyup' || event.type ==='mouseup') {
        let cur = this.selectionStart;
        if (cur == '0') {
            setCursorPosition(this.value.length, this);
        }
    } else {
        setCursorPosition(this.value.length, this);        
    }
}
let tel = document.querySelectorAll('.tel');
tel.forEach(input => {
    input.addEventListener('input', createMask);
    input.addEventListener('focus', createMask);
    input.addEventListener('blur', createMask);
    input.addEventListener('keyup', createMask);
    input.addEventListener('mouseup', createMask);
});
const cartBtn = document.querySelector('.cart');
const miniCart = document.querySelector('.mini-cart');
// const miniCartItem = document.querySelectorAll('.mini-cart__item');

cartBtn.addEventListener('click', () => {
	miniCart.classList.toggle('mini-cart--open');
});

document.addEventListener('click', (e) => {
	if (!e.target.classList.contains('mini-cart') && !e.target.closest('.mini-cart') && !e.target.classList.contains('cart') && !e.target.classList.contains('mini-cart__delete')
	|| e.target.classList.contains('mini-cart__btn')) {
		miniCart.classList.remove('mini-cart--open');
	}
});
//? Параметры:
//* btnSelector - кнопка открытия модального окна
//* modalSelector - модальное окно внутри фона modal

//? эти парвметры менять по умолчанию, либо указывать их как аргумент, если они разные для разных окон
//* animate - анимация при открытии модального окна (контента внутри оболочки)
//* speed - время выполнения, ставится в соответствии с $transition-time

//TODO Добавить классы:
//* data-modal - добавить всем модальным окнам (modal-name) (если их несколько)
//* block-fix - добавить класс для блоков с position: absolute или fixed (добавится padding)
//* small-fix - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)
//* data-inside - добавить кнопкам внутри модального окна, которые открывают следующее модальное окно (что бы сохранить фокус на кнопке вне окна)

bindModal('.cart-btn', '.modal-cart');

let lastFocus = false;

function bindModal(btnSelector, modalSelector, func, animate='fade', speed=500,) {
    const modalBtn = document.querySelectorAll(btnSelector);
	const modal = document.querySelector('.modal-overlay');
	const modalContent = document.querySelector(modalSelector);
	const modalclose = modalContent.querySelector('.modal__close');
	const openWindows = document.querySelectorAll('[data-modal]');
	const fixBlocks = document.querySelectorAll('.block-fix ');
	const fixSmall = document.querySelectorAll('.small-fix');
	const speedTime = (speed);
	// const modalAnimation = animate;
    const modalScroll = window.innerWidth - document.body.offsetWidth;
    const focusElements = [
		'a[href]',
		'input',
		'select',
		'textarea',
		'button',
		'iframe',
		'[contenteditable]',
		'[tabindex]:not([tabindex^="-"])'
	];
	
	if (modal) {
		modalBtn.forEach(function(item) {
			item.addEventListener('click', function(e) {
				let target = e.target
				if (target) {
					e.preventDefault();
					openModal(target);
				}
			});
		});
	
		modalclose.addEventListener('click', () => {
			if (modal.classList.contains("is-open")) {
				closeModal();
			}
		});
	
		document.addEventListener('click', (e) => {
			if (e.target.classList.contains('modal-overlay') && e.target.classList.contains("is-open")) {
				closeModal();			
			}
		});
		
	
		document.addEventListener('keydown', (e) => {
			if (e.code === 'Escape' && modal.classList.contains("is-open")) {
				closeModal();
			}
	
			if (e.code === 'Tab' && modal.classList.contains("is-open")) {
				focusCatch(e);
			}
		});
	}
	function openModal(tar) {
		if (!tar.closest(`[data-inside]`)) {
			lastFocus = document.activeElement;
		}

		openWindows.forEach(item => {
			item.classList.remove('modal-open');
			item.setAttribute('aria-hidden', true);
			// item.classList.remove('animate-open');
			// item.classList.remove(modalAnimation);
		});

		if (!modal.classList.contains('is-open')){
			disableScroll();
		}

		if (modalContent.classList.contains('modal-prod')) {
			let openBtnId = lastFocus.dataset.id;	
			func(openBtnId);
		}

		modal.classList.add('is-open');
		modal.setAttribute('tabindex', '0');

		document.body.style.paddingRight = `${modalScroll}px`;
		if (fixBlocks.length > 0) {
			fixBlocks.forEach(item => {
				item.style.paddingRight = `${modalScroll}px`;
			})
		}
		if (fixSmall.length > 0) {
			fixSmall.forEach(item => {
				item.style.marginRight = `${modalScroll}px`;
			})
		}

		modalContent.classList.add('modal-open');
		modalContent.setAttribute('aria-hidden', false);
		// modalContent.classList.add(modalAnimation);

		setTimeout(() => {
			// modalContent.classList.add('animate-open');
			focusTrap();
		}, speedTime);
	}

	function closeModal() {
		openWindows.forEach(item => {
			item.classList.remove('modal-open');
			item.setAttribute('aria-hidden', true);
			// item.classList.remove('animate-open');
			// item.classList.remove(modalAnimation);
		});

		enableScroll();

		document.body.style.paddingRight = `0px`;
		if (fixBlocks.length > 0) {
			fixBlocks.forEach(item => {
				item.style.paddingRight = `0px`;
			})
		}
		if (fixSmall.length > 0) {
			fixSmall.forEach(item => {
				item.style.marginRight = `0px`;
			})
		}

		modal.classList.remove('is-open');
		modal.setAttribute('tabindex', '-1');

		focusTrap();
	}

    // function disableScroll() {
    //     let pagePosition = window.scrollY;
    //     document.body.classList.add('scroll-lock');
    //     document.body.dataset.position = pagePosition;
    //     document.body.style.top = -pagePosition + 'px';
    // }

    // function enableScroll() {
    //     let pagePosition = parseInt(document.body.dataset.position, 10);
    //     document.body.style.top = '';
    //     document.body.classList.remove('scroll-lock');
    //     window.scroll({ top: pagePosition, left: 0 });
    //     document.body.removeAttribute('data-position');
    // }

    function focusTrap() {
		// const nodes = this.modalContainer.querySelectorAll(this._focusElements); //* для фокуса на первом элементе окна
		if (modal.classList.contains("is-open")) {
            modal.focus();
			// if (nodes.length) nodes[0].focus(); //* для фокуса на первом элементе окна
		} else {
			lastFocus.focus();	
		}
	}

	function focusCatch(e) {
		const focusable = modalContent.querySelectorAll(focusElements);
		const focusArray = Array.prototype.slice.call(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);

		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}

		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}
};
const quizForm = document.querySelector('.quiz-form');
const quizInputs = quizForm.querySelectorAll('input');
const quizBlocks = quizForm.querySelectorAll('.quiz-block');

let textareaText = null;
let quizReply  = {};
let blockIndex = 0;

// функция показа только первого блока квиза
showBlocks(blockIndex);

function showBlocks() {
	quizBlocks.forEach((item) => item.style.display = 'none');
	quizBlocks[blockIndex].style.display = 'block';
}

// запись названия чекбокса в value инпута чекбокса
quizInputs.forEach(input => {
	if (input.type == 'checkbox' || input.type == 'radio') {
		input.value = input.nextElementSibling.textContent;
	}
});

quizForm.addEventListener('click', (e) => {
	let target = e.target;
	let block = target.closest('.quiz-block');
	let nextBtn = quizForm.querySelectorAll('[data-next]');
	nextBtn.forEach(btn => {
		if (target == btn) {
			e.preventDefault();
			addToSend(block, quizReply);
			nextQuestion(block);
		}
	});
	if (target == document.querySelector('[data-send]')) {
		e.preventDefault();
		addToSend(block, quizReply);
		send(block);
	}
});

function nextQuestion(form) {
	let valid = validInput(form);
	if (valid === 0 && validCheck(form)) {
		showBlocks(blockIndex += 1);
	}
}

function send(form) {
	let valid = validInput(form);
	if (valid === 0 && validCheck(form)) {
		formRemoveError(quizForm);

		//* ======== Сообщение об отправке ============
		let ok = form.querySelector('.quiz-send__ok');
		let textMessage = form.querySelector('.quiz-message');
		if (textMessage) {
			textMessage.textContent = 'Загрузка...';
			textMessage.classList.add('active');
		}

		//*========= FormData ===============
		const quizFormData = new FormData();
		for (let key in quizReply) {
			quizFormData.append(key, quizReply[key]);
		}
		// formData.append('image', formImage.files[0]);
		//* Проверка FormData
		// for(var pair of quizFormData.entries()) {
		// 	console.log(pair[0]+ ': '+ pair[1]);
		// }

		//*========= Отправка данных ===============
		const quizData = async (url, data) => {
			let response = await fetch(url, {
				method: "POST",
				body: data
			});	
			if (response.ok) {

				// let result = await response.json(); // json() - для вывода сообщения;
				// alert(result.message);

				let result = await response.text(); // text() - для проверки на сервере, подключить server.php)
				console.log(result); // это для проверки на сервере

				if (textMessage) {
					textMessage.textContent = 'Ok!';
					textMessage.classList.add('active');
				}
				ok.classList.add('active');
				clearInputs(quizInputs);
				setTimeout(() => {
					if (textMessage) {
						textMessage.classList.remove('active');
					}
					ok.classList.remove('active');
				}, 5000);
			} else {
				alert("Ошибка HTTP: " + response.status);
				if (textMessage) {
					textMessage.textContent = 'Что-то пошло не так...';
					textMessage.classList.add('active');
				}
				setTimeout(() => {
					if (textMessage) {
						textMessage.classList.remove('active');
					}
				}, 5000);
			}
		};
		// quizData('../sendmail.php', quizFormData);
		quizData('../server.php', quizFormData) //! убрать (это для проверки на сервере)

	}
}

function addToSend(form, obj) {
	let valueString = '';
	let inputs = form.querySelectorAll('input');
	let textarea = form.querySelectorAll('textarea');
	if (inputs.length > 0) {
		for (let i = 0; i < inputs.length; i++) {
			let field = inputs[i];
			if (field.type != 'checkbox' && field.type != 'radio' && field.value) {
				obj[field.name] = field.value;
			} else if (field.type == 'radio' && field.checked) {
				obj[field.name] = field.value;
			} else if (field.type == 'checkbox' && field.checked) {
				valueString += field.value + ',';		
				obj[field.name] = valueString;
			}
		}
	} else if (textarea.length > 0) {
		for (let i = 0; i < textarea.length; i++) {
			let text = textarea[i];
			if (text.value) {
				obj[text.name] = text.value;	
			}
		}
	}
}
const rangeSlider = document.getElementById('range-slider');

if (rangeSlider) {
	noUiSlider.create(rangeSlider, {
    start: [500, 999999],
		connect: true,
		step: 1,
    range: {
			'min': [500],
			'max': [999999]
    }
	});

	const input0 = document.getElementById('input-0');
	const input1 = document.getElementById('input-1');
	const inputs = [input0, input1];

	rangeSlider.noUiSlider.on('update', function(values, handle){
		inputs[handle].value = Math.round(values[handle]);
	});

	const setRangeSlider = (i, value) => {
		let arr = [null, null];
		arr[i] = value;

		console.log(arr);

		rangeSlider.noUiSlider.set(arr);
	};

	inputs.forEach((el, index) => {
		el.addEventListener('change', (e) => {
			console.log(index);
			setRangeSlider(index, e.currentTarget.value);
		});
	});
}
let td = document.querySelectorAll('.catalog-sizes td');

td.forEach(item => {
	item.addEventListener('click', (e) => {
		let self = e.currentTarget;
		item.style.backgroundColor = '#dbbba9';
		td.forEach(btn => {
			if (btn !== self) {
				btn.style.backgroundColor = 'transparent';
			}
		});
	});
});
// const minSlider = new Swiper('.slider-min', {
// 	grabCursor: true,
// 	slidesPerView: 6,
// 	initialSlide: 0,
// 	// spaceBetween: 20,
// 	freeMode: true,
// });

// const mainSlider = new Swiper('.slider-main', {
// 	grabCursor: true,
// 	spaceBetween: 20,
// 	slidesPerView: 1,
// 	initialSlide: 0,
// 	simulateTouch: false,
// 	effect: 'fade',
// 	fadeEffect: {
// 	  crossFade: true
// 	},
// 	thumbs: {
// 		swiper: minSlider,
// 	}
// });
//* Валидация формы (если чекбоксы и инпуты в одной форме)
function validCheck(form) {
	let elements = form.querySelectorAll('input');
	let isValid = false;
	if (elements.length > 0) {
		for (let index = 0; index < elements.length; index++) {
			let input = elements[index];
			if (!input.classList.contains('not-valid') && input.getAttribute("type") === "checkbox" || input.getAttribute("type") === "radio") {
					if (input.checked) {
						isValid = true;
					} else {
						formAddError(input);
					}
			} else {isValid = true;}
		}
	} else {isValid = true;}

	return isValid;
}
function validInput(form) {
	let elements = form.querySelectorAll('input');
	let error = 0;
	if (elements.length > 0) {
		for (let index = 0; index < elements.length; index++) {
			let input = elements[index];
			let placeholder = input.getAttribute('placeholder');
			if (!input.classList.contains('not-valid')) {
				if (input.classList.contains('email')) {
					if (emailTest(input) || input.value == placeholder) {
						formAddError(input);
						error++;
					}
				} else {
					if (input.value == '' || input.value == placeholder) {
						formAddError(input);
						error++;
					}
				}
			}
		}
	}
	//!включить, если надо валидировать textare:
	// let textarea = form.querySelector('textarea');
	// if (textarea) {
	// 	if (textarea.value == '') {
	// 		formAddError(textarea);
	// 		error++;
	// 	}
	// } 

	return error;
}

function formAddError(item) {
	item.parentElement.classList.add('error');
	item.classList.add('error');

	//! Оставить эту часть, если в html добавлены блоки с сообщением об ошибке (.form-error)
	//* если разный текст ошибки для каждого input
	// let imputError = item.nextElementSibling;
	// if (imputError) {
	// 	if (imputError.classList.contains('imput-message')) {
	// 		imputError.classList.add('active');
	// 	}
	// }
	//* если ошибка для всей формы (или блока квиза):

	//! Оставить эту часть если на сайте есть квиз
	if (item.closest('.quiz-form')) {
		let quizError = item.closest('.quiz-block').querySelector('.quiz-message');
		if (quizError) {
			quizError.classList.add('active');
		}
	} else {
		let formError = item.parentElement.querySelector('.form-message');
		if (formError) {
			formError.classList.add('active');
		}
	}

	//! Оставить эту часть если на сайте нет квиза (только формы)
	// let formError = item.parentElement.querySelector('.form-error');
	// if (formError) {
	// 	formError.classList.add('active');
	// }
}

function formRemoveError(form) {
	let inputs = form.querySelectorAll('input, textarea');
	if (inputs.length > 0) {
		for (let index = 0; index < inputs.length; index++) {
			let input = inputs[index];
			if (!input.classList.contains('not-valid')) {
				input.parentElement.classList.remove('error');
				input.classList.remove('error');
			}
		}
	}
	
	//! Оставить эту часть, если в html добавлены блоки с сообщением об ошибке (.form-error)
	let formError = form.querySelectorAll('.form-message');
	if (formError.length > 0) {
		for (let index = 0; index < formError.length; index++) {
			const error = formError[index];
			error.classList.remove('active');
		}
	}
}

function emailTest(selector) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(selector.value);
}

const textInputs = document.querySelectorAll('.check');   
textInputs.forEach(input => {
	// если значение клавиши(e.key) не соответствует(match) кириллице, поле не заполняется
	input.addEventListener('keypress', function(e) {
		if (e.key.match(/[^а-яё 0-9]/ig)) {
			e.preventDefault();
		}
	});
	// если при автозаполнении выбрано слово не кириллицей, строка очистится
	input.addEventListener('keyup', function() {
		this.value=this.value.replace(/[^\а-яё 0-9]/ig,"");
	});
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJhY2NvcmRpb24uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImNyZWF0ZS1jYXJkcy5qcyIsImZvcm0uanMiLCJsYXp5LmpzIiwibWFwLmpzIiwibWFzay10ZWwuanMiLCJtaW5pLWNhcnQuanMiLCJtb2RhbC5qcyIsInF1aXouanMiLCJyYW5nZS1zbGlkZXIuanMiLCJzaXplcy5qcyIsInNsaWRlci5qcyIsInZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcGNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gZm9yRWFjaCBQb2x5ZmlsbFxyXG5pZiAod2luZG93Lk5vZGVMaXN0ICYmICFOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCkge1xyXG4gICAgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcclxufVxyXG5cclxuLy8gbG9jayBzY3JvbGxcclxuZnVuY3Rpb24gZGlzYWJsZVNjcm9sbCgpIHtcclxuXHRsZXQgcGFnZVBvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XHJcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtbG9jaycpO1xyXG5cdGRvY3VtZW50LmJvZHkuZGF0YXNldC5wb3NpdGlvbiA9IHBhZ2VQb3NpdGlvbjtcclxuXHRkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IC1wYWdlUG9zaXRpb24gKyAncHgnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbmFibGVTY3JvbGwoKSB7XHJcblx0bGV0IHBhZ2VQb3NpdGlvbiA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuZGF0YXNldC5wb3NpdGlvbiwgMTApO1xyXG5cdGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gJyc7XHJcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtbG9jaycpO1xyXG5cdHdpbmRvdy5zY3JvbGwoeyB0b3A6IHBhZ2VQb3NpdGlvbiwgbGVmdDogMCB9KTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wb3NpdGlvbicpO1xyXG59XHJcblxyXG5cclxuY29uc3QgY2xlYXJJbnB1dHMgPSAoc2VsZWN0b3IpID0+IHtcclxuXHRzZWxlY3Rvci5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0aXRlbS52YWx1ZSA9ICcnO1xyXG5cdH0pO1xyXG5cdGxldCBjaGVja2JveGVzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmN1c3RvbS1jaGVja2JveF9faW5wdXQnKTtcclxuXHRpZiAoY2hlY2tib3hlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY2hlY2tib3hlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0Y29uc3QgY2hlY2tib3ggPSBjaGVja2JveGVzW2luZGV4XTtcclxuXHRcdFx0Y2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8vIHdpbmRvdy5ub1plbnNtb290aCA9IHRydWU7IiwiY29uc3QgYWNjb3JkaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24nKTtcblxuYWNjb3JkaW9ucy5mb3JFYWNoKGVsID0+IHtcblx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdGNvbnN0IHNlbGYgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0Y29uc3QgY29udHJvbCA9IHNlbGYucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udHJvbCcpO1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRlbnQnKTtcblxuXHRcdC8vKiDQtdGB0LvQuCDQvdC10L7QsdGF0L7QtNC40LzQviDRh9GC0L7QsdGLINCy0YHQtSDQsdC70L7QutC4INC30LDQutGA0YvQstCw0LvQuNGB0Ywg0L/RgNC4INC+0YLQutGA0YvRgtC40Lgg0LHQu9C+0LrQsCAtINC/0YDQvtGB0YLQviDRgNCw0YHQutC+0LzQtdC90YLQuNGA0L7QstCw0YLRjCDRjdGC0YMg0YfQsNGB0YLRjCFcblx0XHQvLyBhY2NvcmRpb25zLmZvckVhY2goYnRuID0+IHtcblx0XHQvLyBcdGNvbnN0IGNvbnRyb2wgPSBidG4ucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udHJvbCcpO1xuXHRcdC8vIFx0Y29uc3QgY29udGVudCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50Jyk7XG5cdFx0Ly8gXHRpZiAoYnRuICE9PSBzZWxmKSB7XG5cdFx0Ly8gXHRcdGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG5cdFx0Ly8gXHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXHRcdC8vIFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHQvLyBcdFx0Y29udGVudC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH0pO1xuXG5cdFx0c2VsZi5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG5cblx0XHQvLyDQtdGB0LvQuCDQvtGC0LrRgNGL0YIg0LDQutC60L7RgNC00LXQvtC9XG5cdFx0aWYgKHNlbGYuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVuJykpIHtcblx0XHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnN0eWxlLm1heEhlaWdodCA9IGNvbnRlbnQuc2Nyb2xsSGVpZ2h0ICsgJ3B4Jztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udHJvbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHRcdGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcblx0XHR9XG5cdH0pO1xufSk7IiwibGV0IG1lbnVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcclxubGV0IG1lbnVJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVfX2xpbmsnKTtcclxubGV0IGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKTtcclxuXHJcbmhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBtZW51Qm9keS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuXHJcbiAgICBpZiAoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C30LDQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgICAgIGRpc2FibGVTY3JvbGwoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGFtYnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQvtGC0LrRgNGL0YLRjCDQvdCw0LLQuNCz0LDRhtC40Y4nKTtcclxuICAgICAgICBlbmFibGVTY3JvbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBtZW51Qm9keS5mb2N1cygpO1xyXG4gICAgfSwgNjAwKTtcclxufSk7XHJcblxyXG5tZW51SXRlbS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChoYW1idXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIG1lbnVCb2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgICAgICAgICBlbmFibGVTY3JvbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxubGV0IGZpbHRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXJzJyk7XHJcbmxldCBmaWx0ZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fYnRuJyk7XHJcbmxldCBmaWx0ZXJCdXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZy1oYW1idXJnZXInKTtcclxuXHJcbmZpbHRlckJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBmaWx0ZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBpZiAoZmlsdGVyQnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C30LDQutGA0YvRgtGMINGE0LjQu9GM0YLRgCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINGE0LjQu9GM0YLRgCcpO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgZmlsdGVyLmZvY3VzKCk7XHJcbiAgICB9LCA2MDApO1xyXG59KTtcclxuXHJcbmZpbHRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoZmlsdGVyQnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgZmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7IFxyXG4gICAgfVxyXG59KVxyXG4iLCJjb25zdCBjaGVja0JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRhbG9nLWNoZWNrYm94X19sYWJlbCwgLmN1c3RvbS1jaGVja2JveF9fdGV4dCcpO1xyXG5cclxuY2hlY2tCb3guZm9yRWFjaChpdGVtID0+IHtcclxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG5cdFx0aWYgKGUuY29kZSA9PT0gJ0VudGVyJyB8fCBlLmNvZGUgPT09ICdOdW1wYWRFbnRlcicgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XHJcblx0XHRcdGxldCBjaGVjayA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblx0XHRcdGlmIChjaGVjay50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdFx0XHRpZiAoY2hlY2suY2hlY2tlZCA9PT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH0gXHJcblx0XHRcdH0gZWxzZSBpZiAoY2hlY2sudHlwZSA9PSAnY2hlY2tib3gnKSB7XHJcblx0XHRcdFx0aWYgKGNoZWNrLmNoZWNrZWQgPT09IGZhbHNlKSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHR9KTtcclxufSk7IiwiY29uc3QgY2F0YWxvZ1Byb2R1Y3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX3dyYXAnKTtcclxuY29uc3QgY2F0YWxvZ01vcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fbW9yZScpO1xyXG5jb25zdCBwcm9kTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtcHJvZF9fY29udGVudCcpO1xyXG5jb25zdCBwcm9kTW9kYWxTbGlkZXIgPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLnNsaWRlci1tYWluX193cmFwcGVyJyk7XHJcbmNvbnN0IHByb2RNb2RhbFByZXZpZXcgPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLnNsaWRlci1taW5fX3dyYXBwZXInKTtcclxuY29uc3QgcHJvZE1vZGFsSW5mbyA9IHByb2RNb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtaW5mb19fd3JhcHBlcicpO1xyXG5jb25zdCBwcm9kTW9kYWxEZXNjciA9IHByb2RNb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtZGVzY3JfX3RleHQnKTtcclxuY29uc3QgcHJvZE1vZGFsQ2hhcnMgPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWNoYXJfX2l0ZW1zJyk7XHJcbmNvbnN0IHByb2RNb2RhbFZpZGVvID0gcHJvZE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC12aWRlbycpO1xyXG5sZXQgcHJvZFF1YW50aXR5ID0gNjsgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LrQsNGA0YLQvtGH0LXQuiDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0LjQt9C90LDRh9Cw0LvRjNC90L5cclxubGV0IGFkZFF1YW50aXR5ID0gMzsgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvtCx0LDQstC70Y/QtdC80YvRhSDQutCw0YDRgtC+0YfQtdC6INC/0YDQuCDQutC70LjQutC1INC90LAg0LrQvdC+0L/QutGDIFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0ZFcIlxyXG5sZXQgZGF0YUxlbmd0aCA9IG51bGw7XHJcblxyXG4vLyDRhNGD0L3QutGG0LjRjyDQstGB0YLQsNCy0LvRj9C10YIg0L/RgNC+0LHQtdC7INC80LXQttC00YMg0YDQsNC30YDRj9C00LDQvNC4XHJcbmNvbnN0IG5vcm1hbFByaWNlID0gKHN0cikgPT4ge1xyXG5cdHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcclxufTtcclxuXHJcbi8vINC10YHQu9C4INC10YHRgtGMINGB0LvQsNC50LTQtdGAINCyINC80L7QtNCw0LvRjNC90L7QvCDQvtC60L3QtSAtINC40L3QuNGG0LjQuNGA0L7QstCw0YLRjCDRgdC70LDQudC00LXRgNGLINCyINGE0YPQvdC60YbQuNC4IG1vZGFsU2xpZGVyINC4INC+0LHRitGP0LLQu9GP0YLRjCDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0L7QutC90LBcclxuLy8g0YTRg9C90LrRhtC40Y8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0YHQu9Cw0LnQtNC10YDQsFxyXG5jb25zdCBtb2RhbFNsaWRlciA9ICgpID0+IHtcclxuXHRjb25zdCBtaW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1pbicsIHtcclxuXHRcdGdyYWJDdXJzb3I6IHRydWUsXHJcblx0XHRzbGlkZXNQZXJWaWV3OiA2LFxyXG5cdFx0aW5pdGlhbFNsaWRlOiAwLFxyXG5cdFx0c3BhY2VCZXR3ZWVuOiAyMCxcclxuXHRcdGZyZWVNb2RlOiB0cnVlLFxyXG5cdH0pO1xyXG5cdFxyXG5cdGNvbnN0IG1haW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1haW4nLCB7XHJcblx0XHRncmFiQ3Vyc29yOiB0cnVlLFxyXG5cdFx0c3BhY2VCZXR3ZWVuOiAyMCxcclxuXHRcdHNsaWRlc1BlclZpZXc6IDEsXHJcblx0XHRpbml0aWFsU2xpZGU6IDAsXHJcblx0XHRzaW11bGF0ZVRvdWNoOiBmYWxzZSxcclxuXHRcdGVmZmVjdDogJ2ZhZGUnLFxyXG5cdFx0ZmFkZUVmZmVjdDoge1xyXG5cdFx0ICBjcm9zc0ZhZGU6IHRydWVcclxuXHRcdH0sXHJcblx0XHR0aHVtYnM6IHtcclxuXHRcdFx0c3dpcGVyOiBtaW5TbGlkZXIsXHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG5pZiAoY2F0YWxvZ1Byb2R1Y3RzKSB7XHJcblx0Ly8qINGE0YPQvdC60YbQuNGPINGB0L7Qt9C00LDQvdC40Y8g0LrQsNGA0YLQvtGH0LXQuiDQsiDQutCw0YLQsNC70L7Qs9C1INGC0L7QstCw0YDQvtCyXHJcblx0Y29uc3QgbG9hZFByb2R1Y3RzID0gYXN5bmMgKHF1YW50aXR5ID0gNSkgPT4ge1xyXG5cdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy4uL2RhdGEvZGF0YS5qc29uJyk7XHJcblx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHRcdFx0bGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG5cdFx0XHRkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcclxuXHRcdFx0Y2F0YWxvZ1Byb2R1Y3RzLmlubmVySFRNTCA9ICcnO1xyXG5cclxuXHRcdFx0Ly8g0YTQvtGA0LzQuNGA0YPQtdC8INGB0LXRgtC60YMg0LjQtyA2INC60LDRgNGC0L7Rh9C10Log0YLQvtCy0LDRgNC+0LIg0L3QsCDRgdGC0YDQsNC90LjRhtC1ICg2IC0g0Y3RgtC+INGH0LjRgdC70L4gcHJvZFF1YW50aXR5KVxyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChpIDwgcHJvZFF1YW50aXR5KSB7XHJcblx0XHRcdFx0bGV0IGl0ZW0gPSBkYXRhW2ldO1xyXG5cdFxyXG5cdFx0XHRcdFx0Y2F0YWxvZ1Byb2R1Y3RzLmlubmVySFRNTCArPSBgXHJcblx0XHRcdFx0XHRcdDxhcnRpY2xlIGNsYXNzPVwiY2F0YWxvZy1pdGVtXCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9faW1nXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7aXRlbS5tYWluSW1hZ2V9XCIgbG9hZGluZz1cImxhenlcIiBhbHQ9XCIke2l0ZW0udGl0bGV9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0YWxvZy1pdGVtX19idG5zXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgbW9kYWwtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0J/QvtC60LDQt9Cw0YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRgtC+0LLQsNGA0LVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3ZnPjx1c2UgeGxpbms6aHJlZj1cImltZy9zcHJpdGUuc3ZnI3Nob3dcIj48L3VzZT48L3N2Zz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgYWRkLXRvLWNhcnQtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0JTQvtCx0LDQstC40YLRjCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdGDXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHN2Zz48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ByaXRlLnN2ZyNjYXJ0XCI+PC91c2U+PC9zdmc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwiY2F0YWxvZy1pdGVtX190aXRsZVwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2F0YWxvZy1pdGVtX19wcmljZVwiPiR7bm9ybWFsUHJpY2UoaXRlbS5wcmljZSl9INGAPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2FydGljbGU+XHJcblx0XHRcdFx0XHRgO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyDRhNGD0L3QutGG0LjRjyDRgNCw0LHQvtGC0Ysg0LrQvtGA0LfQuNC90YtcclxuXHRcdFx0Y2FydExvZ2ljKCk7XHJcblx0XHRcdC8vINGE0YPQvdC60YbQuNGPINC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwXHJcblx0XHRcdGJpbmRNb2RhbCgnLm1vZGFsLWJ0bicsICcubW9kYWwtcHJvZCcsIGxvYWRNb2RhbERhdGEpO1xyXG5cdFx0XHQvL1RPRE8gLSDQtNC+0LHQsNCy0LjRgtGMINCw0YDQs9GD0LzQtdC90YIgZnVuYyDQsiDRhNGD0L3QutGG0LjRjiBiaW5kTW9kYWwoYnRuU2VsZWN0b3IsIG1vZGFsU2VsZWN0b3IsIGZ1bmMsIGFuaW1hdGU9J2ZhZGUnLCBzcGVlZD0zMDAsKVxyXG5cdFx0XHQvL1RPRE8gLSDQstGB0YLQsNCy0LjRgtGMINGN0YLQvtGCINC60L7QtCDQsiDRhNGD0L3QutGG0LjRjiBiaW5kTW9kYWwgKNC80L7QtNCw0LvRjNC90L7QtSDQvtC60L3Qvikg0LIg0LzQvtC80LXQvdGCINC+0YLQutGA0YvRgtC40Y8g0L7QutC90LAg0L/QvtGB0LvQtSDQv9C+0LvRg9GH0LXQvdC40Y8gbGFzdEZvY3VzXHJcblx0XHRcdC8vINC/0L7Qu9GD0YfQtdC90LjQtSBpZCDQutC90L7Qv9C60LhcclxuXHRcdFx0Ly8gaWYgKG1vZGFsQ29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXByb2QnKSkge1xyXG5cdFx0XHQvLyBcdGxldCBvcGVuQnRuSWQgPSBsYXN0Rm9jdXMuZGF0YXNldC5pZDtcclxuXHRcdFx0Ly8gXHRmdW5jKG9wZW5CdG5JZCk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vINC/0L4g0LrQu9C40LrRgyDQvdCwINC60L3QvtC/0LrRgyBcItCf0L7QutCw0LfQsNGC0Ywg0LXRidGRXCIg0LTQvtCx0LDQstC70Y/QtdC8INC/0L4gMyDQutCw0YDRgtC+0YfQutC4INGC0L7QstCw0YDQsCAoMyAtINGN0YLQviDRh9C40YHQu9C+IGFkZFF1YW50aXR5KSBcclxuXHRcdFx0Y2F0YWxvZ01vcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0XHRcdGxldCBhID0gcHJvZFF1YW50aXR5O1xyXG5cdFx0XHRcdHByb2RRdWFudGl0eSA9IHByb2RRdWFudGl0eSArIGFkZFF1YW50aXR5O1xyXG5cdFx0XHRcdGZvciAobGV0IGkgPSBhOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoaSA8IHByb2RRdWFudGl0eSkge1xyXG5cdFx0XHRcdFx0bGV0IGl0ZW0gPSBkYXRhW2ldO1xyXG5cdFx0XHRcdFx0XHRjYXRhbG9nUHJvZHVjdHMuaW5uZXJIVE1MICs9IGBcclxuXHRcdFx0XHRcdFx0XHQ8YXJ0aWNsZSBjbGFzcz1cImNhdGFsb2ctaXRlbVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9faW1nXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiJHtpdGVtLm1haW5JbWFnZX1cIiBsb2FkaW5nPVwibGF6eVwiIGFsdD1cIiR7aXRlbS50aXRsZX1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuc1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgbW9kYWwtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0J/QvtC60LDQt9Cw0YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRgtC+0LLQsNGA0LVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxzdmc+PHVzZSB4bGluazpocmVmPVwiaW1nL3Nwcml0ZS5zdmcjc2hvd1wiPjwvdXNlPjwvc3ZnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgYWRkLXRvLWNhcnQtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0JTQvtCx0LDQstC40YLRjCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdGDXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3ZnPjx1c2UgeGxpbms6aHJlZj1cImltZy9zcHJpdGUuc3ZnI2NhcnRcIj48L3VzZT48L3N2Zz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDxoMyBjbGFzcz1cImNhdGFsb2ctaXRlbV9fdGl0bGVcIj4ke2l0ZW0udGl0bGV9PC9oMz5cclxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2F0YWxvZy1pdGVtX19wcmljZVwiPiR7bm9ybWFsUHJpY2UoaXRlbS5wcmljZSl9INGAPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdDwvYXJ0aWNsZT5cclxuXHRcdFx0XHRcdFx0YDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHByb2RRdWFudGl0eSA+PSBkYXRhTGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYXRhbG9nTW9yZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjYXRhbG9nTW9yZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8g0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC90L7QstGL0YUg0YLQvtCy0LDRgNC+0LIg0L/QtdGA0LXQt9Cw0L/Rg9GB0LrQsNGO0YLRgdGPINGE0YPQvdC60YbQuNC4INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINC4INC60L7RgNC30LjQvdGLXHJcblx0XHRcdFx0Y2FydExvZ2ljKCk7XHJcblx0XHRcdFx0YmluZE1vZGFsKCcubW9kYWwtYnRuJywgJy5tb2RhbC1wcm9kJywgbG9hZE1vZGFsRGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCgnZXJyb3InLCByZXNwb25zZS5zdGF0dXMpKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRsb2FkUHJvZHVjdHMoKTtcclxuXHJcblx0Ly8qINGE0YPQvdC60YbQuNGPINGB0L7Qt9C00LDQvdC40Y8g0L7QutC90LAg0YLQvtCy0LDRgNCwXHJcblx0Y29uc3QgbG9hZE1vZGFsRGF0YSA9IGFzeW5jIChpZCA9IDEpID0+IHtcclxuXHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcuLi9kYXRhL2RhdGEuanNvbicpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblx0XHRcdGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cdFx0XHQvLyDQvtGH0LjRidCw0LXQvCDQsdC70L7QutC4XHJcblx0XHRcdHByb2RNb2RhbFNsaWRlci5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsUHJldmlldy5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsSW5mby5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsRGVzY3IudGV4dENvbnRlbnQgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsQ2hhcnMuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdHByb2RNb2RhbFZpZGVvLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxWaWRlby5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgZGF0YUl0ZW0gb2YgZGF0YSkge1xyXG5cdFx0XHRcdGlmIChkYXRhSXRlbS5pZCA9PSBpZCkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyDQodC70LDQudC00LXRgCDRgSDRhNC+0YLQviDRgtC+0LLQsNGA0LBcclxuXHRcdFx0XHRcdGNvbnN0IHByZXZpZXcgPSBkYXRhSXRlbS5nYWxsZXJ5Lm1hcCgoaW1hZ2UpID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGBcclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2xpZGVyLW1pbl9faXRlbSBzd2lwZXItc2xpZGVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiJHtpbWFnZX1cIiBhbHQ9XCLQuNC30L7QsdGA0LDQttC10L3QuNC1XCI+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGNvbnN0IHNsaWRlcyA9IGRhdGFJdGVtLmdhbGxlcnkubWFwKChpbWFnZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYFxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzbGlkZXItbWFpbl9faXRlbSBzd2lwZXItc2xpZGVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiJHtpbWFnZX1cIiBhbHQ9XCLQuNC30L7QsdGA0LDQttC10L3QuNC1XCI+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRwcm9kTW9kYWxQcmV2aWV3LmlubmVySFRNTCA9IHByZXZpZXcuam9pbignJyk7XHJcblx0XHRcdFx0XHRwcm9kTW9kYWxTbGlkZXIuaW5uZXJIVE1MID0gc2xpZGVzLmpvaW4oJycpO1xyXG5cclxuXHRcdFx0XHRcdC8vINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INGC0L7QstCw0YDQtVxyXG5cdFx0XHRcdFx0Y29uc3Qgc2l6ZXMgPSBkYXRhSXRlbS5zaXplcy5tYXAoKHNpemUpID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGBcclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3M9XCJtb2RhbC1pbmZvX19pdGVtLXNpemVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJidG4tcmVzZXQgbW9kYWwtaW5mb19fc2l6ZVwiPiR7c2l6ZX08L2J1dHRvbj5cclxuXHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHRgO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0cHJvZE1vZGFsSW5mby5pbm5lckhUTUwgPSBgXHJcblx0XHRcdFx0XHRcdDxoMyBjbGFzcz1cIm1vZGFsLWluZm9fX3RpdGxlXCI+JHtkYXRhSXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtaW5mb19fcmF0ZVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaW1nL3N0YXIuc3ZnXCIgYWx0PVwi0KDQtdC50YLQuNC90LMgNSDQuNC3IDVcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cImltZy9zdGFyLnN2Z1wiIGFsdD1cIlwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaW1nL3N0YXIuc3ZnXCIgYWx0PVwiXCI+XHJcblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJpbWcvc3Rhci5zdmdcIiBhbHQ9XCJcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cImltZy9zdGFyLnN2Z1wiIGFsdD1cIlwiPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWluZm9fX3NpemVzXCI+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJtb2RhbC1pbmZvX19zdWJ0aXRsZVwiPtCS0YvQsdC10YDQuNGC0LUg0YDQsNC30LzQtdGAPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cIm1vZGFsLWluZm9fX3NpemVzLWxpc3QgbGlzdC1yZXNldFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0JHtzaXplcy5qb2luKCcnKX1cclxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWluZm9fX3ByaWNlXCI+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJtb2RhbC1pbmZvX19jdXJyZW50LXByaWNlXCI+JHtkYXRhSXRlbS5wcmljZX0g0YA8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJtb2RhbC1pbmZvX19vbGQtcHJpY2VcIj4ke2RhdGFJdGVtLm9sZFByaWNlID8gZGF0YUl0ZW0ub2xkUHJpY2UgKyAnINGAJyA6ICcnfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQgIGA7XHJcblxyXG5cdFx0XHRcdFx0Ly8g0J7Qv9C40YHQsNC90LjQtVxyXG5cdFx0XHRcdFx0cHJvZE1vZGFsRGVzY3IudGV4dENvbnRlbnQgPSBkYXRhSXRlbS5kZXNjcmlwdGlvbjtcclxuXHJcblx0XHRcdFx0XHQvLyDQpdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutC4XHJcblx0XHRcdFx0XHRsZXQgY2hhcnNJdGVtcyA9ICcnO1xyXG5cclxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKGRhdGFJdGVtLmNoYXJzKS5mb3JFYWNoKGZ1bmN0aW9uIGVhY2hLZXkoa2V5KSB7XHJcblx0XHRcdFx0XHRcdGNoYXJzSXRlbXMgKz0gYDxwIGNsYXNzPVwibW9kYWwtY2hhcl9faXRlbVwiPiR7a2V5fTogJHtkYXRhSXRlbS5jaGFyc1trZXldfTwvcD5gXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHByb2RNb2RhbENoYXJzLmlubmVySFRNTCA9IGNoYXJzSXRlbXM7XHJcblxyXG5cdFx0XHRcdFx0Ly8g0JLQuNC00LXQvlxyXG5cdFx0XHRcdFx0aWYgKGRhdGFJdGVtLnZpZGVvKSB7XHJcblx0XHRcdFx0XHRcdHByb2RNb2RhbFZpZGVvLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0XHRcdFx0XHRwcm9kTW9kYWxWaWRlby5pbm5lckhUTUwgPSBgXHJcblx0XHRcdFx0XHRcdFx0PGlmcmFtZSBzcmM9XCIke2RhdGFJdGVtLnZpZGVvfVwiXHJcblx0XHRcdFx0XHRcdFx0YWxsb3c9XCJhY2NlbGVyb21ldGVyOyBhdXRvcGxheTsgY2xpcGJvYXJkLXdyaXRlOyBlbmNyeXB0ZWQtbWVkaWE7IGd5cm9zY29wZTsgcGljdHVyZS1pbi1waWN0dXJlXCJcclxuXHRcdFx0XHRcdFx0XHRhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+XHJcblx0XHRcdFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtb2RhbFNsaWRlcigpO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCgnZXJyb3InLCByZXNwb25zZS5zdGF0dXMpKTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuICBcclxuXHQvLyog0L/QviDQutC70LjQutGDINC90LAg0LrQvdC+0L/QutGDIFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0ZFcIiDQtNC+0LHQsNCy0LvRj9C10Lwg0L/QviAzINC60LDRgNGC0L7Rh9C60Lgg0YLQvtCy0LDRgNCwICjRgSDQv9C10YDQtdC30LDQs9GA0YPQt9C60L7QuSDQstGB0LXRhSDRgtC+0LLQsNGA0L7QsikgXHJcblx0Ly8gY2F0YWxvZ01vcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdC8vIFx0cHJvZFF1YW50aXR5ID0gcHJvZFF1YW50aXR5ICsgYWRkUXVhbnRpdHk7XHJcblx0Ly8gXHRsb2FkUHJvZHVjdHMocHJvZFF1YW50aXR5KTtcclxuXHQvLyBcdGlmIChwcm9kUXVhbnRpdHkgPj0gZGF0YUxlbmd0aCkge1xyXG5cdC8vIFx0XHRjYXRhbG9nTW9yZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdC8vIFx0fSBlbHNlIHtcclxuXHQvLyBcdFx0Y2F0YWxvZ01vcmUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSk7XHJcblxyXG5cclxufVxyXG4vLyog0YDQsNCx0L7RgtCwINC80LjQvdC4LdC60L7RgNC30LjQvdGLXHJcblxyXG5jb25zdCBtaW5pQ2FydExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWluaS1jYXJ0X19saXN0Jyk7XHJcbmNvbnN0IGZ1bGxQcmljZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5taW5pLWNhcnRfX3N1bW0nKTtcclxuY29uc3QgY2FydENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2NvdW50Jyk7XHJcblxyXG4vLyDRhNGD0L3QutGG0LjRjyDRg9C00LDQu9GP0LXRgiDQv9GA0L7QsdC10Lsg0LzQtdC20LTRgyDRgNCw0LfRgNGP0LTQsNC80LhcclxuY29uc3QgcHJpY2VXaXRob3V0U3BhY2VzID0gKHN0cikgPT4ge1xyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvXFxzL2csICcnKTtcclxufTtcclxuXHJcbmNvbnN0IGNhcnRMb2dpYyA9IGFzeW5jICgpID0+IHtcclxuXHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnLi4vZGF0YS9kYXRhLmpzb24nKTtcclxuXHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHRcdGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cdFx0bGV0IHByaWNlID0gMDtcdFx0XHJcblx0XHRjb25zdCBwcm9kdWN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFkZC10by1jYXJ0LWJ0bicpO1xyXG5cclxuXHRcdC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRgyBcItC00L7QsdCw0LLQuNGC0Ywg0LIg0LrQvtGA0LfQuNC90YNcIiAtINGC0L7QstCw0YAg0LTQvtCx0LDQstC70Y/QtdGC0YHRjyDQsiDQutC+0YDQt9C40L3Rg1xyXG5cdFx0cHJvZHVjdEJ0bi5mb3JFYWNoKGVsID0+IHtcclxuXHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcblx0XHRcdFx0Zm9yIChsZXQgZGF0YUl0ZW0gb2YgZGF0YSkge1xyXG5cdFx0XHRcdFx0aWYgKGRhdGFJdGVtLmlkID09IGlkKSB7XHJcblx0XHRcdFx0XHRcdG1pbmlDYXJ0TGlzdC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgXHJcblx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzPVwibWluaS1jYXJ0X19pdGVtXCIgZGF0YS1pZD1cIiR7ZGF0YUl0ZW0uaWR9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWluaS1jYXJ0X19pbWFnZVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7ZGF0YUl0ZW0ubWFpbkltYWdlfVwiIGFsdD1cIiR7ZGF0YUl0ZW0udGl0bGV9XCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1pbmktY2FydF9fY29udGVudFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aDMgY2xhc3M9XCJtaW5pLWNhcnRfX3RpdGxlXCI+JHtkYXRhSXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm1pbmktY2FydF9fcHJpY2VcIj4ke25vcm1hbFByaWNlKGRhdGFJdGVtLnByaWNlKX0gcDwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm1pbmktY2FydF9fZGVsZXRlIGJ0bi1yZXNldFwiPjwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHRcdGApO1xyXG5cdFx0XHJcblx0XHRcdFx0XHRcdC8vINC/0YDQuNCx0LDQstC70Y/QtdC8INGG0LXQvdGDINGC0L7QstCw0YDQsCDQuiDQvtCx0YnQtdC5INGB0YPQvNC80LUg0Lgg0LLRi9Cy0L7QtNC40Lwg0L7QsdGJ0YPRjiDRgdGD0LzQvNGDXHJcblx0XHRcdFx0XHRcdHByaWNlICs9IGRhdGFJdGVtLnByaWNlO1xyXG5cdFx0XHRcdFx0XHRmdWxsUHJpY2UudGV4dENvbnRlbnQgPSBgJHtub3JtYWxQcmljZShwcmljZSl9INGAYDtcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyDQv9C+0LvRg9GH0LDQtdC8INC60L7Qu9C40YfQtdGB0YLQstC+INGC0L7QstCw0YDQsCwg0LTQvtCx0LDQstC70Y/QtdC8INC10LPQviDQsiDQv9C+0LrQsNC30LDQtdC70Ywg0LrQvtC70LjRh9C10YHRgtCy0LAg0Lgg0LTQtdC70LDQtdC8INCw0LrRgtC40LLQvdGL0Lwg0LrRgNGD0LbQvtGH0LXQuiDRgSDQutC+0LvQuNGH0LXRgdGC0LLQvtC8XHJcblx0XHRcdFx0bGV0IG51bSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5taW5pLWNhcnRfX2l0ZW0nKS5sZW5ndGg7XHJcblx0XHRcdFx0aWYgKG51bSA+IDApIHtcclxuXHRcdFx0XHRcdGNhcnRDb3VudC5jbGFzc0xpc3QuYWRkKCdjYXJ0X19jb3VudC0tYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhcnRDb3VudC50ZXh0Q29udGVudCA9IG51bTtcclxuXHRcdFxyXG5cdFx0XHRcdC8vINC00LXQu9Cw0LXQvCDQt9C90LDRh9C10Log0LrQvtGA0LfQuNC90Ysg0LTQvtGB0YLRg9C/0L3Ri9C8INC00LvRjyDQutC70LjQutCwXHJcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQnKS5jbGFzc0xpc3QucmVtb3ZlKCdjYXJ0LS1pbmFjdGl2ZScpO1xyXG5cdFx0XHRcdC8vINC30L3QsNC6INC00L7QsdCw0LLQu9C10L3QuNGPINCyINC60L7RgNC30LjQvdGDINC90LAg0YLQvtCy0LDRgNC1INC00LXQu9Cw0LXQvCDQvdC10LTQvtGB0YLRg9C/0L3Ri9C8XHJcblx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2NhdGFsb2ctaXRlbV9fYnRuLS1kaXNhYmxlZCcpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdG1pbmlDYXJ0TGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcdC8vINC/0YDQuCDQutC70LjQutC1INC90LAg0LrQvdC+0L/QutGDIFwi0YPQtNCw0LvQuNGC0Ywg0YLQvtCy0LDRgCDQuNC3INC60L7RgNC30LjQvdGLXCIg0YPQtNCw0LvRj9C10Lwg0LXQtNC40L3QuNGG0YMg0YLQvtCy0LDRgNCwLCDQvNC10L3Rj9C10Lwg0YHRg9C80LzRgyDQuCDQutC+0LvQuNGH0LXRgdGC0LLQvlxyXG5cdFx0XHRpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pLWNhcnRfX2RlbGV0ZScpKSB7XHJcblx0XHRcdFx0Y29uc3Qgc2VsZiA9IGUudGFyZ2V0O1xyXG5cdFx0XHRcdGNvbnN0IHBhcmVudCA9IHNlbGYuY2xvc2VzdCgnLm1pbmktY2FydF9faXRlbScpO1xyXG5cdFx0XHRcdGxldCBwcmljZURlbCA9IHBhcnNlSW50KHByaWNlV2l0aG91dFNwYWNlcyhwYXJlbnQucXVlcnlTZWxlY3RvcignLm1pbmktY2FydF9fcHJpY2UnKS50ZXh0Q29udGVudCkpO1xyXG5cdFx0XHRcdGNvbnN0IGlkID0gcGFyZW50LmRhdGFzZXQuaWQ7XHJcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmFkZC10by1jYXJ0LWJ0bltkYXRhLWlkPVwiJHtpZH1cIl1gKS5jbGFzc0xpc3QucmVtb3ZlKCdjYXRhbG9nLWl0ZW1fX2J0bi0tZGlzYWJsZWQnKTtcclxuXHRcdFx0XHRwYXJlbnQucmVtb3ZlKCk7XHJcblxyXG5cdFx0XHRcdHByaWNlIC09IHByaWNlRGVsO1xyXG5cdFx0XHRcdGZ1bGxQcmljZS50ZXh0Q29udGVudCA9IGAke25vcm1hbFByaWNlKHByaWNlKX0g0YBgO1xyXG5cdFx0XHJcblx0XHRcdFx0Ly8g0LXRgdC70Lgg0YLQvtCy0LDRgNC+0LIg0LIg0LrQvtGA0LfQuNC90LUg0L3QtdGCIC0g0LfQsNC60YDRi9Cy0LDQtdC8INC+0LrQvdC+INC60L7RgNC30LjQvdGLLCDQtNC10LvQsNC10Lwg0LfQvdCw0YfQtdC6INC60L7RgNC30LjQvdGLINC90LXQtNC+0YHRgtGD0L/QvdGL0Lwg0Lgg0YPQsdC40YDQsNC10Lwg0LrRgNGD0LbQtdC6INC60L7Qu9C40YfQtdGB0YLQstCwXHJcblx0XHRcdFx0bGV0IG51bSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5taW5pLWNhcnRfX2xpc3QgLm1pbmktY2FydF9faXRlbScpLmxlbmd0aDtcclxuXHRcdFx0XHRpZiAobnVtID09IDApIHtcclxuXHRcdFx0XHRcdGNhcnRDb3VudC5jbGFzc0xpc3QucmVtb3ZlKCdjYXJ0X19jb3VudC0tYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRtaW5pQ2FydC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pLWNhcnQtLW9wZW4nKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0JykuY2xhc3NMaXN0LmFkZCgnY2FydC0taW5hY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FydENvdW50LnRleHRDb250ZW50ID0gbnVtO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChlLnRhcmdldC5jbG9zZXN0KCcubWluaS1jYXJ0X19pdGVtJykpIHtcclxuXHRcdFx0XHQvLyDQstGL0LTQtdC70Y/QtdC8INGC0L7QstCw0YDRiyDQsiDQutC+0YDQt9C40L3QtSDQv9GA0Lgg0LrQu9C40LrQtSDQvdCwINC90LjRhVxyXG5cdFx0XHRcdGNvbnN0IHBhcmVudCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5taW5pLWNhcnRfX2l0ZW0nKTtcclxuXHRcdFx0XHRjb25zdCBjYXJ0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWluaS1jYXJ0X19saXN0IC5taW5pLWNhcnRfX2l0ZW0nKTtcclxuXHRcdFx0XHRjYXJ0SXRlbXMuZm9yRWFjaChidG4gPT4ge1xyXG5cdFx0XHRcdFx0aWYgKCFidG4uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRcdGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pLWNhcnRfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1x0XHJcblxyXG5cdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QuYWRkKCdtaW5pLWNhcnRfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fSAgZWxzZSB7XHJcblx0XHRjb25zb2xlLmxvZygoJ2Vycm9yJywgcmVzcG9uc2Uuc3RhdHVzKSk7XHJcblx0fVxyXG59O1xyXG5cclxuLy8qINGA0LDQsdC+0YLQsCDQutC+0YDQt9C40L3RiyDQsiDQvNC+0LTQsNC70YzQvdC+0Lwg0L7QutC90LVcclxuY29uc3Qgb3Blbk9yZGVyTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWluaS1jYXJ0X19idG4nKTtcclxuY29uc3Qgb3JkZXJNb2RhbExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2FydC1vcmRlcl9fbGlzdCcpO1xyXG5jb25zdCBvcmRlck1vZGFsUXVhbnRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2FydC1vcmRlcl9fcXVhbnRpdHkgc3BhbicpO1xyXG5jb25zdCBvcmRlck1vZGFsU3VtbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jYXJ0LW9yZGVyX19zdW1tIHNwYW4nKTtcclxuY29uc3Qgb3JkZXJNb2RhbFNob3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2FydC1vcmRlcl9fc2hvdycpO1xyXG5cclxuXHJcbi8vINC/0YDQuCDQutC70LjQutC1INC90LAg0LrQvdC+0L/QutGDIFwi0L/QtdGA0LXQudGC0Lgg0LIg0LrQvtGA0LfQuNC90YNcIiDQvNC+0LTQsNC70YzQvdC+0LUg0L7QutC90L4g0LrQvtGA0LfQuNC90Ysg0LfQsNC/0L7Qu9C90Y/QtdGC0YHRjyDRgtC+0LLQsNGA0L7QvCDQuNC3INC80LjQvdC4LdC60L7RgNC30LjQvdGLXHJcbi8vINC30LDQv9C+0LvQvdGP0Y7RgtGB0Y8g0YHRg9C80LzQsCDQuCDQutC+0LvQuNGH0LXRgdGC0LLQviDQuNC3INC80LjQvdC4LdC60L7RgNC30LjQvdGLXHJcbm9wZW5PcmRlck1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdGNvbnN0IHByb2R1Y3RzTWluaUNhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWluaS1jYXJ0X19pdGVtJyk7XHJcblx0Y29uc3QgcHJvZHVjdHNRdWFudGl0eSA9IHByb2R1Y3RzTWluaUNhcnQubGVuZ3RoO1xyXG5cdG9yZGVyTW9kYWxMaXN0LmlubmVySFRNTCA9ICcnO1xyXG5cdHByb2R1Y3RzTWluaUNhcnQuZm9yRWFjaChlbCA9PiB7XHJcblx0XHRsZXQgcHJvZHVjdElkID0gZWwuZGF0YXNldC5pZDtcclxuXHRcdG1vZGFsQ2FydExvYWQocHJvZHVjdElkKTtcclxuXHR9KTtcclxuXHJcblx0Ly8g0LfQsNC60YDRi9Cy0LDRgtGMINGB0L/QuNGB0L7QuiDRgtC+0LLQsNGA0L7QsiDQv9GA0Lgg0L7RgtC60YDRi9GC0LjQuCDQvtC60L3QsCDQutC+0YDQt9C40L3Ri1xyXG5cdGlmIChvcmRlck1vZGFsTGlzdC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLWNhcnQtb3JkZXJfX2xpc3QtLW9wZW4nKSkge1xyXG5cdFx0b3JkZXJNb2RhbFNob3cuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtY2FydC1vcmRlcl9fc2hvdy0tYWN0aXZlJyk7XHJcblx0XHRvcmRlck1vZGFsTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1jYXJ0LW9yZGVyX19saXN0LS1vcGVuJyk7XHJcblx0XHRvcmRlck1vZGFsTGlzdC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0Ly8g0LjQu9C4INGD0LLQtdC70LjRh9C40LLQsNGC0YwgbWF4SGVpZ2h0IC0g0LXRgdC70Lgg0YHQv9C40YHQvtC6INC00L7Qu9C20LXQvSDQvtGB0YLQsNCy0LDRgtGM0YHRjyDQt9Cw0LrRgNGL0YLRi9C8XHJcblx0Ly8gc2V0VGltZW91dCgoKSA9PiB7XHJcblx0Ly8gXHRpZiAob3JkZXJNb2RhbExpc3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC1jYXJ0LW9yZGVyX19saXN0LS1vcGVuJykpIHtcclxuXHQvLyBcdFx0b3JkZXJNb2RhbExpc3Quc3R5bGUubWF4SGVpZ2h0ID0gb3JkZXJNb2RhbExpc3Quc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuXHQvLyBcdH1cclxuXHQvLyB9LCAxMDApO1xyXG5cclxuXHRvcmRlck1vZGFsUXVhbnRpdHkudGV4dENvbnRlbnQgPSBgJHtwcm9kdWN0c1F1YW50aXR5fSDRiNGCYDtcclxuXHRvcmRlck1vZGFsU3VtbS50ZXh0Q29udGVudCA9IGZ1bGxQcmljZS50ZXh0Q29udGVudDtcclxufSk7XHJcblxyXG4vLyDQutC90L7Qv9C60LAg0L7RgtC60YDRi9GC0LjRjy3Qt9Cw0LrRgNGL0YLQuNGPINGB0L/QuNGB0LrQsCDRgtC+0LLQsNGA0L7QsiDQsiDQutC+0YDQt9C40L3QtVxyXG5vcmRlck1vZGFsU2hvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRpZiAob3JkZXJNb2RhbExpc3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC1jYXJ0LW9yZGVyX19saXN0LS1vcGVuJykpIHtcclxuXHRcdG9yZGVyTW9kYWxTaG93LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWNhcnQtb3JkZXJfX3Nob3ctLWFjdGl2ZScpO1xyXG5cdFx0b3JkZXJNb2RhbExpc3QuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtY2FydC1vcmRlcl9fbGlzdC0tb3BlbicpO1xyXG5cdFx0b3JkZXJNb2RhbExpc3Quc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0b3JkZXJNb2RhbFNob3cuY2xhc3NMaXN0LmFkZCgnbW9kYWwtY2FydC1vcmRlcl9fc2hvdy0tYWN0aXZlJyk7XHJcblx0XHRvcmRlck1vZGFsTGlzdC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1jYXJ0LW9yZGVyX19saXN0LS1vcGVuJyk7XHJcblx0XHRvcmRlck1vZGFsTGlzdC5zdHlsZS5tYXhIZWlnaHQgPSBvcmRlck1vZGFsTGlzdC5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG5cdH1cclxufSk7XHJcblxyXG4vLyEg0LTQvtC00LXQu9Cw0YLRjCAhINC60L3QvtC/0LrQsCDQtNC+0LHQsNCy0LvQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LIg0LrQvtGA0LfQuNC90YMg0L7RgdGC0LDQtdGC0YHRjyDQvdC1INCw0LrRgtC40LLQvdC+0Lkg0L/QvtGB0LvQtSDRg9C00LDQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQuNC3INC+0LrQvdCwINC60L7RgNC30LjQvdGLXHJcblxyXG4vLyDRg9C00L7Qu9C10L3QuNC1INGC0L7QstCw0YDQvtCyINC40Lcg0L7QutC90LAg0LrQvtGA0LfQuNC90Ytcclxub3JkZXJNb2RhbExpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLWNhcnQtcHJvZHVjdF9fZGVsZXRlJykpIHtcclxuXHRcdGNvbnN0IHNlbGYgPSBlLnRhcmdldDtcclxuXHRcdGNvbnN0IHBhcmVudCA9IHNlbGYuY2xvc2VzdCgnLm1vZGFsLWNhcnQtcHJvZHVjdCcpO1xyXG5cdFx0Y29uc3QgcHJpY2VJdHJtID0gcGFyc2VJbnQocHJpY2VXaXRob3V0U3BhY2VzKHBhcmVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2FydC1wcm9kdWN0X19wcmljZScpLnRleHRDb250ZW50KSk7XHJcblx0XHRsZXQgcHJpc2VGdWxsID0gcGFyc2VJbnQocHJpY2VXaXRob3V0U3BhY2VzKGZ1bGxQcmljZS50ZXh0Q29udGVudCkpO1xyXG5cdFx0Y29uc3QgaWQgPSBwYXJlbnQuZGF0YXNldC5pZDtcclxuXHRcdGNvbnNvbGUubG9nKHByaXNlRnVsbCk7XHJcblx0XHRcclxuXHRcdC8vINGD0LTQsNC70Y/QtdC8INGC0L7QstCw0YDRiyDQsiDQvtC60L3QtSDQuCDQsiDQvNC40L3QuC3QutC+0YDQt9C40L3QtVxyXG5cdFx0cGFyZW50LnJlbW92ZSgpO1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLm1pbmktY2FydF9faXRlbVtkYXRhLWlkPVwiJHtpZH1cIl1gKS5yZW1vdmUoKTtcclxuXHJcblx0XHQvLyDQuNC30LzQtdC90Y/QtdC8INC+0LHRidGD0Y4g0YHRgtC+0LjQvNC+0YHRgtGMINGC0L7QstCw0YDQvtCyINCyINC+0LrQvdC1INC4INCyINC80LjQvdC4LdC60L7RgNC30LjQvdC1XHJcblx0XHRwcmlzZUZ1bGwgLT0gcHJpY2VJdHJtO1xyXG5cdFx0b3JkZXJNb2RhbFN1bW0udGV4dENvbnRlbnQgPSBgJHtub3JtYWxQcmljZShwcmlzZUZ1bGwpfSDRgGA7XHJcblx0XHRmdWxsUHJpY2UudGV4dENvbnRlbnQgPSBgJHtub3JtYWxQcmljZShwcmlzZUZ1bGwpfSDRgGA7XHJcblxyXG5cdFx0Ly8g0LjQt9C80LXQvdGP0LXQvCDQutC+0LvQuNGH0LXRgdGC0LLQviDRgtC+0LLQsNGA0L7QsiDQsiDQvtC60L3QtSwg0LzQuNC90Lgt0LrQvtGA0LfQuNC90LVcdNC4INC60YDRg9C20LrQtSDRgSDQutC+0LvQuNGH0LXRgdGC0LLQvtC8XHJcblxyXG5cdFx0bGV0IG51bSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1jYXJ0LXByb2R1Y3QnKS5sZW5ndGg7XHJcblx0XHRpZiAobnVtID09IDApIHtcclxuXHRcdFx0Y2FydENvdW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NhcnRfX2NvdW50LS1hY3RpdmUnKTtcclxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQnKS5jbGFzc0xpc3QuYWRkKCdjYXJ0LS1pbmFjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdFx0Y2FydENvdW50LnRleHRDb250ZW50ID0gbnVtOyBcclxuXHJcblx0XHRvcmRlck1vZGFsUXVhbnRpdHkudGV4dENvbnRlbnQgPSBgJHtudW19INGI0YJgO1xyXG5cdH1cclxuICB9KTtcclxuXHJcbi8vINGE0YPQvdC60YbQuNGPINC30LDQv9C+0LvQvdC10L3QuNGPINC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINGC0L7QstCw0YDQvtC80Lgg0LjQtyDQvNC40L3QuC3QutC+0YDQt9C40L3Ri1xyXG5jb25zdCBtb2RhbENhcnRMb2FkID0gYXN5bmMgKGlkKSA9PiB7XHJcblx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy4uL2RhdGEvZGF0YS5qc29uJyk7XHJcblx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblx0XHRsZXQgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcdFxyXG5cdFx0Zm9yIChsZXQgZGF0YUl0ZW0gb2YgZGF0YSkge1xyXG5cdFx0XHRpZiAoZGF0YUl0ZW0uaWQgPT0gaWQpIHtcclxuXHRcdFx0XHRvcmRlck1vZGFsTGlzdC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgXHJcblx0XHRcdFx0XHQ8bGkgY2xhc3M9XCJtb2RhbC1jYXJ0LXByb2R1Y3RcIiBkYXRhLWlkPVwiJHtkYXRhSXRlbS5pZH1cIj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWNhcnQtcHJvZHVjdF9faW1hZ2VcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7ZGF0YUl0ZW0ubWFpbkltYWdlfVwiIGFsdD1cIiR7ZGF0YUl0ZW0udGl0bGV9XCIgd2lkdGg9XCI4MFwiIGhlaWdodD1cIjgwXCI+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtY2FydC1wcm9kdWN0X19jb250ZW50XCI+XHJcblx0XHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwibW9kYWwtY2FydC1wcm9kdWN0X190aXRsZVwiPiR7ZGF0YUl0ZW0udGl0bGV9PC9oMz5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm1vZGFsLWNhcnQtcHJvZHVjdF9fcHJpY2VcIj4ke25vcm1hbFByaWNlKGRhdGFJdGVtLnByaWNlKX0gcDwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJtb2RhbC1jYXJ0LXByb2R1Y3RfX2RlbGV0ZSBidG4tcmVzZXRcIj7Qo9C00LDQu9C40YLRjDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0fSAgZWxzZSB7XHJcblx0XHRjb25zb2xlLmxvZygoJ2Vycm9yJywgcmVzcG9uc2Uuc3RhdHVzKSk7XHJcblx0fVxyXG59OyIsImNvbnN0IGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpO1xyXG5cclxuaWYgKGZvcm1zLmxlbmd0aCA+IDApIHtcclxuXHRmb3Jtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGxldCBmb3JtID0gZS50YXJnZXQ7XHRcclxuXHRcdFx0bGV0IGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRcdFx0Ly8gbGV0IGZpbGVOYW1lID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19uYW1lJyk7IC8vINC10YHQu9C4INC10YHRgtGMINC30LDQs9GA0YPQt9C60LAg0YTQsNC50LvQsCAo0LIg0LDRgtGA0LjQsdGD0YIg0LTQvtCx0LDQstC40YLRjCBmaWxlKVxyXG5cdFx0XHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdFx0XHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0XHRcdGZvcm1SZW1vdmVFcnJvcihmb3JtKTtcclxuXHJcblx0XHRcdFx0Ly8qID09PT09PT09INCh0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YLQv9GA0LDQstC60LUgPT09PT09PT09PT09XHJcblx0XHRcdFx0bGV0IHRleHRNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1tZXNzYWdlJyk7XHJcblx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQl9Cw0LPRgNGD0LfQutCwLi4uJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8qINCX0LDQv9C40YHRjCDQvdCw0LfQstCw0L3QuNGPINGH0LXQutCx0L7QutGB0LAg0LIgdmFsdWUg0LjQvdC/0YPRgtCwINGH0LXQutCx0L7QutGB0LAgKNC10YHQu9C4INC10YHRgtGMINGH0LXQutCx0L7QutGB0YspXHJcblx0XHRcdFx0Ly8gaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdC8vIFx0aWYgKGlucHV0LnR5cGUgPT0gJ2NoZWNrYm94JyB8fCBpbnB1dC50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdFx0XHQvLyBcdFx0aW5wdXQudmFsdWUgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQ7XHJcblx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0Ly8gfSk7XHJcblxyXG5cdFx0XHRcdC8vKj09PT09PT09PSBGb3JtRGF0YSA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdFx0Y29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoaXRlbSk7XHJcblx0XHRcdFx0Ly8gZm9ybURhdGEuYXBwZW5kKCdpbWFnZScsIGZvcm1JbWFnZS5maWxlc1swXSk7XHJcblxyXG5cdFx0XHRcdC8vKiA9PT09PSDQn9GA0L7QstC10YDQutCwINGE0L7RgNC80YsgPT09PT1cclxuXHRcdFx0XHQvLyBmb3IodmFyIHBhaXIgb2YgZm9ybURhdGEuZW50cmllcygpKSB7XHJcblx0XHRcdFx0Ly8gXHRjb25zb2xlLmxvZyhwYWlyWzBdKyAnLCAnKyBwYWlyWzFdKTtcclxuXHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdC8vKj09PT09PT09PSDQntGC0L/RgNCw0LLQutCwINC00LDQvdC90YvRhSA9PT09PT09PT09PT09PT1cclxuXHRcdFx0XHRjb25zdCBwb3N0RGF0YSA9IGFzeW5jICh1cmwsIGRhdGEpID0+IHtcclxuXHRcdFx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG5cdFx0XHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdFx0XHRib2R5OiBkYXRhXHJcblx0XHRcdFx0XHR9KTtcdFxyXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpOyAvLyBqc29uKCkgLSDQtNC70Y8g0LLRi9Cy0L7QtNCwINGB0L7QvtCx0YnQtdC90LjRjztcclxuXHRcdFx0XHRcdFx0YWxlcnQocmVzdWx0Lm1lc3NhZ2UpO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTsgLy8gdGV4dCgpIC0g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSwg0L/QvtC00LrQu9GO0YfQuNGC0Ywgc2VydmVyLnBocClcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzdWx0KTsgLy8g0Y3RgtC+INC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LVcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9Ch0L/QsNGB0LjQsdC+LCDRgdC60L7RgNC+INC80Ysg0YEg0LLQsNC80Lgg0YHQstGP0LbQuNC80YHRjyEnO1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNsZWFySW5wdXRzKGlucHV0cyk7XHJcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIGFsZXJ0KFwi0J7RiNC40LHQutCwXCIpO1xyXG5cdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSwgNTAwMCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRwb3N0RGF0YSgnLi4vc2VuZG1haWwucGhwJywgZm9ybURhdGEpO1xyXG5cdFx0XHRcdC8vIHBvc3REYXRhKCcuLi9zZXJ2ZXIucGhwJywgZm9ybURhdGEpIC8vISDRg9Cx0YDQsNGC0YwgKNGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSIsImNvbnN0IGxhenlJbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1zcmNdLHNvdXJjZVtkYXRhLXNyY3NldF0nKTtcclxuY29uc3QgbG9hZE1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkLW1hcCcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKCkgPT4ge1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0aWYgKGxhenlJbWFnZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0bGF6eUltYWdlcy5mb3JFYWNoKGltZyA9PiB7XHJcblx0XHRcdGxldCBpbWdPZmZzZXQgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgcGFnZVlPZmZzZXQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2Nyb2xsWSA+PSBpbWdPZmZzZXQgLSAxMDAwKSB7XHJcblx0XHRcdFx0aWYgKGltZy5kYXRhc2V0LnNyYykge1xyXG5cdFx0XHRcdFx0aW1nLnNyYyA9IGltZy5kYXRhc2V0LnNyYztcclxuXHRcdFx0XHRcdGltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpbWcuZGF0YXNldC5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdGltZy5zcmNzZXQgPSBpbWcuZGF0YXNldC5zcmNzZXQ7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyY3NldCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vTWFwXHJcblx0Ly8gaWYgKCFsb2FkTWFwLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVkJykpIHtcclxuXHQvLyBcdGxldCBtYXBPZmZzZXQgPSBsb2FkTWFwLm9mZnNldFRvcDtcclxuXHQvLyBcdGlmIChzY3JvbGxZID49IG1hcE9mZnNldCAtIDIwMCkge1xyXG5cdC8vIFx0XHRjb25zdCBsb2FkTWFwVXJsID0gbG9hZE1hcC5kYXRhc2V0Lm1hcDtcclxuXHQvLyBcdFx0aWYgKGxvYWRNYXBVcmwpIHtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmluc2VydEFkamFjZW50SFRNTChcclxuXHQvLyBcdFx0XHRcdFwiYmVmb3JlZW5kXCIsXHJcblx0Ly8gXHRcdFx0XHRgPGlmcmFtZSBzcmM9XCIke2xvYWRNYXBVcmx9XCIgc3R5bGU9XCJib3JkZXI6MDtcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBsb2FkaW5nPVwibGF6eVwiPjwvaWZyYW1lPmBcclxuXHQvLyBcdFx0XHQpO1xyXG5cdC8vIFx0XHRcdGxvYWRNYXAuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcbn0pOyIsImxldCBmbGFnID0gMDtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbigpe1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0bGV0IG1hcE9mZnNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFwXCIpLm9mZnNldFRvcDtcclxuXHJcblx0aWYgKChzY3JvbGxZID49IG1hcE9mZnNldCAtIDUwMCkgJiYgKGZsYWcgPT0gMCkpIHtcclxuXHRcdHltYXBzLnJlYWR5KGluaXQpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGluaXQoKXtcclxuXHRcdFx0Y29uc3QgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKFwibWFwXCIsIHtcclxuXHRcdFx0XHRjZW50ZXI6IFs1OS44MzA0ODEsIDMwLjE0MjE5N10sXHJcblx0XHRcdFx0em9vbTogMTAsXHJcblx0XHRcdFx0Y29udHJvbHM6IFtdXHJcblx0XHRcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBteVBsYWNlbWFyayAgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKFs1OS44MzA0ODEsIDMwLjE0MjE5N10sIHt9LCB7XHJcblx0XHRcdFx0aWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxyXG5cdFx0XHRcdGljb25JbWFnZUhyZWY6ICdpbWcvcGxhY2VtYXJrLnBuZycsXHJcblx0XHRcdFx0aWNvbkltYWdlU2l6ZTogWzI1LCAzNF0sXHJcblx0XHRcdFx0aWNvbkltYWdlT2Zmc2V0OiBbLTE5LCAtNDRdXHJcblx0XHRcdH0pO1x0XHRcdFxyXG5cdFx0XHRteU1hcC5nZW9PYmplY3RzLmFkZChteVBsYWNlbWFyayk7XHJcblx0XHRcdG15TWFwLmJlaGF2aW9ycy5kaXNhYmxlKFsnc2Nyb2xsWm9vbSddKTtcclxuXHRcdH1cclxuXHJcblx0XHRmbGFnID0gMTtcclxuXHR9XHJcbn0pOyIsImxldCBzZXRDdXJzb3JQb3NpdGlvbiA9IChwb3MsIGVsZW0pID0+IHtcclxuICAgIGVsZW0uZm9jdXMoKTtcclxuICAgIGlmIChlbGVtLnNldFNlbGVjdGlvblJhbmdlKSB7XHJcbiAgICAgICAgZWxlbS5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XHJcbiAgICB9IGVsc2UgaWYgKGVsZW0uY3JlYXRlVGV4dFJhbmdlKSB7XHJcbiAgICAgICAgbGV0IHJhbmdlID0gZWxlbS5jcmVhdGVUZXh0UmFuZ2UoKTtcclxuXHJcbiAgICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSk7XHJcbiAgICAgICAgcmFuZ2UubW92ZUVuZCgnY2hhcmFjdGVyJywgcG9zKTtcclxuICAgICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHBvcyk7XHJcbiAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XHJcbiAgICB9XHJcbn07XHJcbmZ1bmN0aW9uIGNyZWF0ZU1hc2soZXZlbnQpIHtcclxuICAgIGxldCBtYXRyaXggPSAnKzcgKF9fXykgX19fIF9fIF9fJyxcclxuICAgICAgICBpID0gMCxcclxuICAgICAgICBkZWYgPSBtYXRyaXgucmVwbGFjZSgvXFxEL2csICcnKSxcclxuICAgICAgICB2YWwgPSB0aGlzLnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XHJcbiAgICBpZiAoZGVmLmxlbmd0aCA+PSB2YWwubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFsID0gZGVmO1xyXG4gICAgfVxyXG4gICAgdGhpcy52YWx1ZSA9IG1hdHJpeC5yZXBsYWNlKC8uL2csIGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gL1tfXFxkXS8udGVzdChhKSAmJiBpIDwgdmFsLmxlbmd0aCA/IHZhbC5jaGFyQXQoaSsrKSA6IGkgPj0gdmFsLmxlbmd0aCA/ICcnIDogYTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09J2JsdXInKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09IDIgfHwgdGhpcy52YWx1ZS5sZW5ndGggPCBtYXRyaXgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSAnJztcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09J2tleXVwJyB8fCBldmVudC50eXBlID09PSdtb3VzZXVwJykge1xyXG4gICAgICAgIGxldCBjdXIgPSB0aGlzLnNlbGVjdGlvblN0YXJ0O1xyXG4gICAgICAgIGlmIChjdXIgPT0gJzAnKSB7XHJcbiAgICAgICAgICAgIHNldEN1cnNvclBvc2l0aW9uKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldEN1cnNvclBvc2l0aW9uKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzKTsgICAgICAgIFxyXG4gICAgfVxyXG59XHJcbmxldCB0ZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGVsJyk7XHJcbnRlbC5mb3JFYWNoKGlucHV0ID0+IHtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY3JlYXRlTWFzayk7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjcmVhdGVNYXNrKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBjcmVhdGVNYXNrKTtcclxufSk7IiwiY29uc3QgY2FydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0Jyk7XHJcbmNvbnN0IG1pbmlDYXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1pbmktY2FydCcpO1xyXG4vLyBjb25zdCBtaW5pQ2FydEl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWluaS1jYXJ0X19pdGVtJyk7XHJcblxyXG5jYXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdG1pbmlDYXJ0LmNsYXNzTGlzdC50b2dnbGUoJ21pbmktY2FydC0tb3BlbicpO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWluaS1jYXJ0JykgJiYgIWUudGFyZ2V0LmNsb3Nlc3QoJy5taW5pLWNhcnQnKSAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJ0JykgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWluaS1jYXJ0X19kZWxldGUnKVxyXG5cdHx8IGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWluaS1jYXJ0X19idG4nKSkge1xyXG5cdFx0bWluaUNhcnQuY2xhc3NMaXN0LnJlbW92ZSgnbWluaS1jYXJ0LS1vcGVuJyk7XHJcblx0fVxyXG59KTsiLCIvLz8g0J/QsNGA0LDQvNC10YLRgNGLOlxyXG4vLyogYnRuU2VsZWN0b3IgLSDQutC90L7Qv9C60LAg0L7RgtC60YDRi9GC0LjRjyDQvNC+0LTQsNC70YzQvdC+0LPQviDQvtC60L3QsFxyXG4vLyogbW9kYWxTZWxlY3RvciAtINC80L7QtNCw0LvRjNC90L7QtSDQvtC60L3QviDQstC90YPRgtGA0Lgg0YTQvtC90LAgbW9kYWxcclxuXHJcbi8vPyDRjdGC0Lgg0L/QsNGA0LLQvNC10YLRgNGLINC80LXQvdGP0YLRjCDQv9C+INGD0LzQvtC70YfQsNC90LjRjiwg0LvQuNCx0L4g0YPQutCw0LfRi9Cy0LDRgtGMINC40YUg0LrQsNC6INCw0YDQs9GD0LzQtdC90YIsINC10YHQu9C4INC+0L3QuCDRgNCw0LfQvdGL0LUg0LTQu9GPINGA0LDQt9C90YvRhSDQvtC60L7QvVxyXG4vLyogYW5pbWF0ZSAtINCw0L3QuNC80LDRhtC40Y8g0L/RgNC4INC+0YLQutGA0YvRgtC40Lgg0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LAgKNC60L7QvdGC0LXQvdGC0LAg0LLQvdGD0YLRgNC4INC+0LHQvtC70L7Rh9C60LgpXHJcbi8vKiBzcGVlZCAtINCy0YDQtdC80Y8g0LLRi9C/0L7Qu9C90LXQvdC40Y8sINGB0YLQsNCy0LjRgtGB0Y8g0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBICR0cmFuc2l0aW9uLXRpbWVcclxuXHJcbi8vVE9ETyDQlNC+0LHQsNCy0LjRgtGMINC60LvQsNGB0YHRizpcclxuLy8qIGRhdGEtbW9kYWwgLSDQtNC+0LHQsNCy0LjRgtGMINCy0YHQtdC8INC80L7QtNCw0LvRjNC90YvQvCDQvtC60L3QsNC8IChtb2RhbC1uYW1lKSAo0LXRgdC70Lgg0LjRhSDQvdC10YHQutC+0LvRjNC60L4pXHJcbi8vKiBibG9jay1maXggLSDQtNC+0LHQsNCy0LjRgtGMINC60LvQsNGB0YEg0LTQu9GPINCx0LvQvtC60L7QsiDRgSBwb3NpdGlvbjogYWJzb2x1dGUg0LjQu9C4IGZpeGVkICjQtNC+0LHQsNCy0LjRgtGB0Y8gcGFkZGluZylcclxuLy8qIHNtYWxsLWZpeCAtINC00L7QsdCw0LLQuNGC0Ywg0LrQu9Cw0YHRgSDQtNC70Y8g0LzQsNC70LXQvdGM0LrQuNGFINCx0LvQvtC60L7QsiDRgSBwb3NpdGlvbjogYWJzb2x1dGUg0LjQu9C4IGZpeGVkICjQtNC+0LHQsNCy0LjRgtGB0Y8gbWFyZ2luKVxyXG4vLyogZGF0YS1pbnNpZGUgLSDQtNC+0LHQsNCy0LjRgtGMINC60L3QvtC/0LrQsNC8INCy0L3Rg9GC0YDQuCDQvNC+0LTQsNC70YzQvdC+0LPQviDQvtC60L3QsCwg0LrQvtGC0L7RgNGL0LUg0L7RgtC60YDRi9Cy0LDRjtGCINGB0LvQtdC00YPRjtGJ0LXQtSDQvNC+0LTQsNC70YzQvdC+0LUg0L7QutC90L4gKNGH0YLQviDQsdGLINGB0L7RhdGA0LDQvdC40YLRjCDRhNC+0LrRg9GBINC90LAg0LrQvdC+0L/QutC1INCy0L3QtSDQvtC60L3QsClcclxuXHJcbmJpbmRNb2RhbCgnLmNhcnQtYnRuJywgJy5tb2RhbC1jYXJ0Jyk7XHJcblxyXG5sZXQgbGFzdEZvY3VzID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBiaW5kTW9kYWwoYnRuU2VsZWN0b3IsIG1vZGFsU2VsZWN0b3IsIGZ1bmMsIGFuaW1hdGU9J2ZhZGUnLCBzcGVlZD01MDAsKSB7XHJcbiAgICBjb25zdCBtb2RhbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYnRuU2VsZWN0b3IpO1xyXG5cdGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLW92ZXJsYXknKTtcclxuXHRjb25zdCBtb2RhbENvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG1vZGFsU2VsZWN0b3IpO1xyXG5cdGNvbnN0IG1vZGFsY2xvc2UgPSBtb2RhbENvbnRlbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19jbG9zZScpO1xyXG5cdGNvbnN0IG9wZW5XaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWxdJyk7XHJcblx0Y29uc3QgZml4QmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJsb2NrLWZpeCAnKTtcclxuXHRjb25zdCBmaXhTbWFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbWFsbC1maXgnKTtcclxuXHRjb25zdCBzcGVlZFRpbWUgPSAoc3BlZWQpO1xyXG5cdC8vIGNvbnN0IG1vZGFsQW5pbWF0aW9uID0gYW5pbWF0ZTtcclxuICAgIGNvbnN0IG1vZGFsU2Nyb2xsID0gd2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoO1xyXG4gICAgY29uc3QgZm9jdXNFbGVtZW50cyA9IFtcclxuXHRcdCdhW2hyZWZdJyxcclxuXHRcdCdpbnB1dCcsXHJcblx0XHQnc2VsZWN0JyxcclxuXHRcdCd0ZXh0YXJlYScsXHJcblx0XHQnYnV0dG9uJyxcclxuXHRcdCdpZnJhbWUnLFxyXG5cdFx0J1tjb250ZW50ZWRpdGFibGVdJyxcclxuXHRcdCdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXhePVwiLVwiXSknXHJcblx0XTtcclxuXHRcclxuXHRpZiAobW9kYWwpIHtcclxuXHRcdG1vZGFsQnRuLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSBlLnRhcmdldFxyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdG9wZW5Nb2RhbCh0YXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHRcclxuXHRcdG1vZGFsY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1vcGVuXCIpKSB7XHJcblx0XHRcdFx0Y2xvc2VNb2RhbCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdFx0aWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtb3ZlcmxheScpICYmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImlzLW9wZW5cIikpIHtcclxuXHRcdFx0XHRjbG9zZU1vZGFsKCk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuXHRcdFx0aWYgKGUuY29kZSA9PT0gJ0VzY2FwZScgJiYgbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtb3BlblwiKSkge1xyXG5cdFx0XHRcdGNsb3NlTW9kYWwoKTtcclxuXHRcdFx0fVxyXG5cdFxyXG5cdFx0XHRpZiAoZS5jb2RlID09PSAnVGFiJyAmJiBtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1vcGVuXCIpKSB7XHJcblx0XHRcdFx0Zm9jdXNDYXRjaChlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIG9wZW5Nb2RhbCh0YXIpIHtcclxuXHRcdGlmICghdGFyLmNsb3Nlc3QoYFtkYXRhLWluc2lkZV1gKSkge1xyXG5cdFx0XHRsYXN0Rm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdG9wZW5XaW5kb3dzLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG5cdFx0XHRpdGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcclxuXHRcdFx0Ly8gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlLW9wZW4nKTtcclxuXHRcdFx0Ly8gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKG1vZGFsQW5pbWF0aW9uKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmICghbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpe1xyXG5cdFx0XHRkaXNhYmxlU2Nyb2xsKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG1vZGFsQ29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXByb2QnKSkge1xyXG5cdFx0XHRsZXQgb3BlbkJ0bklkID0gbGFzdEZvY3VzLmRhdGFzZXQuaWQ7XHRcclxuXHRcdFx0ZnVuYyhvcGVuQnRuSWQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcclxuXHRcdG1vZGFsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xyXG5cclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gYCR7bW9kYWxTY3JvbGx9cHhgO1xyXG5cdFx0aWYgKGZpeEJsb2Nrcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZpeEJsb2Nrcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGl0ZW0uc3R5bGUucGFkZGluZ1JpZ2h0ID0gYCR7bW9kYWxTY3JvbGx9cHhgO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0aWYgKGZpeFNtYWxsLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zml4U21hbGwuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLnN0eWxlLm1hcmdpblJpZ2h0ID0gYCR7bW9kYWxTY3JvbGx9cHhgO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdG1vZGFsQ29udGVudC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJyk7XHJcblx0XHRtb2RhbENvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcclxuXHRcdC8vIG1vZGFsQ29udGVudC5jbGFzc0xpc3QuYWRkKG1vZGFsQW5pbWF0aW9uKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0Ly8gbW9kYWxDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUtb3BlbicpO1xyXG5cdFx0XHRmb2N1c1RyYXAoKTtcclxuXHRcdH0sIHNwZWVkVGltZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xyXG5cdFx0b3BlbldpbmRvd3MuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJyk7XHJcblx0XHRcdGl0ZW0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG5cdFx0XHQvLyBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUtb3BlbicpO1xyXG5cdFx0XHQvLyBpdGVtLmNsYXNzTGlzdC5yZW1vdmUobW9kYWxBbmltYXRpb24pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZW5hYmxlU2Nyb2xsKCk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgMHB4YDtcclxuXHRcdGlmIChmaXhCbG9ja3MubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmaXhCbG9ja3MuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAwcHhgO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0aWYgKGZpeFNtYWxsLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zml4U21hbGwuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLnN0eWxlLm1hcmdpblJpZ2h0ID0gYDBweGA7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0bW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpO1xyXG5cdFx0bW9kYWwuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG5cclxuXHRcdGZvY3VzVHJhcCgpO1xyXG5cdH1cclxuXHJcbiAgICAvLyBmdW5jdGlvbiBkaXNhYmxlU2Nyb2xsKCkge1xyXG4gICAgLy8gICAgIGxldCBwYWdlUG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWTtcclxuICAgIC8vICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1sb2NrJyk7XHJcbiAgICAvLyAgICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnBvc2l0aW9uID0gcGFnZVBvc2l0aW9uO1xyXG4gICAgLy8gICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gLXBhZ2VQb3NpdGlvbiArICdweCc7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gZW5hYmxlU2Nyb2xsKCkge1xyXG4gICAgLy8gICAgIGxldCBwYWdlUG9zaXRpb24gPSBwYXJzZUludChkb2N1bWVudC5ib2R5LmRhdGFzZXQucG9zaXRpb24sIDEwKTtcclxuICAgIC8vICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xyXG4gICAgLy8gICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsLWxvY2snKTtcclxuICAgIC8vICAgICB3aW5kb3cuc2Nyb2xsKHsgdG9wOiBwYWdlUG9zaXRpb24sIGxlZnQ6IDAgfSk7XHJcbiAgICAvLyAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtcG9zaXRpb24nKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmb2N1c1RyYXAoKSB7XHJcblx0XHQvLyBjb25zdCBub2RlcyA9IHRoaXMubW9kYWxDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCh0aGlzLl9mb2N1c0VsZW1lbnRzKTsgLy8qINC00LvRjyDRhNC+0LrRg9GB0LAg0L3QsCDQv9C10YDQstC+0Lwg0Y3Qu9C10LzQtdC90YLQtSDQvtC60L3QsFxyXG5cdFx0aWYgKG1vZGFsLmNsYXNzTGlzdC5jb250YWlucyhcImlzLW9wZW5cIikpIHtcclxuICAgICAgICAgICAgbW9kYWwuZm9jdXMoKTtcclxuXHRcdFx0Ly8gaWYgKG5vZGVzLmxlbmd0aCkgbm9kZXNbMF0uZm9jdXMoKTsgLy8qINC00LvRjyDRhNC+0LrRg9GB0LAg0L3QsCDQv9C10YDQstC+0Lwg0Y3Qu9C10LzQtdC90YLQtSDQvtC60L3QsFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGFzdEZvY3VzLmZvY3VzKCk7XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZvY3VzQ2F0Y2goZSkge1xyXG5cdFx0Y29uc3QgZm9jdXNhYmxlID0gbW9kYWxDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNFbGVtZW50cyk7XHJcblx0XHRjb25zdCBmb2N1c0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9jdXNhYmxlKTtcclxuXHRcdGNvbnN0IGZvY3VzZWRJbmRleCA9IGZvY3VzQXJyYXkuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuXHJcblx0XHRpZiAoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcclxuXHRcdFx0Zm9jdXNBcnJheVtmb2N1c0FycmF5Lmxlbmd0aCAtIDFdLmZvY3VzKCk7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSBmb2N1c0FycmF5Lmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0Zm9jdXNBcnJheVswXS5mb2N1cygpO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsImNvbnN0IHF1aXpGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnF1aXotZm9ybScpO1xyXG5jb25zdCBxdWl6SW5wdXRzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuY29uc3QgcXVpekJsb2NrcyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5xdWl6LWJsb2NrJyk7XHJcblxyXG5sZXQgdGV4dGFyZWFUZXh0ID0gbnVsbDtcclxubGV0IHF1aXpSZXBseSAgPSB7fTtcclxubGV0IGJsb2NrSW5kZXggPSAwO1xyXG5cclxuLy8g0YTRg9C90LrRhtC40Y8g0L/QvtC60LDQt9CwINGC0L7Qu9GM0LrQviDQv9C10YDQstC+0LPQviDQsdC70L7QutCwINC60LLQuNC30LBcclxuc2hvd0Jsb2NrcyhibG9ja0luZGV4KTtcclxuXHJcbmZ1bmN0aW9uIHNob3dCbG9ja3MoKSB7XHJcblx0cXVpekJsb2Nrcy5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScpO1xyXG5cdHF1aXpCbG9ja3NbYmxvY2tJbmRleF0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbn1cclxuXHJcbi8vINC30LDQv9C40YHRjCDQvdCw0LfQstCw0L3QuNGPINGH0LXQutCx0L7QutGB0LAg0LIgdmFsdWUg0LjQvdC/0YPRgtCwINGH0LXQutCx0L7QutGB0LBcclxucXVpeklucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHRpZiAoaW5wdXQudHlwZSA9PSAnY2hlY2tib3gnIHx8IGlucHV0LnR5cGUgPT0gJ3JhZGlvJykge1xyXG5cdFx0aW5wdXQudmFsdWUgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQ7XHJcblx0fVxyXG59KTtcclxuXHJcbnF1aXpGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblx0bGV0IGJsb2NrID0gdGFyZ2V0LmNsb3Nlc3QoJy5xdWl6LWJsb2NrJyk7XHJcblx0bGV0IG5leHRCdG4gPSBxdWl6Rm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uZXh0XScpO1xyXG5cdG5leHRCdG4uZm9yRWFjaChidG4gPT4ge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBidG4pIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRhZGRUb1NlbmQoYmxvY2ssIHF1aXpSZXBseSk7XHJcblx0XHRcdG5leHRRdWVzdGlvbihibG9jayk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0aWYgKHRhcmdldCA9PSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zZW5kXScpKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRhZGRUb1NlbmQoYmxvY2ssIHF1aXpSZXBseSk7XHJcblx0XHRzZW5kKGJsb2NrKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbmV4dFF1ZXN0aW9uKGZvcm0pIHtcclxuXHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdGlmICh2YWxpZCA9PT0gMCAmJiB2YWxpZENoZWNrKGZvcm0pKSB7XHJcblx0XHRzaG93QmxvY2tzKGJsb2NrSW5kZXggKz0gMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZW5kKGZvcm0pIHtcclxuXHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdGlmICh2YWxpZCA9PT0gMCAmJiB2YWxpZENoZWNrKGZvcm0pKSB7XHJcblx0XHRmb3JtUmVtb3ZlRXJyb3IocXVpekZvcm0pO1xyXG5cclxuXHRcdC8vKiA9PT09PT09PSDQodC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGC0L/RgNCw0LLQutC1ID09PT09PT09PT09PVxyXG5cdFx0bGV0IG9rID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcucXVpei1zZW5kX19vaycpO1xyXG5cdFx0bGV0IHRleHRNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcucXVpei1tZXNzYWdlJyk7XHJcblx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JfQsNCz0YDRg9C30LrQsC4uLic7XHJcblx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vKj09PT09PT09PSBGb3JtRGF0YSA9PT09PT09PT09PT09PT1cclxuXHRcdGNvbnN0IHF1aXpGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG5cdFx0Zm9yIChsZXQga2V5IGluIHF1aXpSZXBseSkge1xyXG5cdFx0XHRxdWl6Rm9ybURhdGEuYXBwZW5kKGtleSwgcXVpelJlcGx5W2tleV0pO1xyXG5cdFx0fVxyXG5cdFx0Ly8gZm9ybURhdGEuYXBwZW5kKCdpbWFnZScsIGZvcm1JbWFnZS5maWxlc1swXSk7XHJcblx0XHQvLyog0J/RgNC+0LLQtdGA0LrQsCBGb3JtRGF0YVxyXG5cdFx0Ly8gZm9yKHZhciBwYWlyIG9mIHF1aXpGb3JtRGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdC8vIFx0Y29uc29sZS5sb2cocGFpclswXSsgJzogJysgcGFpclsxXSk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0Ly8qPT09PT09PT09INCe0YLQv9GA0LDQstC60LAg0LTQsNC90L3Ri9GFID09PT09PT09PT09PT09PVxyXG5cdFx0Y29uc3QgcXVpekRhdGEgPSBhc3luYyAodXJsLCBkYXRhKSA9PiB7XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXHJcblx0XHRcdFx0Ym9keTogZGF0YVxyXG5cdFx0XHR9KTtcdFxyXG5cdFx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHJcblx0XHRcdFx0Ly8gbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTsgLy8ganNvbigpIC0g0LTQu9GPINCy0YvQstC+0LTQsCDRgdC+0L7QsdGJ0LXQvdC40Y87XHJcblx0XHRcdFx0Ly8gYWxlcnQocmVzdWx0Lm1lc3NhZ2UpO1xyXG5cclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpOyAvLyB0ZXh0KCkgLSDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1LCDQv9C+0LTQutC70Y7Rh9C40YLRjCBzZXJ2ZXIucGhwKVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdCk7IC8vINGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1XHJcblxyXG5cdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAnT2shJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRjbGVhcklucHV0cyhxdWl6SW5wdXRzKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG9rLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH0sIDUwMDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFsZXJ0KFwi0J7RiNC40LHQutCwIEhUVFA6IFwiICsgcmVzcG9uc2Uuc3RhdHVzKTtcclxuXHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIDUwMDApO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0Ly8gcXVpekRhdGEoJy4uL3NlbmRtYWlsLnBocCcsIHF1aXpGb3JtRGF0YSk7XHJcblx0XHRxdWl6RGF0YSgnLi4vc2VydmVyLnBocCcsIHF1aXpGb3JtRGF0YSkgLy8hINGD0LHRgNCw0YLRjCAo0Y3RgtC+INC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LUpXHJcblxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG9TZW5kKGZvcm0sIG9iaikge1xyXG5cdGxldCB2YWx1ZVN0cmluZyA9ICcnO1xyXG5cdGxldCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IHRleHRhcmVhID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpO1xyXG5cdGlmIChpbnB1dHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IGZpZWxkID0gaW5wdXRzW2ldO1xyXG5cdFx0XHRpZiAoZmllbGQudHlwZSAhPSAnY2hlY2tib3gnICYmIGZpZWxkLnR5cGUgIT0gJ3JhZGlvJyAmJiBmaWVsZC52YWx1ZSkge1xyXG5cdFx0XHRcdG9ialtmaWVsZC5uYW1lXSA9IGZpZWxkLnZhbHVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gJ3JhZGlvJyAmJiBmaWVsZC5jaGVja2VkKSB7XHJcblx0XHRcdFx0b2JqW2ZpZWxkLm5hbWVdID0gZmllbGQudmFsdWU7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PSAnY2hlY2tib3gnICYmIGZpZWxkLmNoZWNrZWQpIHtcclxuXHRcdFx0XHR2YWx1ZVN0cmluZyArPSBmaWVsZC52YWx1ZSArICcsJztcdFx0XHJcblx0XHRcdFx0b2JqW2ZpZWxkLm5hbWVdID0gdmFsdWVTdHJpbmc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKHRleHRhcmVhLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dGFyZWEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IHRleHQgPSB0ZXh0YXJlYVtpXTtcclxuXHRcdFx0aWYgKHRleHQudmFsdWUpIHtcclxuXHRcdFx0XHRvYmpbdGV4dC5uYW1lXSA9IHRleHQudmFsdWU7XHRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSIsImNvbnN0IHJhbmdlU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmdlLXNsaWRlcicpO1xuXG5pZiAocmFuZ2VTbGlkZXIpIHtcblx0bm9VaVNsaWRlci5jcmVhdGUocmFuZ2VTbGlkZXIsIHtcbiAgICBzdGFydDogWzUwMCwgOTk5OTk5XSxcblx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdHN0ZXA6IDEsXG4gICAgcmFuZ2U6IHtcblx0XHRcdCdtaW4nOiBbNTAwXSxcblx0XHRcdCdtYXgnOiBbOTk5OTk5XVxuICAgIH1cblx0fSk7XG5cblx0Y29uc3QgaW5wdXQwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LTAnKTtcblx0Y29uc3QgaW5wdXQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LTEnKTtcblx0Y29uc3QgaW5wdXRzID0gW2lucHV0MCwgaW5wdXQxXTtcblxuXHRyYW5nZVNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSl7XG5cdFx0aW5wdXRzW2hhbmRsZV0udmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlc1toYW5kbGVdKTtcblx0fSk7XG5cblx0Y29uc3Qgc2V0UmFuZ2VTbGlkZXIgPSAoaSwgdmFsdWUpID0+IHtcblx0XHRsZXQgYXJyID0gW251bGwsIG51bGxdO1xuXHRcdGFycltpXSA9IHZhbHVlO1xuXG5cdFx0Y29uc29sZS5sb2coYXJyKTtcblxuXHRcdHJhbmdlU2xpZGVyLm5vVWlTbGlkZXIuc2V0KGFycik7XG5cdH07XG5cblx0aW5wdXRzLmZvckVhY2goKGVsLCBpbmRleCkgPT4ge1xuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhpbmRleCk7XG5cdFx0XHRzZXRSYW5nZVNsaWRlcihpbmRleCwgZS5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcblx0XHR9KTtcblx0fSk7XG59IiwibGV0IHRkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhdGFsb2ctc2l6ZXMgdGQnKTtcclxuXHJcbnRkLmZvckVhY2goaXRlbSA9PiB7XHJcblx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRsZXQgc2VsZiA9IGUuY3VycmVudFRhcmdldDtcclxuXHRcdGl0ZW0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNkYmJiYTknO1xyXG5cdFx0dGQuZm9yRWFjaChidG4gPT4ge1xyXG5cdFx0XHRpZiAoYnRuICE9PSBzZWxmKSB7XHJcblx0XHRcdFx0YnRuLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59KTsiLCIvLyBjb25zdCBtaW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1pbicsIHtcclxuLy8gXHRncmFiQ3Vyc29yOiB0cnVlLFxyXG4vLyBcdHNsaWRlc1BlclZpZXc6IDYsXHJcbi8vIFx0aW5pdGlhbFNsaWRlOiAwLFxyXG4vLyBcdC8vIHNwYWNlQmV0d2VlbjogMjAsXHJcbi8vIFx0ZnJlZU1vZGU6IHRydWUsXHJcbi8vIH0pO1xyXG5cclxuLy8gY29uc3QgbWFpblNsaWRlciA9IG5ldyBTd2lwZXIoJy5zbGlkZXItbWFpbicsIHtcclxuLy8gXHRncmFiQ3Vyc29yOiB0cnVlLFxyXG4vLyBcdHNwYWNlQmV0d2VlbjogMjAsXHJcbi8vIFx0c2xpZGVzUGVyVmlldzogMSxcclxuLy8gXHRpbml0aWFsU2xpZGU6IDAsXHJcbi8vIFx0c2ltdWxhdGVUb3VjaDogZmFsc2UsXHJcbi8vIFx0ZWZmZWN0OiAnZmFkZScsXHJcbi8vIFx0ZmFkZUVmZmVjdDoge1xyXG4vLyBcdCAgY3Jvc3NGYWRlOiB0cnVlXHJcbi8vIFx0fSxcclxuLy8gXHR0aHVtYnM6IHtcclxuLy8gXHRcdHN3aXBlcjogbWluU2xpZGVyLFxyXG4vLyBcdH1cclxuLy8gfSk7IiwiLy8qINCS0LDQu9C40LTQsNGG0LjRjyDRhNC+0YDQvNGLICjQtdGB0LvQuCDRh9C10LrQsdC+0LrRgdGLINC4INC40L3Qv9GD0YLRiyDQsiDQvtC00L3QvtC5INGE0L7RgNC80LUpXHJcbmZ1bmN0aW9uIHZhbGlkQ2hlY2soZm9ybSkge1xyXG5cdGxldCBlbGVtZW50cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRsZXQgaXNWYWxpZCA9IGZhbHNlO1xyXG5cdGlmIChlbGVtZW50cy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZWxlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGxldCBpbnB1dCA9IGVsZW1lbnRzW2luZGV4XTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwiY2hlY2tib3hcIiB8fCBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcInJhZGlvXCIpIHtcclxuXHRcdFx0XHRcdGlmIChpbnB1dC5jaGVja2VkKSB7XHJcblx0XHRcdFx0XHRcdGlzVmFsaWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtpc1ZhbGlkID0gdHJ1ZTt9XHJcblx0XHR9XHJcblx0fSBlbHNlIHtpc1ZhbGlkID0gdHJ1ZTt9XHJcblxyXG5cdHJldHVybiBpc1ZhbGlkO1xyXG59XHJcbmZ1bmN0aW9uIHZhbGlkSW5wdXQoZm9ybSkge1xyXG5cdGxldCBlbGVtZW50cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRsZXQgZXJyb3IgPSAwO1xyXG5cdGlmIChlbGVtZW50cy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZWxlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGxldCBpbnB1dCA9IGVsZW1lbnRzW2luZGV4XTtcclxuXHRcdFx0bGV0IHBsYWNlaG9sZGVyID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xyXG5cdFx0XHRpZiAoIWlucHV0LmNsYXNzTGlzdC5jb250YWlucygnbm90LXZhbGlkJykpIHtcclxuXHRcdFx0XHRpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbWFpbCcpKSB7XHJcblx0XHRcdFx0XHRpZiAoZW1haWxUZXN0KGlucHV0KSB8fCBpbnB1dC52YWx1ZSA9PSBwbGFjZWhvbGRlcikge1xyXG5cdFx0XHRcdFx0XHRmb3JtQWRkRXJyb3IoaW5wdXQpO1xyXG5cdFx0XHRcdFx0XHRlcnJvcisrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoaW5wdXQudmFsdWUgPT0gJycgfHwgaW5wdXQudmFsdWUgPT0gcGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0Ly8h0LLQutC70Y7Rh9C40YLRjCwg0LXRgdC70Lgg0L3QsNC00L4g0LLQsNC70LjQtNC40YDQvtCy0LDRgtGMIHRleHRhcmU6XHJcblx0Ly8gbGV0IHRleHRhcmVhID0gZm9ybS5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xyXG5cdC8vIGlmICh0ZXh0YXJlYSkge1xyXG5cdC8vIFx0aWYgKHRleHRhcmVhLnZhbHVlID09ICcnKSB7XHJcblx0Ly8gXHRcdGZvcm1BZGRFcnJvcih0ZXh0YXJlYSk7XHJcblx0Ly8gXHRcdGVycm9yKys7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSBcclxuXHJcblx0cmV0dXJuIGVycm9yO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtQWRkRXJyb3IoaXRlbSkge1xyXG5cdGl0ZW0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG5cdGl0ZW0uY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuXHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwsINC10YHQu9C4INCyIGh0bWwg0LTQvtCx0LDQstC70LXQvdGLINCx0LvQvtC60Lgg0YEg0YHQvtC+0LHRidC10L3QuNC10Lwg0L7QsSDQvtGI0LjQsdC60LUgKC5mb3JtLWVycm9yKVxyXG5cdC8vKiDQtdGB0LvQuCDRgNCw0LfQvdGL0Lkg0YLQtdC60YHRgiDQvtGI0LjQsdC60Lgg0LTQu9GPINC60LDQttC00L7Qs9C+IGlucHV0XHJcblx0Ly8gbGV0IGltcHV0RXJyb3IgPSBpdGVtLm5leHRFbGVtZW50U2libGluZztcclxuXHQvLyBpZiAoaW1wdXRFcnJvcikge1xyXG5cdC8vIFx0aWYgKGltcHV0RXJyb3IuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbXB1dC1tZXNzYWdlJykpIHtcclxuXHQvLyBcdFx0aW1wdXRFcnJvci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblx0Ly8qINC10YHQu9C4INC+0YjQuNCx0LrQsCDQtNC70Y8g0LLRgdC10Lkg0YTQvtGA0LzRiyAo0LjQu9C4INCx0LvQvtC60LAg0LrQstC40LfQsCk6XHJcblxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMINC10YHQu9C4INC90LAg0YHQsNC50YLQtSDQtdGB0YLRjCDQutCy0LjQt1xyXG5cdGlmIChpdGVtLmNsb3Nlc3QoJy5xdWl6LWZvcm0nKSkge1xyXG5cdFx0bGV0IHF1aXpFcnJvciA9IGl0ZW0uY2xvc2VzdCgnLnF1aXotYmxvY2snKS5xdWVyeVNlbGVjdG9yKCcucXVpei1tZXNzYWdlJyk7XHJcblx0XHRpZiAocXVpekVycm9yKSB7XHJcblx0XHRcdHF1aXpFcnJvci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0bGV0IGZvcm1FcnJvciA9IGl0ZW0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybS1tZXNzYWdlJyk7XHJcblx0XHRpZiAoZm9ybUVycm9yKSB7XHJcblx0XHRcdGZvcm1FcnJvci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMINC10YHQu9C4INC90LAg0YHQsNC50YLQtSDQvdC10YIg0LrQstC40LfQsCAo0YLQvtC70YzQutC+INGE0L7RgNC80YspXHJcblx0Ly8gbGV0IGZvcm1FcnJvciA9IGl0ZW0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybS1lcnJvcicpO1xyXG5cdC8vIGlmIChmb3JtRXJyb3IpIHtcclxuXHQvLyBcdGZvcm1FcnJvci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHQvLyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1SZW1vdmVFcnJvcihmb3JtKSB7XHJcblx0bGV0IGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIHRleHRhcmVhJyk7XHJcblx0aWYgKGlucHV0cy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgaW5wdXRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBpbnB1dHNbaW5kZXhdO1xyXG5cdFx0XHRpZiAoIWlucHV0LmNsYXNzTGlzdC5jb250YWlucygnbm90LXZhbGlkJykpIHtcclxuXHRcdFx0XHRpbnB1dC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XHJcblx0XHRcdFx0aW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCwg0LXRgdC70Lgg0LIgaHRtbCDQtNC+0LHQsNCy0LvQtdC90Ysg0LHQu9C+0LrQuCDRgSDRgdC+0L7QsdGJ0LXQvdC40LXQvCDQvtCxINC+0YjQuNCx0LrQtSAoLmZvcm0tZXJyb3IpXHJcblx0bGV0IGZvcm1FcnJvciA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmZvcm0tbWVzc2FnZScpO1xyXG5cdGlmIChmb3JtRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGZvcm1FcnJvci5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0Y29uc3QgZXJyb3IgPSBmb3JtRXJyb3JbaW5kZXhdO1xyXG5cdFx0XHRlcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVtYWlsVGVzdChzZWxlY3Rvcikge1xyXG5cdHJldHVybiAhL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDh9KSskLy50ZXN0KHNlbGVjdG9yLnZhbHVlKTtcclxufVxyXG5cclxuY29uc3QgdGV4dElucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jaGVjaycpOyAgIFxyXG50ZXh0SW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdC8vINC10YHQu9C4INC30L3QsNGH0LXQvdC40LUg0LrQu9Cw0LLQuNGI0LgoZS5rZXkpINC90LUg0YHQvtC+0YLQstC10YLRgdGC0LLRg9C10YIobWF0Y2gpINC60LjRgNC40LvQu9C40YbQtSwg0L/QvtC70LUg0L3QtSDQt9Cw0L/QvtC70L3Rj9C10YLRgdGPXHJcblx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRpZiAoZS5rZXkubWF0Y2goL1te0LAt0Y/RkSAwLTldL2lnKSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Ly8g0LXRgdC70Lgg0L/RgNC4INCw0LLRgtC+0LfQsNC/0L7Qu9C90LXQvdC40Lgg0LLRi9Cx0YDQsNC90L4g0YHQu9C+0LLQviDQvdC1INC60LjRgNC40LvQu9C40YbQtdC5LCDRgdGC0YDQvtC60LAg0L7Rh9C40YHRgtC40YLRgdGPXHJcblx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudmFsdWU9dGhpcy52YWx1ZS5yZXBsYWNlKC9bXlxc0LAt0Y/RkSAwLTldL2lnLFwiXCIpO1xyXG5cdH0pO1xyXG59KTsiXX0=
