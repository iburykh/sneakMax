'use strict';

// forEach Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
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
        disableScrollBurger();
    } else {
        hamburger.setAttribute('aria-label', 'открыть навигацию');
        enableScrollBurger();
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
            enableScrollBurger();
        }
    })
})

function disableScrollBurger() {
    let pagePosition = window.scrollY;
    document.body.classList.add('scroll-lock');
    document.body.dataset.position = pagePosition;
    document.body.style.top = -pagePosition + 'px';
}

function enableScrollBurger() {
    let pagePosition = parseInt(document.body.dataset.position, 10);
    document.body.style.top = '';
    document.body.classList.remove('scroll-lock');
    window.scroll({ top: pagePosition, left: 0 });
    document.body.removeAttribute('data-position');
}

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
	const getProducts = async (quantity = 5) => {
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

			// функцию модального окна запускать тут
			bindModal('.modal-btn', '.modal-prod', getModalData);
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
				if (prodQuantity >= dataLength) {
					catalogMore.style.display = 'none';
				} else {
					catalogMore.style.display = 'block';
				}
				bindModal('.modal-btn', '.modal-prod', getModalData);
			});

		} else {
			console.log(('error', response.status));
		}
	};

	getProducts(prodQuantity);

	//* функция создания окна товара
	const getModalData = async (id = 1) => {
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
const miniCartItem = document.querySelectorAll('.mini-cart__item');

cartBtn.addEventListener('click', () => {
	miniCart.classList.toggle('mini-cart--open');
});

document.addEventListener('click', (e) => {
	if (!e.target.classList.contains('mini-cart') && !e.target.closest('.mini-cart') && !e.target.classList.contains('cart')) {
		miniCart.classList.remove('mini-cart--open');
	}
});

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJhY2NvcmRpb24uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImNyZWF0ZS1jYXJkcy5qcyIsImZvcm0uanMiLCJsYXp5LmpzIiwibWFwLmpzIiwibWFzay10ZWwuanMiLCJtaW5pLWNhcnQuanMiLCJtb2RhbC5qcyIsInF1aXouanMiLCJyYW5nZS1zbGlkZXIuanMiLCJzaXplcy5qcyIsInNsaWRlci5qcyIsInZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGZvckVhY2ggUG9seWZpbGxcclxuaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbn1cclxuXHJcbmNvbnN0IGNsZWFySW5wdXRzID0gKHNlbGVjdG9yKSA9PiB7XHJcblx0c2VsZWN0b3IuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdGl0ZW0udmFsdWUgPSAnJztcclxuXHR9KTtcclxuXHRsZXQgY2hlY2tib3hlcyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jdXN0b20tY2hlY2tib3hfX2lucHV0Jyk7XHJcblx0aWYgKGNoZWNrYm94ZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNoZWNrYm94ZXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGNvbnN0IGNoZWNrYm94ID0gY2hlY2tib3hlc1tpbmRleF07XHJcblx0XHRcdGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG4vLyB3aW5kb3cubm9aZW5zbW9vdGggPSB0cnVlOyIsImNvbnN0IGFjY29yZGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uJyk7XG5cbmFjY29yZGlvbnMuZm9yRWFjaChlbCA9PiB7XG5cdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRjb25zdCBzZWxmID0gZS5jdXJyZW50VGFyZ2V0O1xuXHRcdGNvbnN0IGNvbnRyb2wgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRyb2wnKTtcblx0XHRjb25zdCBjb250ZW50ID0gc2VsZi5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50Jyk7XG5cblx0XHQvLyog0LXRgdC70Lgg0L3QtdC+0LHRhdC+0LTQuNC80L4g0YfRgtC+0LHRiyDQstGB0LUg0LHQu9C+0LrQuCDQt9Cw0LrRgNGL0LLQsNC70LjRgdGMINC/0YDQuCDQvtGC0LrRgNGL0YLQuNC4INCx0LvQvtC60LAgLSDQv9GA0L7RgdGC0L4g0YDQsNGB0LrQvtC80LXQvdGC0LjRgNC+0LLQsNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwhXG5cdFx0Ly8gYWNjb3JkaW9ucy5mb3JFYWNoKGJ0biA9PiB7XG5cdFx0Ly8gXHRjb25zdCBjb250cm9sID0gYnRuLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRyb2wnKTtcblx0XHQvLyBcdGNvbnN0IGNvbnRlbnQgPSBidG4ucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udGVudCcpO1xuXHRcdC8vIFx0aWYgKGJ0biAhPT0gc2VsZikge1xuXHRcdC8vIFx0XHRidG4uY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuXHRcdC8vIFx0XHRjb250cm9sLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcblx0XHQvLyBcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cdFx0Ly8gXHRcdGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcblx0XHQvLyBcdH1cblx0XHQvLyB9KTtcblxuXHRcdHNlbGYuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xuXG5cdFx0Ly8g0LXRgdC70Lgg0L7RgtC60YDRi9GCINCw0LrQutC+0YDQtNC10L7QvVxuXHRcdGlmIChzZWxmLmNsYXNzTGlzdC5jb250YWlucygnb3BlbicpKSB7XG5cdFx0XHRjb250cm9sLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xuXHRcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5zdHlsZS5tYXhIZWlnaHQgPSBjb250ZW50LnNjcm9sbEhlaWdodCArICdweCc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cdFx0XHRjb250ZW50LnN0eWxlLm1heEhlaWdodCA9IG51bGw7XG5cdFx0fVxuXHR9KTtcbn0pOyIsImxldCBtZW51Qm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51Jyk7XHJcbmxldCBtZW51SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51X19saW5rJyk7XHJcbmxldCBoYW1idXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyJyk7XHJcblxyXG5oYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7ICAgIFxyXG4gICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgbWVudUJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG4gICAgaWYgKGhhbWJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgaGFtYnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQt9Cw0LrRgNGL0YLRjCDQvdCw0LLQuNCz0LDRhtC40Y4nKTtcclxuICAgICAgICBkaXNhYmxlU2Nyb2xsQnVyZ2VyKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbWJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0L3QsNCy0LjQs9Cw0YbQuNGOJyk7XHJcbiAgICAgICAgZW5hYmxlU2Nyb2xsQnVyZ2VyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgbWVudUJvZHkuZm9jdXMoKTtcclxuICAgIH0sIDYwMCk7XHJcbn0pO1xyXG5cclxubWVudUl0ZW0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBtZW51Qm9keS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgaGFtYnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQvtGC0LrRgNGL0YLRjCDQvdCw0LLQuNCz0LDRhtC40Y4nKTtcclxuICAgICAgICAgICAgZW5hYmxlU2Nyb2xsQnVyZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSlcclxuXHJcbmZ1bmN0aW9uIGRpc2FibGVTY3JvbGxCdXJnZXIoKSB7XHJcbiAgICBsZXQgcGFnZVBvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1sb2NrJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQucG9zaXRpb24gPSBwYWdlUG9zaXRpb247XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IC1wYWdlUG9zaXRpb24gKyAncHgnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbmFibGVTY3JvbGxCdXJnZXIoKSB7XHJcbiAgICBsZXQgcGFnZVBvc2l0aW9uID0gcGFyc2VJbnQoZG9jdW1lbnQuYm9keS5kYXRhc2V0LnBvc2l0aW9uLCAxMCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtbG9jaycpO1xyXG4gICAgd2luZG93LnNjcm9sbCh7IHRvcDogcGFnZVBvc2l0aW9uLCBsZWZ0OiAwIH0pO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtcG9zaXRpb24nKTtcclxufVxyXG5cclxubGV0IGZpbHRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXJzJyk7XHJcbmxldCBmaWx0ZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fYnRuJyk7XHJcbmxldCBmaWx0ZXJCdXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZy1oYW1idXJnZXInKTtcclxuXHJcbmZpbHRlckJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBmaWx0ZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBpZiAoZmlsdGVyQnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C30LDQutGA0YvRgtGMINGE0LjQu9GM0YLRgCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINGE0LjQu9GM0YLRgCcpO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgZmlsdGVyLmZvY3VzKCk7XHJcbiAgICB9LCA2MDApO1xyXG59KTtcclxuXHJcbmZpbHRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoZmlsdGVyQnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgZmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7IFxyXG4gICAgfVxyXG59KVxyXG4iLCJjb25zdCBjaGVja0JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRhbG9nLWNoZWNrYm94X19sYWJlbCwgLmN1c3RvbS1jaGVja2JveF9fdGV4dCcpO1xyXG5cclxuY2hlY2tCb3guZm9yRWFjaChpdGVtID0+IHtcclxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG5cdFx0aWYgKGUuY29kZSA9PT0gJ0VudGVyJyB8fCBlLmNvZGUgPT09ICdOdW1wYWRFbnRlcicgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XHJcblx0XHRcdGxldCBjaGVjayA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblx0XHRcdGlmIChjaGVjay50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdFx0XHRpZiAoY2hlY2suY2hlY2tlZCA9PT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH0gXHJcblx0XHRcdH0gZWxzZSBpZiAoY2hlY2sudHlwZSA9PSAnY2hlY2tib3gnKSB7XHJcblx0XHRcdFx0aWYgKGNoZWNrLmNoZWNrZWQgPT09IGZhbHNlKSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHR9KTtcclxufSk7IiwiLy8qINCV0YHQu9C4INC10YHRgtGMINGB0LvQsNC50LTQtdGAINCyINC80L7QtNCw0LvRjNC90L7QvCDQvtC60L3QtSAtINC40L3QuNGG0LjQuNGA0L7QstCw0YLRjCDRgdC70LDQudC00LXRgNGLINCyINGE0YPQvdC60YbQuNC4IG1vZGFsU2xpZGVyINC4INC+0LHRitGP0LLQu9GP0YLRjCDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0L7QutC90LBcclxuXHJcbmNvbnN0IGNhdGFsb2dQcm9kdWN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX193cmFwJyk7XHJcbmNvbnN0IGNhdGFsb2dNb3JlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX21vcmUnKTtcclxuY29uc3QgcHJvZE1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLXByb2RfX2NvbnRlbnQnKTtcclxuY29uc3QgcHJvZE1vZGFsU2xpZGVyID0gcHJvZE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItbWFpbl9fd3JhcHBlcicpO1xyXG5jb25zdCBwcm9kTW9kYWxQcmV2aWV3ID0gcHJvZE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItbWluX193cmFwcGVyJyk7XHJcbmNvbnN0IHByb2RNb2RhbEluZm8gPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWluZm9fX3dyYXBwZXInKTtcclxuY29uc3QgcHJvZE1vZGFsRGVzY3IgPSBwcm9kTW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWRlc2NyX190ZXh0Jyk7XHJcbmNvbnN0IHByb2RNb2RhbENoYXJzID0gcHJvZE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jaGFyX19pdGVtcycpO1xyXG5jb25zdCBwcm9kTW9kYWxWaWRlbyA9IHByb2RNb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtdmlkZW8nKTtcclxubGV0IHByb2RRdWFudGl0eSA9IDY7IC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC60LDRgNGC0L7Rh9C10Log0L3QsCDRgdGC0YDQsNC90LjRhtC1INC40LfQvdCw0YfQsNC70YzQvdC+XHJcbmxldCBhZGRRdWFudGl0eSA9IDM7IC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC00L7QsdCw0LLQu9GP0LXQvNGL0YUg0LrQsNGA0YLQvtGH0LXQuiDQv9GA0Lgg0LrQu9C40LrQtSDQvdCwINC60L3QvtC/0LrRgyBcItCf0L7QutCw0LfQsNGC0Ywg0LXRidGRXCJcclxubGV0IGRhdGFMZW5ndGggPSBudWxsO1xyXG5cclxuLy8g0YTRg9C90LrRhtC40Y8g0LLRgdGC0LDQstC70Y/QtdGCINC/0YDQvtCx0LXQuyDQvNC10LbQtNGDINGA0LDQt9GA0Y/QtNCw0LzQuFxyXG5jb25zdCBub3JtYWxQcmljZSA9IChzdHIpID0+IHtcclxuXHRyZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkXFxkKSsoW15cXGRdfCQpKS9nLCAnJDEgJyk7XHJcbn07XHJcblxyXG4vLyDRhNGD0L3QutGG0LjRjyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDRgdC70LDQudC00LXRgNCwXHJcbmNvbnN0IG1vZGFsU2xpZGVyID0gKCkgPT4ge1xyXG5cdGNvbnN0IG1pblNsaWRlciA9IG5ldyBTd2lwZXIoJy5zbGlkZXItbWluJywge1xyXG5cdFx0Z3JhYkN1cnNvcjogdHJ1ZSxcclxuXHRcdHNsaWRlc1BlclZpZXc6IDYsXHJcblx0XHRpbml0aWFsU2xpZGU6IDAsXHJcblx0XHRzcGFjZUJldHdlZW46IDIwLFxyXG5cdFx0ZnJlZU1vZGU6IHRydWUsXHJcblx0fSk7XHJcblx0XHJcblx0Y29uc3QgbWFpblNsaWRlciA9IG5ldyBTd2lwZXIoJy5zbGlkZXItbWFpbicsIHtcclxuXHRcdGdyYWJDdXJzb3I6IHRydWUsXHJcblx0XHRzcGFjZUJldHdlZW46IDIwLFxyXG5cdFx0c2xpZGVzUGVyVmlldzogMSxcclxuXHRcdGluaXRpYWxTbGlkZTogMCxcclxuXHRcdHNpbXVsYXRlVG91Y2g6IGZhbHNlLFxyXG5cdFx0ZWZmZWN0OiAnZmFkZScsXHJcblx0XHRmYWRlRWZmZWN0OiB7XHJcblx0XHQgIGNyb3NzRmFkZTogdHJ1ZVxyXG5cdFx0fSxcclxuXHRcdHRodW1iczoge1xyXG5cdFx0XHRzd2lwZXI6IG1pblNsaWRlcixcclxuXHRcdH1cclxuXHR9KTtcclxufTtcclxuXHJcbmlmIChjYXRhbG9nUHJvZHVjdHMpIHtcclxuXHQvLyog0YTRg9C90LrRhtC40Y8g0YHQvtC30LTQsNC90LjRjyDQutCw0YDRgtC+0YfQtdC6INCyINC60LDRgtCw0LvQvtCz0LUg0YLQvtCy0LDRgNC+0LJcclxuXHRjb25zdCBnZXRQcm9kdWN0cyA9IGFzeW5jIChxdWFudGl0eSA9IDUpID0+IHtcclxuXHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcuLi9kYXRhL2RhdGEuanNvbicpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblx0XHRcdGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuXHRcdFx0ZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHJcblx0XHRcdGNhdGFsb2dQcm9kdWN0cy5pbm5lckhUTUwgPSAnJztcclxuXHJcblx0XHRcdC8vINGE0L7RgNC80LjRgNGD0LXQvCDRgdC10YLQutGDINC40LcgNiDQutCw0YDRgtC+0YfQtdC6INGC0L7QstCw0YDQvtCyINC90LAg0YHRgtGA0LDQvdC40YbQtSAoNiAtINGN0YLQviDRh9C40YHQu9C+IHByb2RRdWFudGl0eSlcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoaSA8IHByb2RRdWFudGl0eSkge1xyXG5cdFx0XHRcdGxldCBpdGVtID0gZGF0YVtpXTtcclxuXHRcclxuXHRcdFx0XHRcdGNhdGFsb2dQcm9kdWN0cy5pbm5lckhUTUwgKz0gYFxyXG5cdFx0XHRcdFx0XHQ8YXJ0aWNsZSBjbGFzcz1cImNhdGFsb2ctaXRlbVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2ltZ1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke2l0ZW0ubWFpbkltYWdlfVwiIGxvYWRpbmc9XCJsYXp5XCIgYWx0PVwiJHtpdGVtLnRpdGxlfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuc1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiY2F0YWxvZy1pdGVtX19idG4gYnRuLXJlc2V0IG1vZGFsLWJ0blwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCIgYXJpYS1sYWJlbD1cItCf0L7QutCw0LfQsNGC0Ywg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0YLQvtCy0LDRgNC1XCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHN2Zz48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ByaXRlLnN2ZyNzaG93XCI+PC91c2U+PC9zdmc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiY2F0YWxvZy1pdGVtX19idG4gYnRuLXJlc2V0XCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0JTQvtCx0LDQstC40YLRjCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdGDXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHN2Zz48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ByaXRlLnN2ZyNjYXJ0XCI+PC91c2U+PC9zdmc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwiY2F0YWxvZy1pdGVtX190aXRsZVwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2F0YWxvZy1pdGVtX19wcmljZVwiPiR7bm9ybWFsUHJpY2UoaXRlbS5wcmljZSl9INGAPC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2FydGljbGU+XHJcblx0XHRcdFx0XHRgO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8g0YTRg9C90LrRhtC40Y4g0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LAg0LfQsNC/0YPRgdC60LDRgtGMINGC0YPRglxyXG5cdFx0XHRiaW5kTW9kYWwoJy5tb2RhbC1idG4nLCAnLm1vZGFsLXByb2QnLCBnZXRNb2RhbERhdGEpO1xyXG5cdFx0XHQvL1RPRE8gLSDQtNC+0LHQsNCy0LjRgtGMINCw0YDQs9GD0LzQtdC90YIgZnVuYyDQsiDRhNGD0L3QutGG0LjRjiBiaW5kTW9kYWwoYnRuU2VsZWN0b3IsIG1vZGFsU2VsZWN0b3IsIGZ1bmMsIGFuaW1hdGU9J2ZhZGUnLCBzcGVlZD0zMDAsKVxyXG5cdFx0XHQvL1RPRE8gLSDQstGB0YLQsNCy0LjRgtGMINGN0YLQvtGCINC60L7QtCDQsiDRhNGD0L3QutGG0LjRjiBiaW5kTW9kYWwgKNC80L7QtNCw0LvRjNC90L7QtSDQvtC60L3Qvikg0LIg0LzQvtC80LXQvdGCINC+0YLQutGA0YvRgtC40Y8g0L7QutC90LAg0L/QvtGB0LvQtSDQv9C+0LvRg9GH0LXQvdC40Y8gbGFzdEZvY3VzXHJcblx0XHRcdC8vINC/0L7Qu9GD0YfQtdC90LjQtSBpZCDQutC90L7Qv9C60LhcclxuXHRcdFx0Ly8gaWYgKG1vZGFsQ29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLXByb2QnKSkge1xyXG5cdFx0XHQvLyBcdGxldCBvcGVuQnRuSWQgPSBsYXN0Rm9jdXMuZGF0YXNldC5pZDtcclxuXHRcdFx0Ly8gXHRmdW5jKG9wZW5CdG5JZCk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vINC/0L4g0LrQu9C40LrRgyDQvdCwINC60L3QvtC/0LrRgyBcItCf0L7QutCw0LfQsNGC0Ywg0LXRidGRXCIg0LTQvtCx0LDQstC70Y/QtdC8INC/0L4gMyDQutCw0YDRgtC+0YfQutC4INGC0L7QstCw0YDQsCAoMyAtINGN0YLQviDRh9C40YHQu9C+IGFkZFF1YW50aXR5KSBcclxuXHRcdFx0Y2F0YWxvZ01vcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0XHRcdGxldCBhID0gcHJvZFF1YW50aXR5O1xyXG5cdFx0XHRcdHByb2RRdWFudGl0eSA9IHByb2RRdWFudGl0eSArIGFkZFF1YW50aXR5O1xyXG5cdFx0XHRcdGZvciAobGV0IGkgPSBhOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoaSA8IHByb2RRdWFudGl0eSkge1xyXG5cdFx0XHRcdFx0bGV0IGl0ZW0gPSBkYXRhW2ldO1xyXG5cdFx0XHRcdFx0XHRjYXRhbG9nUHJvZHVjdHMuaW5uZXJIVE1MICs9IGBcclxuXHRcdFx0XHRcdFx0XHQ8YXJ0aWNsZSBjbGFzcz1cImNhdGFsb2ctaXRlbVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9faW1nXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiJHtpdGVtLm1haW5JbWFnZX1cIiBsb2FkaW5nPVwibGF6eVwiIGFsdD1cIiR7aXRlbS50aXRsZX1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuc1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXQgbW9kYWwtYnRuXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiBhcmlhLWxhYmVsPVwi0J/QvtC60LDQt9Cw0YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRgtC+0LLQsNGA0LVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxzdmc+PHVzZSB4bGluazpocmVmPVwiaW1nL3Nwcml0ZS5zdmcjc2hvd1wiPjwvdXNlPjwvc3ZnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX2J0biBidG4tcmVzZXRcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiIGFyaWEtbGFiZWw9XCLQlNC+0LHQsNCy0LjRgtGMINGC0L7QstCw0YAg0LIg0LrQvtGA0LfQuNC90YNcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxzdmc+PHVzZSB4bGluazpocmVmPVwiaW1nL3Nwcml0ZS5zdmcjY2FydFwiPjwvdXNlPjwvc3ZnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwiY2F0YWxvZy1pdGVtX190aXRsZVwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjYXRhbG9nLWl0ZW1fX3ByaWNlXCI+JHtub3JtYWxQcmljZShpdGVtLnByaWNlKX0g0YA8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0PC9hcnRpY2xlPlxyXG5cdFx0XHRcdFx0XHRgO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocHJvZFF1YW50aXR5ID49IGRhdGFMZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNhdGFsb2dNb3JlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNhdGFsb2dNb3JlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRiaW5kTW9kYWwoJy5tb2RhbC1idG4nLCAnLm1vZGFsLXByb2QnLCBnZXRNb2RhbERhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmxvZygoJ2Vycm9yJywgcmVzcG9uc2Uuc3RhdHVzKSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Z2V0UHJvZHVjdHMocHJvZFF1YW50aXR5KTtcclxuXHJcblx0Ly8qINGE0YPQvdC60YbQuNGPINGB0L7Qt9C00LDQvdC40Y8g0L7QutC90LAg0YLQvtCy0LDRgNCwXHJcblx0Y29uc3QgZ2V0TW9kYWxEYXRhID0gYXN5bmMgKGlkID0gMSkgPT4ge1xyXG5cdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy4uL2RhdGEvZGF0YS5qc29uJyk7XHJcblx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHRcdFx0bGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblx0XHRcdC8vINC+0YfQuNGJ0LDQtdC8INCx0LvQvtC60LhcclxuXHRcdFx0cHJvZE1vZGFsU2xpZGVyLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxQcmV2aWV3LmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxJbmZvLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxEZXNjci50ZXh0Q29udGVudCA9ICcnO1xyXG5cdFx0XHRwcm9kTW9kYWxDaGFycy5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0cHJvZE1vZGFsVmlkZW8uaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdHByb2RNb2RhbFZpZGVvLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBkYXRhSXRlbSBvZiBkYXRhKSB7XHJcblx0XHRcdFx0aWYgKGRhdGFJdGVtLmlkID09IGlkKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vINCh0LvQsNC50LTQtdGAINGBINGE0L7RgtC+INGC0L7QstCw0YDQsFxyXG5cdFx0XHRcdFx0Y29uc3QgcHJldmlldyA9IGRhdGFJdGVtLmdhbGxlcnkubWFwKChpbWFnZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYFxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzbGlkZXItbWluX19pdGVtIHN3aXBlci1zbGlkZVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke2ltYWdlfVwiIGFsdD1cItC40LfQvtCx0YDQsNC20LXQvdC40LVcIj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0YDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Y29uc3Qgc2xpZGVzID0gZGF0YUl0ZW0uZ2FsbGVyeS5tYXAoKGltYWdlKSA9PiB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBgXHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNsaWRlci1tYWluX19pdGVtIHN3aXBlci1zbGlkZVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke2ltYWdlfVwiIGFsdD1cItC40LfQvtCx0YDQsNC20LXQvdC40LVcIj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0YDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHByb2RNb2RhbFByZXZpZXcuaW5uZXJIVE1MID0gcHJldmlldy5qb2luKCcnKTtcclxuXHRcdFx0XHRcdHByb2RNb2RhbFNsaWRlci5pbm5lckhUTUwgPSBzbGlkZXMuam9pbignJyk7XHJcblxyXG5cdFx0XHRcdFx0Ly8g0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0YLQvtCy0LDRgNC1XHJcblx0XHRcdFx0XHRjb25zdCBzaXplcyA9IGRhdGFJdGVtLnNpemVzLm1hcCgoc2l6ZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYFxyXG5cdFx0XHRcdFx0XHRcdDxsaSBjbGFzcz1cIm1vZGFsLWluZm9fX2l0ZW0tc2l6ZVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImJ0bi1yZXNldCBtb2RhbC1pbmZvX19zaXplXCI+JHtzaXplfTwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRwcm9kTW9kYWxJbmZvLmlubmVySFRNTCA9IGBcclxuXHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwibW9kYWwtaW5mb19fdGl0bGVcIj4ke2RhdGFJdGVtLnRpdGxlfTwvaDM+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1pbmZvX19yYXRlXCI+XHJcblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJpbWcvc3Rhci5zdmdcIiBhbHQ9XCLQoNC10LnRgtC40L3QsyA1INC40LcgNVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaW1nL3N0YXIuc3ZnXCIgYWx0PVwiXCI+XHJcblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJpbWcvc3Rhci5zdmdcIiBhbHQ9XCJcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cImltZy9zdGFyLnN2Z1wiIGFsdD1cIlwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaW1nL3N0YXIuc3ZnXCIgYWx0PVwiXCI+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtaW5mb19fc2l6ZXNcIj5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm1vZGFsLWluZm9fX3N1YnRpdGxlXCI+0JLRi9Cx0LXRgNC40YLQtSDRgNCw0LfQvNC10YA8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzPVwibW9kYWwtaW5mb19fc2l6ZXMtbGlzdCBsaXN0LXJlc2V0XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQke3NpemVzLmpvaW4oJycpfVxyXG5cdFx0XHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtaW5mb19fcHJpY2VcIj5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm1vZGFsLWluZm9fX2N1cnJlbnQtcHJpY2VcIj4ke2RhdGFJdGVtLnByaWNlfSDRgDwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm1vZGFsLWluZm9fX29sZC1wcmljZVwiPiR7ZGF0YUl0ZW0ub2xkUHJpY2UgPyBkYXRhSXRlbS5vbGRQcmljZSArICcg0YAnIDogJyd9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdCAgYDtcclxuXHJcblx0XHRcdFx0XHQvLyDQntC/0LjRgdCw0L3QuNC1XHJcblx0XHRcdFx0XHRwcm9kTW9kYWxEZXNjci50ZXh0Q29udGVudCA9IGRhdGFJdGVtLmRlc2NyaXB0aW9uO1xyXG5cclxuXHRcdFx0XHRcdC8vINCl0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuXHRcdFx0XHRcdGxldCBjaGFyc0l0ZW1zID0gJyc7XHJcblxyXG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoZGF0YUl0ZW0uY2hhcnMpLmZvckVhY2goZnVuY3Rpb24gZWFjaEtleShrZXkpIHtcclxuXHRcdFx0XHRcdFx0Y2hhcnNJdGVtcyArPSBgPHAgY2xhc3M9XCJtb2RhbC1jaGFyX19pdGVtXCI+JHtrZXl9OiAke2RhdGFJdGVtLmNoYXJzW2tleV19PC9wPmBcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cHJvZE1vZGFsQ2hhcnMuaW5uZXJIVE1MID0gY2hhcnNJdGVtcztcclxuXHJcblx0XHRcdFx0XHQvLyDQktC40LTQtdC+XHJcblx0XHRcdFx0XHRpZiAoZGF0YUl0ZW0udmlkZW8pIHtcclxuXHRcdFx0XHRcdFx0cHJvZE1vZGFsVmlkZW8uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHRcdFx0XHRcdHByb2RNb2RhbFZpZGVvLmlubmVySFRNTCA9IGBcclxuXHRcdFx0XHRcdFx0XHQ8aWZyYW1lIHNyYz1cIiR7ZGF0YUl0ZW0udmlkZW99XCJcclxuXHRcdFx0XHRcdFx0XHRhbGxvdz1cImFjY2VsZXJvbWV0ZXI7IGF1dG9wbGF5OyBjbGlwYm9hcmQtd3JpdGU7IGVuY3J5cHRlZC1tZWRpYTsgZ3lyb3Njb3BlOyBwaWN0dXJlLWluLXBpY3R1cmVcIlxyXG5cdFx0XHRcdFx0XHRcdGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cclxuXHRcdFx0XHRcdFx0YDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1vZGFsU2xpZGVyKCk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coKCdlcnJvcicsIHJlc3BvbnNlLnN0YXR1cykpO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG4gIFxyXG5cdC8vIGNhdGFsb2dNb3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHQvLyBcdC8vKiArMyAtINC00L7QsdCw0LLQu9GP0YLRjCDQv9C+INC3INC60LDRgNGC0L7Rh9C60Lgg0YLQvtCy0LDRgNCwXHJcblx0Ly8gXHRwcm9kUXVhbnRpdHkgPSBwcm9kUXVhbnRpdHkgKyBhZGRRdWFudGl0eTtcclxuXHQvLyBcdGdldFByb2R1Y3RzKHByb2RRdWFudGl0eSk7XHJcblx0Ly8gXHRpZiAocHJvZFF1YW50aXR5ID49IGRhdGFMZW5ndGgpIHtcclxuXHQvLyBcdFx0Y2F0YWxvZ01vcmUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHQvLyBcdH0gZWxzZSB7XHJcblx0Ly8gXHRcdGNhdGFsb2dNb3JlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0pO1xyXG5cclxufSIsImNvbnN0IGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpO1xyXG5cclxuaWYgKGZvcm1zLmxlbmd0aCA+IDApIHtcclxuXHRmb3Jtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGxldCBmb3JtID0gZS50YXJnZXQ7XHRcclxuXHRcdFx0bGV0IGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRcdFx0Ly8gbGV0IGZpbGVOYW1lID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19uYW1lJyk7IC8vINC10YHQu9C4INC10YHRgtGMINC30LDQs9GA0YPQt9C60LAg0YTQsNC50LvQsCAo0LIg0LDRgtGA0LjQsdGD0YIg0LTQvtCx0LDQstC40YLRjCBmaWxlKVxyXG5cdFx0XHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdFx0XHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0XHRcdGZvcm1SZW1vdmVFcnJvcihmb3JtKTtcclxuXHJcblx0XHRcdFx0Ly8qID09PT09PT09INCh0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YLQv9GA0LDQstC60LUgPT09PT09PT09PT09XHJcblx0XHRcdFx0bGV0IHRleHRNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1tZXNzYWdlJyk7XHJcblx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQl9Cw0LPRgNGD0LfQutCwLi4uJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8qINCX0LDQv9C40YHRjCDQvdCw0LfQstCw0L3QuNGPINGH0LXQutCx0L7QutGB0LAg0LIgdmFsdWUg0LjQvdC/0YPRgtCwINGH0LXQutCx0L7QutGB0LAgKNC10YHQu9C4INC10YHRgtGMINGH0LXQutCx0L7QutGB0YspXHJcblx0XHRcdFx0Ly8gaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdC8vIFx0aWYgKGlucHV0LnR5cGUgPT0gJ2NoZWNrYm94JyB8fCBpbnB1dC50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdFx0XHQvLyBcdFx0aW5wdXQudmFsdWUgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQ7XHJcblx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0Ly8gfSk7XHJcblxyXG5cdFx0XHRcdC8vKj09PT09PT09PSBGb3JtRGF0YSA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdFx0Y29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoaXRlbSk7XHJcblx0XHRcdFx0Ly8gZm9ybURhdGEuYXBwZW5kKCdpbWFnZScsIGZvcm1JbWFnZS5maWxlc1swXSk7XHJcblxyXG5cdFx0XHRcdC8vKiA9PT09PSDQn9GA0L7QstC10YDQutCwINGE0L7RgNC80YsgPT09PT1cclxuXHRcdFx0XHQvLyBmb3IodmFyIHBhaXIgb2YgZm9ybURhdGEuZW50cmllcygpKSB7XHJcblx0XHRcdFx0Ly8gXHRjb25zb2xlLmxvZyhwYWlyWzBdKyAnLCAnKyBwYWlyWzFdKTtcclxuXHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdC8vKj09PT09PT09PSDQntGC0L/RgNCw0LLQutCwINC00LDQvdC90YvRhSA9PT09PT09PT09PT09PT1cclxuXHRcdFx0XHRjb25zdCBwb3N0RGF0YSA9IGFzeW5jICh1cmwsIGRhdGEpID0+IHtcclxuXHRcdFx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG5cdFx0XHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdFx0XHRib2R5OiBkYXRhXHJcblx0XHRcdFx0XHR9KTtcdFxyXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpOyAvLyBqc29uKCkgLSDQtNC70Y8g0LLRi9Cy0L7QtNCwINGB0L7QvtCx0YnQtdC90LjRjztcclxuXHRcdFx0XHRcdFx0YWxlcnQocmVzdWx0Lm1lc3NhZ2UpO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTsgLy8gdGV4dCgpIC0g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSwg0L/QvtC00LrQu9GO0YfQuNGC0Ywgc2VydmVyLnBocClcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzdWx0KTsgLy8g0Y3RgtC+INC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LVcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9Ch0L/QsNGB0LjQsdC+LCDRgdC60L7RgNC+INC80Ysg0YEg0LLQsNC80Lgg0YHQstGP0LbQuNC80YHRjyEnO1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNsZWFySW5wdXRzKGlucHV0cyk7XHJcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIGFsZXJ0KFwi0J7RiNC40LHQutCwXCIpO1xyXG5cdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSwgNTAwMCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRwb3N0RGF0YSgnLi4vc2VuZG1haWwucGhwJywgZm9ybURhdGEpO1xyXG5cdFx0XHRcdC8vIHBvc3REYXRhKCcuLi9zZXJ2ZXIucGhwJywgZm9ybURhdGEpIC8vISDRg9Cx0YDQsNGC0YwgKNGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSIsImNvbnN0IGxhenlJbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1zcmNdLHNvdXJjZVtkYXRhLXNyY3NldF0nKTtcclxuY29uc3QgbG9hZE1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkLW1hcCcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKCkgPT4ge1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0aWYgKGxhenlJbWFnZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0bGF6eUltYWdlcy5mb3JFYWNoKGltZyA9PiB7XHJcblx0XHRcdGxldCBpbWdPZmZzZXQgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgcGFnZVlPZmZzZXQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2Nyb2xsWSA+PSBpbWdPZmZzZXQgLSAxMDAwKSB7XHJcblx0XHRcdFx0aWYgKGltZy5kYXRhc2V0LnNyYykge1xyXG5cdFx0XHRcdFx0aW1nLnNyYyA9IGltZy5kYXRhc2V0LnNyYztcclxuXHRcdFx0XHRcdGltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpbWcuZGF0YXNldC5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdGltZy5zcmNzZXQgPSBpbWcuZGF0YXNldC5zcmNzZXQ7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyY3NldCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vTWFwXHJcblx0Ly8gaWYgKCFsb2FkTWFwLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVkJykpIHtcclxuXHQvLyBcdGxldCBtYXBPZmZzZXQgPSBsb2FkTWFwLm9mZnNldFRvcDtcclxuXHQvLyBcdGlmIChzY3JvbGxZID49IG1hcE9mZnNldCAtIDIwMCkge1xyXG5cdC8vIFx0XHRjb25zdCBsb2FkTWFwVXJsID0gbG9hZE1hcC5kYXRhc2V0Lm1hcDtcclxuXHQvLyBcdFx0aWYgKGxvYWRNYXBVcmwpIHtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmluc2VydEFkamFjZW50SFRNTChcclxuXHQvLyBcdFx0XHRcdFwiYmVmb3JlZW5kXCIsXHJcblx0Ly8gXHRcdFx0XHRgPGlmcmFtZSBzcmM9XCIke2xvYWRNYXBVcmx9XCIgc3R5bGU9XCJib3JkZXI6MDtcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBsb2FkaW5nPVwibGF6eVwiPjwvaWZyYW1lPmBcclxuXHQvLyBcdFx0XHQpO1xyXG5cdC8vIFx0XHRcdGxvYWRNYXAuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcbn0pOyIsImxldCBmbGFnID0gMDtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbigpe1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0bGV0IG1hcE9mZnNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFwXCIpLm9mZnNldFRvcDtcclxuXHJcblx0aWYgKChzY3JvbGxZID49IG1hcE9mZnNldCAtIDUwMCkgJiYgKGZsYWcgPT0gMCkpIHtcclxuXHRcdHltYXBzLnJlYWR5KGluaXQpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGluaXQoKXtcclxuXHRcdFx0Y29uc3QgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKFwibWFwXCIsIHtcclxuXHRcdFx0XHRjZW50ZXI6IFs1OS44MzA0ODEsIDMwLjE0MjE5N10sXHJcblx0XHRcdFx0em9vbTogMTAsXHJcblx0XHRcdFx0Y29udHJvbHM6IFtdXHJcblx0XHRcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBteVBsYWNlbWFyayAgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKFs1OS44MzA0ODEsIDMwLjE0MjE5N10sIHt9LCB7XHJcblx0XHRcdFx0aWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxyXG5cdFx0XHRcdGljb25JbWFnZUhyZWY6ICdpbWcvcGxhY2VtYXJrLnBuZycsXHJcblx0XHRcdFx0aWNvbkltYWdlU2l6ZTogWzI1LCAzNF0sXHJcblx0XHRcdFx0aWNvbkltYWdlT2Zmc2V0OiBbLTE5LCAtNDRdXHJcblx0XHRcdH0pO1x0XHRcdFxyXG5cdFx0XHRteU1hcC5nZW9PYmplY3RzLmFkZChteVBsYWNlbWFyayk7XHJcblx0XHRcdG15TWFwLmJlaGF2aW9ycy5kaXNhYmxlKFsnc2Nyb2xsWm9vbSddKTtcclxuXHRcdH1cclxuXHJcblx0XHRmbGFnID0gMTtcclxuXHR9XHJcbn0pOyIsImxldCBzZXRDdXJzb3JQb3NpdGlvbiA9IChwb3MsIGVsZW0pID0+IHtcclxuICAgIGVsZW0uZm9jdXMoKTtcclxuICAgIGlmIChlbGVtLnNldFNlbGVjdGlvblJhbmdlKSB7XHJcbiAgICAgICAgZWxlbS5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XHJcbiAgICB9IGVsc2UgaWYgKGVsZW0uY3JlYXRlVGV4dFJhbmdlKSB7XHJcbiAgICAgICAgbGV0IHJhbmdlID0gZWxlbS5jcmVhdGVUZXh0UmFuZ2UoKTtcclxuXHJcbiAgICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSk7XHJcbiAgICAgICAgcmFuZ2UubW92ZUVuZCgnY2hhcmFjdGVyJywgcG9zKTtcclxuICAgICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHBvcyk7XHJcbiAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XHJcbiAgICB9XHJcbn07XHJcbmZ1bmN0aW9uIGNyZWF0ZU1hc2soZXZlbnQpIHtcclxuICAgIGxldCBtYXRyaXggPSAnKzcgKF9fXykgX19fIF9fIF9fJyxcclxuICAgICAgICBpID0gMCxcclxuICAgICAgICBkZWYgPSBtYXRyaXgucmVwbGFjZSgvXFxEL2csICcnKSxcclxuICAgICAgICB2YWwgPSB0aGlzLnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XHJcbiAgICBpZiAoZGVmLmxlbmd0aCA+PSB2YWwubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFsID0gZGVmO1xyXG4gICAgfVxyXG4gICAgdGhpcy52YWx1ZSA9IG1hdHJpeC5yZXBsYWNlKC8uL2csIGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gL1tfXFxkXS8udGVzdChhKSAmJiBpIDwgdmFsLmxlbmd0aCA/IHZhbC5jaGFyQXQoaSsrKSA6IGkgPj0gdmFsLmxlbmd0aCA/ICcnIDogYTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09J2JsdXInKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09IDIgfHwgdGhpcy52YWx1ZS5sZW5ndGggPCBtYXRyaXgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSAnJztcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09J2tleXVwJyB8fCBldmVudC50eXBlID09PSdtb3VzZXVwJykge1xyXG4gICAgICAgIGxldCBjdXIgPSB0aGlzLnNlbGVjdGlvblN0YXJ0O1xyXG4gICAgICAgIGlmIChjdXIgPT0gJzAnKSB7XHJcbiAgICAgICAgICAgIHNldEN1cnNvclBvc2l0aW9uKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldEN1cnNvclBvc2l0aW9uKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzKTsgICAgICAgIFxyXG4gICAgfVxyXG59XHJcbmxldCB0ZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGVsJyk7XHJcbnRlbC5mb3JFYWNoKGlucHV0ID0+IHtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY3JlYXRlTWFzayk7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjcmVhdGVNYXNrKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBjcmVhdGVNYXNrKTtcclxufSk7IiwiY29uc3QgY2FydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0Jyk7XHJcbmNvbnN0IG1pbmlDYXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1pbmktY2FydCcpO1xyXG5jb25zdCBtaW5pQ2FydEl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWluaS1jYXJ0X19pdGVtJyk7XHJcblxyXG5jYXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdG1pbmlDYXJ0LmNsYXNzTGlzdC50b2dnbGUoJ21pbmktY2FydC0tb3BlbicpO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWluaS1jYXJ0JykgJiYgIWUudGFyZ2V0LmNsb3Nlc3QoJy5taW5pLWNhcnQnKSAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJ0JykpIHtcclxuXHRcdG1pbmlDYXJ0LmNsYXNzTGlzdC5yZW1vdmUoJ21pbmktY2FydC0tb3BlbicpO1xyXG5cdH1cclxufSk7XHJcblxyXG5taW5pQ2FydEl0ZW0uZm9yRWFjaChpdGVtID0+IHtcclxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdFxyXG5cdFx0bWluaUNhcnRJdGVtLmZvckVhY2goYnRuID0+IHtcclxuXHRcdFx0aWYgKCFidG4uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcblx0XHRcdFx0YnRuLmNsYXNzTGlzdC5yZW1vdmUoJ21pbmktY2FydF9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnbWluaS1jYXJ0X19pdGVtLS1hY3RpdmUnKTtcclxuXHR9KTtcclxufSk7IiwiLy8/INCf0LDRgNCw0LzQtdGC0YDRizpcclxuLy8qIGJ0blNlbGVjdG9yIC0g0LrQvdC+0L/QutCwINC+0YLQutGA0YvRgtC40Y8g0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LBcclxuLy8qIG1vZGFsU2VsZWN0b3IgLSDQvNC+0LTQsNC70YzQvdC+0LUg0L7QutC90L4g0LLQvdGD0YLRgNC4INGE0L7QvdCwIG1vZGFsXHJcblxyXG4vLz8g0Y3RgtC4INC/0LDRgNCy0LzQtdGC0YDRiyDQvNC10L3Rj9GC0Ywg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4sINC70LjQsdC+INGD0LrQsNC30YvQstCw0YLRjCDQuNGFINC60LDQuiDQsNGA0LPRg9C80LXQvdGCLCDQtdGB0LvQuCDQvtC90Lgg0YDQsNC30L3Ri9C1INC00LvRjyDRgNCw0LfQvdGL0YUg0L7QutC+0L1cclxuLy8qIGFuaW1hdGUgLSDQsNC90LjQvNCw0YbQuNGPINC/0YDQuCDQvtGC0LrRgNGL0YLQuNC4INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwICjQutC+0L3RgtC10L3RgtCwINCy0L3Rg9GC0YDQuCDQvtCx0L7Qu9C+0YfQutC4KVxyXG4vLyogc3BlZWQgLSDQstGA0LXQvNGPINCy0YvQv9C+0LvQvdC10L3QuNGPLCDRgdGC0LDQstC40YLRgdGPINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQuCDRgSAkdHJhbnNpdGlvbi10aW1lXHJcblxyXG4vL1RPRE8g0JTQvtCx0LDQstC40YLRjCDQutC70LDRgdGB0Ys6XHJcbi8vKiBkYXRhLW1vZGFsIC0g0LTQvtCx0LDQstC40YLRjCDQstGB0LXQvCDQvNC+0LTQsNC70YzQvdGL0Lwg0L7QutC90LDQvCAobW9kYWwtbmFtZSkgKNC10YHQu9C4INC40YUg0L3QtdGB0LrQvtC70YzQutC+KVxyXG4vLyogYmxvY2stZml4IC0g0LTQvtCx0LDQstC40YLRjCDQutC70LDRgdGBINC00LvRjyDQsdC70L7QutC+0LIg0YEgcG9zaXRpb246IGFic29sdXRlINC40LvQuCBmaXhlZCAo0LTQvtCx0LDQstC40YLRgdGPIHBhZGRpbmcpXHJcbi8vKiBzbWFsbC1maXggLSDQtNC+0LHQsNCy0LjRgtGMINC60LvQsNGB0YEg0LTQu9GPINC80LDQu9C10L3RjNC60LjRhSDQsdC70L7QutC+0LIg0YEgcG9zaXRpb246IGFic29sdXRlINC40LvQuCBmaXhlZCAo0LTQvtCx0LDQstC40YLRgdGPIG1hcmdpbilcclxuLy8qIGRhdGEtaW5zaWRlIC0g0LTQvtCx0LDQstC40YLRjCDQutC90L7Qv9C60LDQvCDQstC90YPRgtGA0Lgg0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LAsINC60L7RgtC+0YDRi9C1INC+0YLQutGA0YvQstCw0Y7RgiDRgdC70LXQtNGD0Y7RidC10LUg0LzQvtC00LDQu9GM0L3QvtC1INC+0LrQvdC+ICjRh9GC0L4g0LHRiyDRgdC+0YXRgNCw0L3QuNGC0Ywg0YTQvtC60YPRgSDQvdCwINC60L3QvtC/0LrQtSDQstC90LUg0L7QutC90LApXHJcblxyXG5iaW5kTW9kYWwoJy5jYXJ0LWJ0bicsICcubW9kYWwtY2FydCcpO1xyXG5cclxubGV0IGxhc3RGb2N1cyA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gYmluZE1vZGFsKGJ0blNlbGVjdG9yLCBtb2RhbFNlbGVjdG9yLCBmdW5jLCBhbmltYXRlPSdmYWRlJywgc3BlZWQ9NTAwLCkge1xyXG4gICAgY29uc3QgbW9kYWxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGJ0blNlbGVjdG9yKTtcclxuXHRjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1vdmVybGF5Jyk7XHJcblx0Y29uc3QgbW9kYWxDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihtb2RhbFNlbGVjdG9yKTtcclxuXHRjb25zdCBtb2RhbGNsb3NlID0gbW9kYWxDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UnKTtcclxuXHRjb25zdCBvcGVuV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZGFsXScpO1xyXG5cdGNvbnN0IGZpeEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ibG9jay1maXggJyk7XHJcblx0Y29uc3QgZml4U21hbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc21hbGwtZml4Jyk7XHJcblx0Y29uc3Qgc3BlZWRUaW1lID0gKHNwZWVkKTtcclxuXHQvLyBjb25zdCBtb2RhbEFuaW1hdGlvbiA9IGFuaW1hdGU7XHJcbiAgICBjb25zdCBtb2RhbFNjcm9sbCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aDtcclxuICAgIGNvbnN0IGZvY3VzRWxlbWVudHMgPSBbXHJcblx0XHQnYVtocmVmXScsXHJcblx0XHQnaW5wdXQnLFxyXG5cdFx0J3NlbGVjdCcsXHJcblx0XHQndGV4dGFyZWEnLFxyXG5cdFx0J2J1dHRvbicsXHJcblx0XHQnaWZyYW1lJyxcclxuXHRcdCdbY29udGVudGVkaXRhYmxlXScsXHJcblx0XHQnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4Xj1cIi1cIl0pJ1xyXG5cdF07XHJcblx0XHJcblx0aWYgKG1vZGFsKSB7XHJcblx0XHRtb2RhbEJ0bi5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gZS50YXJnZXRcclxuXHRcdFx0XHRpZiAodGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRvcGVuTW9kYWwodGFyZ2V0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0XHJcblx0XHRtb2RhbGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHRpZiAobW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtb3BlblwiKSkge1xyXG5cdFx0XHRcdGNsb3NlTW9kYWwoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRcdGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsLW92ZXJsYXknKSAmJiBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1vcGVuXCIpKSB7XHJcblx0XHRcdFx0Y2xvc2VNb2RhbCgpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcblx0XHRcdGlmIChlLmNvZGUgPT09ICdFc2NhcGUnICYmIG1vZGFsLmNsYXNzTGlzdC5jb250YWlucyhcImlzLW9wZW5cIikpIHtcclxuXHRcdFx0XHRjbG9zZU1vZGFsKCk7XHJcblx0XHRcdH1cclxuXHRcclxuXHRcdFx0aWYgKGUuY29kZSA9PT0gJ1RhYicgJiYgbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtb3BlblwiKSkge1xyXG5cdFx0XHRcdGZvY3VzQ2F0Y2goZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBvcGVuTW9kYWwodGFyKSB7XHJcblx0XHRpZiAoIXRhci5jbG9zZXN0KGBbZGF0YS1pbnNpZGVdYCkpIHtcclxuXHRcdFx0bGFzdEZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuXHRcdH1cclxuXHJcblx0XHRvcGVuV2luZG93cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuXHRcdFx0aXRlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcblx0XHRcdC8vIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZS1vcGVuJyk7XHJcblx0XHRcdC8vIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShtb2RhbEFuaW1hdGlvbik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoIW1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnaXMtb3BlbicpKXtcclxuXHRcdFx0ZGlzYWJsZVNjcm9sbCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtb2RhbENvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC1wcm9kJykpIHtcclxuXHRcdFx0bGV0IG9wZW5CdG5JZCA9IGxhc3RGb2N1cy5kYXRhc2V0LmlkO1x0XHJcblx0XHRcdGZ1bmMob3BlbkJ0bklkKTtcclxuXHRcdH1cclxuXHJcblx0XHRtb2RhbC5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuJyk7XHJcblx0XHRtb2RhbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke21vZGFsU2Nyb2xsfXB4YDtcclxuXHRcdGlmIChmaXhCbG9ja3MubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmaXhCbG9ja3MuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0XHRpdGVtLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke21vZGFsU2Nyb2xsfXB4YDtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHRcdGlmIChmaXhTbWFsbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZpeFNtYWxsLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5zdHlsZS5tYXJnaW5SaWdodCA9IGAke21vZGFsU2Nyb2xsfXB4YDtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRtb2RhbENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpO1xyXG5cdFx0bW9kYWxDb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XHJcblx0XHQvLyBtb2RhbENvbnRlbnQuY2xhc3NMaXN0LmFkZChtb2RhbEFuaW1hdGlvbik7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdC8vIG1vZGFsQ29udGVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlLW9wZW4nKTtcclxuXHRcdFx0Zm9jdXNUcmFwKCk7XHJcblx0XHR9LCBzcGVlZFRpbWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuXHRcdG9wZW5XaW5kb3dzLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG5cdFx0XHRpdGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcclxuXHRcdFx0Ly8gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlLW9wZW4nKTtcclxuXHRcdFx0Ly8gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKG1vZGFsQW5pbWF0aW9uKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGVuYWJsZVNjcm9sbCgpO1xyXG5cclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gYDBweGA7XHJcblx0XHRpZiAoZml4QmxvY2tzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zml4QmxvY2tzLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgMHB4YDtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHRcdGlmIChmaXhTbWFsbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZpeFNtYWxsLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdFx0aXRlbS5zdHlsZS5tYXJnaW5SaWdodCA9IGAwcHhgO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcclxuXHRcdG1vZGFsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuXHJcblx0XHRmb2N1c1RyYXAoKTtcclxuXHR9XHJcblxyXG4gICAgZnVuY3Rpb24gZGlzYWJsZVNjcm9sbCgpIHtcclxuICAgICAgICBsZXQgcGFnZVBvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtbG9jaycpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5wb3NpdGlvbiA9IHBhZ2VQb3NpdGlvbjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IC1wYWdlUG9zaXRpb24gKyAncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVuYWJsZVNjcm9sbCgpIHtcclxuICAgICAgICBsZXQgcGFnZVBvc2l0aW9uID0gcGFyc2VJbnQoZG9jdW1lbnQuYm9keS5kYXRhc2V0LnBvc2l0aW9uLCAxMCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAnJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1sb2NrJyk7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbCh7IHRvcDogcGFnZVBvc2l0aW9uLCBsZWZ0OiAwIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXBvc2l0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZm9jdXNUcmFwKCkge1xyXG5cdFx0Ly8gY29uc3Qgbm9kZXMgPSB0aGlzLm1vZGFsQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5fZm9jdXNFbGVtZW50cyk7IC8vKiDQtNC70Y8g0YTQvtC60YPRgdCwINC90LAg0L/QtdGA0LLQvtC8INGN0LvQtdC80LXQvdGC0LUg0L7QutC90LBcclxuXHRcdGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1vcGVuXCIpKSB7XHJcbiAgICAgICAgICAgIG1vZGFsLmZvY3VzKCk7XHJcblx0XHRcdC8vIGlmIChub2Rlcy5sZW5ndGgpIG5vZGVzWzBdLmZvY3VzKCk7IC8vKiDQtNC70Y8g0YTQvtC60YPRgdCwINC90LAg0L/QtdGA0LLQvtC8INGN0LvQtdC80LXQvdGC0LUg0L7QutC90LBcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxhc3RGb2N1cy5mb2N1cygpO1x0XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmb2N1c0NhdGNoKGUpIHtcclxuXHRcdGNvbnN0IGZvY3VzYWJsZSA9IG1vZGFsQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzRWxlbWVudHMpO1xyXG5cdFx0Y29uc3QgZm9jdXNBcnJheSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZvY3VzYWJsZSk7XHJcblx0XHRjb25zdCBmb2N1c2VkSW5kZXggPSBmb2N1c0FycmF5LmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcblxyXG5cdFx0aWYgKGUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSAwKSB7XHJcblx0XHRcdGZvY3VzQXJyYXlbZm9jdXNBcnJheS5sZW5ndGggLSAxXS5mb2N1cygpO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gZm9jdXNBcnJheS5sZW5ndGggLSAxKSB7XHJcblx0XHRcdGZvY3VzQXJyYXlbMF0uZm9jdXMoKTtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiLCJjb25zdCBxdWl6Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LWZvcm0nKTtcclxuY29uc3QgcXVpeklucHV0cyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcbmNvbnN0IHF1aXpCbG9ja3MgPSBxdWl6Rm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcucXVpei1ibG9jaycpO1xyXG5cclxubGV0IHRleHRhcmVhVGV4dCA9IG51bGw7XHJcbmxldCBxdWl6UmVwbHkgID0ge307XHJcbmxldCBibG9ja0luZGV4ID0gMDtcclxuXHJcbi8vINGE0YPQvdC60YbQuNGPINC/0L7QutCw0LfQsCDRgtC+0LvRjNC60L4g0L/QtdGA0LLQvtCz0L4g0LHQu9C+0LrQsCDQutCy0LjQt9CwXHJcbnNob3dCbG9ja3MoYmxvY2tJbmRleCk7XHJcblxyXG5mdW5jdGlvbiBzaG93QmxvY2tzKCkge1xyXG5cdHF1aXpCbG9ja3MuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnKTtcclxuXHRxdWl6QmxvY2tzW2Jsb2NrSW5kZXhdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG59XHJcblxyXG4vLyDQt9Cw0L/QuNGB0Ywg0L3QsNC30LLQsNC90LjRjyDRh9C10LrQsdC+0LrRgdCwINCyIHZhbHVlINC40L3Qv9GD0YLQsCDRh9C10LrQsdC+0LrRgdCwXHJcbnF1aXpJbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0aWYgKGlucHV0LnR5cGUgPT0gJ2NoZWNrYm94JyB8fCBpbnB1dC50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdGlucHV0LnZhbHVlID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nLnRleHRDb250ZW50O1xyXG5cdH1cclxufSk7XHJcblxyXG5xdWl6Rm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0bGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cdGxldCBibG9jayA9IHRhcmdldC5jbG9zZXN0KCcucXVpei1ibG9jaycpO1xyXG5cdGxldCBuZXh0QnRuID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbmV4dF0nKTtcclxuXHRuZXh0QnRuLmZvckVhY2goYnRuID0+IHtcclxuXHRcdGlmICh0YXJnZXQgPT0gYnRuKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0YWRkVG9TZW5kKGJsb2NrLCBxdWl6UmVwbHkpO1xyXG5cdFx0XHRuZXh0UXVlc3Rpb24oYmxvY2spO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdGlmICh0YXJnZXQgPT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2VuZF0nKSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0YWRkVG9TZW5kKGJsb2NrLCBxdWl6UmVwbHkpO1xyXG5cdFx0c2VuZChibG9jayk7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG5leHRRdWVzdGlvbihmb3JtKSB7XHJcblx0bGV0IHZhbGlkID0gdmFsaWRJbnB1dChmb3JtKTtcclxuXHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0c2hvd0Jsb2NrcyhibG9ja0luZGV4ICs9IDEpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2VuZChmb3JtKSB7XHJcblx0bGV0IHZhbGlkID0gdmFsaWRJbnB1dChmb3JtKTtcclxuXHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0Zm9ybVJlbW92ZUVycm9yKHF1aXpGb3JtKTtcclxuXHJcblx0XHQvLyogPT09PT09PT0g0KHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RgtC/0YDQsNCy0LrQtSA9PT09PT09PT09PT1cclxuXHRcdGxldCBvayA9IGZvcm0ucXVlcnlTZWxlY3RvcignLnF1aXotc2VuZF9fb2snKTtcclxuXHRcdGxldCB0ZXh0TWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLnF1aXotbWVzc2FnZScpO1xyXG5cdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9CX0LDQs9GA0YPQt9C60LAuLi4nO1xyXG5cdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyo9PT09PT09PT0gRm9ybURhdGEgPT09PT09PT09PT09PT09XHJcblx0XHRjb25zdCBxdWl6Rm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBxdWl6UmVwbHkpIHtcclxuXHRcdFx0cXVpekZvcm1EYXRhLmFwcGVuZChrZXksIHF1aXpSZXBseVtrZXldKTtcclxuXHRcdH1cclxuXHRcdC8vIGZvcm1EYXRhLmFwcGVuZCgnaW1hZ2UnLCBmb3JtSW1hZ2UuZmlsZXNbMF0pO1xyXG5cdFx0Ly8qINCf0YDQvtCy0LXRgNC60LAgRm9ybURhdGFcclxuXHRcdC8vIGZvcih2YXIgcGFpciBvZiBxdWl6Rm9ybURhdGEuZW50cmllcygpKSB7XHJcblx0XHQvLyBcdGNvbnNvbGUubG9nKHBhaXJbMF0rICc6ICcrIHBhaXJbMV0pO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vKj09PT09PT09PSDQntGC0L/RgNCw0LLQutCwINC00LDQvdC90YvRhSA9PT09PT09PT09PT09PT1cclxuXHRcdGNvbnN0IHF1aXpEYXRhID0gYXN5bmMgKHVybCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcclxuXHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdGJvZHk6IGRhdGFcclxuXHRcdFx0fSk7XHRcclxuXHRcdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblxyXG5cdFx0XHRcdC8vIGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7IC8vIGpzb24oKSAtINC00LvRjyDQstGL0LLQvtC00LAg0YHQvtC+0LHRidC10L3QuNGPO1xyXG5cdFx0XHRcdC8vIGFsZXJ0KHJlc3VsdC5tZXNzYWdlKTtcclxuXHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTsgLy8gdGV4dCgpIC0g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSwg0L/QvtC00LrQu9GO0YfQuNGC0Ywgc2VydmVyLnBocClcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXN1bHQpOyAvLyDRjdGC0L4g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtVxyXG5cclxuXHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ09rISc7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2suY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0Y2xlYXJJbnB1dHMocXVpeklucHV0cyk7XHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRvay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhbGVydChcItCe0YjQuNCx0LrQsCBIVFRQOiBcIiArIHJlc3BvbnNlLnN0YXR1cyk7XHJcblx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdC8vIHF1aXpEYXRhKCcuLi9zZW5kbWFpbC5waHAnLCBxdWl6Rm9ybURhdGEpO1xyXG5cdFx0cXVpekRhdGEoJy4uL3NlcnZlci5waHAnLCBxdWl6Rm9ybURhdGEpIC8vISDRg9Cx0YDQsNGC0YwgKNGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1KVxyXG5cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvU2VuZChmb3JtLCBvYmopIHtcclxuXHRsZXQgdmFsdWVTdHJpbmcgPSAnJztcclxuXHRsZXQgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG5cdGxldCB0ZXh0YXJlYSA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKTtcclxuXHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBmaWVsZCA9IGlucHV0c1tpXTtcclxuXHRcdFx0aWYgKGZpZWxkLnR5cGUgIT0gJ2NoZWNrYm94JyAmJiBmaWVsZC50eXBlICE9ICdyYWRpbycgJiYgZmllbGQudmFsdWUpIHtcclxuXHRcdFx0XHRvYmpbZmllbGQubmFtZV0gPSBmaWVsZC52YWx1ZTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWVsZC50eXBlID09ICdyYWRpbycgJiYgZmllbGQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdG9ialtmaWVsZC5uYW1lXSA9IGZpZWxkLnZhbHVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gJ2NoZWNrYm94JyAmJiBmaWVsZC5jaGVja2VkKSB7XHJcblx0XHRcdFx0dmFsdWVTdHJpbmcgKz0gZmllbGQudmFsdWUgKyAnLCc7XHRcdFxyXG5cdFx0XHRcdG9ialtmaWVsZC5uYW1lXSA9IHZhbHVlU3RyaW5nO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSBlbHNlIGlmICh0ZXh0YXJlYS5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRleHRhcmVhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCB0ZXh0ID0gdGV4dGFyZWFbaV07XHJcblx0XHRcdGlmICh0ZXh0LnZhbHVlKSB7XHJcblx0XHRcdFx0b2JqW3RleHQubmFtZV0gPSB0ZXh0LnZhbHVlO1x0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0iLCJjb25zdCByYW5nZVNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5nZS1zbGlkZXInKTtcblxuaWYgKHJhbmdlU2xpZGVyKSB7XG5cdG5vVWlTbGlkZXIuY3JlYXRlKHJhbmdlU2xpZGVyLCB7XG4gICAgc3RhcnQ6IFs1MDAsIDk5OTk5OV0sXG5cdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRzdGVwOiAxLFxuICAgIHJhbmdlOiB7XG5cdFx0XHQnbWluJzogWzUwMF0sXG5cdFx0XHQnbWF4JzogWzk5OTk5OV1cbiAgICB9XG5cdH0pO1xuXG5cdGNvbnN0IGlucHV0MCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC0wJyk7XG5cdGNvbnN0IGlucHV0MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC0xJyk7XG5cdGNvbnN0IGlucHV0cyA9IFtpbnB1dDAsIGlucHV0MV07XG5cblx0cmFuZ2VTbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24odmFsdWVzLCBoYW5kbGUpe1xuXHRcdGlucHV0c1toYW5kbGVdLnZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZXNbaGFuZGxlXSk7XG5cdH0pO1xuXG5cdGNvbnN0IHNldFJhbmdlU2xpZGVyID0gKGksIHZhbHVlKSA9PiB7XG5cdFx0bGV0IGFyciA9IFtudWxsLCBudWxsXTtcblx0XHRhcnJbaV0gPSB2YWx1ZTtcblxuXHRcdGNvbnNvbGUubG9nKGFycik7XG5cblx0XHRyYW5nZVNsaWRlci5ub1VpU2xpZGVyLnNldChhcnIpO1xuXHR9O1xuXG5cdGlucHV0cy5mb3JFYWNoKChlbCwgaW5kZXgpID0+IHtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coaW5kZXgpO1xuXHRcdFx0c2V0UmFuZ2VTbGlkZXIoaW5kZXgsIGUuY3VycmVudFRhcmdldC52YWx1ZSk7XG5cdFx0fSk7XG5cdH0pO1xufSIsImxldCB0ZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRhbG9nLXNpemVzIHRkJyk7XHJcblxyXG50ZC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0bGV0IHNlbGYgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblx0XHRpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZGJiYmE5JztcclxuXHRcdHRkLmZvckVhY2goYnRuID0+IHtcclxuXHRcdFx0aWYgKGJ0biAhPT0gc2VsZikge1xyXG5cdFx0XHRcdGJ0bi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAndHJhbnNwYXJlbnQnO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSk7IiwiLy8gY29uc3QgbWluU2xpZGVyID0gbmV3IFN3aXBlcignLnNsaWRlci1taW4nLCB7XHJcbi8vIFx0Z3JhYkN1cnNvcjogdHJ1ZSxcclxuLy8gXHRzbGlkZXNQZXJWaWV3OiA2LFxyXG4vLyBcdGluaXRpYWxTbGlkZTogMCxcclxuLy8gXHQvLyBzcGFjZUJldHdlZW46IDIwLFxyXG4vLyBcdGZyZWVNb2RlOiB0cnVlLFxyXG4vLyB9KTtcclxuXHJcbi8vIGNvbnN0IG1haW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1haW4nLCB7XHJcbi8vIFx0Z3JhYkN1cnNvcjogdHJ1ZSxcclxuLy8gXHRzcGFjZUJldHdlZW46IDIwLFxyXG4vLyBcdHNsaWRlc1BlclZpZXc6IDEsXHJcbi8vIFx0aW5pdGlhbFNsaWRlOiAwLFxyXG4vLyBcdHNpbXVsYXRlVG91Y2g6IGZhbHNlLFxyXG4vLyBcdGVmZmVjdDogJ2ZhZGUnLFxyXG4vLyBcdGZhZGVFZmZlY3Q6IHtcclxuLy8gXHQgIGNyb3NzRmFkZTogdHJ1ZVxyXG4vLyBcdH0sXHJcbi8vIFx0dGh1bWJzOiB7XHJcbi8vIFx0XHRzd2lwZXI6IG1pblNsaWRlcixcclxuLy8gXHR9XHJcbi8vIH0pOyIsIi8vKiDQktCw0LvQuNC00LDRhtC40Y8g0YTQvtGA0LzRiyAo0LXRgdC70Lgg0YfQtdC60LHQvtC60YHRiyDQuCDQuNC90L/Rg9GC0Ysg0LIg0L7QtNC90L7QuSDRhNC+0YDQvNC1KVxyXG5mdW5jdGlvbiB2YWxpZENoZWNrKGZvcm0pIHtcclxuXHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IGlzVmFsaWQgPSBmYWxzZTtcclxuXHRpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBlbGVtZW50c1tpbmRleF07XHJcblx0XHRcdGlmICghaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3QtdmFsaWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcImNoZWNrYm94XCIgfHwgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJyYWRpb1wiKSB7XHJcblx0XHRcdFx0XHRpZiAoaW5wdXQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdFx0XHRpc1ZhbGlkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7aXNWYWxpZCA9IHRydWU7fVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7aXNWYWxpZCA9IHRydWU7fVxyXG5cclxuXHRyZXR1cm4gaXNWYWxpZDtcclxufVxyXG5mdW5jdGlvbiB2YWxpZElucHV0KGZvcm0pIHtcclxuXHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IGVycm9yID0gMDtcclxuXHRpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBlbGVtZW50c1tpbmRleF07XHJcblx0XHRcdGxldCBwbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpKSB7XHJcblx0XHRcdFx0aWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZW1haWwnKSkge1xyXG5cdFx0XHRcdFx0aWYgKGVtYWlsVGVzdChpbnB1dCkgfHwgaW5wdXQudmFsdWUgPT0gcGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGlucHV0LnZhbHVlID09ICcnIHx8IGlucHV0LnZhbHVlID09IHBsYWNlaG9sZGVyKSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHRcdGVycm9yKys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIdCy0LrQu9GO0YfQuNGC0YwsINC10YHQu9C4INC90LDQtNC+INCy0LDQu9C40LTQuNGA0L7QstCw0YLRjCB0ZXh0YXJlOlxyXG5cdC8vIGxldCB0ZXh0YXJlYSA9IGZvcm0ucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcclxuXHQvLyBpZiAodGV4dGFyZWEpIHtcclxuXHQvLyBcdGlmICh0ZXh0YXJlYS52YWx1ZSA9PSAnJykge1xyXG5cdC8vIFx0XHRmb3JtQWRkRXJyb3IodGV4dGFyZWEpO1xyXG5cdC8vIFx0XHRlcnJvcisrO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0gXHJcblxyXG5cdHJldHVybiBlcnJvcjtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybUFkZEVycm9yKGl0ZW0pIHtcclxuXHRpdGVtLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuXHRpdGVtLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcblxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMLCDQtdGB0LvQuCDQsiBodG1sINC00L7QsdCw0LLQu9C10L3RiyDQsdC70L7QutC4INGBINGB0L7QvtCx0YnQtdC90LjQtdC8INC+0LEg0L7RiNC40LHQutC1ICguZm9ybS1lcnJvcilcclxuXHQvLyog0LXRgdC70Lgg0YDQsNC30L3Ri9C5INGC0LXQutGB0YIg0L7RiNC40LHQutC4INC00LvRjyDQutCw0LbQtNC+0LPQviBpbnB1dFxyXG5cdC8vIGxldCBpbXB1dEVycm9yID0gaXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblx0Ly8gaWYgKGltcHV0RXJyb3IpIHtcclxuXHQvLyBcdGlmIChpbXB1dEVycm9yLmNsYXNzTGlzdC5jb250YWlucygnaW1wdXQtbWVzc2FnZScpKSB7XHJcblx0Ly8gXHRcdGltcHV0RXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cdC8vKiDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LTQu9GPINCy0YHQtdC5INGE0L7RgNC80YsgKNC40LvQuCDQsdC70L7QutCwINC60LLQuNC30LApOlxyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCDQtdGB0LvQuCDQvdCwINGB0LDQudGC0LUg0LXRgdGC0Ywg0LrQstC40LdcclxuXHRpZiAoaXRlbS5jbG9zZXN0KCcucXVpei1mb3JtJykpIHtcclxuXHRcdGxldCBxdWl6RXJyb3IgPSBpdGVtLmNsb3Nlc3QoJy5xdWl6LWJsb2NrJykucXVlcnlTZWxlY3RvcignLnF1aXotbWVzc2FnZScpO1xyXG5cdFx0aWYgKHF1aXpFcnJvcikge1xyXG5cdFx0XHRxdWl6RXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGxldCBmb3JtRXJyb3IgPSBpdGVtLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tbWVzc2FnZScpO1xyXG5cdFx0aWYgKGZvcm1FcnJvcikge1xyXG5cdFx0XHRmb3JtRXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCDQtdGB0LvQuCDQvdCwINGB0LDQudGC0LUg0L3QtdGCINC60LLQuNC30LAgKNGC0L7Qu9GM0LrQviDRhNC+0YDQvNGLKVxyXG5cdC8vIGxldCBmb3JtRXJyb3IgPSBpdGVtLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tZXJyb3InKTtcclxuXHQvLyBpZiAoZm9ybUVycm9yKSB7XHJcblx0Ly8gXHRmb3JtRXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0Ly8gfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtUmVtb3ZlRXJyb3IoZm9ybSkge1xyXG5cdGxldCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cdGlmIChpbnB1dHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGlucHV0cy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0bGV0IGlucHV0ID0gaW5wdXRzW2luZGV4XTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpKSB7XHJcblx0XHRcdFx0aW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cdFx0XHRcdGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwsINC10YHQu9C4INCyIGh0bWwg0LTQvtCx0LDQstC70LXQvdGLINCx0LvQvtC60Lgg0YEg0YHQvtC+0LHRidC10L3QuNC10Lwg0L7QsSDQvtGI0LjQsdC60LUgKC5mb3JtLWVycm9yKVxyXG5cdGxldCBmb3JtRXJyb3IgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtLW1lc3NhZ2UnKTtcclxuXHRpZiAoZm9ybUVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBmb3JtRXJyb3IubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGNvbnN0IGVycm9yID0gZm9ybUVycm9yW2luZGV4XTtcclxuXHRcdFx0ZXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbWFpbFRlc3Qoc2VsZWN0b3IpIHtcclxuXHRyZXR1cm4gIS9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7Miw4fSkrJC8udGVzdChzZWxlY3Rvci52YWx1ZSk7XHJcbn1cclxuXHJcbmNvbnN0IHRleHRJbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hlY2snKTsgICBcclxudGV4dElucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHQvLyDQtdGB0LvQuCDQt9C90LDRh9C10L3QuNC1INC60LvQsNCy0LjRiNC4KGUua2V5KSDQvdC1INGB0L7QvtGC0LLQtdGC0YHRgtCy0YPQtdGCKG1hdGNoKSDQutC40YDQuNC70LvQuNGG0LUsINC/0L7Qu9C1INC90LUg0LfQsNC/0L7Qu9C90Y/QtdGC0YHRj1xyXG5cdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYgKGUua2V5Lm1hdGNoKC9bXtCwLdGP0ZEgMC05XS9pZykpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdC8vINC10YHQu9C4INC/0YDQuCDQsNCy0YLQvtC30LDQv9C+0LvQvdC10L3QuNC4INCy0YvQsdGA0LDQvdC+INGB0LvQvtCy0L4g0L3QtSDQutC40YDQuNC70LvQuNGG0LXQuSwg0YHRgtGA0L7QutCwINC+0YfQuNGB0YLQuNGC0YHRj1xyXG5cdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnZhbHVlPXRoaXMudmFsdWUucmVwbGFjZSgvW15cXNCwLdGP0ZEgMC05XS9pZyxcIlwiKTtcclxuXHR9KTtcclxufSk7Il19
