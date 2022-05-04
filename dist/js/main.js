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
//* Если есть слайдер в модальном окне - инициировать слайдеры в функции modalSlider и объявлять после создания окна

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
			cartLogic();

			// функцию модального окна запускать тут
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
  
	// catalogMore.addEventListener('click', (e) => {
	// 	//* +3 - добавлять по з карточки товара
	// 	prodQuantity = prodQuantity + addQuantity;
	// 	getProducts(prodQuantity);
	// 	if (prodQuantity >= dataLength) {
	// 		catalogMore.style.display = 'none';
	// 	} else {
	// 		catalogMore.style.display = 'block';
	// 	}
	// });

	//* работа корзины

	let price = 0;
	const miniCartList = document.querySelector('.mini-cart__list');
	const fullPrice = document.querySelector('.mini-cart__summ');
	const cartCount = document.querySelector('.cart__count');

	const priceWithoutSpaces = (str) => {
		return str.replace(/\s/g, '');
	};

	const plusFullPrice = (currentPrice) => {
		return price += currentPrice;
	};

	const minusFullPrice = (currentPrice) => {
		return price -= currentPrice;
	};
	  
	const printFullPrice = () => {
		fullPrice.textContent = `${normalPrice(price)} р`;
	};
	  
	const printQuantity = (num) => {
		cartCount.textContent = num;
	};

	const loadCartData = async (id = 1) => {
		let response = await fetch('../data/data.json');
		if (response.ok) {
			let data = await response.json();

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

					plusFullPrice(dataItem.price);
					printFullPrice();	
				}
			}

			const miniCartItem = document.querySelectorAll('.mini-cart__list .mini-cart__item');
					
			let num = miniCartItem.length;
		
			if (num > 0) {
			  cartCount.classList.add('cart__count--active');
			}
	
			printQuantity(num);

			miniCartItem.forEach(item => {
				item.addEventListener('click', (e) => {
					
					miniCartItem.forEach(btn => {
						if (!btn.contains(e.target)) {
							btn.classList.remove('mini-cart__item--active');
						}
					});
	
					item.classList.add('mini-cart__item--active');
				});
			});

		}  else {
			console.log(('error', response.status));
		}

	};

	const cartLogic = () => {
		const productBtn = document.querySelectorAll('.add-to-cart-btn');

		productBtn.forEach(el => {
			el.addEventListener('click', (e) => {
				const id = e.currentTarget.dataset.id;
				loadCartData(id);
				document.querySelector('.cart').classList.remove('cart--inactive');
				e.currentTarget.classList.add('catalog-item__btn--disabled');
			});
		});

		miniCartList.addEventListener('click', (e) => {
			if (e.target.classList.contains('mini-cart__delete')) {
				const self = e.target;
				const parent = self.closest('.mini-cart__item');
				const price = parseInt(priceWithoutSpaces(parent.querySelector('.mini-cart__price').textContent));
				const id = parent.dataset.id;
		
				document.querySelector(`.add-to-cart-btn[data-id="${id}"]`).classList.remove('catalog-item__btn--disabled');
		
				parent.remove();
		
				minusFullPrice(price);
				printFullPrice();
		
				let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;
		
				if (num == 0) {
					cartCount.classList.remove('cart__count--active');
					miniCart.classList.remove('mini-cart--open');
					document.querySelector('.cart').classList.add('cart--inactive');
				}
		
				printQuantity(num);
			}
		});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJhY2NvcmRpb24uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImNyZWF0ZS1jYXJkcy5qcyIsImZvcm0uanMiLCJsYXp5LmpzIiwibWFwLmpzIiwibWFzay10ZWwuanMiLCJtaW5pLWNhcnQuanMiLCJtb2RhbC5qcyIsInF1aXouanMiLCJyYW5nZS1zbGlkZXIuanMiLCJzaXplcy5qcyIsInNsaWRlci5qcyIsInZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGZvckVhY2ggUG9seWZpbGxcclxuaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbn1cclxuXHJcbi8vIGxvY2sgc2Nyb2xsXHJcbmZ1bmN0aW9uIGRpc2FibGVTY3JvbGwoKSB7XHJcblx0bGV0IHBhZ2VQb3NpdGlvbiA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnc2Nyb2xsLWxvY2snKTtcclxuXHRkb2N1bWVudC5ib2R5LmRhdGFzZXQucG9zaXRpb24gPSBwYWdlUG9zaXRpb247XHJcblx0ZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAtcGFnZVBvc2l0aW9uICsgJ3B4JztcclxufVxyXG5cclxuZnVuY3Rpb24gZW5hYmxlU2Nyb2xsKCkge1xyXG5cdGxldCBwYWdlUG9zaXRpb24gPSBwYXJzZUludChkb2N1bWVudC5ib2R5LmRhdGFzZXQucG9zaXRpb24sIDEwKTtcclxuXHRkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xyXG5cdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsLWxvY2snKTtcclxuXHR3aW5kb3cuc2Nyb2xsKHsgdG9wOiBwYWdlUG9zaXRpb24sIGxlZnQ6IDAgfSk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtcG9zaXRpb24nKTtcclxufVxyXG5cclxuXHJcbmNvbnN0IGNsZWFySW5wdXRzID0gKHNlbGVjdG9yKSA9PiB7XHJcblx0c2VsZWN0b3IuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdGl0ZW0udmFsdWUgPSAnJztcclxuXHR9KTtcclxuXHRsZXQgY2hlY2tib3hlcyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jdXN0b20tY2hlY2tib3hfX2lucHV0Jyk7XHJcblx0aWYgKGNoZWNrYm94ZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNoZWNrYm94ZXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGNvbnN0IGNoZWNrYm94ID0gY2hlY2tib3hlc1tpbmRleF07XHJcblx0XHRcdGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG4vLyB3aW5kb3cubm9aZW5zbW9vdGggPSB0cnVlOyIsImNvbnN0IGFjY29yZGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uJyk7XG5cbmFjY29yZGlvbnMuZm9yRWFjaChlbCA9PiB7XG5cdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRjb25zdCBzZWxmID0gZS5jdXJyZW50VGFyZ2V0O1xuXHRcdGNvbnN0IGNvbnRyb2wgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRyb2wnKTtcblx0XHRjb25zdCBjb250ZW50ID0gc2VsZi5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50Jyk7XG5cblx0XHQvLyog0LXRgdC70Lgg0L3QtdC+0LHRhdC+0LTQuNC80L4g0YfRgtC+0LHRiyDQstGB0LUg0LHQu9C+0LrQuCDQt9Cw0LrRgNGL0LLQsNC70LjRgdGMINC/0YDQuCDQvtGC0LrRgNGL0YLQuNC4INCx0LvQvtC60LAgLSDQv9GA0L7RgdGC0L4g0YDQsNGB0LrQvtC80LXQvdGC0LjRgNC+0LLQsNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwhXG5cdFx0Ly8gYWNjb3JkaW9ucy5mb3JFYWNoKGJ0biA9PiB7XG5cdFx0Ly8gXHRjb25zdCBjb250cm9sID0gYnRuLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRyb2wnKTtcblx0XHQvLyBcdGNvbnN0IGNvbnRlbnQgPSBidG4ucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udGVudCcpO1xuXHRcdC8vIFx0aWYgKGJ0biAhPT0gc2VsZikge1xuXHRcdC8vIFx0XHRidG4uY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuXHRcdC8vIFx0XHRjb250cm9sLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcblx0XHQvLyBcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cdFx0Ly8gXHRcdGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcblx0XHQvLyBcdH1cblx0XHQvLyB9KTtcblxuXHRcdHNlbGYuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xuXG5cdFx0Ly8g0LXRgdC70Lgg0L7RgtC60YDRi9GCINCw0LrQutC+0YDQtNC10L7QvVxuXHRcdGlmIChzZWxmLmNsYXNzTGlzdC5jb250YWlucygnb3BlbicpKSB7XG5cdFx0XHRjb250cm9sLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xuXHRcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5zdHlsZS5tYXhIZWlnaHQgPSBjb250ZW50LnNjcm9sbEhlaWdodCArICdweCc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cdFx0XHRjb250ZW50LnN0eWxlLm1heEhlaWdodCA9IG51bGw7XG5cdFx0fVxuXHR9KTtcbn0pOyIsImxldCBtZW51Qm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51Jyk7XHJcbmxldCBtZW51SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51X19saW5rJyk7XHJcbmxldCBoYW1idXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyJyk7XHJcblxyXG5oYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7ICAgIFxyXG4gICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgbWVudUJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG4gICAgaWYgKGhhbWJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgaGFtYnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQt9Cw0LrRgNGL0YLRjCDQvdCw0LLQuNCz0LDRhtC40Y4nKTtcclxuICAgICAgICBkaXNhYmxlU2Nyb2xsKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbWJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0L3QsNCy0LjQs9Cw0YbQuNGOJyk7XHJcbiAgICAgICAgZW5hYmxlU2Nyb2xsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgbWVudUJvZHkuZm9jdXMoKTtcclxuICAgIH0sIDYwMCk7XHJcbn0pO1xyXG5cclxubWVudUl0ZW0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBtZW51Qm9keS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgaGFtYnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQvtGC0LrRgNGL0YLRjCDQvdCw0LLQuNCz0LDRhtC40Y4nKTtcclxuICAgICAgICAgICAgZW5hYmxlU2Nyb2xsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSlcclxuXHJcbmxldCBmaWx0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fZmlsdGVycycpO1xyXG5sZXQgZmlsdGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2J0bicpO1xyXG5sZXQgZmlsdGVyQnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2ctaGFtYnVyZ2VyJyk7XHJcblxyXG5maWx0ZXJCdXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7ICAgIFxyXG4gICAgZmlsdGVyQnVyZ2VyLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgZmlsdGVyLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgaWYgKGZpbHRlckJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgZmlsdGVyQnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQt9Cw0LrRgNGL0YLRjCDRhNC40LvRjNGC0YAnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmlsdGVyQnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQvtGC0LrRgNGL0YLRjCDRhNC40LvRjNGC0YAnKTtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGZpbHRlci5mb2N1cygpO1xyXG4gICAgfSwgNjAwKTtcclxufSk7XHJcblxyXG5maWx0ZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKGZpbHRlckJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgZmlsdGVyQnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINGE0LjQu9GM0YLRgCcpOyBcclxuICAgIH1cclxufSlcclxuIiwiY29uc3QgY2hlY2tCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2F0YWxvZy1jaGVja2JveF9fbGFiZWwsIC5jdXN0b20tY2hlY2tib3hfX3RleHQnKTtcclxuXHJcbmNoZWNrQm94LmZvckVhY2goaXRlbSA9PiB7XHJcblx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuXHRcdGlmIChlLmNvZGUgPT09ICdFbnRlcicgfHwgZS5jb2RlID09PSAnTnVtcGFkRW50ZXInIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xyXG5cdFx0XHRsZXQgY2hlY2sgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRpZiAoY2hlY2sudHlwZSA9PSAncmFkaW8nKSB7XHJcblx0XHRcdFx0aWYgKGNoZWNrLmNoZWNrZWQgPT09IGZhbHNlKSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHR9IFxyXG5cdFx0XHR9IGVsc2UgaWYgKGNoZWNrLnR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG5cdFx0XHRcdGlmIChjaGVjay5jaGVja2VkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fSk7XHJcbn0pOyIsIi8vKiDQldGB0LvQuCDQtdGB0YLRjCDRgdC70LDQudC00LXRgCDQsiDQvNC+0LTQsNC70YzQvdC+0Lwg0L7QutC90LUgLSDQuNC90LjRhtC40LjRgNC+0LLQsNGC0Ywg0YHQu9Cw0LnQtNC10YDRiyDQsiDRhNGD0L3QutGG0LjQuCBtb2RhbFNsaWRlciDQuCDQvtCx0YrRj9Cy0LvRj9GC0Ywg0L/QvtGB0LvQtSDRgdC+0LfQtNCw0L3QuNGPINC+0LrQvdCwXHJcblxyXG5jb25zdCBjYXRhbG9nUHJvZHVjdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fd3JhcCcpO1xyXG5jb25zdCBjYXRhbG9nTW9yZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19tb3JlJyk7XHJcbmNvbnN0IHByb2RNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1wcm9kX19jb250ZW50Jyk7XHJcbmNvbnN0IHByb2RNb2RhbFNsaWRlciA9IHByb2RNb2RhbC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLW1haW5fX3dyYXBwZXInKTtcclxuY29uc3QgcHJvZE1vZGFsUHJldmlldyA9IHByb2RNb2RhbC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLW1pbl9fd3JhcHBlcicpO1xyXG5jb25zdCBwcm9kTW9kYWxJbmZvID0gcHJvZE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1pbmZvX193cmFwcGVyJyk7XHJcbmNvbnN0IHByb2RNb2RhbERlc2NyID0gcHJvZE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kZXNjcl9fdGV4dCcpO1xyXG5jb25zdCBwcm9kTW9kYWxDaGFycyA9IHByb2RNb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2hhcl9faXRlbXMnKTtcclxuY29uc3QgcHJvZE1vZGFsVmlkZW8gPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLXZpZGVvJyk7XHJcbmxldCBwcm9kUXVhbnRpdHkgPSA2OyAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQutCw0YDRgtC+0YfQtdC6INC90LAg0YHRgtGA0LDQvdC40YbQtSDQuNC30L3QsNGH0LDQu9GM0L3QvlxyXG5sZXQgYWRkUXVhbnRpdHkgPSAzOyAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQtNC+0LHQsNCy0LvRj9C10LzRi9GFINC60LDRgNGC0L7Rh9C10Log0L/RgNC4INC60LvQuNC60LUg0L3QsCDQutC90L7Qv9C60YMgXCLQn9C+0LrQsNC30LDRgtGMINC10YnRkVwiXHJcbmxldCBkYXRhTGVuZ3RoID0gbnVsbDtcclxuXHJcbi8vINGE0YPQvdC60YbQuNGPINCy0YHRgtCw0LLQu9GP0LXRgiDQv9GA0L7QsdC10Lsg0LzQtdC20LTRgyDRgNCw0LfRgNGP0LTQsNC80LhcclxuY29uc3Qgbm9ybWFsUHJpY2UgPSAoc3RyKSA9PiB7XHJcblx0cmV0dXJuIFN0cmluZyhzdHIpLnJlcGxhY2UoLyhcXGQpKD89KFxcZFxcZFxcZCkrKFteXFxkXXwkKSkvZywgJyQxICcpO1xyXG59O1xyXG5cclxuLy8g0YTRg9C90LrRhtC40Y8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0YHQu9Cw0LnQtNC10YDQsFxyXG5jb25zdCBtb2RhbFNsaWRlciA9ICgpID0+IHtcclxuXHRjb25zdCBtaW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1pbicsIHtcclxuXHRcdGdyYWJDdXJzb3I6IHRydWUsXHJcblx0XHRzbGlkZXNQZXJWaWV3OiA2LFxyXG5cdFx0aW5pdGlhbFNsaWRlOiAwLFxyXG5cdFx0c3BhY2VCZXR3ZWVuOiAyMCxcclxuXHRcdGZyZWVNb2RlOiB0cnVlLFxyXG5cdH0pO1xyXG5cdFxyXG5cdGNvbnN0IG1haW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1haW4nLCB7XHJcblx0XHRncmFiQ3Vyc29yOiB0cnVlLFxyXG5cdFx0c3BhY2VCZXR3ZWVuOiAyMCxcclxuXHRcdHNsaWRlc1BlclZpZXc6IDEsXHJcblx0XHRpbml0aWFsU2xpZGU6IDAsXHJcblx0XHRzaW11bGF0ZVRvdWNoOiBmYWxzZSxcclxuXHRcdGVmZmVjdDogJ2ZhZGUnLFxyXG5cdFx0ZmFkZUVmZmVjdDoge1xyXG5cdFx0ICBjcm9zc0ZhZGU6IHRydWVcclxuXHRcdH0sXHJcblx0XHR0aHVtYnM6IHtcclxuXHRcdFx0c3dpcGVyOiBtaW5TbGlkZXIsXHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG5pZiAoY2F0YWxvZ1Byb2R1Y3RzKSB7XHJcblx0Ly8qINGE0YPQvdC60YbQuNGPINGB0L7Qt9C00LDQvdC40Y8g0LrQsNGA0YLQvtGH0LXQuiDQsiDQutCw0YLQsNC70L7Qs9C1INGC0L7QstCw0YDQvtCyXHJcblx0Y29uc3QgbG9hZFByb2R1Y3RzID0gYXN5bmMgKHF1YW50aXR5ID0gNSkgPT4ge1xyXG5cdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy4uL2RhdGEvZGF0YS5qc29uJyk7XHJcblx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHRcdFx0bGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG5cdFx0XHRkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcclxuXHRcdFx0Y2F0YWxvZ1Byb2R1Y3RzLmlubmVySFRNTCA9ICcnO1xyXG5cclxuXHRcdFx0Ly8g0YTQvtGA0LzQuNGA0YPQtdC8INGB0LXRgtC60YMg0LjQtyA2INC60LDRgNGC0L7Rh9C10Log0YLQvtCy0LDRgNC+0LIg0L3QsCDRgdGC0YDQsNC90LjRhtC1ICg2IC0g0Y3RgtC+INGH0LjRgdC70L4gcHJvZFF1YW50aXR5KVxyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChpIDwgcHJvZFF1YW50aXR5KSB7XHJcblx0XHRcdFx0bGV0IGl0ZW0gPSBkYXRhW2ldO1xyXG5cdFxyXG5cdFx0XHRcdFx0Y2F0YWxvZ1Byb2R1Y3RzLmlubmVySFRNTCArPSBgXHJcblx0XHRcdFx0XHRcdDxhcnRpY2xlIGNsYXNzPVwiY2F0YWxvZy1pdGVtXCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9faW1nXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7aXRlbS5tYWluSW1hZ2V9XCIgbG9hZGluZz1cImxhenlcIiBhbHQ9XCIke2l0ZW0udGl0bGV9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0YWxvZy1pdGVtX19idG5zXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgbW9kYWwtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0J/QvtC60LDQt9Cw0YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRgtC+0LLQsNGA0LVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3ZnPjx1c2UgeGxpbms6aHJlZj1cImltZy9zcHJpdGUuc3ZnI3Nob3dcIj48L3VzZT48L3N2Zz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgYWRkLXRvLWNhcnQtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0JTQvtCx0LDQstC40YLRjCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdGDXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHN2Zz48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ByaXRlLnN2ZyNjYXJ0XCI+PC91c2U+PC9zdmc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwiY2F0YWxvZy1pdGVtX190aXRsZVwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2F0YWxvZy1pdGVtX19wcmljZVwiPiR7bm9ybWFsUHJpY2UoaXRlbS5wcmljZSl9INGAPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2FydGljbGU+XHJcblx0XHRcdFx0XHRgO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjYXJ0TG9naWMoKTtcclxuXHJcblx0XHRcdC8vINGE0YPQvdC60YbQuNGOINC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINC30LDQv9GD0YHQutCw0YLRjCDRgtGD0YJcclxuXHRcdFx0YmluZE1vZGFsKCcubW9kYWwtYnRuJywgJy5tb2RhbC1wcm9kJywgbG9hZE1vZGFsRGF0YSk7XHJcblx0XHRcdC8vVE9ETyAtINC00L7QsdCw0LLQuNGC0Ywg0LDRgNCz0YPQvNC10L3RgiBmdW5jINCyINGE0YPQvdC60YbQuNGOIGJpbmRNb2RhbChidG5TZWxlY3RvciwgbW9kYWxTZWxlY3RvciwgZnVuYywgYW5pbWF0ZT0nZmFkZScsIHNwZWVkPTMwMCwpXHJcblx0XHRcdC8vVE9ETyAtINCy0YHRgtCw0LLQuNGC0Ywg0Y3RgtC+0YIg0LrQvtC0INCyINGE0YPQvdC60YbQuNGOIGJpbmRNb2RhbCAo0LzQvtC00LDQu9GM0L3QvtC1INC+0LrQvdC+KSDQsiDQvNC+0LzQtdC90YIg0L7RgtC60YDRi9GC0LjRjyDQvtC60L3QsCDQv9C+0YHQu9C1INC/0L7Qu9GD0YfQtdC90LjRjyBsYXN0Rm9jdXNcclxuXHRcdFx0Ly8g0L/QvtC70YPRh9C10L3QuNC1IGlkINC60L3QvtC/0LrQuFxyXG5cdFx0XHQvLyBpZiAobW9kYWxDb250ZW50LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtcHJvZCcpKSB7XHJcblx0XHRcdC8vIFx0bGV0IG9wZW5CdG5JZCA9IGxhc3RGb2N1cy5kYXRhc2V0LmlkO1xyXG5cdFx0XHQvLyBcdGZ1bmMob3BlbkJ0bklkKTtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0Ly8g0L/QviDQutC70LjQutGDINC90LAg0LrQvdC+0L/QutGDIFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0ZFcIiDQtNC+0LHQsNCy0LvRj9C10Lwg0L/QviAzINC60LDRgNGC0L7Rh9C60Lgg0YLQvtCy0LDRgNCwICgzIC0g0Y3RgtC+INGH0LjRgdC70L4gYWRkUXVhbnRpdHkpIFxyXG5cdFx0XHRjYXRhbG9nTW9yZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcdFx0bGV0IGEgPSBwcm9kUXVhbnRpdHk7XHJcblx0XHRcdFx0cHJvZFF1YW50aXR5ID0gcHJvZFF1YW50aXR5ICsgYWRkUXVhbnRpdHk7XHJcblx0XHRcdFx0Zm9yIChsZXQgaSA9IGE7IGkgPCBkYXRhTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChpIDwgcHJvZFF1YW50aXR5KSB7XHJcblx0XHRcdFx0XHRsZXQgaXRlbSA9IGRhdGFbaV07XHJcblx0XHRcdFx0XHRcdGNhdGFsb2dQcm9kdWN0cy5pbm5lckhUTUwgKz0gYFxyXG5cdFx0XHRcdFx0XHRcdDxhcnRpY2xlIGNsYXNzPVwiY2F0YWxvZy1pdGVtXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0YWxvZy1pdGVtX19pbWdcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke2l0ZW0ubWFpbkltYWdlfVwiIGxvYWRpbmc9XCJsYXp5XCIgYWx0PVwiJHtpdGVtLnRpdGxlfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0YWxvZy1pdGVtX19idG5zXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuIGJ0bi1yZXNldCBtb2RhbC1idG5cIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiIGFyaWEtbGFiZWw9XCLQn9C+0LrQsNC30LDRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INGC0L7QstCw0YDQtVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHN2Zz48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ByaXRlLnN2ZyNzaG93XCI+PC91c2U+PC9zdmc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuIGJ0bi1yZXNldCBhZGQtdG8tY2FydC1idG5cIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiIGFyaWEtbGFiZWw9XCLQlNC+0LHQsNCy0LjRgtGMINGC0L7QstCw0YAg0LIg0LrQvtGA0LfQuNC90YNcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxzdmc+PHVzZSB4bGluazpocmVmPVwiaW1nL3Nwcml0ZS5zdmcjY2FydFwiPjwvdXNlPjwvc3ZnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwiY2F0YWxvZy1pdGVtX190aXRsZVwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX3ByaWNlXCI+JHtub3JtYWxQcmljZShpdGVtLnByaWNlKX0g0YA8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0PC9hcnRpY2xlPlxyXG5cdFx0XHRcdFx0XHRgO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocHJvZFF1YW50aXR5ID49IGRhdGFMZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNhdGFsb2dNb3JlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNhdGFsb2dNb3JlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXJ0TG9naWMoKTtcclxuXHRcdFx0XHRiaW5kTW9kYWwoJy5tb2RhbC1idG4nLCAnLm1vZGFsLXByb2QnLCBsb2FkTW9kYWxEYXRhKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coKCdlcnJvcicsIHJlc3BvbnNlLnN0YXR1cykpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdGxvYWRQcm9kdWN0cygpO1xyXG5cclxuXHQvLyog0YTRg9C90LrRhtC40Y8g0YHQvtC30LTQsNC90LjRjyDQvtC60L3QsCDRgtC+0LLQsNGA0LBcclxuXHRjb25zdCBsb2FkTW9kYWxEYXRhID0gYXN5bmMgKGlkID0gMSkgPT4ge1xyXG5cdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy4uL2RhdGEvZGF0YS5qc29uJyk7XHJcblx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHRcdFx0bGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblx0XHRcdC8vINC+0YfQuNGJ0LDQtdC8INCx0LvQvtC60LhcclxuXHRcdFx0cHJvZE1vZGFsU2xpZGVyLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxQcmV2aWV3LmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxJbmZvLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxEZXNjci50ZXh0Q29udGVudCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxDaGFycy5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsVmlkZW8uaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdHByb2RNb2RhbFZpZGVvLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBkYXRhSXRlbSBvZiBkYXRhKSB7XHJcblx0XHRcdFx0aWYgKGRhdGFJdGVtLmlkID09IGlkKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vINCh0LvQsNC50LTQtdGAINGBINGE0L7RgtC+INGC0L7QstCw0YDQsFxyXG5cdFx0XHRcdFx0Y29uc3QgcHJldmlldyA9IGRhdGFJdGVtLmdhbGxlcnkubWFwKChpbWFnZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYFxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzbGlkZXItbWluX19pdGVtIHN3aXBlci1zbGlkZVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke2ltYWdlfVwiIGFsdD1cItC40LfQvtCx0YDQsNC20LXQvdC40LVcIj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0YDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Y29uc3Qgc2xpZGVzID0gZGF0YUl0ZW0uZ2FsbGVyeS5tYXAoKGltYWdlKSA9PiB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBgXHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNsaWRlci1tYWluX19pdGVtIHN3aXBlci1zbGlkZVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke2ltYWdlfVwiIGFsdD1cItC40LfQvtCx0YDQsNC20LXQvdC40LVcIj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0YDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHByb2RNb2RhbFByZXZpZXcuaW5uZXJIVE1MID0gcHJldmlldy5qb2luKCcnKTtcclxuXHRcdFx0XHRcdHByb2RNb2RhbFNsaWRlci5pbm5lckhUTUwgPSBzbGlkZXMuam9pbignJyk7XHJcblxyXG5cdFx0XHRcdFx0Ly8g0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0YLQvtCy0LDRgNC1XHJcblx0XHRcdFx0XHRjb25zdCBzaXplcyA9IGRhdGFJdGVtLnNpemVzLm1hcCgoc2l6ZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYFxyXG5cdFx0XHRcdFx0XHRcdDxsaSBjbGFzcz1cIm1vZGFsLWluZm9fX2l0ZW0tc2l6ZVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImJ0bi1yZXNldCBtb2RhbC1pbmZvX19zaXplXCI+JHtzaXplfTwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRwcm9kTW9kYWxJbmZvLmlubmVySFRNTCA9IGBcclxuXHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwibW9kYWwtaW5mb19fdGl0bGVcIj4ke2RhdGFJdGVtLnRpdGxlfTwvaDM+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1pbmZvX19yYXRlXCI+XHJcblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJpbWcvc3Rhci5zdmdcIiBhbHQ9XCLQoNC10LnRgtC40L3QsyA1INC40LcgNVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaW1nL3N0YXIuc3ZnXCIgYWx0PVwiXCI+XHJcblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJpbWcvc3Rhci5zdmdcIiBhbHQ9XCJcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cImltZy9zdGFyLnN2Z1wiIGFsdD1cIlwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaW1nL3N0YXIuc3ZnXCIgYWx0PVwiXCI+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtaW5mb19fc2l6ZXNcIj5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm1vZGFsLWluZm9fX3N1YnRpdGxlXCI+0JLRi9Cx0LXRgNC40YLQtSDRgNCw0LfQvNC10YA8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzPVwibW9kYWwtaW5mb19fc2l6ZXMtbGlzdCBsaXN0LXJlc2V0XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQke3NpemVzLmpvaW4oJycpfVxyXG5cdFx0XHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtaW5mb19fcHJpY2VcIj5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm1vZGFsLWluZm9fX2N1cnJlbnQtcHJpY2VcIj4ke2RhdGFJdGVtLnByaWNlfSDRgDwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm1vZGFsLWluZm9fX29sZC1wcmljZVwiPiR7ZGF0YUl0ZW0ub2xkUHJpY2UgPyBkYXRhSXRlbS5vbGRQcmljZSArICcg0YAnIDogJyd9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdCAgYDtcclxuXHJcblx0XHRcdFx0XHQvLyDQntC/0LjRgdCw0L3QuNC1XHJcblx0XHRcdFx0XHRwcm9kTW9kYWxEZXNjci50ZXh0Q29udGVudCA9IGRhdGFJdGVtLmRlc2NyaXB0aW9uO1xyXG5cclxuXHRcdFx0XHRcdC8vINCl0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuXHRcdFx0XHRcdGxldCBjaGFyc0l0ZW1zID0gJyc7XHJcblxyXG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoZGF0YUl0ZW0uY2hhcnMpLmZvckVhY2goZnVuY3Rpb24gZWFjaEtleShrZXkpIHtcclxuXHRcdFx0XHRcdFx0Y2hhcnNJdGVtcyArPSBgPHAgY2xhc3M9XCJtb2RhbC1jaGFyX19pdGVtXCI+JHtrZXl9OiAke2RhdGFJdGVtLmNoYXJzW2tleV19PC9wPmBcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cHJvZE1vZGFsQ2hhcnMuaW5uZXJIVE1MID0gY2hhcnNJdGVtcztcclxuXHJcblx0XHRcdFx0XHQvLyDQktC40LTQtdC+XHJcblx0XHRcdFx0XHRpZiAoZGF0YUl0ZW0udmlkZW8pIHtcclxuXHRcdFx0XHRcdFx0cHJvZE1vZGFsVmlkZW8uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHRcdFx0XHRcdHByb2RNb2RhbFZpZGVvLmlubmVySFRNTCA9IGBcclxuXHRcdFx0XHRcdFx0XHQ8aWZyYW1lIHNyYz1cIiR7ZGF0YUl0ZW0udmlkZW99XCJcclxuXHRcdFx0XHRcdFx0XHRhbGxvdz1cImFjY2VsZXJvbWV0ZXI7IGF1dG9wbGF5OyBjbGlwYm9hcmQtd3JpdGU7IGVuY3J5cHRlZC1tZWRpYTsgZ3lyb3Njb3BlOyBwaWN0dXJlLWluLXBpY3R1cmVcIlxyXG5cdFx0XHRcdFx0XHRcdGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cclxuXHRcdFx0XHRcdFx0YDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1vZGFsU2xpZGVyKCk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coKCdlcnJvcicsIHJlc3BvbnNlLnN0YXR1cykpO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG4gIFxyXG5cdC8vIGNhdGFsb2dNb3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHQvLyBcdC8vKiArMyAtINC00L7QsdCw0LLQu9GP0YLRjCDQv9C+INC3INC60LDRgNGC0L7Rh9C60Lgg0YLQvtCy0LDRgNCwXHJcblx0Ly8gXHRwcm9kUXVhbnRpdHkgPSBwcm9kUXVhbnRpdHkgKyBhZGRRdWFudGl0eTtcclxuXHQvLyBcdGdldFByb2R1Y3RzKHByb2RRdWFudGl0eSk7XHJcblx0Ly8gXHRpZiAocHJvZFF1YW50aXR5ID49IGRhdGFMZW5ndGgpIHtcclxuXHQvLyBcdFx0Y2F0YWxvZ01vcmUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHQvLyBcdH0gZWxzZSB7XHJcblx0Ly8gXHRcdGNhdGFsb2dNb3JlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0pO1xyXG5cclxuXHQvLyog0YDQsNCx0L7RgtCwINC60L7RgNC30LjQvdGLXHJcblxyXG5cdGxldCBwcmljZSA9IDA7XHJcblx0Y29uc3QgbWluaUNhcnRMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1pbmktY2FydF9fbGlzdCcpO1xyXG5cdGNvbnN0IGZ1bGxQcmljZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5taW5pLWNhcnRfX3N1bW0nKTtcclxuXHRjb25zdCBjYXJ0Q291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fY291bnQnKTtcclxuXHJcblx0Y29uc3QgcHJpY2VXaXRob3V0U3BhY2VzID0gKHN0cikgPT4ge1xyXG5cdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG5cdH07XHJcblxyXG5cdGNvbnN0IHBsdXNGdWxsUHJpY2UgPSAoY3VycmVudFByaWNlKSA9PiB7XHJcblx0XHRyZXR1cm4gcHJpY2UgKz0gY3VycmVudFByaWNlO1xyXG5cdH07XHJcblxyXG5cdGNvbnN0IG1pbnVzRnVsbFByaWNlID0gKGN1cnJlbnRQcmljZSkgPT4ge1xyXG5cdFx0cmV0dXJuIHByaWNlIC09IGN1cnJlbnRQcmljZTtcclxuXHR9O1xyXG5cdCAgXHJcblx0Y29uc3QgcHJpbnRGdWxsUHJpY2UgPSAoKSA9PiB7XHJcblx0XHRmdWxsUHJpY2UudGV4dENvbnRlbnQgPSBgJHtub3JtYWxQcmljZShwcmljZSl9INGAYDtcclxuXHR9O1xyXG5cdCAgXHJcblx0Y29uc3QgcHJpbnRRdWFudGl0eSA9IChudW0pID0+IHtcclxuXHRcdGNhcnRDb3VudC50ZXh0Q29udGVudCA9IG51bTtcclxuXHR9O1xyXG5cclxuXHRjb25zdCBsb2FkQ2FydERhdGEgPSBhc3luYyAoaWQgPSAxKSA9PiB7XHJcblx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnLi4vZGF0YS9kYXRhLmpzb24nKTtcclxuXHRcdGlmIChyZXNwb25zZS5vaykge1xyXG5cdFx0XHRsZXQgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcblx0XHRcdGZvciAobGV0IGRhdGFJdGVtIG9mIGRhdGEpIHtcclxuXHRcdFx0XHRpZiAoZGF0YUl0ZW0uaWQgPT0gaWQpIHtcclxuXHRcdFx0XHRcdG1pbmlDYXJ0TGlzdC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgXHJcblx0XHRcdFx0XHRcdDxsaSBjbGFzcz1cIm1pbmktY2FydF9faXRlbVwiIGRhdGEtaWQ9XCIke2RhdGFJdGVtLmlkfVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtaW5pLWNhcnRfX2ltYWdlXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7ZGF0YUl0ZW0ubWFpbkltYWdlfVwiIGFsdD1cIiR7ZGF0YUl0ZW0udGl0bGV9XCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWluaS1jYXJ0X19jb250ZW50XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8aDMgY2xhc3M9XCJtaW5pLWNhcnRfX3RpdGxlXCI+JHtkYXRhSXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJtaW5pLWNhcnRfX3ByaWNlXCI+JHtub3JtYWxQcmljZShkYXRhSXRlbS5wcmljZSl9IHA8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm1pbmktY2FydF9fZGVsZXRlIGJ0bi1yZXNldFwiPjwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0YCk7XHJcblxyXG5cdFx0XHRcdFx0cGx1c0Z1bGxQcmljZShkYXRhSXRlbS5wcmljZSk7XHJcblx0XHRcdFx0XHRwcmludEZ1bGxQcmljZSgpO1x0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBtaW5pQ2FydEl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWluaS1jYXJ0X19saXN0IC5taW5pLWNhcnRfX2l0ZW0nKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRsZXQgbnVtID0gbWluaUNhcnRJdGVtLmxlbmd0aDtcclxuXHRcdFxyXG5cdFx0XHRpZiAobnVtID4gMCkge1xyXG5cdFx0XHQgIGNhcnRDb3VudC5jbGFzc0xpc3QuYWRkKCdjYXJ0X19jb3VudC0tYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcclxuXHRcdFx0cHJpbnRRdWFudGl0eShudW0pO1xyXG5cclxuXHRcdFx0bWluaUNhcnRJdGVtLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdG1pbmlDYXJ0SXRlbS5mb3JFYWNoKGJ0biA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICghYnRuLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG5cdFx0XHRcdFx0XHRcdGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pLWNhcnRfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcclxuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnbWluaS1jYXJ0X19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fSAgZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCgnZXJyb3InLCByZXNwb25zZS5zdGF0dXMpKTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0Y29uc3QgY2FydExvZ2ljID0gKCkgPT4ge1xyXG5cdFx0Y29uc3QgcHJvZHVjdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hZGQtdG8tY2FydC1idG4nKTtcclxuXHJcblx0XHRwcm9kdWN0QnRuLmZvckVhY2goZWwgPT4ge1xyXG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgaWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuXHRcdFx0XHRsb2FkQ2FydERhdGEoaWQpO1xyXG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0JykuY2xhc3NMaXN0LnJlbW92ZSgnY2FydC0taW5hY3RpdmUnKTtcclxuXHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmFkZCgnY2F0YWxvZy1pdGVtX19idG4tLWRpc2FibGVkJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0bWluaUNhcnRMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdFx0aWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWluaS1jYXJ0X19kZWxldGUnKSkge1xyXG5cdFx0XHRcdGNvbnN0IHNlbGYgPSBlLnRhcmdldDtcclxuXHRcdFx0XHRjb25zdCBwYXJlbnQgPSBzZWxmLmNsb3Nlc3QoJy5taW5pLWNhcnRfX2l0ZW0nKTtcclxuXHRcdFx0XHRjb25zdCBwcmljZSA9IHBhcnNlSW50KHByaWNlV2l0aG91dFNwYWNlcyhwYXJlbnQucXVlcnlTZWxlY3RvcignLm1pbmktY2FydF9fcHJpY2UnKS50ZXh0Q29udGVudCkpO1xyXG5cdFx0XHRcdGNvbnN0IGlkID0gcGFyZW50LmRhdGFzZXQuaWQ7XHJcblx0XHRcclxuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuYWRkLXRvLWNhcnQtYnRuW2RhdGEtaWQ9XCIke2lkfVwiXWApLmNsYXNzTGlzdC5yZW1vdmUoJ2NhdGFsb2ctaXRlbV9fYnRuLS1kaXNhYmxlZCcpO1xyXG5cdFx0XHJcblx0XHRcdFx0cGFyZW50LnJlbW92ZSgpO1xyXG5cdFx0XHJcblx0XHRcdFx0bWludXNGdWxsUHJpY2UocHJpY2UpO1xyXG5cdFx0XHRcdHByaW50RnVsbFByaWNlKCk7XHJcblx0XHRcclxuXHRcdFx0XHRsZXQgbnVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1pbmktY2FydF9fbGlzdCAubWluaS1jYXJ0X19pdGVtJykubGVuZ3RoO1xyXG5cdFx0XHJcblx0XHRcdFx0aWYgKG51bSA9PSAwKSB7XHJcblx0XHRcdFx0XHRjYXJ0Q291bnQuY2xhc3NMaXN0LnJlbW92ZSgnY2FydF9fY291bnQtLWFjdGl2ZScpO1xyXG5cdFx0XHRcdFx0bWluaUNhcnQuY2xhc3NMaXN0LnJlbW92ZSgnbWluaS1jYXJ0LS1vcGVuJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydCcpLmNsYXNzTGlzdC5hZGQoJ2NhcnQtLWluYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHJcblx0XHRcdFx0cHJpbnRRdWFudGl0eShudW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9O1xyXG59IiwiY29uc3QgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJyk7XHJcblxyXG5pZiAoZm9ybXMubGVuZ3RoID4gMCkge1xyXG5cdGZvcm1zLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0bGV0IGZvcm0gPSBlLnRhcmdldDtcdFxyXG5cdFx0XHRsZXQgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG5cdFx0XHQvLyBsZXQgZmlsZU5hbWUgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX25hbWUnKTsgLy8g0LXRgdC70Lgg0LXRgdGC0Ywg0LfQsNCz0YDRg9C30LrQsCDRhNCw0LnQu9CwICjQsiDQsNGC0YDQuNCx0YPRgiDQtNC+0LHQsNCy0LjRgtGMIGZpbGUpXHJcblx0XHRcdGxldCB2YWxpZCA9IHZhbGlkSW5wdXQoZm9ybSk7XHJcblx0XHRcdGlmICh2YWxpZCA9PT0gMCAmJiB2YWxpZENoZWNrKGZvcm0pKSB7XHJcblx0XHRcdFx0Zm9ybVJlbW92ZUVycm9yKGZvcm0pO1xyXG5cclxuXHRcdFx0XHQvLyogPT09PT09PT0g0KHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RgtC/0YDQsNCy0LrQtSA9PT09PT09PT09PT1cclxuXHRcdFx0XHRsZXQgdGV4dE1lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLW1lc3NhZ2UnKTtcclxuXHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9CX0LDQs9GA0YPQt9C60LAuLi4nO1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyog0JfQsNC/0LjRgdGMINC90LDQt9Cy0LDQvdC40Y8g0YfQtdC60LHQvtC60YHQsCDQsiB2YWx1ZSDQuNC90L/Rg9GC0LAg0YfQtdC60LHQvtC60YHQsCAo0LXRgdC70Lgg0LXRgdGC0Ywg0YfQtdC60LHQvtC60YHRiylcclxuXHRcdFx0XHQvLyBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0XHRcdFx0Ly8gXHRpZiAoaW5wdXQudHlwZSA9PSAnY2hlY2tib3gnIHx8IGlucHV0LnR5cGUgPT0gJ3JhZGlvJykge1xyXG5cdFx0XHRcdC8vIFx0XHRpbnB1dC52YWx1ZSA9IGlucHV0Lm5leHRFbGVtZW50U2libGluZy50ZXh0Q29udGVudDtcclxuXHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHQvLyB9KTtcclxuXHJcblx0XHRcdFx0Ly8qPT09PT09PT09IEZvcm1EYXRhID09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0XHRjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShpdGVtKTtcclxuXHRcdFx0XHQvLyBmb3JtRGF0YS5hcHBlbmQoJ2ltYWdlJywgZm9ybUltYWdlLmZpbGVzWzBdKTtcclxuXHJcblx0XHRcdFx0Ly8qID09PT09INCf0YDQvtCy0LXRgNC60LAg0YTQvtGA0LzRiyA9PT09PVxyXG5cdFx0XHRcdC8vIGZvcih2YXIgcGFpciBvZiBmb3JtRGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdFx0XHQvLyBcdGNvbnNvbGUubG9nKHBhaXJbMF0rICcsICcrIHBhaXJbMV0pO1xyXG5cdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0Ly8qPT09PT09PT09INCe0YLQv9GA0LDQstC60LAg0LTQsNC90L3Ri9GFID09PT09PT09PT09PT09PVxyXG5cdFx0XHRcdGNvbnN0IHBvc3REYXRhID0gYXN5bmMgKHVybCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcblx0XHRcdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXHJcblx0XHRcdFx0XHRcdGJvZHk6IGRhdGFcclxuXHRcdFx0XHRcdH0pO1x0XHJcblx0XHRcdFx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHJcblx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7IC8vIGpzb24oKSAtINC00LvRjyDQstGL0LLQvtC00LAg0YHQvtC+0LHRidC10L3QuNGPO1xyXG5cdFx0XHRcdFx0XHRhbGVydChyZXN1bHQubWVzc2FnZSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpOyAvLyB0ZXh0KCkgLSDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1LCDQv9C+0LTQutC70Y7Rh9C40YLRjCBzZXJ2ZXIucGhwKVxyXG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXN1bHQpOyAvLyDRjdGC0L4g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KHQv9Cw0YHQuNCx0L4sINGB0LrQvtGA0L4g0LzRiyDRgSDQstCw0LzQuCDRgdCy0Y/QttC40LzRgdGPISc7XHJcblx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y2xlYXJJbnB1dHMoaW5wdXRzKTtcclxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sIDUwMDApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gYWxlcnQoXCLQntGI0LjQsdC60LBcIik7XHJcblx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHBvc3REYXRhKCcuLi9zZW5kbWFpbC5waHAnLCBmb3JtRGF0YSk7XHJcblx0XHRcdFx0Ly8gcG9zdERhdGEoJy4uL3NlcnZlci5waHAnLCBmb3JtRGF0YSkgLy8hINGD0LHRgNCw0YLRjCAo0Y3RgtC+INC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LUpXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59IiwiY29uc3QgbGF6eUltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZ1tkYXRhLXNyY10sc291cmNlW2RhdGEtc3Jjc2V0XScpO1xyXG5jb25zdCBsb2FkTWFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWQtbWFwJyk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoKSA9PiB7XHJcblx0bGV0IHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcclxuXHRpZiAobGF6eUltYWdlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRsYXp5SW1hZ2VzLmZvckVhY2goaW1nID0+IHtcclxuXHRcdFx0bGV0IGltZ09mZnNldCA9IGltZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBwYWdlWU9mZnNldDtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChzY3JvbGxZID49IGltZ09mZnNldCAtIDEwMDApIHtcclxuXHRcdFx0XHRpZiAoaW1nLmRhdGFzZXQuc3JjKSB7XHJcblx0XHRcdFx0XHRpbWcuc3JjID0gaW1nLmRhdGFzZXQuc3JjO1xyXG5cdFx0XHRcdFx0aW1nLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmMnKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGltZy5kYXRhc2V0LnNyY3NldCkge1xyXG5cdFx0XHRcdFx0aW1nLnNyY3NldCA9IGltZy5kYXRhc2V0LnNyY3NldDtcclxuXHRcdFx0XHRcdGltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3Jjc2V0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly9NYXBcclxuXHQvLyBpZiAoIWxvYWRNYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb2FkZWQnKSkge1xyXG5cdC8vIFx0bGV0IG1hcE9mZnNldCA9IGxvYWRNYXAub2Zmc2V0VG9wO1xyXG5cdC8vIFx0aWYgKHNjcm9sbFkgPj0gbWFwT2Zmc2V0IC0gMjAwKSB7XHJcblx0Ly8gXHRcdGNvbnN0IGxvYWRNYXBVcmwgPSBsb2FkTWFwLmRhdGFzZXQubWFwO1xyXG5cdC8vIFx0XHRpZiAobG9hZE1hcFVybCkge1xyXG5cdC8vIFx0XHRcdGxvYWRNYXAuaW5zZXJ0QWRqYWNlbnRIVE1MKFxyXG5cdC8vIFx0XHRcdFx0XCJiZWZvcmVlbmRcIixcclxuXHQvLyBcdFx0XHRcdGA8aWZyYW1lIHNyYz1cIiR7bG9hZE1hcFVybH1cIiBzdHlsZT1cImJvcmRlcjowO1wiIGFsbG93ZnVsbHNjcmVlbj1cIlwiIGxvYWRpbmc9XCJsYXp5XCI+PC9pZnJhbWU+YFxyXG5cdC8vIFx0XHRcdCk7XHJcblx0Ly8gXHRcdFx0bG9hZE1hcC5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKTtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxufSk7IiwibGV0IGZsYWcgPSAwO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKCl7XHJcblx0bGV0IHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcclxuXHRsZXQgbWFwT2Zmc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYXBcIikub2Zmc2V0VG9wO1xyXG5cclxuXHRpZiAoKHNjcm9sbFkgPj0gbWFwT2Zmc2V0IC0gNTAwKSAmJiAoZmxhZyA9PSAwKSkge1xyXG5cdFx0eW1hcHMucmVhZHkoaW5pdCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gaW5pdCgpe1xyXG5cdFx0XHRjb25zdCBteU1hcCA9IG5ldyB5bWFwcy5NYXAoXCJtYXBcIiwge1xyXG5cdFx0XHRcdGNlbnRlcjogWzU5LjgzMDQ4MSwgMzAuMTQyMTk3XSxcclxuXHRcdFx0XHR6b29tOiAxMCxcclxuXHRcdFx0XHRjb250cm9sczogW11cclxuXHRcdFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IG15UGxhY2VtYXJrICA9IG5ldyB5bWFwcy5QbGFjZW1hcmsoWzU5LjgzMDQ4MSwgMzAuMTQyMTk3XSwge30sIHtcclxuXHRcdFx0XHRpY29uTGF5b3V0OiAnZGVmYXVsdCNpbWFnZScsXHJcblx0XHRcdFx0aWNvbkltYWdlSHJlZjogJ2ltZy9wbGFjZW1hcmsucG5nJyxcclxuXHRcdFx0XHRpY29uSW1hZ2VTaXplOiBbMjUsIDM0XSxcclxuXHRcdFx0XHRpY29uSW1hZ2VPZmZzZXQ6IFstMTksIC00NF1cclxuXHRcdFx0fSk7XHRcdFx0XHJcblx0XHRcdG15TWFwLmdlb09iamVjdHMuYWRkKG15UGxhY2VtYXJrKTtcclxuXHRcdFx0bXlNYXAuYmVoYXZpb3JzLmRpc2FibGUoWydzY3JvbGxab29tJ10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZsYWcgPSAxO1xyXG5cdH1cclxufSk7IiwibGV0IHNldEN1cnNvclBvc2l0aW9uID0gKHBvcywgZWxlbSkgPT4ge1xyXG4gICAgZWxlbS5mb2N1cygpO1xyXG4gICAgaWYgKGVsZW0uc2V0U2VsZWN0aW9uUmFuZ2UpIHtcclxuICAgICAgICBlbGVtLnNldFNlbGVjdGlvblJhbmdlKHBvcywgcG9zKTtcclxuICAgIH0gZWxzZSBpZiAoZWxlbS5jcmVhdGVUZXh0UmFuZ2UpIHtcclxuICAgICAgICBsZXQgcmFuZ2UgPSBlbGVtLmNyZWF0ZVRleHRSYW5nZSgpO1xyXG5cclxuICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKTtcclxuICAgICAgICByYW5nZS5tb3ZlRW5kKCdjaGFyYWN0ZXInLCBwb3MpO1xyXG4gICAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgcG9zKTtcclxuICAgICAgICByYW5nZS5zZWxlY3QoKTtcclxuICAgIH1cclxufTtcclxuZnVuY3Rpb24gY3JlYXRlTWFzayhldmVudCkge1xyXG4gICAgbGV0IG1hdHJpeCA9ICcrNyAoX19fKSBfX18gX18gX18nLFxyXG4gICAgICAgIGkgPSAwLFxyXG4gICAgICAgIGRlZiA9IG1hdHJpeC5yZXBsYWNlKC9cXEQvZywgJycpLFxyXG4gICAgICAgIHZhbCA9IHRoaXMudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKTtcclxuICAgIGlmIChkZWYubGVuZ3RoID49IHZhbC5sZW5ndGgpIHtcclxuICAgICAgICB2YWwgPSBkZWY7XHJcbiAgICB9XHJcbiAgICB0aGlzLnZhbHVlID0gbWF0cml4LnJlcGxhY2UoLy4vZywgZnVuY3Rpb24oYSkge1xyXG4gICAgICAgIHJldHVybiAvW19cXGRdLy50ZXN0KGEpICYmIGkgPCB2YWwubGVuZ3RoID8gdmFsLmNoYXJBdChpKyspIDogaSA+PSB2YWwubGVuZ3RoID8gJycgOiBhO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0nYmx1cicpIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT0gMiB8fCB0aGlzLnZhbHVlLmxlbmd0aCA8IG1hdHJpeC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0na2V5dXAnIHx8IGV2ZW50LnR5cGUgPT09J21vdXNldXAnKSB7XHJcbiAgICAgICAgbGV0IGN1ciA9IHRoaXMuc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICAgICAgaWYgKGN1ciA9PSAnMCcpIHtcclxuICAgICAgICAgICAgc2V0Q3Vyc29yUG9zaXRpb24odGhpcy52YWx1ZS5sZW5ndGgsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0Q3Vyc29yUG9zaXRpb24odGhpcy52YWx1ZS5sZW5ndGgsIHRoaXMpOyAgICAgICAgXHJcbiAgICB9XHJcbn1cclxubGV0IHRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZWwnKTtcclxudGVsLmZvckVhY2goaW5wdXQgPT4ge1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBjcmVhdGVNYXNrKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgY3JlYXRlTWFzayk7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgY3JlYXRlTWFzayk7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGNyZWF0ZU1hc2spO1xyXG59KTsiLCJjb25zdCBjYXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQnKTtcclxuY29uc3QgbWluaUNhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWluaS1jYXJ0Jyk7XHJcbi8vIGNvbnN0IG1pbmlDYXJ0SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5taW5pLWNhcnRfX2l0ZW0nKTtcclxuXHJcbmNhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0bWluaUNhcnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWluaS1jYXJ0LS1vcGVuJyk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pLWNhcnQnKSAmJiAhZS50YXJnZXQuY2xvc2VzdCgnLm1pbmktY2FydCcpICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NhcnQnKSAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pLWNhcnRfX2RlbGV0ZScpKSB7XHJcblx0XHRtaW5pQ2FydC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pLWNhcnQtLW9wZW4nKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuLy8gbWluaUNhcnRJdGVtLmZvckVhY2goaXRlbSA9PiB7XHJcbi8vIFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcclxuLy8gXHRcdG1pbmlDYXJ0SXRlbS5mb3JFYWNoKGJ0biA9PiB7XHJcbi8vIFx0XHRcdGlmICghYnRuLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4vLyBcdFx0XHRcdGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pLWNhcnRfX2l0ZW0tLWFjdGl2ZScpO1xyXG4vLyBcdFx0XHR9XHJcbi8vIFx0XHR9KTtcclxuXHJcbi8vIFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ21pbmktY2FydF9faXRlbS0tYWN0aXZlJyk7XHJcbi8vIFx0fSk7XHJcbi8vIH0pOyIsIi8vPyDQn9Cw0YDQsNC80LXRgtGA0Ys6XHJcbi8vKiBidG5TZWxlY3RvciAtINC60L3QvtC/0LrQsCDQvtGC0LrRgNGL0YLQuNGPINC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwXHJcbi8vKiBtb2RhbFNlbGVjdG9yIC0g0LzQvtC00LDQu9GM0L3QvtC1INC+0LrQvdC+INCy0L3Rg9GC0YDQuCDRhNC+0L3QsCBtb2RhbFxyXG5cclxuLy8/INGN0YLQuCDQv9Cw0YDQstC80LXRgtGA0Ysg0LzQtdC90Y/RgtGMINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLCDQu9C40LHQviDRg9C60LDQt9GL0LLQsNGC0Ywg0LjRhSDQutCw0Log0LDRgNCz0YPQvNC10L3Rgiwg0LXRgdC70Lgg0L7QvdC4INGA0LDQt9C90YvQtSDQtNC70Y8g0YDQsNC30L3Ri9GFINC+0LrQvtC9XHJcbi8vKiBhbmltYXRlIC0g0LDQvdC40LzQsNGG0LjRjyDQv9GA0Lgg0L7RgtC60YDRi9GC0LjQuCDQvNC+0LTQsNC70YzQvdC+0LPQviDQvtC60L3QsCAo0LrQvtC90YLQtdC90YLQsCDQstC90YPRgtGA0Lgg0L7QsdC+0LvQvtGH0LrQuClcclxuLy8qIHNwZWVkIC0g0LLRgNC10LzRjyDQstGL0L/QvtC70L3QtdC90LjRjywg0YHRgtCw0LLQuNGC0YHRjyDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEgJHRyYW5zaXRpb24tdGltZVxyXG5cclxuLy9UT0RPINCU0L7QsdCw0LLQuNGC0Ywg0LrQu9Cw0YHRgdGLOlxyXG4vLyogZGF0YS1tb2RhbCAtINC00L7QsdCw0LLQuNGC0Ywg0LLRgdC10Lwg0LzQvtC00LDQu9GM0L3Ri9C8INC+0LrQvdCw0LwgKG1vZGFsLW5hbWUpICjQtdGB0LvQuCDQuNGFINC90LXRgdC60L7Qu9GM0LrQvilcclxuLy8qIGJsb2NrLWZpeCAtINC00L7QsdCw0LLQuNGC0Ywg0LrQu9Cw0YHRgSDQtNC70Y8g0LHQu9C+0LrQvtCyINGBIHBvc2l0aW9uOiBhYnNvbHV0ZSDQuNC70LggZml4ZWQgKNC00L7QsdCw0LLQuNGC0YHRjyBwYWRkaW5nKVxyXG4vLyogc21hbGwtZml4IC0g0LTQvtCx0LDQstC40YLRjCDQutC70LDRgdGBINC00LvRjyDQvNCw0LvQtdC90YzQutC40YUg0LHQu9C+0LrQvtCyINGBIHBvc2l0aW9uOiBhYnNvbHV0ZSDQuNC70LggZml4ZWQgKNC00L7QsdCw0LLQuNGC0YHRjyBtYXJnaW4pXHJcbi8vKiBkYXRhLWluc2lkZSAtINC00L7QsdCw0LLQuNGC0Ywg0LrQvdC+0L/QutCw0Lwg0LLQvdGD0YLRgNC4INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwLCDQutC+0YLQvtGA0YvQtSDQvtGC0LrRgNGL0LLQsNGO0YIg0YHQu9C10LTRg9GO0YnQtdC1INC80L7QtNCw0LvRjNC90L7QtSDQvtC60L3QviAo0YfRgtC+INCx0Ysg0YHQvtGF0YDQsNC90LjRgtGMINGE0L7QutGD0YEg0L3QsCDQutC90L7Qv9C60LUg0LLQvdC1INC+0LrQvdCwKVxyXG5cclxuYmluZE1vZGFsKCcuY2FydC1idG4nLCAnLm1vZGFsLWNhcnQnKTtcclxuXHJcbmxldCBsYXN0Rm9jdXMgPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIGJpbmRNb2RhbChidG5TZWxlY3RvciwgbW9kYWxTZWxlY3RvciwgZnVuYywgYW5pbWF0ZT0nZmFkZScsIHNwZWVkPTUwMCwpIHtcclxuICAgIGNvbnN0IG1vZGFsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChidG5TZWxlY3Rvcik7XHJcblx0Y29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtb3ZlcmxheScpO1xyXG5cdGNvbnN0IG1vZGFsQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IobW9kYWxTZWxlY3Rvcik7XHJcblx0Y29uc3QgbW9kYWxjbG9zZSA9IG1vZGFsQ29udGVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2Nsb3NlJyk7XHJcblx0Y29uc3Qgb3BlbldpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbF0nKTtcclxuXHRjb25zdCBmaXhCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYmxvY2stZml4ICcpO1xyXG5cdGNvbnN0IGZpeFNtYWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNtYWxsLWZpeCcpO1xyXG5cdGNvbnN0IHNwZWVkVGltZSA9IChzcGVlZCk7XHJcblx0Ly8gY29uc3QgbW9kYWxBbmltYXRpb24gPSBhbmltYXRlO1xyXG4gICAgY29uc3QgbW9kYWxTY3JvbGwgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGg7XHJcbiAgICBjb25zdCBmb2N1c0VsZW1lbnRzID0gW1xyXG5cdFx0J2FbaHJlZl0nLFxyXG5cdFx0J2lucHV0JyxcclxuXHRcdCdzZWxlY3QnLFxyXG5cdFx0J3RleHRhcmVhJyxcclxuXHRcdCdidXR0b24nLFxyXG5cdFx0J2lmcmFtZScsXHJcblx0XHQnW2NvbnRlbnRlZGl0YWJsZV0nLFxyXG5cdFx0J1t0YWJpbmRleF06bm90KFt0YWJpbmRleF49XCItXCJdKSdcclxuXHRdO1xyXG5cdFxyXG5cdGlmIChtb2RhbCkge1xyXG5cdFx0bW9kYWxCdG4uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0bGV0IHRhcmdldCA9IGUudGFyZ2V0XHJcblx0XHRcdFx0aWYgKHRhcmdldCkge1xyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0b3Blbk1vZGFsKHRhcmdldCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdFxyXG5cdFx0bW9kYWxjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0aWYgKG1vZGFsLmNsYXNzTGlzdC5jb250YWlucyhcImlzLW9wZW5cIikpIHtcclxuXHRcdFx0XHRjbG9zZU1vZGFsKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0XHRpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC1vdmVybGF5JykgJiYgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtb3BlblwiKSkge1xyXG5cdFx0XHRcdGNsb3NlTW9kYWwoKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG5cdFx0XHRpZiAoZS5jb2RlID09PSAnRXNjYXBlJyAmJiBtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1vcGVuXCIpKSB7XHJcblx0XHRcdFx0Y2xvc2VNb2RhbCgpO1xyXG5cdFx0XHR9XHJcblx0XHJcblx0XHRcdGlmIChlLmNvZGUgPT09ICdUYWInICYmIG1vZGFsLmNsYXNzTGlzdC5jb250YWlucyhcImlzLW9wZW5cIikpIHtcclxuXHRcdFx0XHRmb2N1c0NhdGNoKGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gb3Blbk1vZGFsKHRhcikge1xyXG5cdFx0aWYgKCF0YXIuY2xvc2VzdChgW2RhdGEtaW5zaWRlXWApKSB7XHJcblx0XHRcdGxhc3RGb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0b3BlbldpbmRvd3MuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJyk7XHJcblx0XHRcdGl0ZW0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG5cdFx0XHQvLyBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUtb3BlbicpO1xyXG5cdFx0XHQvLyBpdGVtLmNsYXNzTGlzdC5yZW1vdmUobW9kYWxBbmltYXRpb24pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKCFtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLW9wZW4nKSl7XHJcblx0XHRcdGRpc2FibGVTY3JvbGwoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobW9kYWxDb250ZW50LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtcHJvZCcpKSB7XHJcblx0XHRcdGxldCBvcGVuQnRuSWQgPSBsYXN0Rm9jdXMuZGF0YXNldC5pZDtcdFxyXG5cdFx0XHRmdW5jKG9wZW5CdG5JZCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bW9kYWwuY2xhc3NMaXN0LmFkZCgnaXMtb3BlbicpO1xyXG5cdFx0bW9kYWwuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgJHttb2RhbFNjcm9sbH1weGA7XHJcblx0XHRpZiAoZml4QmxvY2tzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zml4QmxvY2tzLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgJHttb2RhbFNjcm9sbH1weGA7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRpZiAoZml4U21hbGwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmaXhTbWFsbC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGl0ZW0uc3R5bGUubWFyZ2luUmlnaHQgPSBgJHttb2RhbFNjcm9sbH1weGA7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0bW9kYWxDb250ZW50LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuXHRcdG1vZGFsQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xyXG5cdFx0Ly8gbW9kYWxDb250ZW50LmNsYXNzTGlzdC5hZGQobW9kYWxBbmltYXRpb24pO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHQvLyBtb2RhbENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZS1vcGVuJyk7XHJcblx0XHRcdGZvY3VzVHJhcCgpO1xyXG5cdFx0fSwgc3BlZWRUaW1lKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XHJcblx0XHRvcGVuV2luZG93cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuXHRcdFx0aXRlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcblx0XHRcdC8vIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZS1vcGVuJyk7XHJcblx0XHRcdC8vIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShtb2RhbEFuaW1hdGlvbik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRlbmFibGVTY3JvbGwoKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGAwcHhgO1xyXG5cdFx0aWYgKGZpeEJsb2Nrcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZpeEJsb2Nrcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGl0ZW0uc3R5bGUucGFkZGluZ1JpZ2h0ID0gYDBweGA7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRpZiAoZml4U21hbGwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmaXhTbWFsbC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRcdGl0ZW0uc3R5bGUubWFyZ2luUmlnaHQgPSBgMHB4YDtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XHJcblx0XHRtb2RhbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XHJcblxyXG5cdFx0Zm9jdXNUcmFwKCk7XHJcblx0fVxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIGRpc2FibGVTY3JvbGwoKSB7XHJcbiAgICAvLyAgICAgbGV0IHBhZ2VQb3NpdGlvbiA9IHdpbmRvdy5zY3JvbGxZO1xyXG4gICAgLy8gICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnc2Nyb2xsLWxvY2snKTtcclxuICAgIC8vICAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQucG9zaXRpb24gPSBwYWdlUG9zaXRpb247XHJcbiAgICAvLyAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAtcGFnZVBvc2l0aW9uICsgJ3B4JztcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBmdW5jdGlvbiBlbmFibGVTY3JvbGwoKSB7XHJcbiAgICAvLyAgICAgbGV0IHBhZ2VQb3NpdGlvbiA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuZGF0YXNldC5wb3NpdGlvbiwgMTApO1xyXG4gICAgLy8gICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gJyc7XHJcbiAgICAvLyAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtbG9jaycpO1xyXG4gICAgLy8gICAgIHdpbmRvdy5zY3JvbGwoeyB0b3A6IHBhZ2VQb3NpdGlvbiwgbGVmdDogMCB9KTtcclxuICAgIC8vICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wb3NpdGlvbicpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZvY3VzVHJhcCgpIHtcclxuXHRcdC8vIGNvbnN0IG5vZGVzID0gdGhpcy5tb2RhbENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuX2ZvY3VzRWxlbWVudHMpOyAvLyog0LTQu9GPINGE0L7QutGD0YHQsCDQvdCwINC/0LXRgNCy0L7QvCDRjdC70LXQvNC10L3RgtC1INC+0LrQvdCwXHJcblx0XHRpZiAobW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtb3BlblwiKSkge1xyXG4gICAgICAgICAgICBtb2RhbC5mb2N1cygpO1xyXG5cdFx0XHQvLyBpZiAobm9kZXMubGVuZ3RoKSBub2Rlc1swXS5mb2N1cygpOyAvLyog0LTQu9GPINGE0L7QutGD0YHQsCDQvdCwINC/0LXRgNCy0L7QvCDRjdC70LXQvNC10L3RgtC1INC+0LrQvdCwXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsYXN0Rm9jdXMuZm9jdXMoKTtcdFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZm9jdXNDYXRjaChlKSB7XHJcblx0XHRjb25zdCBmb2N1c2FibGUgPSBtb2RhbENvbnRlbnQucXVlcnlTZWxlY3RvckFsbChmb2N1c0VsZW1lbnRzKTtcclxuXHRcdGNvbnN0IGZvY3VzQXJyYXkgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmb2N1c2FibGUpO1xyXG5cdFx0Y29uc3QgZm9jdXNlZEluZGV4ID0gZm9jdXNBcnJheS5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG5cclxuXHRcdGlmIChlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xyXG5cdFx0XHRmb2N1c0FycmF5W2ZvY3VzQXJyYXkubGVuZ3RoIC0gMV0uZm9jdXMoKTtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IGZvY3VzQXJyYXkubGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRmb2N1c0FycmF5WzBdLmZvY3VzKCk7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwiY29uc3QgcXVpekZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucXVpei1mb3JtJyk7XHJcbmNvbnN0IHF1aXpJbnB1dHMgPSBxdWl6Rm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG5jb25zdCBxdWl6QmxvY2tzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLnF1aXotYmxvY2snKTtcclxuXHJcbmxldCB0ZXh0YXJlYVRleHQgPSBudWxsO1xyXG5sZXQgcXVpelJlcGx5ICA9IHt9O1xyXG5sZXQgYmxvY2tJbmRleCA9IDA7XHJcblxyXG4vLyDRhNGD0L3QutGG0LjRjyDQv9C+0LrQsNC30LAg0YLQvtC70YzQutC+INC/0LXRgNCy0L7Qs9C+INCx0LvQvtC60LAg0LrQstC40LfQsFxyXG5zaG93QmxvY2tzKGJsb2NrSW5kZXgpO1xyXG5cclxuZnVuY3Rpb24gc2hvd0Jsb2NrcygpIHtcclxuXHRxdWl6QmxvY2tzLmZvckVhY2goKGl0ZW0pID0+IGl0ZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJyk7XHJcblx0cXVpekJsb2Nrc1tibG9ja0luZGV4XS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxufVxyXG5cclxuLy8g0LfQsNC/0LjRgdGMINC90LDQt9Cy0LDQvdC40Y8g0YfQtdC60LHQvtC60YHQsCDQsiB2YWx1ZSDQuNC90L/Rg9GC0LAg0YfQtdC60LHQvtC60YHQsFxyXG5xdWl6SW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdGlmIChpbnB1dC50eXBlID09ICdjaGVja2JveCcgfHwgaW5wdXQudHlwZSA9PSAncmFkaW8nKSB7XHJcblx0XHRpbnB1dC52YWx1ZSA9IGlucHV0Lm5leHRFbGVtZW50U2libGluZy50ZXh0Q29udGVudDtcclxuXHR9XHJcbn0pO1xyXG5cclxucXVpekZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdGxldCB0YXJnZXQgPSBlLnRhcmdldDtcclxuXHRsZXQgYmxvY2sgPSB0YXJnZXQuY2xvc2VzdCgnLnF1aXotYmxvY2snKTtcclxuXHRsZXQgbmV4dEJ0biA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5leHRdJyk7XHJcblx0bmV4dEJ0bi5mb3JFYWNoKGJ0biA9PiB7XHJcblx0XHRpZiAodGFyZ2V0ID09IGJ0bikge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGFkZFRvU2VuZChibG9jaywgcXVpelJlcGx5KTtcclxuXHRcdFx0bmV4dFF1ZXN0aW9uKGJsb2NrKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRpZiAodGFyZ2V0ID09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNlbmRdJykpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGFkZFRvU2VuZChibG9jaywgcXVpelJlcGx5KTtcclxuXHRcdHNlbmQoYmxvY2spO1xyXG5cdH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBuZXh0UXVlc3Rpb24oZm9ybSkge1xyXG5cdGxldCB2YWxpZCA9IHZhbGlkSW5wdXQoZm9ybSk7XHJcblx0aWYgKHZhbGlkID09PSAwICYmIHZhbGlkQ2hlY2soZm9ybSkpIHtcclxuXHRcdHNob3dCbG9ja3MoYmxvY2tJbmRleCArPSAxKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlbmQoZm9ybSkge1xyXG5cdGxldCB2YWxpZCA9IHZhbGlkSW5wdXQoZm9ybSk7XHJcblx0aWYgKHZhbGlkID09PSAwICYmIHZhbGlkQ2hlY2soZm9ybSkpIHtcclxuXHRcdGZvcm1SZW1vdmVFcnJvcihxdWl6Rm9ybSk7XHJcblxyXG5cdFx0Ly8qID09PT09PT09INCh0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YLQv9GA0LDQstC60LUgPT09PT09PT09PT09XHJcblx0XHRsZXQgb2sgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LXNlbmRfX29rJyk7XHJcblx0XHRsZXQgdGV4dE1lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LW1lc3NhZ2UnKTtcclxuXHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQl9Cw0LPRgNGD0LfQutCwLi4uJztcclxuXHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8qPT09PT09PT09IEZvcm1EYXRhID09PT09PT09PT09PT09PVxyXG5cdFx0Y29uc3QgcXVpekZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblx0XHRmb3IgKGxldCBrZXkgaW4gcXVpelJlcGx5KSB7XHJcblx0XHRcdHF1aXpGb3JtRGF0YS5hcHBlbmQoa2V5LCBxdWl6UmVwbHlba2V5XSk7XHJcblx0XHR9XHJcblx0XHQvLyBmb3JtRGF0YS5hcHBlbmQoJ2ltYWdlJywgZm9ybUltYWdlLmZpbGVzWzBdKTtcclxuXHRcdC8vKiDQn9GA0L7QstC10YDQutCwIEZvcm1EYXRhXHJcblx0XHQvLyBmb3IodmFyIHBhaXIgb2YgcXVpekZvcm1EYXRhLmVudHJpZXMoKSkge1xyXG5cdFx0Ly8gXHRjb25zb2xlLmxvZyhwYWlyWzBdKyAnOiAnKyBwYWlyWzFdKTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyo9PT09PT09PT0g0J7RgtC/0YDQsNCy0LrQsCDQtNCw0L3QvdGL0YUgPT09PT09PT09PT09PT09XHJcblx0XHRjb25zdCBxdWl6RGF0YSA9IGFzeW5jICh1cmwsIGRhdGEpID0+IHtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcblx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcclxuXHRcdFx0XHRib2R5OiBkYXRhXHJcblx0XHRcdH0pO1x0XHJcblx0XHRcdGlmIChyZXNwb25zZS5vaykge1xyXG5cclxuXHRcdFx0XHQvLyBsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpOyAvLyBqc29uKCkgLSDQtNC70Y8g0LLRi9Cy0L7QtNCwINGB0L7QvtCx0YnQtdC90LjRjztcclxuXHRcdFx0XHQvLyBhbGVydChyZXN1bHQubWVzc2FnZSk7XHJcblxyXG5cdFx0XHRcdGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7IC8vIHRleHQoKSAtINC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LUsINC/0L7QtNC60LvRjtGH0LjRgtGMIHNlcnZlci5waHApXHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0KTsgLy8g0Y3RgtC+INC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LVcclxuXHJcblx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICdPayEnO1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG9rLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdGNsZWFySW5wdXRzKHF1aXpJbnB1dHMpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0b2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0fSwgNTAwMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YWxlcnQoXCLQntGI0LjQsdC60LAgSFRUUDogXCIgKyByZXNwb25zZS5zdGF0dXMpO1xyXG5cdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgNTAwMCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHQvLyBxdWl6RGF0YSgnLi4vc2VuZG1haWwucGhwJywgcXVpekZvcm1EYXRhKTtcclxuXHRcdHF1aXpEYXRhKCcuLi9zZXJ2ZXIucGhwJywgcXVpekZvcm1EYXRhKSAvLyEg0YPQsdGA0LDRgtGMICjRjdGC0L4g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSlcclxuXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb1NlbmQoZm9ybSwgb2JqKSB7XHJcblx0bGV0IHZhbHVlU3RyaW5nID0gJyc7XHJcblx0bGV0IGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRsZXQgdGV4dGFyZWEgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJyk7XHJcblx0aWYgKGlucHV0cy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgZmllbGQgPSBpbnB1dHNbaV07XHJcblx0XHRcdGlmIChmaWVsZC50eXBlICE9ICdjaGVja2JveCcgJiYgZmllbGQudHlwZSAhPSAncmFkaW8nICYmIGZpZWxkLnZhbHVlKSB7XHJcblx0XHRcdFx0b2JqW2ZpZWxkLm5hbWVdID0gZmllbGQudmFsdWU7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PSAncmFkaW8nICYmIGZpZWxkLmNoZWNrZWQpIHtcclxuXHRcdFx0XHRvYmpbZmllbGQubmFtZV0gPSBmaWVsZC52YWx1ZTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWVsZC50eXBlID09ICdjaGVja2JveCcgJiYgZmllbGQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdHZhbHVlU3RyaW5nICs9IGZpZWxkLnZhbHVlICsgJywnO1x0XHRcclxuXHRcdFx0XHRvYmpbZmllbGQubmFtZV0gPSB2YWx1ZVN0cmluZztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0gZWxzZSBpZiAodGV4dGFyZWEubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0YXJlYS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgdGV4dCA9IHRleHRhcmVhW2ldO1xyXG5cdFx0XHRpZiAodGV4dC52YWx1ZSkge1xyXG5cdFx0XHRcdG9ialt0ZXh0Lm5hbWVdID0gdGV4dC52YWx1ZTtcdFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59IiwiY29uc3QgcmFuZ2VTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZ2Utc2xpZGVyJyk7XG5cbmlmIChyYW5nZVNsaWRlcikge1xuXHRub1VpU2xpZGVyLmNyZWF0ZShyYW5nZVNsaWRlciwge1xuICAgIHN0YXJ0OiBbNTAwLCA5OTk5OTldLFxuXHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0c3RlcDogMSxcbiAgICByYW5nZToge1xuXHRcdFx0J21pbic6IFs1MDBdLFxuXHRcdFx0J21heCc6IFs5OTk5OTldXG4gICAgfVxuXHR9KTtcblxuXHRjb25zdCBpbnB1dDAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtMCcpO1xuXHRjb25zdCBpbnB1dDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtMScpO1xuXHRjb25zdCBpbnB1dHMgPSBbaW5wdXQwLCBpbnB1dDFdO1xuXG5cdHJhbmdlU2xpZGVyLm5vVWlTbGlkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKHZhbHVlcywgaGFuZGxlKXtcblx0XHRpbnB1dHNbaGFuZGxlXS52YWx1ZSA9IE1hdGgucm91bmQodmFsdWVzW2hhbmRsZV0pO1xuXHR9KTtcblxuXHRjb25zdCBzZXRSYW5nZVNsaWRlciA9IChpLCB2YWx1ZSkgPT4ge1xuXHRcdGxldCBhcnIgPSBbbnVsbCwgbnVsbF07XG5cdFx0YXJyW2ldID0gdmFsdWU7XG5cblx0XHRjb25zb2xlLmxvZyhhcnIpO1xuXG5cdFx0cmFuZ2VTbGlkZXIubm9VaVNsaWRlci5zZXQoYXJyKTtcblx0fTtcblxuXHRpbnB1dHMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG5cdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGluZGV4KTtcblx0XHRcdHNldFJhbmdlU2xpZGVyKGluZGV4LCBlLmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuXHRcdH0pO1xuXHR9KTtcbn0iLCJsZXQgdGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2F0YWxvZy1zaXplcyB0ZCcpO1xyXG5cclxudGQuZm9yRWFjaChpdGVtID0+IHtcclxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdGxldCBzZWxmID0gZS5jdXJyZW50VGFyZ2V0O1xyXG5cdFx0aXRlbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2RiYmJhOSc7XHJcblx0XHR0ZC5mb3JFYWNoKGJ0biA9PiB7XHJcblx0XHRcdGlmIChidG4gIT09IHNlbGYpIHtcclxuXHRcdFx0XHRidG4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3RyYW5zcGFyZW50JztcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0pOyIsIi8vIGNvbnN0IG1pblNsaWRlciA9IG5ldyBTd2lwZXIoJy5zbGlkZXItbWluJywge1xyXG4vLyBcdGdyYWJDdXJzb3I6IHRydWUsXHJcbi8vIFx0c2xpZGVzUGVyVmlldzogNixcclxuLy8gXHRpbml0aWFsU2xpZGU6IDAsXHJcbi8vIFx0Ly8gc3BhY2VCZXR3ZWVuOiAyMCxcclxuLy8gXHRmcmVlTW9kZTogdHJ1ZSxcclxuLy8gfSk7XHJcblxyXG4vLyBjb25zdCBtYWluU2xpZGVyID0gbmV3IFN3aXBlcignLnNsaWRlci1tYWluJywge1xyXG4vLyBcdGdyYWJDdXJzb3I6IHRydWUsXHJcbi8vIFx0c3BhY2VCZXR3ZWVuOiAyMCxcclxuLy8gXHRzbGlkZXNQZXJWaWV3OiAxLFxyXG4vLyBcdGluaXRpYWxTbGlkZTogMCxcclxuLy8gXHRzaW11bGF0ZVRvdWNoOiBmYWxzZSxcclxuLy8gXHRlZmZlY3Q6ICdmYWRlJyxcclxuLy8gXHRmYWRlRWZmZWN0OiB7XHJcbi8vIFx0ICBjcm9zc0ZhZGU6IHRydWVcclxuLy8gXHR9LFxyXG4vLyBcdHRodW1iczoge1xyXG4vLyBcdFx0c3dpcGVyOiBtaW5TbGlkZXIsXHJcbi8vIFx0fVxyXG4vLyB9KTsiLCIvLyog0JLQsNC70LjQtNCw0YbQuNGPINGE0L7RgNC80YsgKNC10YHQu9C4INGH0LXQutCx0L7QutGB0Ysg0Lgg0LjQvdC/0YPRgtGLINCyINC+0LTQvdC+0Lkg0YTQvtGA0LzQtSlcclxuZnVuY3Rpb24gdmFsaWRDaGVjayhmb3JtKSB7XHJcblx0bGV0IGVsZW1lbnRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG5cdGxldCBpc1ZhbGlkID0gZmFsc2U7XHJcblx0aWYgKGVsZW1lbnRzLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBlbGVtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0bGV0IGlucHV0ID0gZWxlbWVudHNbaW5kZXhdO1xyXG5cdFx0XHRpZiAoIWlucHV0LmNsYXNzTGlzdC5jb250YWlucygnbm90LXZhbGlkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJjaGVja2JveFwiIHx8IGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwicmFkaW9cIikge1xyXG5cdFx0XHRcdFx0aWYgKGlucHV0LmNoZWNrZWQpIHtcclxuXHRcdFx0XHRcdFx0aXNWYWxpZCA9IHRydWU7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRmb3JtQWRkRXJyb3IoaW5wdXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge2lzVmFsaWQgPSB0cnVlO31cclxuXHRcdH1cclxuXHR9IGVsc2Uge2lzVmFsaWQgPSB0cnVlO31cclxuXHJcblx0cmV0dXJuIGlzVmFsaWQ7XHJcbn1cclxuZnVuY3Rpb24gdmFsaWRJbnB1dChmb3JtKSB7XHJcblx0bGV0IGVsZW1lbnRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG5cdGxldCBlcnJvciA9IDA7XHJcblx0aWYgKGVsZW1lbnRzLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBlbGVtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0bGV0IGlucHV0ID0gZWxlbWVudHNbaW5kZXhdO1xyXG5cdFx0XHRsZXQgcGxhY2Vob2xkZXIgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJyk7XHJcblx0XHRcdGlmICghaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3QtdmFsaWQnKSkge1xyXG5cdFx0XHRcdGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2VtYWlsJykpIHtcclxuXHRcdFx0XHRcdGlmIChlbWFpbFRlc3QoaW5wdXQpIHx8IGlucHV0LnZhbHVlID09IHBsYWNlaG9sZGVyKSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHRcdGVycm9yKys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChpbnB1dC52YWx1ZSA9PSAnJyB8fCBpbnB1dC52YWx1ZSA9PSBwbGFjZWhvbGRlcikge1xyXG5cdFx0XHRcdFx0XHRmb3JtQWRkRXJyb3IoaW5wdXQpO1xyXG5cdFx0XHRcdFx0XHRlcnJvcisrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHQvLyHQstC60LvRjtGH0LjRgtGMLCDQtdGB0LvQuCDQvdCw0LTQviDQstCw0LvQuNC00LjRgNC+0LLQsNGC0YwgdGV4dGFyZTpcclxuXHQvLyBsZXQgdGV4dGFyZWEgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XHJcblx0Ly8gaWYgKHRleHRhcmVhKSB7XHJcblx0Ly8gXHRpZiAodGV4dGFyZWEudmFsdWUgPT0gJycpIHtcclxuXHQvLyBcdFx0Zm9ybUFkZEVycm9yKHRleHRhcmVhKTtcclxuXHQvLyBcdFx0ZXJyb3IrKztcclxuXHQvLyBcdH1cclxuXHQvLyB9IFxyXG5cclxuXHRyZXR1cm4gZXJyb3I7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1BZGRFcnJvcihpdGVtKSB7XHJcblx0aXRlbS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcblx0aXRlbS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCwg0LXRgdC70Lgg0LIgaHRtbCDQtNC+0LHQsNCy0LvQtdC90Ysg0LHQu9C+0LrQuCDRgSDRgdC+0L7QsdGJ0LXQvdC40LXQvCDQvtCxINC+0YjQuNCx0LrQtSAoLmZvcm0tZXJyb3IpXHJcblx0Ly8qINC10YHQu9C4INGA0LDQt9C90YvQuSDRgtC10LrRgdGCINC+0YjQuNCx0LrQuCDQtNC70Y8g0LrQsNC20LTQvtCz0L4gaW5wdXRcclxuXHQvLyBsZXQgaW1wdXRFcnJvciA9IGl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cdC8vIGlmIChpbXB1dEVycm9yKSB7XHJcblx0Ly8gXHRpZiAoaW1wdXRFcnJvci5jbGFzc0xpc3QuY29udGFpbnMoJ2ltcHV0LW1lc3NhZ2UnKSkge1xyXG5cdC8vIFx0XHRpbXB1dEVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHQvLyog0LXRgdC70Lgg0L7RiNC40LHQutCwINC00LvRjyDQstGB0LXQuSDRhNC+0YDQvNGLICjQuNC70Lgg0LHQu9C+0LrQsCDQutCy0LjQt9CwKTpcclxuXHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0Ywg0LXRgdC70Lgg0L3QsCDRgdCw0LnRgtC1INC10YHRgtGMINC60LLQuNC3XHJcblx0aWYgKGl0ZW0uY2xvc2VzdCgnLnF1aXotZm9ybScpKSB7XHJcblx0XHRsZXQgcXVpekVycm9yID0gaXRlbS5jbG9zZXN0KCcucXVpei1ibG9jaycpLnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LW1lc3NhZ2UnKTtcclxuXHRcdGlmIChxdWl6RXJyb3IpIHtcclxuXHRcdFx0cXVpekVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHRsZXQgZm9ybUVycm9yID0gaXRlbS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLW1lc3NhZ2UnKTtcclxuXHRcdGlmIChmb3JtRXJyb3IpIHtcclxuXHRcdFx0Zm9ybUVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0Ywg0LXRgdC70Lgg0L3QsCDRgdCw0LnRgtC1INC90LXRgiDQutCy0LjQt9CwICjRgtC+0LvRjNC60L4g0YTQvtGA0LzRiylcclxuXHQvLyBsZXQgZm9ybUVycm9yID0gaXRlbS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWVycm9yJyk7XHJcblx0Ly8gaWYgKGZvcm1FcnJvcikge1xyXG5cdC8vIFx0Zm9ybUVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdC8vIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybVJlbW92ZUVycm9yKGZvcm0pIHtcclxuXHRsZXQgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEnKTtcclxuXHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpbnB1dHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGxldCBpbnB1dCA9IGlucHV0c1tpbmRleF07XHJcblx0XHRcdGlmICghaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3QtdmFsaWQnKSkge1xyXG5cdFx0XHRcdGlucHV0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcclxuXHRcdFx0XHRpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMLCDQtdGB0LvQuCDQsiBodG1sINC00L7QsdCw0LLQu9C10L3RiyDQsdC70L7QutC4INGBINGB0L7QvtCx0YnQtdC90LjQtdC8INC+0LEg0L7RiNC40LHQutC1ICguZm9ybS1lcnJvcilcclxuXHRsZXQgZm9ybUVycm9yID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybS1tZXNzYWdlJyk7XHJcblx0aWYgKGZvcm1FcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZm9ybUVycm9yLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRjb25zdCBlcnJvciA9IGZvcm1FcnJvcltpbmRleF07XHJcblx0XHRcdGVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZW1haWxUZXN0KHNlbGVjdG9yKSB7XHJcblx0cmV0dXJuICEvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsOH0pKyQvLnRlc3Qoc2VsZWN0b3IudmFsdWUpO1xyXG59XHJcblxyXG5jb25zdCB0ZXh0SW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNoZWNrJyk7ICAgXHJcbnRleHRJbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0Ly8g0LXRgdC70Lgg0LfQvdCw0YfQtdC90LjQtSDQutC70LDQstC40YjQuChlLmtleSkg0L3QtSDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0LXRgihtYXRjaCkg0LrQuNGA0LjQu9C70LjRhtC1LCDQv9C+0LvQtSDQvdC1INC30LDQv9C+0LvQvdGP0LXRgtGB0Y9cclxuXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmIChlLmtleS5tYXRjaCgvW17QsC3Rj9GRIDAtOV0vaWcpKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQvLyDQtdGB0LvQuCDQv9GA0Lgg0LDQstGC0L7Qt9Cw0L/QvtC70L3QtdC90LjQuCDQstGL0LHRgNCw0L3QviDRgdC70L7QstC+INC90LUg0LrQuNGA0LjQu9C70LjRhtC10LksINGB0YLRgNC+0LrQsCDQvtGH0LjRgdGC0LjRgtGB0Y9cclxuXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy52YWx1ZT10aGlzLnZhbHVlLnJlcGxhY2UoL1teXFzQsC3Rj9GRIDAtOV0vaWcsXCJcIik7XHJcblx0fSk7XHJcbn0pOyJdfQ==
