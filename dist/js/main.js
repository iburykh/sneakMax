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

	//* работа корзины

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
}
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
	if (!e.target.classList.contains('mini-cart') && !e.target.closest('.mini-cart') && !e.target.classList.contains('cart') && !e.target.classList.contains('mini-cart__delete')) {
		miniCart.classList.remove('mini-cart--open');
	}
});

// miniCartItem.forEach(item => {
// 	item.addEventListener('click', (e) => {
		
// 		miniCartItem.forEach(btn => {
// 			if (!btn.contains(e.target)) {
// 				btn.classList.remove('mini-cart__item--active');
// 			}
// 		});

// 		item.classList.add('mini-cart__item--active');
// 	});
// });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJhY2NvcmRpb24uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImNyZWF0ZS1jYXJkcy5qcyIsImZvcm0uanMiLCJsYXp5LmpzIiwibWFwLmpzIiwibWFzay10ZWwuanMiLCJtaW5pLWNhcnQuanMiLCJtb2RhbC5qcyIsInF1aXouanMiLCJyYW5nZS1zbGlkZXIuanMiLCJzaXplcy5qcyIsInNsaWRlci5qcyIsInZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gZm9yRWFjaCBQb2x5ZmlsbFxyXG5pZiAod2luZG93Lk5vZGVMaXN0ICYmICFOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCkge1xyXG4gICAgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcclxufVxyXG5cclxuLy8gbG9jayBzY3JvbGxcclxuZnVuY3Rpb24gZGlzYWJsZVNjcm9sbCgpIHtcclxuXHRsZXQgcGFnZVBvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XHJcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtbG9jaycpO1xyXG5cdGRvY3VtZW50LmJvZHkuZGF0YXNldC5wb3NpdGlvbiA9IHBhZ2VQb3NpdGlvbjtcclxuXHRkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IC1wYWdlUG9zaXRpb24gKyAncHgnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbmFibGVTY3JvbGwoKSB7XHJcblx0bGV0IHBhZ2VQb3NpdGlvbiA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuZGF0YXNldC5wb3NpdGlvbiwgMTApO1xyXG5cdGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gJyc7XHJcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtbG9jaycpO1xyXG5cdHdpbmRvdy5zY3JvbGwoeyB0b3A6IHBhZ2VQb3NpdGlvbiwgbGVmdDogMCB9KTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wb3NpdGlvbicpO1xyXG59XHJcblxyXG5cclxuY29uc3QgY2xlYXJJbnB1dHMgPSAoc2VsZWN0b3IpID0+IHtcclxuXHRzZWxlY3Rvci5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0aXRlbS52YWx1ZSA9ICcnO1xyXG5cdH0pO1xyXG5cdGxldCBjaGVja2JveGVzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmN1c3RvbS1jaGVja2JveF9faW5wdXQnKTtcclxuXHRpZiAoY2hlY2tib3hlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY2hlY2tib3hlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0Y29uc3QgY2hlY2tib3ggPSBjaGVja2JveGVzW2luZGV4XTtcclxuXHRcdFx0Y2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8vIHdpbmRvdy5ub1plbnNtb290aCA9IHRydWU7IiwiY29uc3QgYWNjb3JkaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24nKTtcblxuYWNjb3JkaW9ucy5mb3JFYWNoKGVsID0+IHtcblx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdGNvbnN0IHNlbGYgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0Y29uc3QgY29udHJvbCA9IHNlbGYucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udHJvbCcpO1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRlbnQnKTtcblxuXHRcdC8vKiDQtdGB0LvQuCDQvdC10L7QsdGF0L7QtNC40LzQviDRh9GC0L7QsdGLINCy0YHQtSDQsdC70L7QutC4INC30LDQutGA0YvQstCw0LvQuNGB0Ywg0L/RgNC4INC+0YLQutGA0YvRgtC40Lgg0LHQu9C+0LrQsCAtINC/0YDQvtGB0YLQviDRgNCw0YHQutC+0LzQtdC90YLQuNGA0L7QstCw0YLRjCDRjdGC0YMg0YfQsNGB0YLRjCFcblx0XHQvLyBhY2NvcmRpb25zLmZvckVhY2goYnRuID0+IHtcblx0XHQvLyBcdGNvbnN0IGNvbnRyb2wgPSBidG4ucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udHJvbCcpO1xuXHRcdC8vIFx0Y29uc3QgY29udGVudCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50Jyk7XG5cdFx0Ly8gXHRpZiAoYnRuICE9PSBzZWxmKSB7XG5cdFx0Ly8gXHRcdGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG5cdFx0Ly8gXHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXHRcdC8vIFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHQvLyBcdFx0Y29udGVudC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH0pO1xuXG5cdFx0c2VsZi5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG5cblx0XHQvLyDQtdGB0LvQuCDQvtGC0LrRgNGL0YIg0LDQutC60L7RgNC00LXQvtC9XG5cdFx0aWYgKHNlbGYuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVuJykpIHtcblx0XHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnN0eWxlLm1heEhlaWdodCA9IGNvbnRlbnQuc2Nyb2xsSGVpZ2h0ICsgJ3B4Jztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udHJvbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHRcdGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcblx0XHR9XG5cdH0pO1xufSk7IiwibGV0IG1lbnVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcclxubGV0IG1lbnVJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVfX2xpbmsnKTtcclxubGV0IGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKTtcclxuXHJcbmhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBtZW51Qm9keS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuXHJcbiAgICBpZiAoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C30LDQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgICAgIGRpc2FibGVTY3JvbGwoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGFtYnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQvtGC0LrRgNGL0YLRjCDQvdCw0LLQuNCz0LDRhtC40Y4nKTtcclxuICAgICAgICBlbmFibGVTY3JvbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBtZW51Qm9keS5mb2N1cygpO1xyXG4gICAgfSwgNjAwKTtcclxufSk7XHJcblxyXG5tZW51SXRlbS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChoYW1idXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIG1lbnVCb2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgICAgICAgICBlbmFibGVTY3JvbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxubGV0IGZpbHRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXJzJyk7XHJcbmxldCBmaWx0ZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fYnRuJyk7XHJcbmxldCBmaWx0ZXJCdXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZy1oYW1idXJnZXInKTtcclxuXHJcbmZpbHRlckJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBmaWx0ZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBpZiAoZmlsdGVyQnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C30LDQutGA0YvRgtGMINGE0LjQu9GM0YLRgCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINGE0LjQu9GM0YLRgCcpO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgZmlsdGVyLmZvY3VzKCk7XHJcbiAgICB9LCA2MDApO1xyXG59KTtcclxuXHJcbmZpbHRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoZmlsdGVyQnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgZmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7IFxyXG4gICAgfVxyXG59KVxyXG4iLCJjb25zdCBjaGVja0JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRhbG9nLWNoZWNrYm94X19sYWJlbCwgLmN1c3RvbS1jaGVja2JveF9fdGV4dCcpO1xyXG5cclxuY2hlY2tCb3guZm9yRWFjaChpdGVtID0+IHtcclxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG5cdFx0aWYgKGUuY29kZSA9PT0gJ0VudGVyJyB8fCBlLmNvZGUgPT09ICdOdW1wYWRFbnRlcicgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XHJcblx0XHRcdGxldCBjaGVjayA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblx0XHRcdGlmIChjaGVjay50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdFx0XHRpZiAoY2hlY2suY2hlY2tlZCA9PT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH0gXHJcblx0XHRcdH0gZWxzZSBpZiAoY2hlY2sudHlwZSA9PSAnY2hlY2tib3gnKSB7XHJcblx0XHRcdFx0aWYgKGNoZWNrLmNoZWNrZWQgPT09IGZhbHNlKSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHR9KTtcclxufSk7IiwiY29uc3QgY2F0YWxvZ1Byb2R1Y3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX3dyYXAnKTtcclxuY29uc3QgY2F0YWxvZ01vcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fbW9yZScpO1xyXG5jb25zdCBwcm9kTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtcHJvZF9fY29udGVudCcpO1xyXG5jb25zdCBwcm9kTW9kYWxTbGlkZXIgPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLnNsaWRlci1tYWluX193cmFwcGVyJyk7XHJcbmNvbnN0IHByb2RNb2RhbFByZXZpZXcgPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLnNsaWRlci1taW5fX3dyYXBwZXInKTtcclxuY29uc3QgcHJvZE1vZGFsSW5mbyA9IHByb2RNb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtaW5mb19fd3JhcHBlcicpO1xyXG5jb25zdCBwcm9kTW9kYWxEZXNjciA9IHByb2RNb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtZGVzY3JfX3RleHQnKTtcclxuY29uc3QgcHJvZE1vZGFsQ2hhcnMgPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWNoYXJfX2l0ZW1zJyk7XHJcbmNvbnN0IHByb2RNb2RhbFZpZGVvID0gcHJvZE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC12aWRlbycpO1xyXG5sZXQgcHJvZFF1YW50aXR5ID0gNjsgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LrQsNGA0YLQvtGH0LXQuiDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0LjQt9C90LDRh9Cw0LvRjNC90L5cclxubGV0IGFkZFF1YW50aXR5ID0gMzsgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvtCx0LDQstC70Y/QtdC80YvRhSDQutCw0YDRgtC+0YfQtdC6INC/0YDQuCDQutC70LjQutC1INC90LAg0LrQvdC+0L/QutGDIFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0ZFcIlxyXG5sZXQgZGF0YUxlbmd0aCA9IG51bGw7XHJcblxyXG4vLyDRhNGD0L3QutGG0LjRjyDQstGB0YLQsNCy0LvRj9C10YIg0L/RgNC+0LHQtdC7INC80LXQttC00YMg0YDQsNC30YDRj9C00LDQvNC4XHJcbmNvbnN0IG5vcm1hbFByaWNlID0gKHN0cikgPT4ge1xyXG5cdHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcclxufTtcclxuXHJcbi8vINC10YHQu9C4INC10YHRgtGMINGB0LvQsNC50LTQtdGAINCyINC80L7QtNCw0LvRjNC90L7QvCDQvtC60L3QtSAtINC40L3QuNGG0LjQuNGA0L7QstCw0YLRjCDRgdC70LDQudC00LXRgNGLINCyINGE0YPQvdC60YbQuNC4IG1vZGFsU2xpZGVyINC4INC+0LHRitGP0LLQu9GP0YLRjCDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0L7QutC90LBcclxuLy8g0YTRg9C90LrRhtC40Y8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0YHQu9Cw0LnQtNC10YDQsFxyXG5jb25zdCBtb2RhbFNsaWRlciA9ICgpID0+IHtcclxuXHRjb25zdCBtaW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1pbicsIHtcclxuXHRcdGdyYWJDdXJzb3I6IHRydWUsXHJcblx0XHRzbGlkZXNQZXJWaWV3OiA2LFxyXG5cdFx0aW5pdGlhbFNsaWRlOiAwLFxyXG5cdFx0c3BhY2VCZXR3ZWVuOiAyMCxcclxuXHRcdGZyZWVNb2RlOiB0cnVlLFxyXG5cdH0pO1xyXG5cdFxyXG5cdGNvbnN0IG1haW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1haW4nLCB7XHJcblx0XHRncmFiQ3Vyc29yOiB0cnVlLFxyXG5cdFx0c3BhY2VCZXR3ZWVuOiAyMCxcclxuXHRcdHNsaWRlc1BlclZpZXc6IDEsXHJcblx0XHRpbml0aWFsU2xpZGU6IDAsXHJcblx0XHRzaW11bGF0ZVRvdWNoOiBmYWxzZSxcclxuXHRcdGVmZmVjdDogJ2ZhZGUnLFxyXG5cdFx0ZmFkZUVmZmVjdDoge1xyXG5cdFx0ICBjcm9zc0ZhZGU6IHRydWVcclxuXHRcdH0sXHJcblx0XHR0aHVtYnM6IHtcclxuXHRcdFx0c3dpcGVyOiBtaW5TbGlkZXIsXHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG5pZiAoY2F0YWxvZ1Byb2R1Y3RzKSB7XHJcblx0Ly8qINGE0YPQvdC60YbQuNGPINGB0L7Qt9C00LDQvdC40Y8g0LrQsNGA0YLQvtGH0LXQuiDQsiDQutCw0YLQsNC70L7Qs9C1INGC0L7QstCw0YDQvtCyXHJcblx0Y29uc3QgbG9hZFByb2R1Y3RzID0gYXN5bmMgKHF1YW50aXR5ID0gNSkgPT4ge1xyXG5cdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy4uL2RhdGEvZGF0YS5qc29uJyk7XHJcblx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHRcdFx0bGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG5cdFx0XHRkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcclxuXHRcdFx0Y2F0YWxvZ1Byb2R1Y3RzLmlubmVySFRNTCA9ICcnO1xyXG5cclxuXHRcdFx0Ly8g0YTQvtGA0LzQuNGA0YPQtdC8INGB0LXRgtC60YMg0LjQtyA2INC60LDRgNGC0L7Rh9C10Log0YLQvtCy0LDRgNC+0LIg0L3QsCDRgdGC0YDQsNC90LjRhtC1ICg2IC0g0Y3RgtC+INGH0LjRgdC70L4gcHJvZFF1YW50aXR5KVxyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChpIDwgcHJvZFF1YW50aXR5KSB7XHJcblx0XHRcdFx0bGV0IGl0ZW0gPSBkYXRhW2ldO1xyXG5cdFxyXG5cdFx0XHRcdFx0Y2F0YWxvZ1Byb2R1Y3RzLmlubmVySFRNTCArPSBgXHJcblx0XHRcdFx0XHRcdDxhcnRpY2xlIGNsYXNzPVwiY2F0YWxvZy1pdGVtXCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9faW1nXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7aXRlbS5tYWluSW1hZ2V9XCIgbG9hZGluZz1cImxhenlcIiBhbHQ9XCIke2l0ZW0udGl0bGV9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0YWxvZy1pdGVtX19idG5zXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgbW9kYWwtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0J/QvtC60LDQt9Cw0YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRgtC+0LLQsNGA0LVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3ZnPjx1c2UgeGxpbms6aHJlZj1cImltZy9zcHJpdGUuc3ZnI3Nob3dcIj48L3VzZT48L3N2Zz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgYWRkLXRvLWNhcnQtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0JTQvtCx0LDQstC40YLRjCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdGDXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHN2Zz48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ByaXRlLnN2ZyNjYXJ0XCI+PC91c2U+PC9zdmc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwiY2F0YWxvZy1pdGVtX190aXRsZVwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2F0YWxvZy1pdGVtX19wcmljZVwiPiR7bm9ybWFsUHJpY2UoaXRlbS5wcmljZSl9INGAPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2FydGljbGU+XHJcblx0XHRcdFx0XHRgO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyDRhNGD0L3QutGG0LjRjyDRgNCw0LHQvtGC0Ysg0LrQvtGA0LfQuNC90YtcclxuXHRcdFx0Y2FydExvZ2ljKCk7XHJcblx0XHRcdC8vINGE0YPQvdC60YbQuNGPINC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwXHJcblx0XHRcdGJpbmRNb2RhbCgnLm1vZGFsLWJ0bicsICcubW9kYWwtcHJvZCcsIGxvYWRNb2RhbERhdGEpO1xyXG5cdFx0XHQvL1RPRE8gLSDQtNC+0LHQsNCy0LjRgtGMINCw0YDQs9GD0LzQtdC90YIgZnVuYyDQsiDRhNGD0L3QutGG0LjRjiBiaW5kTW9kYWwoYnRuU2VsZWN0b3IsIG1vZGFsU2VsZWN0b3IsIGZ1bmMsIGFuaW1hdGU9J2ZhZGUnLCBzcGVlZD0zMDAsKVxyXG5cdFx0XHQvL1RPRE8gLSDQstGB0YLQsNCy0LjRgtGMINGN0YLQvtGCINC60L7QtCDQsiDRhNGD0L3QutGG0LjRjiBiaW5kTW9kYWwgKNC80L7QtNCw0LvRjNC90L7QtSDQvtC60L3Qvikg0LIg0LzQvtC80LXQvdGCINC+0YLQutGA0YvRgtC40Y8g0L7QutC90LAg0L/QvtGB0LvQtSDQv9C+0LvRg9GH0LXQvdC40Y8gbGFzdEZvY3VzXHJcblx0XHRcdC8vINC/0L7Qu9GD0YfQtdC90LjQtSBpZCDQutC90L7Qv9C60LhcclxuXHRcdFx0Ly8gaWYgKG1vZGFsQ29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXByb2QnKSkge1xyXG5cdFx0XHQvLyBcdGxldCBvcGVuQnRuSWQgPSBsYXN0Rm9jdXMuZGF0YXNldC5pZDtcclxuXHRcdFx0Ly8gXHRmdW5jKG9wZW5CdG5JZCk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vINC/0L4g0LrQu9C40LrRgyDQvdCwINC60L3QvtC/0LrRgyBcItCf0L7QutCw0LfQsNGC0Ywg0LXRidGRXCIg0LTQvtCx0LDQstC70Y/QtdC8INC/0L4gMyDQutCw0YDRgtC+0YfQutC4INGC0L7QstCw0YDQsCAoMyAtINGN0YLQviDRh9C40YHQu9C+IGFkZFF1YW50aXR5KSBcclxuXHRcdFx0Y2F0YWxvZ01vcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0XHRcdGxldCBhID0gcHJvZFF1YW50aXR5O1xyXG5cdFx0XHRcdHByb2RRdWFudGl0eSA9IHByb2RRdWFudGl0eSArIGFkZFF1YW50aXR5O1xyXG5cdFx0XHRcdGZvciAobGV0IGkgPSBhOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoaSA8IHByb2RRdWFudGl0eSkge1xyXG5cdFx0XHRcdFx0bGV0IGl0ZW0gPSBkYXRhW2ldO1xyXG5cdFx0XHRcdFx0XHRjYXRhbG9nUHJvZHVjdHMuaW5uZXJIVE1MICs9IGBcclxuXHRcdFx0XHRcdFx0XHQ8YXJ0aWNsZSBjbGFzcz1cImNhdGFsb2ctaXRlbVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9faW1nXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiJHtpdGVtLm1haW5JbWFnZX1cIiBsb2FkaW5nPVwibGF6eVwiIGFsdD1cIiR7aXRlbS50aXRsZX1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuc1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgbW9kYWwtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0J/QvtC60LDQt9Cw0YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRgtC+0LLQsNGA0LVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxzdmc+PHVzZSB4bGluazpocmVmPVwiaW1nL3Nwcml0ZS5zdmcjc2hvd1wiPjwvdXNlPjwvc3ZnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgYWRkLXRvLWNhcnQtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0JTQvtCx0LDQstC40YLRjCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdGDXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3ZnPjx1c2UgeGxpbms6aHJlZj1cImltZy9zcHJpdGUuc3ZnI2NhcnRcIj48L3VzZT48L3N2Zz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDxoMyBjbGFzcz1cImNhdGFsb2ctaXRlbV9fdGl0bGVcIj4ke2l0ZW0udGl0bGV9PC9oMz5cclxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2F0YWxvZy1pdGVtX19wcmljZVwiPiR7bm9ybWFsUHJpY2UoaXRlbS5wcmljZSl9INGAPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdDwvYXJ0aWNsZT5cclxuXHRcdFx0XHRcdFx0YDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHByb2RRdWFudGl0eSA+PSBkYXRhTGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYXRhbG9nTW9yZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjYXRhbG9nTW9yZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8g0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC90L7QstGL0YUg0YLQvtCy0LDRgNC+0LIg0L/QtdGA0LXQt9Cw0L/Rg9GB0LrQsNGO0YLRgdGPINGE0YPQvdC60YbQuNC4INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINC4INC60L7RgNC30LjQvdGLXHJcblx0XHRcdFx0Y2FydExvZ2ljKCk7XHJcblx0XHRcdFx0YmluZE1vZGFsKCcubW9kYWwtYnRuJywgJy5tb2RhbC1wcm9kJywgbG9hZE1vZGFsRGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCgnZXJyb3InLCByZXNwb25zZS5zdGF0dXMpKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRsb2FkUHJvZHVjdHMoKTtcclxuXHJcblx0Ly8qINGE0YPQvdC60YbQuNGPINGB0L7Qt9C00LDQvdC40Y8g0L7QutC90LAg0YLQvtCy0LDRgNCwXHJcblx0Y29uc3QgbG9hZE1vZGFsRGF0YSA9IGFzeW5jIChpZCA9IDEpID0+IHtcclxuXHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcuLi9kYXRhL2RhdGEuanNvbicpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblx0XHRcdGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cdFx0XHQvLyDQvtGH0LjRidCw0LXQvCDQsdC70L7QutC4XHJcblx0XHRcdHByb2RNb2RhbFNsaWRlci5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsUHJldmlldy5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsSW5mby5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsRGVzY3IudGV4dENvbnRlbnQgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsQ2hhcnMuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdHByb2RNb2RhbFZpZGVvLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxWaWRlby5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgZGF0YUl0ZW0gb2YgZGF0YSkge1xyXG5cdFx0XHRcdGlmIChkYXRhSXRlbS5pZCA9PSBpZCkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyDQodC70LDQudC00LXRgCDRgSDRhNC+0YLQviDRgtC+0LLQsNGA0LBcclxuXHRcdFx0XHRcdGNvbnN0IHByZXZpZXcgPSBkYXRhSXRlbS5nYWxsZXJ5Lm1hcCgoaW1hZ2UpID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGBcclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2xpZGVyLW1pbl9faXRlbSBzd2lwZXItc2xpZGVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiJHtpbWFnZX1cIiBhbHQ9XCLQuNC30L7QsdGA0LDQttC10L3QuNC1XCI+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGNvbnN0IHNsaWRlcyA9IGRhdGFJdGVtLmdhbGxlcnkubWFwKChpbWFnZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYFxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzbGlkZXItbWFpbl9faXRlbSBzd2lwZXItc2xpZGVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiJHtpbWFnZX1cIiBhbHQ9XCLQuNC30L7QsdGA0LDQttC10L3QuNC1XCI+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRwcm9kTW9kYWxQcmV2aWV3LmlubmVySFRNTCA9IHByZXZpZXcuam9pbignJyk7XHJcblx0XHRcdFx0XHRwcm9kTW9kYWxTbGlkZXIuaW5uZXJIVE1MID0gc2xpZGVzLmpvaW4oJycpO1xyXG5cclxuXHRcdFx0XHRcdC8vINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INGC0L7QstCw0YDQtVxyXG5cdFx0XHRcdFx0Y29uc3Qgc2l6ZXMgPSBkYXRhSXRlbS5zaXplcy5tYXAoKHNpemUpID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGBcclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3M9XCJtb2RhbC1pbmZvX19pdGVtLXNpemVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJidG4tcmVzZXQgbW9kYWwtaW5mb19fc2l6ZVwiPiR7c2l6ZX08L2J1dHRvbj5cclxuXHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHRgO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0cHJvZE1vZGFsSW5mby5pbm5lckhUTUwgPSBgXHJcblx0XHRcdFx0XHRcdDxoMyBjbGFzcz1cIm1vZGFsLWluZm9fX3RpdGxlXCI+JHtkYXRhSXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtaW5mb19fcmF0ZVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaW1nL3N0YXIuc3ZnXCIgYWx0PVwi0KDQtdC50YLQuNC90LMgNSDQuNC3IDVcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cImltZy9zdGFyLnN2Z1wiIGFsdD1cIlwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaW1nL3N0YXIuc3ZnXCIgYWx0PVwiXCI+XHJcblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJpbWcvc3Rhci5zdmdcIiBhbHQ9XCJcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cImltZy9zdGFyLnN2Z1wiIGFsdD1cIlwiPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWluZm9fX3NpemVzXCI+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJtb2RhbC1pbmZvX19zdWJ0aXRsZVwiPtCS0YvQsdC10YDQuNGC0LUg0YDQsNC30LzQtdGAPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cIm1vZGFsLWluZm9fX3NpemVzLWxpc3QgbGlzdC1yZXNldFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0JHtzaXplcy5qb2luKCcnKX1cclxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWluZm9fX3ByaWNlXCI+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJtb2RhbC1pbmZvX19jdXJyZW50LXByaWNlXCI+JHtkYXRhSXRlbS5wcmljZX0g0YA8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJtb2RhbC1pbmZvX19vbGQtcHJpY2VcIj4ke2RhdGFJdGVtLm9sZFByaWNlID8gZGF0YUl0ZW0ub2xkUHJpY2UgKyAnINGAJyA6ICcnfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQgIGA7XHJcblxyXG5cdFx0XHRcdFx0Ly8g0J7Qv9C40YHQsNC90LjQtVxyXG5cdFx0XHRcdFx0cHJvZE1vZGFsRGVzY3IudGV4dENvbnRlbnQgPSBkYXRhSXRlbS5kZXNjcmlwdGlvbjtcclxuXHJcblx0XHRcdFx0XHQvLyDQpdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutC4XHJcblx0XHRcdFx0XHRsZXQgY2hhcnNJdGVtcyA9ICcnO1xyXG5cclxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKGRhdGFJdGVtLmNoYXJzKS5mb3JFYWNoKGZ1bmN0aW9uIGVhY2hLZXkoa2V5KSB7XHJcblx0XHRcdFx0XHRcdGNoYXJzSXRlbXMgKz0gYDxwIGNsYXNzPVwibW9kYWwtY2hhcl9faXRlbVwiPiR7a2V5fTogJHtkYXRhSXRlbS5jaGFyc1trZXldfTwvcD5gXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHByb2RNb2RhbENoYXJzLmlubmVySFRNTCA9IGNoYXJzSXRlbXM7XHJcblxyXG5cdFx0XHRcdFx0Ly8g0JLQuNC00LXQvlxyXG5cdFx0XHRcdFx0aWYgKGRhdGFJdGVtLnZpZGVvKSB7XHJcblx0XHRcdFx0XHRcdHByb2RNb2RhbFZpZGVvLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0XHRcdFx0XHRwcm9kTW9kYWxWaWRlby5pbm5lckhUTUwgPSBgXHJcblx0XHRcdFx0XHRcdFx0PGlmcmFtZSBzcmM9XCIke2RhdGFJdGVtLnZpZGVvfVwiXHJcblx0XHRcdFx0XHRcdFx0YWxsb3c9XCJhY2NlbGVyb21ldGVyOyBhdXRvcGxheTsgY2xpcGJvYXJkLXdyaXRlOyBlbmNyeXB0ZWQtbWVkaWE7IGd5cm9zY29wZTsgcGljdHVyZS1pbi1waWN0dXJlXCJcclxuXHRcdFx0XHRcdFx0XHRhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+XHJcblx0XHRcdFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtb2RhbFNsaWRlcigpO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCgnZXJyb3InLCByZXNwb25zZS5zdGF0dXMpKTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuICBcclxuXHQvLyog0L/QviDQutC70LjQutGDINC90LAg0LrQvdC+0L/QutGDIFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0ZFcIiDQtNC+0LHQsNCy0LvRj9C10Lwg0L/QviAzINC60LDRgNGC0L7Rh9C60Lgg0YLQvtCy0LDRgNCwICjRgSDQv9C10YDQtdC30LDQs9GA0YPQt9C60L7QuSDQstGB0LXRhSDRgtC+0LLQsNGA0L7QsikgXHJcblx0Ly8gY2F0YWxvZ01vcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdC8vIFx0cHJvZFF1YW50aXR5ID0gcHJvZFF1YW50aXR5ICsgYWRkUXVhbnRpdHk7XHJcblx0Ly8gXHRsb2FkUHJvZHVjdHMocHJvZFF1YW50aXR5KTtcclxuXHQvLyBcdGlmIChwcm9kUXVhbnRpdHkgPj0gZGF0YUxlbmd0aCkge1xyXG5cdC8vIFx0XHRjYXRhbG9nTW9yZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdC8vIFx0fSBlbHNlIHtcclxuXHQvLyBcdFx0Y2F0YWxvZ01vcmUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSk7XHJcblxyXG5cdC8vKiDRgNCw0LHQvtGC0LAg0LrQvtGA0LfQuNC90YtcclxuXHJcblx0Y29uc3QgbWluaUNhcnRMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1pbmktY2FydF9fbGlzdCcpO1xyXG5cdGNvbnN0IGZ1bGxQcmljZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5taW5pLWNhcnRfX3N1bW0nKTtcclxuXHRjb25zdCBjYXJ0Q291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fY291bnQnKTtcclxuXHJcblx0Ly8g0YTRg9C90LrRhtC40Y8g0YPQtNCw0LvRj9C10YIg0L/RgNC+0LHQtdC7INC80LXQttC00YMg0YDQsNC30YDRj9C00LDQvNC4XHJcblx0Y29uc3QgcHJpY2VXaXRob3V0U3BhY2VzID0gKHN0cikgPT4ge1xyXG5cdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdH07XHJcblxyXG5cdGNvbnN0IGNhcnRMb2dpYyA9IGFzeW5jICgpID0+IHtcclxuXHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcuLi9kYXRhL2RhdGEuanNvbicpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblx0XHRcdGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cdFx0XHRsZXQgcHJpY2UgPSAwO1x0XHRcclxuXHRcdFx0Y29uc3QgcHJvZHVjdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hZGQtdG8tY2FydC1idG4nKTtcclxuXHJcblx0XHRcdC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRgyBcItC00L7QsdCw0LLQuNGC0Ywg0LIg0LrQvtGA0LfQuNC90YNcIiAtINGC0L7QstCw0YAg0LTQvtCx0LDQstC70Y/QtdGC0YHRjyDQsiDQutC+0YDQt9C40L3Rg1xyXG5cdFx0XHRwcm9kdWN0QnRuLmZvckVhY2goZWwgPT4ge1xyXG5cdFx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IGlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkYXRhSXRlbSBvZiBkYXRhKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkYXRhSXRlbS5pZCA9PSBpZCkge1xyXG5cdFx0XHRcdFx0XHRcdG1pbmlDYXJ0TGlzdC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgXHJcblx0XHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3M9XCJtaW5pLWNhcnRfX2l0ZW1cIiBkYXRhLWlkPVwiJHtkYXRhSXRlbS5pZH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1pbmktY2FydF9faW1hZ2VcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7ZGF0YUl0ZW0ubWFpbkltYWdlfVwiIGFsdD1cIiR7ZGF0YUl0ZW0udGl0bGV9XCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtaW5pLWNhcnRfX2NvbnRlbnRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aDMgY2xhc3M9XCJtaW5pLWNhcnRfX3RpdGxlXCI+JHtkYXRhSXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwibWluaS1jYXJ0X19wcmljZVwiPiR7bm9ybWFsUHJpY2UoZGF0YUl0ZW0ucHJpY2UpfSBwPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm1pbmktY2FydF9fZGVsZXRlIGJ0bi1yZXNldFwiPjwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0XHRgKTtcclxuXHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0Ly8g0L/RgNC40LHQsNCy0LvRj9C10Lwg0YbQtdC90YMg0YLQvtCy0LDRgNCwINC6INC+0LHRidC10Lkg0YHRg9C80LzQtSDQuCDQstGL0LLQvtC00LjQvCDQvtCx0YnRg9GOINGB0YPQvNC80YNcclxuXHRcdFx0XHRcdFx0XHRwcmljZSArPSBkYXRhSXRlbS5wcmljZTtcclxuXHRcdFx0XHRcdFx0XHRmdWxsUHJpY2UudGV4dENvbnRlbnQgPSBgJHtub3JtYWxQcmljZShwcmljZSl9INGAYDtcdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyDQv9C+0LvRg9GH0LDQtdC8INC60L7Qu9C40YfQtdGB0YLQstC+INGC0L7QstCw0YDQsCwg0LTQvtCx0LDQstC70Y/QtdC8INC10LPQviDQsiDQv9C+0LrQsNC30LDQtdC70Ywg0LrQvtC70LjRh9C10YHRgtCy0LAg0Lgg0LTQtdC70LDQtdC8INCw0LrRgtC40LLQvdGL0Lwg0LrRgNGD0LbQvtGH0LXQuiDRgSDQutC+0LvQuNGH0LXRgdGC0LLQvtC8XHJcblx0XHRcdFx0XHRsZXQgbnVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1pbmktY2FydF9faXRlbScpLmxlbmd0aDtcclxuXHRcdFx0XHRcdGlmIChudW0gPiAwKSB7XHJcblx0XHRcdFx0XHQgIGNhcnRDb3VudC5jbGFzc0xpc3QuYWRkKCdjYXJ0X19jb3VudC0tYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYXJ0Q291bnQudGV4dENvbnRlbnQgPSBudW07XHJcblx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8g0LTQtdC70LDQtdC8INC30L3QsNGH0LXQuiDQutC+0YDQt9C40L3RiyDQtNC+0YHRgtGD0L/QvdGL0Lwg0LTQu9GPINC60LvQuNC60LBcclxuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0JykuY2xhc3NMaXN0LnJlbW92ZSgnY2FydC0taW5hY3RpdmUnKTtcclxuXHRcdFx0XHRcdC8vINC30L3QsNC6INC00L7QsdCw0LLQu9C10L3QuNGPINCyINC60L7RgNC30LjQvdGDINC90LAg0YLQvtCy0LDRgNC1INC00LXQu9Cw0LXQvCDQvdC10LTQvtGB0YLRg9C/0L3Ri9C8XHJcblx0XHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmFkZCgnY2F0YWxvZy1pdGVtX19idG4tLWRpc2FibGVkJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWluaUNhcnRMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdFx0XHQvLyDQv9GA0Lgg0LrQu9C40LrQtSDQvdCwINC60L3QvtC/0LrRgyBcItGD0LTQsNC70LjRgtGMINGC0L7QstCw0YAg0LjQtyDQutC+0YDQt9C40L3Ri1wiINGD0LTQsNC70Y/QtdC8INC10LTQuNC90LjRhtGDINGC0L7QstCw0YDQsCwg0LzQtdC90Y/QtdC8INGB0YPQvNC80YMg0Lgg0LrQvtC70LjRh9C10YHRgtCy0L5cclxuXHRcdFx0XHRpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pLWNhcnRfX2RlbGV0ZScpKSB7XHJcblx0XHRcdFx0XHRjb25zdCBzZWxmID0gZS50YXJnZXQ7XHJcblx0XHRcdFx0XHRjb25zdCBwYXJlbnQgPSBzZWxmLmNsb3Nlc3QoJy5taW5pLWNhcnRfX2l0ZW0nKTtcclxuXHRcdFx0XHRcdGxldCBwcmljZURlbCA9IHBhcnNlSW50KHByaWNlV2l0aG91dFNwYWNlcyhwYXJlbnQucXVlcnlTZWxlY3RvcignLm1pbmktY2FydF9fcHJpY2UnKS50ZXh0Q29udGVudCkpO1xyXG5cdFx0XHRcdFx0Y29uc3QgaWQgPSBwYXJlbnQuZGF0YXNldC5pZDtcclxuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5hZGQtdG8tY2FydC1idG5bZGF0YS1pZD1cIiR7aWR9XCJdYCkuY2xhc3NMaXN0LnJlbW92ZSgnY2F0YWxvZy1pdGVtX19idG4tLWRpc2FibGVkJyk7XHJcblx0XHRcdFx0XHRwYXJlbnQucmVtb3ZlKCk7XHJcblx0XHJcblx0XHRcdFx0XHRwcmljZSAtPSBwcmljZURlbDtcclxuXHRcdFx0XHRcdGZ1bGxQcmljZS50ZXh0Q29udGVudCA9IGAke25vcm1hbFByaWNlKHByaWNlKX0g0YBgO1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcdC8vINC10YHQu9C4INGC0L7QstCw0YDQvtCyINCyINC60L7RgNC30LjQvdC1INC90LXRgiAtINC30LDQutGA0YvQstCw0LXQvCDQvtC60L3QviDQutC+0YDQt9C40L3Riywg0LTQtdC70LDQtdC8INC30L3QsNGH0LXQuiDQutC+0YDQt9C40L3RiyDQvdC10LTQvtGB0YLRg9C/0L3Ri9C8INC4INGD0LHQuNGA0LDQtdC8INC60YDRg9C20LXQuiDQutC+0LvQuNGH0LXRgdGC0LLQsFxyXG5cdFx0XHRcdFx0bGV0IG51bSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5taW5pLWNhcnRfX2xpc3QgLm1pbmktY2FydF9faXRlbScpLmxlbmd0aDtcclxuXHRcdFx0XHRcdGlmIChudW0gPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRjYXJ0Q291bnQuY2xhc3NMaXN0LnJlbW92ZSgnY2FydF9fY291bnQtLWFjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHRtaW5pQ2FydC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pLWNhcnQtLW9wZW4nKTtcclxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQnKS5jbGFzc0xpc3QuYWRkKCdjYXJ0LS1pbmFjdGl2ZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2FydENvdW50LnRleHRDb250ZW50ID0gbnVtO1xyXG5cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy5taW5pLWNhcnRfX2l0ZW0nKSkge1xyXG5cdFx0XHRcdFx0Ly8g0LLRi9C00LXQu9GP0LXQvCDRgtC+0LLQsNGA0Ysg0LIg0LrQvtGA0LfQuNC90LUg0L/RgNC4INC60LvQuNC60LUg0L3QsCDQvdC40YVcclxuXHRcdFx0XHRcdGNvbnN0IHBhcmVudCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5taW5pLWNhcnRfX2l0ZW0nKTtcclxuXHRcdFx0XHRcdGNvbnN0IGNhcnRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5taW5pLWNhcnRfX2xpc3QgLm1pbmktY2FydF9faXRlbScpO1xyXG5cdFx0XHRcdFx0Y2FydEl0ZW1zLmZvckVhY2goYnRuID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKCFidG4uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRcdFx0YnRuLmNsYXNzTGlzdC5yZW1vdmUoJ21pbmktY2FydF9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1x0XHJcblxyXG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC5hZGQoJ21pbmktY2FydF9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9ICBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coKCdlcnJvcicsIHJlc3BvbnNlLnN0YXR1cykpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn0iLCJjb25zdCBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Zvcm0nKTtcclxuXHJcbmlmIChmb3Jtcy5sZW5ndGggPiAwKSB7XHJcblx0Zm9ybXMuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRsZXQgZm9ybSA9IGUudGFyZ2V0O1x0XHJcblx0XHRcdGxldCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0XHRcdC8vIGxldCBmaWxlTmFtZSA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpOyAvLyDQtdGB0LvQuCDQtdGB0YLRjCDQt9Cw0LPRgNGD0LfQutCwINGE0LDQudC70LAgKNCyINCw0YLRgNC40LHRg9GCINC00L7QsdCw0LLQuNGC0YwgZmlsZSlcclxuXHRcdFx0bGV0IHZhbGlkID0gdmFsaWRJbnB1dChmb3JtKTtcclxuXHRcdFx0aWYgKHZhbGlkID09PSAwICYmIHZhbGlkQ2hlY2soZm9ybSkpIHtcclxuXHRcdFx0XHRmb3JtUmVtb3ZlRXJyb3IoZm9ybSk7XHJcblxyXG5cdFx0XHRcdC8vKiA9PT09PT09PSDQodC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGC0L/RgNCw0LLQutC1ID09PT09PT09PT09PVxyXG5cdFx0XHRcdGxldCB0ZXh0TWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm0tbWVzc2FnZScpO1xyXG5cdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JfQsNCz0YDRg9C30LrQsC4uLic7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vKiDQl9Cw0L/QuNGB0Ywg0L3QsNC30LLQsNC90LjRjyDRh9C10LrQsdC+0LrRgdCwINCyIHZhbHVlINC40L3Qv9GD0YLQsCDRh9C10LrQsdC+0LrRgdCwICjQtdGB0LvQuCDQtdGB0YLRjCDRh9C10LrQsdC+0LrRgdGLKVxyXG5cdFx0XHRcdC8vIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHRcdFx0XHQvLyBcdGlmIChpbnB1dC50eXBlID09ICdjaGVja2JveCcgfHwgaW5wdXQudHlwZSA9PSAncmFkaW8nKSB7XHJcblx0XHRcdFx0Ly8gXHRcdGlucHV0LnZhbHVlID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nLnRleHRDb250ZW50O1xyXG5cdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdC8vIH0pO1xyXG5cclxuXHRcdFx0XHQvLyo9PT09PT09PT0gRm9ybURhdGEgPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHRcdGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGl0ZW0pO1xyXG5cdFx0XHRcdC8vIGZvcm1EYXRhLmFwcGVuZCgnaW1hZ2UnLCBmb3JtSW1hZ2UuZmlsZXNbMF0pO1xyXG5cclxuXHRcdFx0XHQvLyogPT09PT0g0J/RgNC+0LLQtdGA0LrQsCDRhNC+0YDQvNGLID09PT09XHJcblx0XHRcdFx0Ly8gZm9yKHZhciBwYWlyIG9mIGZvcm1EYXRhLmVudHJpZXMoKSkge1xyXG5cdFx0XHRcdC8vIFx0Y29uc29sZS5sb2cocGFpclswXSsgJywgJysgcGFpclsxXSk7XHJcblx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHQvLyo9PT09PT09PT0g0J7RgtC/0YDQsNCy0LrQsCDQtNCw0L3QvdGL0YUgPT09PT09PT09PT09PT09XHJcblx0XHRcdFx0Y29uc3QgcG9zdERhdGEgPSBhc3luYyAodXJsLCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcclxuXHRcdFx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcclxuXHRcdFx0XHRcdFx0Ym9keTogZGF0YVxyXG5cdFx0XHRcdFx0fSk7XHRcclxuXHRcdFx0XHRcdGlmIChyZXNwb25zZS5vaykge1xyXG5cclxuXHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTsgLy8ganNvbigpIC0g0LTQu9GPINCy0YvQstC+0LTQsCDRgdC+0L7QsdGJ0LXQvdC40Y87XHJcblx0XHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5tZXNzYWdlKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7IC8vIHRleHQoKSAtINC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LUsINC/0L7QtNC60LvRjtGH0LjRgtGMIHNlcnZlci5waHApXHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7IC8vINGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQodC/0LDRgdC40LHQviwg0YHQutC+0YDQviDQvNGLINGBINCy0LDQvNC4INGB0LLRj9C20LjQvNGB0Y8hJztcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjbGVhcklucHV0cyhpbnB1dHMpO1xyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSwgNTAwMCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBhbGVydChcItCe0YjQuNCx0LrQsFwiKTtcclxuXHRcdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XHJcblx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sIDUwMDApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cG9zdERhdGEoJy4uL3NlbmRtYWlsLnBocCcsIGZvcm1EYXRhKTtcclxuXHRcdFx0XHQvLyBwb3N0RGF0YSgnLi4vc2VydmVyLnBocCcsIGZvcm1EYXRhKSAvLyEg0YPQsdGA0LDRgtGMICjRjdGC0L4g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSlcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0iLCJjb25zdCBsYXp5SW1hZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtc3JjXSxzb3VyY2VbZGF0YS1zcmNzZXRdJyk7XHJcbmNvbnN0IGxvYWRNYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZC1tYXAnKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsICgpID0+IHtcclxuXHRsZXQgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cdGlmIChsYXp5SW1hZ2VzLmxlbmd0aCA+IDApIHtcclxuXHRcdGxhenlJbWFnZXMuZm9yRWFjaChpbWcgPT4ge1xyXG5cdFx0XHRsZXQgaW1nT2Zmc2V0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHBhZ2VZT2Zmc2V0O1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHNjcm9sbFkgPj0gaW1nT2Zmc2V0IC0gMTAwMCkge1xyXG5cdFx0XHRcdGlmIChpbWcuZGF0YXNldC5zcmMpIHtcclxuXHRcdFx0XHRcdGltZy5zcmMgPSBpbWcuZGF0YXNldC5zcmM7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyYycpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoaW1nLmRhdGFzZXQuc3Jjc2V0KSB7XHJcblx0XHRcdFx0XHRpbWcuc3Jjc2V0ID0gaW1nLmRhdGFzZXQuc3Jjc2V0O1xyXG5cdFx0XHRcdFx0aW1nLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmNzZXQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvL01hcFxyXG5cdC8vIGlmICghbG9hZE1hcC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvYWRlZCcpKSB7XHJcblx0Ly8gXHRsZXQgbWFwT2Zmc2V0ID0gbG9hZE1hcC5vZmZzZXRUb3A7XHJcblx0Ly8gXHRpZiAoc2Nyb2xsWSA+PSBtYXBPZmZzZXQgLSAyMDApIHtcclxuXHQvLyBcdFx0Y29uc3QgbG9hZE1hcFVybCA9IGxvYWRNYXAuZGF0YXNldC5tYXA7XHJcblx0Ly8gXHRcdGlmIChsb2FkTWFwVXJsKSB7XHJcblx0Ly8gXHRcdFx0bG9hZE1hcC5pbnNlcnRBZGphY2VudEhUTUwoXHJcblx0Ly8gXHRcdFx0XHRcImJlZm9yZWVuZFwiLFxyXG5cdC8vIFx0XHRcdFx0YDxpZnJhbWUgc3JjPVwiJHtsb2FkTWFwVXJsfVwiIHN0eWxlPVwiYm9yZGVyOjA7XCIgYWxsb3dmdWxsc2NyZWVuPVwiXCIgbG9hZGluZz1cImxhenlcIj48L2lmcmFtZT5gXHJcblx0Ly8gXHRcdFx0KTtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG59KTsiLCJsZXQgZmxhZyA9IDA7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKXtcclxuXHRsZXQgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cdGxldCBtYXBPZmZzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hcFwiKS5vZmZzZXRUb3A7XHJcblxyXG5cdGlmICgoc2Nyb2xsWSA+PSBtYXBPZmZzZXQgLSA1MDApICYmIChmbGFnID09IDApKSB7XHJcblx0XHR5bWFwcy5yZWFkeShpbml0KTtcclxuXHJcblx0XHRmdW5jdGlvbiBpbml0KCl7XHJcblx0XHRcdGNvbnN0IG15TWFwID0gbmV3IHltYXBzLk1hcChcIm1hcFwiLCB7XHJcblx0XHRcdFx0Y2VudGVyOiBbNTkuODMwNDgxLCAzMC4xNDIxOTddLFxyXG5cdFx0XHRcdHpvb206IDEwLFxyXG5cdFx0XHRcdGNvbnRyb2xzOiBbXVxyXG5cdFx0XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgbXlQbGFjZW1hcmsgID0gbmV3IHltYXBzLlBsYWNlbWFyayhbNTkuODMwNDgxLCAzMC4xNDIxOTddLCB7fSwge1xyXG5cdFx0XHRcdGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuXHRcdFx0XHRpY29uSW1hZ2VIcmVmOiAnaW1nL3BsYWNlbWFyay5wbmcnLFxyXG5cdFx0XHRcdGljb25JbWFnZVNpemU6IFsyNSwgMzRdLFxyXG5cdFx0XHRcdGljb25JbWFnZU9mZnNldDogWy0xOSwgLTQ0XVxyXG5cdFx0XHR9KTtcdFx0XHRcclxuXHRcdFx0bXlNYXAuZ2VvT2JqZWN0cy5hZGQobXlQbGFjZW1hcmspO1xyXG5cdFx0XHRteU1hcC5iZWhhdmlvcnMuZGlzYWJsZShbJ3Njcm9sbFpvb20nXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZmxhZyA9IDE7XHJcblx0fVxyXG59KTsiLCJsZXQgc2V0Q3Vyc29yUG9zaXRpb24gPSAocG9zLCBlbGVtKSA9PiB7XHJcbiAgICBlbGVtLmZvY3VzKCk7XHJcbiAgICBpZiAoZWxlbS5zZXRTZWxlY3Rpb25SYW5nZSkge1xyXG4gICAgICAgIGVsZW0uc2V0U2VsZWN0aW9uUmFuZ2UocG9zLCBwb3MpO1xyXG4gICAgfSBlbHNlIGlmIChlbGVtLmNyZWF0ZVRleHRSYW5nZSkge1xyXG4gICAgICAgIGxldCByYW5nZSA9IGVsZW0uY3JlYXRlVGV4dFJhbmdlKCk7XHJcblxyXG4gICAgICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xyXG4gICAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIHBvcyk7XHJcbiAgICAgICAgcmFuZ2UubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCBwb3MpO1xyXG4gICAgICAgIHJhbmdlLnNlbGVjdCgpO1xyXG4gICAgfVxyXG59O1xyXG5mdW5jdGlvbiBjcmVhdGVNYXNrKGV2ZW50KSB7XHJcbiAgICBsZXQgbWF0cml4ID0gJys3IChfX18pIF9fXyBfXyBfXycsXHJcbiAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgZGVmID0gbWF0cml4LnJlcGxhY2UoL1xcRC9nLCAnJyksXHJcbiAgICAgICAgdmFsID0gdGhpcy52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xyXG4gICAgaWYgKGRlZi5sZW5ndGggPj0gdmFsLmxlbmd0aCkge1xyXG4gICAgICAgIHZhbCA9IGRlZjtcclxuICAgIH1cclxuICAgIHRoaXMudmFsdWUgPSBtYXRyaXgucmVwbGFjZSgvLi9nLCBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgcmV0dXJuIC9bX1xcZF0vLnRlc3QoYSkgJiYgaSA8IHZhbC5sZW5ndGggPyB2YWwuY2hhckF0KGkrKykgOiBpID49IHZhbC5sZW5ndGggPyAnJyA6IGE7XHJcbiAgICB9KTtcclxuICAgIGlmIChldmVudC50eXBlID09PSdibHVyJykge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PSAyIHx8IHRoaXMudmFsdWUubGVuZ3RoIDwgbWF0cml4Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSdrZXl1cCcgfHwgZXZlbnQudHlwZSA9PT0nbW91c2V1cCcpIHtcclxuICAgICAgICBsZXQgY3VyID0gdGhpcy5zZWxlY3Rpb25TdGFydDtcclxuICAgICAgICBpZiAoY3VyID09ICcwJykge1xyXG4gICAgICAgICAgICBzZXRDdXJzb3JQb3NpdGlvbih0aGlzLnZhbHVlLmxlbmd0aCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRDdXJzb3JQb3NpdGlvbih0aGlzLnZhbHVlLmxlbmd0aCwgdGhpcyk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5sZXQgdGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRlbCcpO1xyXG50ZWwuZm9yRWFjaChpbnB1dCA9PiB7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBjcmVhdGVNYXNrKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBjcmVhdGVNYXNrKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgY3JlYXRlTWFzayk7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgY3JlYXRlTWFzayk7XHJcbn0pOyIsImNvbnN0IGNhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydCcpO1xyXG5jb25zdCBtaW5pQ2FydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5taW5pLWNhcnQnKTtcclxuLy8gY29uc3QgbWluaUNhcnRJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1pbmktY2FydF9faXRlbScpO1xyXG5cclxuY2FydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRtaW5pQ2FydC5jbGFzc0xpc3QudG9nZ2xlKCdtaW5pLWNhcnQtLW9wZW4nKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0aWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmktY2FydCcpICYmICFlLnRhcmdldC5jbG9zZXN0KCcubWluaS1jYXJ0JykgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2FydCcpICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmktY2FydF9fZGVsZXRlJykpIHtcclxuXHRcdG1pbmlDYXJ0LmNsYXNzTGlzdC5yZW1vdmUoJ21pbmktY2FydC0tb3BlbicpO1xyXG5cdH1cclxufSk7XHJcblxyXG4vLyBtaW5pQ2FydEl0ZW0uZm9yRWFjaChpdGVtID0+IHtcclxuLy8gXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdFxyXG4vLyBcdFx0bWluaUNhcnRJdGVtLmZvckVhY2goYnRuID0+IHtcclxuLy8gXHRcdFx0aWYgKCFidG4uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbi8vIFx0XHRcdFx0YnRuLmNsYXNzTGlzdC5yZW1vdmUoJ21pbmktY2FydF9faXRlbS0tYWN0aXZlJyk7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdH0pO1xyXG5cclxuLy8gXHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnbWluaS1jYXJ0X19pdGVtLS1hY3RpdmUnKTtcclxuLy8gXHR9KTtcclxuLy8gfSk7IiwiLy8/INCf0LDRgNCw0LzQtdGC0YDRizpcclxuLy8qIGJ0blNlbGVjdG9yIC0g0LrQvdC+0L/QutCwINC+0YLQutGA0YvRgtC40Y8g0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LBcclxuLy8qIG1vZGFsU2VsZWN0b3IgLSDQvNC+0LTQsNC70YzQvdC+0LUg0L7QutC90L4g0LLQvdGD0YLRgNC4INGE0L7QvdCwIG1vZGFsXHJcblxyXG4vLz8g0Y3RgtC4INC/0LDRgNCy0LzQtdGC0YDRiyDQvNC10L3Rj9GC0Ywg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4sINC70LjQsdC+INGD0LrQsNC30YvQstCw0YLRjCDQuNGFINC60LDQuiDQsNGA0LPRg9C80LXQvdGCLCDQtdGB0LvQuCDQvtC90Lgg0YDQsNC30L3Ri9C1INC00LvRjyDRgNCw0LfQvdGL0YUg0L7QutC+0L1cclxuLy8qIGFuaW1hdGUgLSDQsNC90LjQvNCw0YbQuNGPINC/0YDQuCDQvtGC0LrRgNGL0YLQuNC4INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwICjQutC+0L3RgtC10L3RgtCwINCy0L3Rg9GC0YDQuCDQvtCx0L7Qu9C+0YfQutC4KVxyXG4vLyogc3BlZWQgLSDQstGA0LXQvNGPINCy0YvQv9C+0LvQvdC10L3QuNGPLCDRgdGC0LDQstC40YLRgdGPINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQuCDRgSAkdHJhbnNpdGlvbi10aW1lXHJcblxyXG4vL1RPRE8g0JTQvtCx0LDQstC40YLRjCDQutC70LDRgdGB0Ys6XHJcbi8vKiBkYXRhLW1vZGFsIC0g0LTQvtCx0LDQstC40YLRjCDQstGB0LXQvCDQvNC+0LTQsNC70YzQvdGL0Lwg0L7QutC90LDQvCAobW9kYWwtbmFtZSkgKNC10YHQu9C4INC40YUg0L3QtdGB0LrQvtC70YzQutC+KVxyXG4vLyogYmxvY2stZml4IC0g0LTQvtCx0LDQstC40YLRjCDQutC70LDRgdGBINC00LvRjyDQsdC70L7QutC+0LIg0YEgcG9zaXRpb246IGFic29sdXRlINC40LvQuCBmaXhlZCAo0LTQvtCx0LDQstC40YLRgdGPIHBhZGRpbmcpXHJcbi8vKiBzbWFsbC1maXggLSDQtNC+0LHQsNCy0LjRgtGMINC60LvQsNGB0YEg0LTQu9GPINC80LDQu9C10L3RjNC60LjRhSDQsdC70L7QutC+0LIg0YEgcG9zaXRpb246IGFic29sdXRlINC40LvQuCBmaXhlZCAo0LTQvtCx0LDQstC40YLRgdGPIG1hcmdpbilcclxuLy8qIGRhdGEtaW5zaWRlIC0g0LTQvtCx0LDQstC40YLRjCDQutC90L7Qv9C60LDQvCDQstC90YPRgtGA0Lgg0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LAsINC60L7RgtC+0YDRi9C1INC+0YLQutGA0YvQstCw0Y7RgiDRgdC70LXQtNGD0Y7RidC10LUg0LzQvtC00LDQu9GM0L3QvtC1INC+0LrQvdC+ICjRh9GC0L4g0LHRiyDRgdC+0YXRgNCw0L3QuNGC0Ywg0YTQvtC60YPRgSDQvdCwINC60L3QvtC/0LrQtSDQstC90LUg0L7QutC90LApXHJcblxyXG5iaW5kTW9kYWwoJy5jYXJ0LWJ0bicsICcubW9kYWwtY2FydCcpO1xyXG5cclxubGV0IGxhc3RGb2N1cyA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gYmluZE1vZGFsKGJ0blNlbGVjdG9yLCBtb2RhbFNlbGVjdG9yLCBmdW5jLCBhbmltYXRlPSdmYWRlJywgc3BlZWQ9NTAwLCkge1xyXG4gICAgY29uc3QgbW9kYWxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGJ0blNlbGVjdG9yKTtcclxuXHRjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1vdmVybGF5Jyk7XHJcblx0Y29uc3QgbW9kYWxDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihtb2RhbFNlbGVjdG9yKTtcclxuXHRjb25zdCBtb2RhbGNsb3NlID0gbW9kYWxDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UnKTtcclxuXHRjb25zdCBvcGVuV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZGFsXScpO1xyXG5cdGNvbnN0IGZpeEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ibG9jay1maXggJyk7XHJcblx0Y29uc3QgZml4U21hbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc21hbGwtZml4Jyk7XHJcblx0Y29uc3Qgc3BlZWRUaW1lID0gKHNwZWVkKTtcclxuXHQvLyBjb25zdCBtb2RhbEFuaW1hdGlvbiA9IGFuaW1hdGU7XHJcbiAgICBjb25zdCBtb2RhbFNjcm9sbCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aDtcclxuICAgIGNvbnN0IGZvY3VzRWxlbWVudHMgPSBbXHJcblx0XHQnYVtocmVmXScsXHJcblx0XHQnaW5wdXQnLFxyXG5cdFx0J3NlbGVjdCcsXHJcblx0XHQndGV4dGFyZWEnLFxyXG5cdFx0J2J1dHRvbicsXHJcblx0XHQnaWZyYW1lJyxcclxuXHRcdCdbY29udGVudGVkaXRhYmxlXScsXHJcblx0XHQnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4Xj1cIi1cIl0pJ1xyXG5cdF07XHJcblx0XHJcblx0aWYgKG1vZGFsKSB7XHJcblx0XHRtb2RhbEJ0bi5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gZS50YXJnZXRcclxuXHRcdFx0XHRpZiAodGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRvcGVuTW9kYWwodGFyZ2V0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0XHJcblx0XHRtb2RhbGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHRpZiAobW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtb3BlblwiKSkge1xyXG5cdFx0XHRcdGNsb3NlTW9kYWwoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcdGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLW92ZXJsYXknKSAmJiBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1vcGVuXCIpKSB7XHJcblx0XHRcdFx0Y2xvc2VNb2RhbCgpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcblx0XHRcdGlmIChlLmNvZGUgPT09ICdFc2NhcGUnICYmIG1vZGFsLmNsYXNzTGlzdC5jb250YWlucyhcImlzLW9wZW5cIikpIHtcclxuXHRcdFx0XHRjbG9zZU1vZGFsKCk7XHJcblx0XHRcdH1cclxuXHRcclxuXHRcdFx0aWYgKGUuY29kZSA9PT0gJ1RhYicgJiYgbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtb3BlblwiKSkge1xyXG5cdFx0XHRcdGZvY3VzQ2F0Y2goZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBvcGVuTW9kYWwodGFyKSB7XHJcblx0XHRpZiAoIXRhci5jbG9zZXN0KGBbZGF0YS1pbnNpZGVdYCkpIHtcclxuXHRcdFx0bGFzdEZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuXHRcdH1cclxuXHJcblx0XHRvcGVuV2luZG93cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuXHRcdFx0aXRlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcblx0XHRcdC8vIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZS1vcGVuJyk7XHJcblx0XHRcdC8vIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShtb2RhbEFuaW1hdGlvbik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoIW1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnaXMtb3BlbicpKXtcclxuXHRcdFx0ZGlzYWJsZVNjcm9sbCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtb2RhbENvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC1wcm9kJykpIHtcclxuXHRcdFx0bGV0IG9wZW5CdG5JZCA9IGxhc3RGb2N1cy5kYXRhc2V0LmlkO1x0XHJcblx0XHRcdGZ1bmMob3BlbkJ0bklkKTtcclxuXHRcdH1cclxuXHJcblx0XHRtb2RhbC5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuJyk7XHJcblx0XHRtb2RhbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke21vZGFsU2Nyb2xsfXB4YDtcclxuXHRcdGlmIChmaXhCbG9ja3MubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmaXhCbG9ja3MuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke21vZGFsU2Nyb2xsfXB4YDtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHRcdGlmIChmaXhTbWFsbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZpeFNtYWxsLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5zdHlsZS5tYXJnaW5SaWdodCA9IGAke21vZGFsU2Nyb2xsfXB4YDtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRtb2RhbENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpO1xyXG5cdFx0bW9kYWxDb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XHJcblx0XHQvLyBtb2RhbENvbnRlbnQuY2xhc3NMaXN0LmFkZChtb2RhbEFuaW1hdGlvbik7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdC8vIG1vZGFsQ29udGVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlLW9wZW4nKTtcclxuXHRcdFx0Zm9jdXNUcmFwKCk7XHJcblx0XHR9LCBzcGVlZFRpbWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuXHRcdG9wZW5XaW5kb3dzLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG5cdFx0XHRpdGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcclxuXHRcdFx0Ly8gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlLW9wZW4nKTtcclxuXHRcdFx0Ly8gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKG1vZGFsQW5pbWF0aW9uKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGVuYWJsZVNjcm9sbCgpO1xyXG5cclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gYDBweGA7XHJcblx0XHRpZiAoZml4QmxvY2tzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zml4QmxvY2tzLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgMHB4YDtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHRcdGlmIChmaXhTbWFsbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZpeFNtYWxsLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5zdHlsZS5tYXJnaW5SaWdodCA9IGAwcHhgO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcclxuXHRcdG1vZGFsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuXHJcblx0XHRmb2N1c1RyYXAoKTtcclxuXHR9XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gZGlzYWJsZVNjcm9sbCgpIHtcclxuICAgIC8vICAgICBsZXQgcGFnZVBvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XHJcbiAgICAvLyAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtbG9jaycpO1xyXG4gICAgLy8gICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5wb3NpdGlvbiA9IHBhZ2VQb3NpdGlvbjtcclxuICAgIC8vICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IC1wYWdlUG9zaXRpb24gKyAncHgnO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIGVuYWJsZVNjcm9sbCgpIHtcclxuICAgIC8vICAgICBsZXQgcGFnZVBvc2l0aW9uID0gcGFyc2VJbnQoZG9jdW1lbnQuYm9keS5kYXRhc2V0LnBvc2l0aW9uLCAxMCk7XHJcbiAgICAvLyAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAnJztcclxuICAgIC8vICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1sb2NrJyk7XHJcbiAgICAvLyAgICAgd2luZG93LnNjcm9sbCh7IHRvcDogcGFnZVBvc2l0aW9uLCBsZWZ0OiAwIH0pO1xyXG4gICAgLy8gICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXBvc2l0aW9uJyk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgZnVuY3Rpb24gZm9jdXNUcmFwKCkge1xyXG5cdFx0Ly8gY29uc3Qgbm9kZXMgPSB0aGlzLm1vZGFsQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5fZm9jdXNFbGVtZW50cyk7IC8vKiDQtNC70Y8g0YTQvtC60YPRgdCwINC90LAg0L/QtdGA0LLQvtC8INGN0LvQtdC80LXQvdGC0LUg0L7QutC90LBcclxuXHRcdGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1vcGVuXCIpKSB7XHJcbiAgICAgICAgICAgIG1vZGFsLmZvY3VzKCk7XHJcblx0XHRcdC8vIGlmIChub2Rlcy5sZW5ndGgpIG5vZGVzWzBdLmZvY3VzKCk7IC8vKiDQtNC70Y8g0YTQvtC60YPRgdCwINC90LAg0L/QtdGA0LLQvtC8INGN0LvQtdC80LXQvdGC0LUg0L7QutC90LBcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxhc3RGb2N1cy5mb2N1cygpO1x0XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmb2N1c0NhdGNoKGUpIHtcclxuXHRcdGNvbnN0IGZvY3VzYWJsZSA9IG1vZGFsQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzRWxlbWVudHMpO1xyXG5cdFx0Y29uc3QgZm9jdXNBcnJheSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZvY3VzYWJsZSk7XHJcblx0XHRjb25zdCBmb2N1c2VkSW5kZXggPSBmb2N1c0FycmF5LmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcblxyXG5cdFx0aWYgKGUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSAwKSB7XHJcblx0XHRcdGZvY3VzQXJyYXlbZm9jdXNBcnJheS5sZW5ndGggLSAxXS5mb2N1cygpO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gZm9jdXNBcnJheS5sZW5ndGggLSAxKSB7XHJcblx0XHRcdGZvY3VzQXJyYXlbMF0uZm9jdXMoKTtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiLCJjb25zdCBxdWl6Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LWZvcm0nKTtcclxuY29uc3QgcXVpeklucHV0cyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcbmNvbnN0IHF1aXpCbG9ja3MgPSBxdWl6Rm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcucXVpei1ibG9jaycpO1xyXG5cclxubGV0IHRleHRhcmVhVGV4dCA9IG51bGw7XHJcbmxldCBxdWl6UmVwbHkgID0ge307XHJcbmxldCBibG9ja0luZGV4ID0gMDtcclxuXHJcbi8vINGE0YPQvdC60YbQuNGPINC/0L7QutCw0LfQsCDRgtC+0LvRjNC60L4g0L/QtdGA0LLQvtCz0L4g0LHQu9C+0LrQsCDQutCy0LjQt9CwXHJcbnNob3dCbG9ja3MoYmxvY2tJbmRleCk7XHJcblxyXG5mdW5jdGlvbiBzaG93QmxvY2tzKCkge1xyXG5cdHF1aXpCbG9ja3MuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnKTtcclxuXHRxdWl6QmxvY2tzW2Jsb2NrSW5kZXhdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG59XHJcblxyXG4vLyDQt9Cw0L/QuNGB0Ywg0L3QsNC30LLQsNC90LjRjyDRh9C10LrQsdC+0LrRgdCwINCyIHZhbHVlINC40L3Qv9GD0YLQsCDRh9C10LrQsdC+0LrRgdCwXHJcbnF1aXpJbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0aWYgKGlucHV0LnR5cGUgPT0gJ2NoZWNrYm94JyB8fCBpbnB1dC50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdGlucHV0LnZhbHVlID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nLnRleHRDb250ZW50O1xyXG5cdH1cclxufSk7XHJcblxyXG5xdWl6Rm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0bGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cdGxldCBibG9jayA9IHRhcmdldC5jbG9zZXN0KCcucXVpei1ibG9jaycpO1xyXG5cdGxldCBuZXh0QnRuID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbmV4dF0nKTtcclxuXHRuZXh0QnRuLmZvckVhY2goYnRuID0+IHtcclxuXHRcdGlmICh0YXJnZXQgPT0gYnRuKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0YWRkVG9TZW5kKGJsb2NrLCBxdWl6UmVwbHkpO1xyXG5cdFx0XHRuZXh0UXVlc3Rpb24oYmxvY2spO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdGlmICh0YXJnZXQgPT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2VuZF0nKSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0YWRkVG9TZW5kKGJsb2NrLCBxdWl6UmVwbHkpO1xyXG5cdFx0c2VuZChibG9jayk7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG5leHRRdWVzdGlvbihmb3JtKSB7XHJcblx0bGV0IHZhbGlkID0gdmFsaWRJbnB1dChmb3JtKTtcclxuXHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0c2hvd0Jsb2NrcyhibG9ja0luZGV4ICs9IDEpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2VuZChmb3JtKSB7XHJcblx0bGV0IHZhbGlkID0gdmFsaWRJbnB1dChmb3JtKTtcclxuXHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0Zm9ybVJlbW92ZUVycm9yKHF1aXpGb3JtKTtcclxuXHJcblx0XHQvLyogPT09PT09PT0g0KHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RgtC/0YDQsNCy0LrQtSA9PT09PT09PT09PT1cclxuXHRcdGxldCBvayA9IGZvcm0ucXVlcnlTZWxlY3RvcignLnF1aXotc2VuZF9fb2snKTtcclxuXHRcdGxldCB0ZXh0TWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLnF1aXotbWVzc2FnZScpO1xyXG5cdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9CX0LDQs9GA0YPQt9C60LAuLi4nO1xyXG5cdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyo9PT09PT09PT0gRm9ybURhdGEgPT09PT09PT09PT09PT09XHJcblx0XHRjb25zdCBxdWl6Rm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBxdWl6UmVwbHkpIHtcclxuXHRcdFx0cXVpekZvcm1EYXRhLmFwcGVuZChrZXksIHF1aXpSZXBseVtrZXldKTtcclxuXHRcdH1cclxuXHRcdC8vIGZvcm1EYXRhLmFwcGVuZCgnaW1hZ2UnLCBmb3JtSW1hZ2UuZmlsZXNbMF0pO1xyXG5cdFx0Ly8qINCf0YDQvtCy0LXRgNC60LAgRm9ybURhdGFcclxuXHRcdC8vIGZvcih2YXIgcGFpciBvZiBxdWl6Rm9ybURhdGEuZW50cmllcygpKSB7XHJcblx0XHQvLyBcdGNvbnNvbGUubG9nKHBhaXJbMF0rICc6ICcrIHBhaXJbMV0pO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vKj09PT09PT09PSDQntGC0L/RgNCw0LLQutCwINC00LDQvdC90YvRhSA9PT09PT09PT09PT09PT1cclxuXHRcdGNvbnN0IHF1aXpEYXRhID0gYXN5bmMgKHVybCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcclxuXHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdGJvZHk6IGRhdGFcclxuXHRcdFx0fSk7XHRcclxuXHRcdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblxyXG5cdFx0XHRcdC8vIGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7IC8vIGpzb24oKSAtINC00LvRjyDQstGL0LLQvtC00LAg0YHQvtC+0LHRidC10L3QuNGPO1xyXG5cdFx0XHRcdC8vIGFsZXJ0KHJlc3VsdC5tZXNzYWdlKTtcclxuXHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTsgLy8gdGV4dCgpIC0g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSwg0L/QvtC00LrQu9GO0YfQuNGC0Ywgc2VydmVyLnBocClcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXN1bHQpOyAvLyDRjdGC0L4g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtVxyXG5cclxuXHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ09rISc7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2suY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0Y2xlYXJJbnB1dHMocXVpeklucHV0cyk7XHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRvay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhbGVydChcItCe0YjQuNCx0LrQsCBIVFRQOiBcIiArIHJlc3BvbnNlLnN0YXR1cyk7XHJcblx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdC8vIHF1aXpEYXRhKCcuLi9zZW5kbWFpbC5waHAnLCBxdWl6Rm9ybURhdGEpO1xyXG5cdFx0cXVpekRhdGEoJy4uL3NlcnZlci5waHAnLCBxdWl6Rm9ybURhdGEpIC8vISDRg9Cx0YDQsNGC0YwgKNGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1KVxyXG5cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvU2VuZChmb3JtLCBvYmopIHtcclxuXHRsZXQgdmFsdWVTdHJpbmcgPSAnJztcclxuXHRsZXQgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG5cdGxldCB0ZXh0YXJlYSA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKTtcclxuXHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBmaWVsZCA9IGlucHV0c1tpXTtcclxuXHRcdFx0aWYgKGZpZWxkLnR5cGUgIT0gJ2NoZWNrYm94JyAmJiBmaWVsZC50eXBlICE9ICdyYWRpbycgJiYgZmllbGQudmFsdWUpIHtcclxuXHRcdFx0XHRvYmpbZmllbGQubmFtZV0gPSBmaWVsZC52YWx1ZTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWVsZC50eXBlID09ICdyYWRpbycgJiYgZmllbGQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdG9ialtmaWVsZC5uYW1lXSA9IGZpZWxkLnZhbHVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gJ2NoZWNrYm94JyAmJiBmaWVsZC5jaGVja2VkKSB7XHJcblx0XHRcdFx0dmFsdWVTdHJpbmcgKz0gZmllbGQudmFsdWUgKyAnLCc7XHRcdFxyXG5cdFx0XHRcdG9ialtmaWVsZC5uYW1lXSA9IHZhbHVlU3RyaW5nO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSBlbHNlIGlmICh0ZXh0YXJlYS5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRleHRhcmVhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCB0ZXh0ID0gdGV4dGFyZWFbaV07XHJcblx0XHRcdGlmICh0ZXh0LnZhbHVlKSB7XHJcblx0XHRcdFx0b2JqW3RleHQubmFtZV0gPSB0ZXh0LnZhbHVlO1x0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0iLCJjb25zdCByYW5nZVNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5nZS1zbGlkZXInKTtcblxuaWYgKHJhbmdlU2xpZGVyKSB7XG5cdG5vVWlTbGlkZXIuY3JlYXRlKHJhbmdlU2xpZGVyLCB7XG4gICAgc3RhcnQ6IFs1MDAsIDk5OTk5OV0sXG5cdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRzdGVwOiAxLFxuICAgIHJhbmdlOiB7XG5cdFx0XHQnbWluJzogWzUwMF0sXG5cdFx0XHQnbWF4JzogWzk5OTk5OV1cbiAgICB9XG5cdH0pO1xuXG5cdGNvbnN0IGlucHV0MCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC0wJyk7XG5cdGNvbnN0IGlucHV0MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC0xJyk7XG5cdGNvbnN0IGlucHV0cyA9IFtpbnB1dDAsIGlucHV0MV07XG5cblx0cmFuZ2VTbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24odmFsdWVzLCBoYW5kbGUpe1xuXHRcdGlucHV0c1toYW5kbGVdLnZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZXNbaGFuZGxlXSk7XG5cdH0pO1xuXG5cdGNvbnN0IHNldFJhbmdlU2xpZGVyID0gKGksIHZhbHVlKSA9PiB7XG5cdFx0bGV0IGFyciA9IFtudWxsLCBudWxsXTtcblx0XHRhcnJbaV0gPSB2YWx1ZTtcblxuXHRcdGNvbnNvbGUubG9nKGFycik7XG5cblx0XHRyYW5nZVNsaWRlci5ub1VpU2xpZGVyLnNldChhcnIpO1xuXHR9O1xuXG5cdGlucHV0cy5mb3JFYWNoKChlbCwgaW5kZXgpID0+IHtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coaW5kZXgpO1xuXHRcdFx0c2V0UmFuZ2VTbGlkZXIoaW5kZXgsIGUuY3VycmVudFRhcmdldC52YWx1ZSk7XG5cdFx0fSk7XG5cdH0pO1xufSIsImxldCB0ZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRhbG9nLXNpemVzIHRkJyk7XHJcblxyXG50ZC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0bGV0IHNlbGYgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblx0XHRpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZGJiYmE5JztcclxuXHRcdHRkLmZvckVhY2goYnRuID0+IHtcclxuXHRcdFx0aWYgKGJ0biAhPT0gc2VsZikge1xyXG5cdFx0XHRcdGJ0bi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAndHJhbnNwYXJlbnQnO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSk7IiwiLy8gY29uc3QgbWluU2xpZGVyID0gbmV3IFN3aXBlcignLnNsaWRlci1taW4nLCB7XHJcbi8vIFx0Z3JhYkN1cnNvcjogdHJ1ZSxcclxuLy8gXHRzbGlkZXNQZXJWaWV3OiA2LFxyXG4vLyBcdGluaXRpYWxTbGlkZTogMCxcclxuLy8gXHQvLyBzcGFjZUJldHdlZW46IDIwLFxyXG4vLyBcdGZyZWVNb2RlOiB0cnVlLFxyXG4vLyB9KTtcclxuXHJcbi8vIGNvbnN0IG1haW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1haW4nLCB7XHJcbi8vIFx0Z3JhYkN1cnNvcjogdHJ1ZSxcclxuLy8gXHRzcGFjZUJldHdlZW46IDIwLFxyXG4vLyBcdHNsaWRlc1BlclZpZXc6IDEsXHJcbi8vIFx0aW5pdGlhbFNsaWRlOiAwLFxyXG4vLyBcdHNpbXVsYXRlVG91Y2g6IGZhbHNlLFxyXG4vLyBcdGVmZmVjdDogJ2ZhZGUnLFxyXG4vLyBcdGZhZGVFZmZlY3Q6IHtcclxuLy8gXHQgIGNyb3NzRmFkZTogdHJ1ZVxyXG4vLyBcdH0sXHJcbi8vIFx0dGh1bWJzOiB7XHJcbi8vIFx0XHRzd2lwZXI6IG1pblNsaWRlcixcclxuLy8gXHR9XHJcbi8vIH0pOyIsIi8vKiDQktCw0LvQuNC00LDRhtC40Y8g0YTQvtGA0LzRiyAo0LXRgdC70Lgg0YfQtdC60LHQvtC60YHRiyDQuCDQuNC90L/Rg9GC0Ysg0LIg0L7QtNC90L7QuSDRhNC+0YDQvNC1KVxyXG5mdW5jdGlvbiB2YWxpZENoZWNrKGZvcm0pIHtcclxuXHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IGlzVmFsaWQgPSBmYWxzZTtcclxuXHRpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBlbGVtZW50c1tpbmRleF07XHJcblx0XHRcdGlmICghaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3QtdmFsaWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcImNoZWNrYm94XCIgfHwgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJyYWRpb1wiKSB7XHJcblx0XHRcdFx0XHRpZiAoaW5wdXQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdFx0XHRpc1ZhbGlkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7aXNWYWxpZCA9IHRydWU7fVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7aXNWYWxpZCA9IHRydWU7fVxyXG5cclxuXHRyZXR1cm4gaXNWYWxpZDtcclxufVxyXG5mdW5jdGlvbiB2YWxpZElucHV0KGZvcm0pIHtcclxuXHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IGVycm9yID0gMDtcclxuXHRpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBlbGVtZW50c1tpbmRleF07XHJcblx0XHRcdGxldCBwbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpKSB7XHJcblx0XHRcdFx0aWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZW1haWwnKSkge1xyXG5cdFx0XHRcdFx0aWYgKGVtYWlsVGVzdChpbnB1dCkgfHwgaW5wdXQudmFsdWUgPT0gcGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGlucHV0LnZhbHVlID09ICcnIHx8IGlucHV0LnZhbHVlID09IHBsYWNlaG9sZGVyKSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHRcdGVycm9yKys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIdCy0LrQu9GO0YfQuNGC0YwsINC10YHQu9C4INC90LDQtNC+INCy0LDQu9C40LTQuNGA0L7QstCw0YLRjCB0ZXh0YXJlOlxyXG5cdC8vIGxldCB0ZXh0YXJlYSA9IGZvcm0ucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcclxuXHQvLyBpZiAodGV4dGFyZWEpIHtcclxuXHQvLyBcdGlmICh0ZXh0YXJlYS52YWx1ZSA9PSAnJykge1xyXG5cdC8vIFx0XHRmb3JtQWRkRXJyb3IodGV4dGFyZWEpO1xyXG5cdC8vIFx0XHRlcnJvcisrO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0gXHJcblxyXG5cdHJldHVybiBlcnJvcjtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybUFkZEVycm9yKGl0ZW0pIHtcclxuXHRpdGVtLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuXHRpdGVtLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcblxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMLCDQtdGB0LvQuCDQsiBodG1sINC00L7QsdCw0LLQu9C10L3RiyDQsdC70L7QutC4INGBINGB0L7QvtCx0YnQtdC90LjQtdC8INC+0LEg0L7RiNC40LHQutC1ICguZm9ybS1lcnJvcilcclxuXHQvLyog0LXRgdC70Lgg0YDQsNC30L3Ri9C5INGC0LXQutGB0YIg0L7RiNC40LHQutC4INC00LvRjyDQutCw0LbQtNC+0LPQviBpbnB1dFxyXG5cdC8vIGxldCBpbXB1dEVycm9yID0gaXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblx0Ly8gaWYgKGltcHV0RXJyb3IpIHtcclxuXHQvLyBcdGlmIChpbXB1dEVycm9yLmNsYXNzTGlzdC5jb250YWlucygnaW1wdXQtbWVzc2FnZScpKSB7XHJcblx0Ly8gXHRcdGltcHV0RXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cdC8vKiDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LTQu9GPINCy0YHQtdC5INGE0L7RgNC80YsgKNC40LvQuCDQsdC70L7QutCwINC60LLQuNC30LApOlxyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCDQtdGB0LvQuCDQvdCwINGB0LDQudGC0LUg0LXRgdGC0Ywg0LrQstC40LdcclxuXHRpZiAoaXRlbS5jbG9zZXN0KCcucXVpei1mb3JtJykpIHtcclxuXHRcdGxldCBxdWl6RXJyb3IgPSBpdGVtLmNsb3Nlc3QoJy5xdWl6LWJsb2NrJykucXVlcnlTZWxlY3RvcignLnF1aXotbWVzc2FnZScpO1xyXG5cdFx0aWYgKHF1aXpFcnJvcikge1xyXG5cdFx0XHRxdWl6RXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGxldCBmb3JtRXJyb3IgPSBpdGVtLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tbWVzc2FnZScpO1xyXG5cdFx0aWYgKGZvcm1FcnJvcikge1xyXG5cdFx0XHRmb3JtRXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCDQtdGB0LvQuCDQvdCwINGB0LDQudGC0LUg0L3QtdGCINC60LLQuNC30LAgKNGC0L7Qu9GM0LrQviDRhNC+0YDQvNGLKVxyXG5cdC8vIGxldCBmb3JtRXJyb3IgPSBpdGVtLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tZXJyb3InKTtcclxuXHQvLyBpZiAoZm9ybUVycm9yKSB7XHJcblx0Ly8gXHRmb3JtRXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0Ly8gfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtUmVtb3ZlRXJyb3IoZm9ybSkge1xyXG5cdGxldCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cdGlmIChpbnB1dHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGlucHV0cy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0bGV0IGlucHV0ID0gaW5wdXRzW2luZGV4XTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpKSB7XHJcblx0XHRcdFx0aW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cdFx0XHRcdGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwsINC10YHQu9C4INCyIGh0bWwg0LTQvtCx0LDQstC70LXQvdGLINCx0LvQvtC60Lgg0YEg0YHQvtC+0LHRidC10L3QuNC10Lwg0L7QsSDQvtGI0LjQsdC60LUgKC5mb3JtLWVycm9yKVxyXG5cdGxldCBmb3JtRXJyb3IgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtLW1lc3NhZ2UnKTtcclxuXHRpZiAoZm9ybUVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBmb3JtRXJyb3IubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGNvbnN0IGVycm9yID0gZm9ybUVycm9yW2luZGV4XTtcclxuXHRcdFx0ZXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbWFpbFRlc3Qoc2VsZWN0b3IpIHtcclxuXHRyZXR1cm4gIS9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7Miw4fSkrJC8udGVzdChzZWxlY3Rvci52YWx1ZSk7XHJcbn1cclxuXHJcbmNvbnN0IHRleHRJbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hlY2snKTsgICBcclxudGV4dElucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHQvLyDQtdGB0LvQuCDQt9C90LDRh9C10L3QuNC1INC60LvQsNCy0LjRiNC4KGUua2V5KSDQvdC1INGB0L7QvtGC0LLQtdGC0YHRgtCy0YPQtdGCKG1hdGNoKSDQutC40YDQuNC70LvQuNGG0LUsINC/0L7Qu9C1INC90LUg0LfQsNC/0L7Qu9C90Y/QtdGC0YHRj1xyXG5cdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYgKGUua2V5Lm1hdGNoKC9bXtCwLdGP0ZEgMC05XS9pZykpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdC8vINC10YHQu9C4INC/0YDQuCDQsNCy0YLQvtC30LDQv9C+0LvQvdC10L3QuNC4INCy0YvQsdGA0LDQvdC+INGB0LvQvtCy0L4g0L3QtSDQutC40YDQuNC70LvQuNGG0LXQuSwg0YHRgtGA0L7QutCwINC+0YfQuNGB0YLQuNGC0YHRj1xyXG5cdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnZhbHVlPXRoaXMudmFsdWUucmVwbGFjZSgvW15cXNCwLdGP0ZEgMC05XS9pZyxcIlwiKTtcclxuXHR9KTtcclxufSk7Il19
