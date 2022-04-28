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
    disableScroll();
    if (hamburger.classList.contains('active')) {
        hamburger.setAttribute('aria-label', 'закрыть навигацию');
    } else {
        hamburger.setAttribute('aria-label', 'открыть навигацию');
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
            enableScroll();
            hamburger.setAttribute('aria-label', 'открыть навигацию');
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

// scroll-lock
function disableScroll() {
	let pagePosition = window.scrollY;
	document.body.classList.add('scroll-lock');
	document.body.dataset.position = pagePosition;
	document.body.style.top = -pagePosition + 'px';
}

function enableScroll() {
	let pagePosition = parseInt(document.body.dataset.position, 10);
	document.body.style.top = 'auto';
	document.body.classList.remove('scroll-lock');
	window.scroll({ top: pagePosition, left: 0 });
	document.body.removeAttribute('data-position');
}

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
							textMessage.textContent = 'Ok!';
							textMessage.classList.add('active');
						}
						clearInputs(inputs);
						setTimeout(() => {
							if (textMessage) {
								textMessage.classList.remove('active');
							}
						}, 5000);
					} else {
						alert("Ошибка");
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
				// postData('../server.php', quizFormData) //! убрать (это для проверки на сервере)
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
//? Параметры:
//* triggerSelector - кнопка открытия модального окна
//* modalSelector - модальное окно внутри фона modal
//* closeSelector - крестик, закрывающий окно
//* speed - время выполнения, ставится в соответствии с $transition-time

//TODO Добавить классы:
//* data-modal - добавить всем модальным окнам (modal-name) (если их несколько)
//* lock - добавить класс для блоков с position: absolute или fixed (добавится padding)
//* small-lock - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)


bindModal('.modal-btn', '.modal-prod', '.modal__close', 500);

function bindModal(triggerSelector, modalSelector, closeSelector, speed) {
    const trigger = document.querySelectorAll(triggerSelector),
            modal = document.querySelector('.modal-overlay'),
            modalContent = document.querySelector(modalSelector),
            close = document.querySelector(closeSelector),
            windows = document.querySelectorAll('[data-modal]'),
            fixScroll = document.querySelectorAll('.lock'),
            smallFix = document.querySelectorAll('.small-lock'),
            speedTime = (speed),
            scroll = calcScroll();
    let modalOpen = false;
    let lastFocus;
    const focusElements = [
		'a[href]',
		'input',
		'button',
		'select',
		'textarea',
		'[tabindex]'
	];

    trigger.forEach(function(item) {
        item.addEventListener('click', function(e) {
            let target = e.target
            if (target) {
                e.preventDefault();
            }
            modalOpen = true;
            windows.forEach(item => {
                item.classList.remove('modal-open');
            });

            modal.classList.add('is-open');
            disableScroll();

            document.body.style.paddingRight = `${scroll}px`;
            if (fixScroll.length > 0) {
                fixScroll.forEach(item => {
                    item.style.paddingRight = `${scroll}px`;
                })
            }
            if (smallFix.length > 0) {
                smallFix.forEach(item => {
                    item.style.marginRight = `${scroll}px`;
                })
            }

            modalContent.classList.add('modal-open');
            modalContent.setAttribute('aria-hidden', false);
            lastFocus = document.activeElement;
            modal.setAttribute('tabindex', '0');

            setTimeout(() => {
                modal.focus();
                /** если фокус на первый активный элемент, то  focusTrap*/
				// focusTrap();
            }, speedTime);
        });
    });

    close.addEventListener('click', () => {
        popapClose();
        lastFocus.focus();
    });

    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
            popapClose();
            lastFocus.focus();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalOpen) {
            popapClose();
            lastFocus.focus();
        }

        if (e.code === 'Tab' && modalOpen) {
            focusCatch(e);
        }
    });

    function focusTrap() {
		const focusable = modalContent.querySelectorAll(focusElements);
		if (modalOpen) {
			focusable[0].focus();
		}
	}

	function focusCatch(e) {
		const focusable = modalContent.querySelectorAll(focusElements);
		const focusArray = Array.prototype.slice.call(focusable); //Преобразуем псевдомассив в массив
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

    function popapClose() {
        modalOpen = false;
        windows.forEach(item => {
            item.classList.remove('modal-open');
        });
        modal.classList.remove('is-open');
        enableScroll();

        document.body.style.paddingRight = `0px`;
        if (fixScroll.length > 0) {
            fixScroll.forEach(item => {
                item.style.paddingRight = `0px`;
            })
        }
        if (smallFix.length > 0) {
            smallFix.forEach(item => {
                item.style.marginRight = `0px`;
            })
        }
        modal.classList.remove('is-open');
        modalContent.setAttribute('aria-hidden', true);
        modal.setAttribute('tabindex', '-1');
    }

    function calcScroll() {
        let div = document.createElement('div');

        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';

        document.body.appendChild(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        return scrollWidth;
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

const minSlider = new Swiper('.slider-min', {
	grabCursor: true,
	slidesPerView: 6,
	spaceBetween: 20,
	freeMode: true,
	// speed: 800
});

const mainSlider = new Swiper('.slider-main', {
	spaceBetween: 20,
	slidesPerView: 1,
	simulateTouch: false,
	effect: 'fade',
	fadeEffect: {
	  crossFade: true
	},
	thumbs: {
		swiper: minSlider,
	}
});
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
		let formError = item.parentElement.querySelector('.form-error');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJhY2NvcmRpb24uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImNyZWF0ZS1jYXJkcy5qcyIsImZvcm0uanMiLCJsYXp5LmpzIiwibWFwLmpzIiwibWFzay10ZWwuanMiLCJtb2RhbC5qcyIsInF1aXouanMiLCJyYW5nZS1zbGlkZXIuanMiLCJzaXplcy5qcyIsInNsaWRlci5qcyIsInZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGZvckVhY2ggUG9seWZpbGxcclxuaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbn1cclxuXHJcbmNvbnN0IGNsZWFySW5wdXRzID0gKHNlbGVjdG9yKSA9PiB7XHJcblx0c2VsZWN0b3IuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdGl0ZW0udmFsdWUgPSAnJztcclxuXHR9KTtcclxuXHRsZXQgY2hlY2tib3hlcyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jdXN0b20tY2hlY2tib3hfX2lucHV0Jyk7XHJcblx0aWYgKGNoZWNrYm94ZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNoZWNrYm94ZXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGNvbnN0IGNoZWNrYm94ID0gY2hlY2tib3hlc1tpbmRleF07XHJcblx0XHRcdGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG4vLyB3aW5kb3cubm9aZW5zbW9vdGggPSB0cnVlOyIsImNvbnN0IGFjY29yZGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uJyk7XG5cbmFjY29yZGlvbnMuZm9yRWFjaChlbCA9PiB7XG5cdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRjb25zdCBzZWxmID0gZS5jdXJyZW50VGFyZ2V0O1xuXHRcdGNvbnN0IGNvbnRyb2wgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRyb2wnKTtcblx0XHRjb25zdCBjb250ZW50ID0gc2VsZi5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50Jyk7XG5cblx0XHQvLyog0LXRgdC70Lgg0L3QtdC+0LHRhdC+0LTQuNC80L4g0YfRgtC+0LHRiyDQstGB0LUg0LHQu9C+0LrQuCDQt9Cw0LrRgNGL0LLQsNC70LjRgdGMINC/0YDQuCDQvtGC0LrRgNGL0YLQuNC4INCx0LvQvtC60LAgLSDQv9GA0L7RgdGC0L4g0YDQsNGB0LrQvtC80LXQvdGC0LjRgNC+0LLQsNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwhXG5cdFx0Ly8gYWNjb3JkaW9ucy5mb3JFYWNoKGJ0biA9PiB7XG5cdFx0Ly8gXHRjb25zdCBjb250cm9sID0gYnRuLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRyb2wnKTtcblx0XHQvLyBcdGNvbnN0IGNvbnRlbnQgPSBidG4ucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udGVudCcpO1xuXHRcdC8vIFx0aWYgKGJ0biAhPT0gc2VsZikge1xuXHRcdC8vIFx0XHRidG4uY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuXHRcdC8vIFx0XHRjb250cm9sLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcblx0XHQvLyBcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cdFx0Ly8gXHRcdGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcblx0XHQvLyBcdH1cblx0XHQvLyB9KTtcblxuXHRcdHNlbGYuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xuXG5cdFx0Ly8g0LXRgdC70Lgg0L7RgtC60YDRi9GCINCw0LrQutC+0YDQtNC10L7QvVxuXHRcdGlmIChzZWxmLmNsYXNzTGlzdC5jb250YWlucygnb3BlbicpKSB7XG5cdFx0XHRjb250cm9sLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xuXHRcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5zdHlsZS5tYXhIZWlnaHQgPSBjb250ZW50LnNjcm9sbEhlaWdodCArICdweCc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cdFx0XHRjb250ZW50LnN0eWxlLm1heEhlaWdodCA9IG51bGw7XG5cdFx0fVxuXHR9KTtcbn0pOyIsImxldCBtZW51Qm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51Jyk7XHJcbmxldCBtZW51SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51X19saW5rJyk7XHJcbmxldCBoYW1idXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyJyk7XHJcblxyXG5oYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7ICAgIFxyXG4gICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgbWVudUJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBkaXNhYmxlU2Nyb2xsKCk7XHJcbiAgICBpZiAoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C30LDQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIG1lbnVCb2R5LmZvY3VzKCk7XHJcbiAgICB9LCA2MDApO1xyXG59KTtcclxuXHJcbm1lbnVJdGVtLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKGhhbWJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIGhhbWJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgbWVudUJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGVuYWJsZVNjcm9sbCgpO1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcblxyXG5sZXQgZmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlcnMnKTtcclxubGV0IGZpbHRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19idG4nKTtcclxubGV0IGZpbHRlckJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nLWhhbWJ1cmdlcicpO1xyXG5cclxuZmlsdGVyQnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyAgICBcclxuICAgIGZpbHRlckJ1cmdlci5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGZpbHRlci5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGlmIChmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0LfQsNC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBmaWx0ZXIuZm9jdXMoKTtcclxuICAgIH0sIDYwMCk7XHJcbn0pO1xyXG5cclxuZmlsdGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgZmlsdGVyQnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQvtGC0LrRgNGL0YLRjCDRhNC40LvRjNGC0YAnKTsgXHJcbiAgICB9XHJcbn0pXHJcblxyXG4vLyBzY3JvbGwtbG9ja1xyXG5mdW5jdGlvbiBkaXNhYmxlU2Nyb2xsKCkge1xyXG5cdGxldCBwYWdlUG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWTtcclxuXHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1sb2NrJyk7XHJcblx0ZG9jdW1lbnQuYm9keS5kYXRhc2V0LnBvc2l0aW9uID0gcGFnZVBvc2l0aW9uO1xyXG5cdGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gLXBhZ2VQb3NpdGlvbiArICdweCc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuYWJsZVNjcm9sbCgpIHtcclxuXHRsZXQgcGFnZVBvc2l0aW9uID0gcGFyc2VJbnQoZG9jdW1lbnQuYm9keS5kYXRhc2V0LnBvc2l0aW9uLCAxMCk7XHJcblx0ZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAnYXV0byc7XHJcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtbG9jaycpO1xyXG5cdHdpbmRvdy5zY3JvbGwoeyB0b3A6IHBhZ2VQb3NpdGlvbiwgbGVmdDogMCB9KTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wb3NpdGlvbicpO1xyXG59XHJcbiIsImNvbnN0IGNoZWNrQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhdGFsb2ctY2hlY2tib3hfX2xhYmVsLCAuY3VzdG9tLWNoZWNrYm94X190ZXh0Jyk7XHJcblxyXG5jaGVja0JveC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcblx0XHRpZiAoZS5jb2RlID09PSAnRW50ZXInIHx8IGUuY29kZSA9PT0gJ051bXBhZEVudGVyJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcclxuXHRcdFx0bGV0IGNoZWNrID0gZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHRcdFx0aWYgKGNoZWNrLnR5cGUgPT0gJ3JhZGlvJykge1xyXG5cdFx0XHRcdGlmIChjaGVjay5jaGVja2VkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0fSBcclxuXHRcdFx0fSBlbHNlIGlmIChjaGVjay50eXBlID09ICdjaGVja2JveCcpIHtcclxuXHRcdFx0XHRpZiAoY2hlY2suY2hlY2tlZCA9PT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG59KTsiLCJjb25zdCBjYXRhbG9nUHJvZHVjdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fd3JhcCcpO1xyXG5jb25zdCBjYXRhbG9nTW9yZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19tb3JlJyk7XHJcbmxldCBwcm9kUXVhbnRpdHkgPSA2O1xyXG5sZXQgZGF0YUxlbmd0aCA9IG51bGw7XHJcblxyXG4vLyDRhNGD0L3QutGG0LjRjyDQstGB0YLQsNCy0LvRj9C10YIg0L/RgNC+0LHQtdC7INC80LXQttC00YMg0YDQsNC30YDRj9C00LDQvNC4XHJcbmNvbnN0IG5vcm1hbFByaWNlID0gKHN0cikgPT4ge1xyXG5cdHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcclxufTtcclxuXHJcbmlmIChjYXRhbG9nUHJvZHVjdHMpIHtcclxuXHRjb25zdCBsb2FkUHJvZHVjdHMgPSAocXVhbnRpdHkgPSA1KSA9PiB7XHJcblx0ICBmZXRjaCgnLi4vZGF0YS9kYXRhLmpzb24nKVxyXG5cdFx0LnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcblx0XHQgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcblx0XHR9KVxyXG5cdFx0LnRoZW4oKGRhdGEpID0+IHtcclxuXHRcdCAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG4gIFxyXG5cdFx0ICBjYXRhbG9nUHJvZHVjdHMuaW5uZXJIVE1MID0gJyc7XHJcbiAgXHJcblx0XHQgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChpIDwgcXVhbnRpdHkpIHtcclxuXHRcdFx0ICBsZXQgaXRlbSA9IGRhdGFbaV07XHJcbiAgXHJcblx0XHRcdFx0Y2F0YWxvZ1Byb2R1Y3RzLmlubmVySFRNTCArPSBgXHJcblx0XHRcdFx0XHQ8YXJ0aWNsZSBjbGFzcz1cImNhdGFsb2ctaXRlbVwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0YWxvZy1pdGVtX19pbWdcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7aXRlbS5tYWluSW1hZ2V9XCIgbG9hZGluZz1cImxhenlcIiBhbHQ9XCIke2l0ZW0udGl0bGV9XCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuc1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuIGJ0bi1yZXNldCBtb2RhbC1idG5cIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiIGFyaWEtbGFiZWw9XCLQn9C+0LrQsNC30LDRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INGC0L7QstCw0YDQtVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3ZnPjx1c2UgeGxpbms6aHJlZj1cImltZy9zcHJpdGUuc3ZnI3Nob3dcIj48L3VzZT48L3N2Zz5cclxuXHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fYnRuIGJ0bi1yZXNldFwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCIgYXJpYS1sYWJlbD1cItCU0L7QsdCw0LLQuNGC0Ywg0YLQvtCy0LDRgCDQsiDQutC+0YDQt9C40L3Rg1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3ZnPjx1c2UgeGxpbms6aHJlZj1cImltZy9zcHJpdGUuc3ZnI2NhcnRcIj48L3VzZT48L3N2Zz5cclxuXHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGgzIGNsYXNzPVwiY2F0YWxvZy1pdGVtX190aXRsZVwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImNhdGFsb2ctaXRlbV9fcHJpY2VcIj4ke25vcm1hbFByaWNlKGl0ZW0ucHJpY2UpfSDRgDwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvYXJ0aWNsZT5cclxuXHJcblx0XHRcdFx0YDtcclxuXHRcdFx0fVxyXG5cdFx0ICB9XHJcblx0XHR9KVxyXG5cdH07XHJcbiAgXHJcblx0bG9hZFByb2R1Y3RzKHByb2RRdWFudGl0eSk7XHJcbiAgXHJcblx0Y2F0YWxvZ01vcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0Ly8qICszIC0g0LTQvtCx0LDQstC70Y/RgtGMINC/0L4g0Lcg0LrQsNGA0YLQvtGH0LrQuCDRgtC+0LLQsNGA0LBcclxuXHRcdHByb2RRdWFudGl0eSA9IHByb2RRdWFudGl0eSArIDM7XHJcblxyXG5cdFx0bG9hZFByb2R1Y3RzKHByb2RRdWFudGl0eSk7XHJcblxyXG5cdFx0aWYgKHByb2RRdWFudGl0eSA+PSBkYXRhTGVuZ3RoKSB7XHJcblx0XHRcdGNhdGFsb2dNb3JlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjYXRhbG9nTW9yZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdH1cclxuXHR9KTtcclxufSIsImNvbnN0IGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpO1xyXG5cclxuaWYgKGZvcm1zLmxlbmd0aCA+IDApIHtcclxuXHRmb3Jtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGxldCBmb3JtID0gZS50YXJnZXQ7XHRcclxuXHRcdFx0bGV0IGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRcdFx0Ly8gbGV0IGZpbGVOYW1lID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19uYW1lJyk7IC8vINC10YHQu9C4INC10YHRgtGMINC30LDQs9GA0YPQt9C60LAg0YTQsNC50LvQsCAo0LIg0LDRgtGA0LjQsdGD0YIg0LTQvtCx0LDQstC40YLRjCBmaWxlKVxyXG5cdFx0XHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdFx0XHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0XHRcdGZvcm1SZW1vdmVFcnJvcihmb3JtKTtcclxuXHJcblx0XHRcdFx0Ly8qID09PT09PT09INCh0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YLQv9GA0LDQstC60LUgPT09PT09PT09PT09XHJcblx0XHRcdFx0bGV0IHRleHRNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1tZXNzYWdlJyk7XHJcblx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQl9Cw0LPRgNGD0LfQutCwLi4uJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8qINCX0LDQv9C40YHRjCDQvdCw0LfQstCw0L3QuNGPINGH0LXQutCx0L7QutGB0LAg0LIgdmFsdWUg0LjQvdC/0YPRgtCwINGH0LXQutCx0L7QutGB0LAgKNC10YHQu9C4INC10YHRgtGMINGH0LXQutCx0L7QutGB0YspXHJcblx0XHRcdFx0Ly8gaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdC8vIFx0aWYgKGlucHV0LnR5cGUgPT0gJ2NoZWNrYm94JyB8fCBpbnB1dC50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdFx0XHQvLyBcdFx0aW5wdXQudmFsdWUgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQ7XHJcblx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0Ly8gfSk7XHJcblxyXG5cdFx0XHRcdC8vKj09PT09PT09PSBGb3JtRGF0YSA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdFx0Y29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoaXRlbSk7XHJcblx0XHRcdFx0Ly8gZm9ybURhdGEuYXBwZW5kKCdpbWFnZScsIGZvcm1JbWFnZS5maWxlc1swXSk7XHJcblxyXG5cdFx0XHRcdC8vKiA9PT09PSDQn9GA0L7QstC10YDQutCwINGE0L7RgNC80YsgPT09PT1cclxuXHRcdFx0XHQvLyBmb3IodmFyIHBhaXIgb2YgZm9ybURhdGEuZW50cmllcygpKSB7XHJcblx0XHRcdFx0Ly8gXHRjb25zb2xlLmxvZyhwYWlyWzBdKyAnLCAnKyBwYWlyWzFdKTtcclxuXHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdC8vKj09PT09PT09PSDQntGC0L/RgNCw0LLQutCwINC00LDQvdC90YvRhSA9PT09PT09PT09PT09PT1cclxuXHRcdFx0XHRjb25zdCBwb3N0RGF0YSA9IGFzeW5jICh1cmwsIGRhdGEpID0+IHtcclxuXHRcdFx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG5cdFx0XHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdFx0XHRib2R5OiBkYXRhXHJcblx0XHRcdFx0XHR9KTtcdFxyXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpOyAvLyBqc29uKCkgLSDQtNC70Y8g0LLRi9Cy0L7QtNCwINGB0L7QvtCx0YnQtdC90LjRjztcclxuXHRcdFx0XHRcdFx0YWxlcnQocmVzdWx0Lm1lc3NhZ2UpO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTsgLy8gdGV4dCgpIC0g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSwg0L/QvtC00LrQu9GO0YfQuNGC0Ywgc2VydmVyLnBocClcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzdWx0KTsgLy8g0Y3RgtC+INC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LVcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ09rISc7XHJcblx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y2xlYXJJbnB1dHMoaW5wdXRzKTtcclxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sIDUwMDApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0YWxlcnQoXCLQntGI0LjQsdC60LBcIik7XHJcblx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHBvc3REYXRhKCcuLi9zZW5kbWFpbC5waHAnLCBmb3JtRGF0YSk7XHJcblx0XHRcdFx0Ly8gcG9zdERhdGEoJy4uL3NlcnZlci5waHAnLCBxdWl6Rm9ybURhdGEpIC8vISDRg9Cx0YDQsNGC0YwgKNGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSIsImNvbnN0IGxhenlJbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1zcmNdLHNvdXJjZVtkYXRhLXNyY3NldF0nKTtcclxuY29uc3QgbG9hZE1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkLW1hcCcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKCkgPT4ge1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0aWYgKGxhenlJbWFnZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0bGF6eUltYWdlcy5mb3JFYWNoKGltZyA9PiB7XHJcblx0XHRcdGxldCBpbWdPZmZzZXQgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgcGFnZVlPZmZzZXQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2Nyb2xsWSA+PSBpbWdPZmZzZXQgLSAxMDAwKSB7XHJcblx0XHRcdFx0aWYgKGltZy5kYXRhc2V0LnNyYykge1xyXG5cdFx0XHRcdFx0aW1nLnNyYyA9IGltZy5kYXRhc2V0LnNyYztcclxuXHRcdFx0XHRcdGltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpbWcuZGF0YXNldC5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdGltZy5zcmNzZXQgPSBpbWcuZGF0YXNldC5zcmNzZXQ7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyY3NldCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vTWFwXHJcblx0Ly8gaWYgKCFsb2FkTWFwLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVkJykpIHtcclxuXHQvLyBcdGxldCBtYXBPZmZzZXQgPSBsb2FkTWFwLm9mZnNldFRvcDtcclxuXHQvLyBcdGlmIChzY3JvbGxZID49IG1hcE9mZnNldCAtIDIwMCkge1xyXG5cdC8vIFx0XHRjb25zdCBsb2FkTWFwVXJsID0gbG9hZE1hcC5kYXRhc2V0Lm1hcDtcclxuXHQvLyBcdFx0aWYgKGxvYWRNYXBVcmwpIHtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmluc2VydEFkamFjZW50SFRNTChcclxuXHQvLyBcdFx0XHRcdFwiYmVmb3JlZW5kXCIsXHJcblx0Ly8gXHRcdFx0XHRgPGlmcmFtZSBzcmM9XCIke2xvYWRNYXBVcmx9XCIgc3R5bGU9XCJib3JkZXI6MDtcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBsb2FkaW5nPVwibGF6eVwiPjwvaWZyYW1lPmBcclxuXHQvLyBcdFx0XHQpO1xyXG5cdC8vIFx0XHRcdGxvYWRNYXAuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcbn0pOyIsImxldCBmbGFnID0gMDtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbigpe1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0bGV0IG1hcE9mZnNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFwXCIpLm9mZnNldFRvcDtcclxuXHJcblx0aWYgKChzY3JvbGxZID49IG1hcE9mZnNldCAtIDUwMCkgJiYgKGZsYWcgPT0gMCkpIHtcclxuXHRcdHltYXBzLnJlYWR5KGluaXQpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGluaXQoKXtcclxuXHRcdFx0Y29uc3QgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKFwibWFwXCIsIHtcclxuXHRcdFx0XHRjZW50ZXI6IFs1OS44MzA0ODEsIDMwLjE0MjE5N10sXHJcblx0XHRcdFx0em9vbTogMTAsXHJcblx0XHRcdFx0Y29udHJvbHM6IFtdXHJcblx0XHRcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBteVBsYWNlbWFyayAgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKFs1OS44MzA0ODEsIDMwLjE0MjE5N10sIHt9LCB7XHJcblx0XHRcdFx0aWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxyXG5cdFx0XHRcdGljb25JbWFnZUhyZWY6ICdpbWcvcGxhY2VtYXJrLnBuZycsXHJcblx0XHRcdFx0aWNvbkltYWdlU2l6ZTogWzI1LCAzNF0sXHJcblx0XHRcdFx0aWNvbkltYWdlT2Zmc2V0OiBbLTE5LCAtNDRdXHJcblx0XHRcdH0pO1x0XHRcdFxyXG5cdFx0XHRteU1hcC5nZW9PYmplY3RzLmFkZChteVBsYWNlbWFyayk7XHJcblx0XHRcdG15TWFwLmJlaGF2aW9ycy5kaXNhYmxlKFsnc2Nyb2xsWm9vbSddKTtcclxuXHRcdH1cclxuXHJcblx0XHRmbGFnID0gMTtcclxuXHR9XHJcbn0pOyIsImxldCBzZXRDdXJzb3JQb3NpdGlvbiA9IChwb3MsIGVsZW0pID0+IHtcclxuICAgIGVsZW0uZm9jdXMoKTtcclxuICAgIGlmIChlbGVtLnNldFNlbGVjdGlvblJhbmdlKSB7XHJcbiAgICAgICAgZWxlbS5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XHJcbiAgICB9IGVsc2UgaWYgKGVsZW0uY3JlYXRlVGV4dFJhbmdlKSB7XHJcbiAgICAgICAgbGV0IHJhbmdlID0gZWxlbS5jcmVhdGVUZXh0UmFuZ2UoKTtcclxuXHJcbiAgICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSk7XHJcbiAgICAgICAgcmFuZ2UubW92ZUVuZCgnY2hhcmFjdGVyJywgcG9zKTtcclxuICAgICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHBvcyk7XHJcbiAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XHJcbiAgICB9XHJcbn07XHJcbmZ1bmN0aW9uIGNyZWF0ZU1hc2soZXZlbnQpIHtcclxuICAgIGxldCBtYXRyaXggPSAnKzcgKF9fXykgX19fIF9fIF9fJyxcclxuICAgICAgICBpID0gMCxcclxuICAgICAgICBkZWYgPSBtYXRyaXgucmVwbGFjZSgvXFxEL2csICcnKSxcclxuICAgICAgICB2YWwgPSB0aGlzLnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XHJcbiAgICBpZiAoZGVmLmxlbmd0aCA+PSB2YWwubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFsID0gZGVmO1xyXG4gICAgfVxyXG4gICAgdGhpcy52YWx1ZSA9IG1hdHJpeC5yZXBsYWNlKC8uL2csIGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gL1tfXFxkXS8udGVzdChhKSAmJiBpIDwgdmFsLmxlbmd0aCA/IHZhbC5jaGFyQXQoaSsrKSA6IGkgPj0gdmFsLmxlbmd0aCA/ICcnIDogYTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09J2JsdXInKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09IDIgfHwgdGhpcy52YWx1ZS5sZW5ndGggPCBtYXRyaXgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSAnJztcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09J2tleXVwJyB8fCBldmVudC50eXBlID09PSdtb3VzZXVwJykge1xyXG4gICAgICAgIGxldCBjdXIgPSB0aGlzLnNlbGVjdGlvblN0YXJ0O1xyXG4gICAgICAgIGlmIChjdXIgPT0gJzAnKSB7XHJcbiAgICAgICAgICAgIHNldEN1cnNvclBvc2l0aW9uKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldEN1cnNvclBvc2l0aW9uKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzKTsgICAgICAgIFxyXG4gICAgfVxyXG59XHJcbmxldCB0ZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGVsJyk7XHJcbnRlbC5mb3JFYWNoKGlucHV0ID0+IHtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY3JlYXRlTWFzayk7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjcmVhdGVNYXNrKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBjcmVhdGVNYXNrKTtcclxufSk7IiwiLy8/INCf0LDRgNCw0LzQtdGC0YDRizpcclxuLy8qIHRyaWdnZXJTZWxlY3RvciAtINC60L3QvtC/0LrQsCDQvtGC0LrRgNGL0YLQuNGPINC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwXHJcbi8vKiBtb2RhbFNlbGVjdG9yIC0g0LzQvtC00LDQu9GM0L3QvtC1INC+0LrQvdC+INCy0L3Rg9GC0YDQuCDRhNC+0L3QsCBtb2RhbFxyXG4vLyogY2xvc2VTZWxlY3RvciAtINC60YDQtdGB0YLQuNC6LCDQt9Cw0LrRgNGL0LLQsNGO0YnQuNC5INC+0LrQvdC+XHJcbi8vKiBzcGVlZCAtINCy0YDQtdC80Y8g0LLRi9C/0L7Qu9C90LXQvdC40Y8sINGB0YLQsNCy0LjRgtGB0Y8g0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBICR0cmFuc2l0aW9uLXRpbWVcclxuXHJcbi8vVE9ETyDQlNC+0LHQsNCy0LjRgtGMINC60LvQsNGB0YHRizpcclxuLy8qIGRhdGEtbW9kYWwgLSDQtNC+0LHQsNCy0LjRgtGMINCy0YHQtdC8INC80L7QtNCw0LvRjNC90YvQvCDQvtC60L3QsNC8IChtb2RhbC1uYW1lKSAo0LXRgdC70Lgg0LjRhSDQvdC10YHQutC+0LvRjNC60L4pXHJcbi8vKiBsb2NrIC0g0LTQvtCx0LDQstC40YLRjCDQutC70LDRgdGBINC00LvRjyDQsdC70L7QutC+0LIg0YEgcG9zaXRpb246IGFic29sdXRlINC40LvQuCBmaXhlZCAo0LTQvtCx0LDQstC40YLRgdGPIHBhZGRpbmcpXHJcbi8vKiBzbWFsbC1sb2NrIC0g0LTQvtCx0LDQstC40YLRjCDQutC70LDRgdGBINC00LvRjyDQvNCw0LvQtdC90YzQutC40YUg0LHQu9C+0LrQvtCyINGBIHBvc2l0aW9uOiBhYnNvbHV0ZSDQuNC70LggZml4ZWQgKNC00L7QsdCw0LLQuNGC0YHRjyBtYXJnaW4pXHJcblxyXG5cclxuYmluZE1vZGFsKCcubW9kYWwtYnRuJywgJy5tb2RhbC1wcm9kJywgJy5tb2RhbF9fY2xvc2UnLCA1MDApO1xyXG5cclxuZnVuY3Rpb24gYmluZE1vZGFsKHRyaWdnZXJTZWxlY3RvciwgbW9kYWxTZWxlY3RvciwgY2xvc2VTZWxlY3Rvciwgc3BlZWQpIHtcclxuICAgIGNvbnN0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRyaWdnZXJTZWxlY3RvciksXHJcbiAgICAgICAgICAgIG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLW92ZXJsYXknKSxcclxuICAgICAgICAgICAgbW9kYWxDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihtb2RhbFNlbGVjdG9yKSxcclxuICAgICAgICAgICAgY2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNsb3NlU2VsZWN0b3IpLFxyXG4gICAgICAgICAgICB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWxdJyksXHJcbiAgICAgICAgICAgIGZpeFNjcm9sbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5sb2NrJyksXHJcbiAgICAgICAgICAgIHNtYWxsRml4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNtYWxsLWxvY2snKSxcclxuICAgICAgICAgICAgc3BlZWRUaW1lID0gKHNwZWVkKSxcclxuICAgICAgICAgICAgc2Nyb2xsID0gY2FsY1Njcm9sbCgpO1xyXG4gICAgbGV0IG1vZGFsT3BlbiA9IGZhbHNlO1xyXG4gICAgbGV0IGxhc3RGb2N1cztcclxuICAgIGNvbnN0IGZvY3VzRWxlbWVudHMgPSBbXHJcblx0XHQnYVtocmVmXScsXHJcblx0XHQnaW5wdXQnLFxyXG5cdFx0J2J1dHRvbicsXHJcblx0XHQnc2VsZWN0JyxcclxuXHRcdCd0ZXh0YXJlYScsXHJcblx0XHQnW3RhYmluZGV4XSdcclxuXHRdO1xyXG5cclxuICAgIHRyaWdnZXIuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtb2RhbE9wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB3aW5kb3dzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgICAgIGRpc2FibGVTY3JvbGwoKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gYCR7c2Nyb2xsfXB4YDtcclxuICAgICAgICAgICAgaWYgKGZpeFNjcm9sbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBmaXhTY3JvbGwuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke3Njcm9sbH1weGA7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzbWFsbEZpeC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBzbWFsbEZpeC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUubWFyZ2luUmlnaHQgPSBgJHtzY3JvbGx9cHhgO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbW9kYWxDb250ZW50LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICAgICAgbW9kYWxDb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGxhc3RGb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgLyoqINC10YHQu9C4INGE0L7QutGD0YEg0L3QsCDQv9C10YDQstGL0Lkg0LDQutGC0LjQstC90YvQuSDRjdC70LXQvNC10L3Rgiwg0YLQviAgZm9jdXNUcmFwKi9cclxuXHRcdFx0XHQvLyBmb2N1c1RyYXAoKTtcclxuICAgICAgICAgICAgfSwgc3BlZWRUaW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHBvcGFwQ2xvc2UoKTtcclxuICAgICAgICBsYXN0Rm9jdXMuZm9jdXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBpZiAoZS50YXJnZXQgPT0gbW9kYWwpIHtcclxuICAgICAgICAgICAgcG9wYXBDbG9zZSgpO1xyXG4gICAgICAgICAgICBsYXN0Rm9jdXMuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuICAgICAgICBpZiAoZS5jb2RlID09PSAnRXNjYXBlJyAmJiBtb2RhbE9wZW4pIHtcclxuICAgICAgICAgICAgcG9wYXBDbG9zZSgpO1xyXG4gICAgICAgICAgICBsYXN0Rm9jdXMuZm9jdXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLmNvZGUgPT09ICdUYWInICYmIG1vZGFsT3Blbikge1xyXG4gICAgICAgICAgICBmb2N1c0NhdGNoKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGZvY3VzVHJhcCgpIHtcclxuXHRcdGNvbnN0IGZvY3VzYWJsZSA9IG1vZGFsQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzRWxlbWVudHMpO1xyXG5cdFx0aWYgKG1vZGFsT3Blbikge1xyXG5cdFx0XHRmb2N1c2FibGVbMF0uZm9jdXMoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZvY3VzQ2F0Y2goZSkge1xyXG5cdFx0Y29uc3QgZm9jdXNhYmxlID0gbW9kYWxDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNFbGVtZW50cyk7XHJcblx0XHRjb25zdCBmb2N1c0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9jdXNhYmxlKTsgLy/Qn9GA0LXQvtCx0YDQsNC30YPQtdC8INC/0YHQtdCy0LTQvtC80LDRgdGB0LjQsiDQsiDQvNCw0YHRgdC40LJcclxuXHRcdGNvbnN0IGZvY3VzZWRJbmRleCA9IGZvY3VzQXJyYXkuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuXHJcblx0XHRpZiAoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcclxuXHRcdFx0Zm9jdXNBcnJheVtmb2N1c0FycmF5Lmxlbmd0aCAtIDFdLmZvY3VzKCk7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSBmb2N1c0FycmF5Lmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0Zm9jdXNBcnJheVswXS5mb2N1cygpO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuICAgIGZ1bmN0aW9uIHBvcGFwQ2xvc2UoKSB7XHJcbiAgICAgICAgbW9kYWxPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgd2luZG93cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgZW5hYmxlU2Nyb2xsKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gYDBweGA7XHJcbiAgICAgICAgaWYgKGZpeFNjcm9sbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZpeFNjcm9sbC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgMHB4YDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNtYWxsRml4Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgc21hbGxGaXguZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUubWFyZ2luUmlnaHQgPSBgMHB4YDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpO1xyXG4gICAgICAgIG1vZGFsQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNhbGNTY3JvbGwoKSB7XHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cclxuICAgICAgICBkaXYuc3R5bGUud2lkdGggPSAnNTBweCc7XHJcbiAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9ICc1MHB4JztcclxuICAgICAgICBkaXYuc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XHJcbiAgICAgICAgZGl2LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xyXG4gICAgICAgIGxldCBzY3JvbGxXaWR0aCA9IGRpdi5vZmZzZXRXaWR0aCAtIGRpdi5jbGllbnRXaWR0aDtcclxuICAgICAgICBkaXYucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHNjcm9sbFdpZHRoO1xyXG4gICAgfVxyXG59OyIsImNvbnN0IHF1aXpGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnF1aXotZm9ybScpO1xyXG5jb25zdCBxdWl6SW5wdXRzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuY29uc3QgcXVpekJsb2NrcyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5xdWl6LWJsb2NrJyk7XHJcblxyXG5sZXQgdGV4dGFyZWFUZXh0ID0gbnVsbDtcclxubGV0IHF1aXpSZXBseSAgPSB7fTtcclxubGV0IGJsb2NrSW5kZXggPSAwO1xyXG5cclxuLy8g0YTRg9C90LrRhtC40Y8g0L/QvtC60LDQt9CwINGC0L7Qu9GM0LrQviDQv9C10YDQstC+0LPQviDQsdC70L7QutCwINC60LLQuNC30LBcclxuc2hvd0Jsb2NrcyhibG9ja0luZGV4KTtcclxuXHJcbmZ1bmN0aW9uIHNob3dCbG9ja3MoKSB7XHJcblx0cXVpekJsb2Nrcy5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScpO1xyXG5cdHF1aXpCbG9ja3NbYmxvY2tJbmRleF0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbn1cclxuXHJcbi8vINC30LDQv9C40YHRjCDQvdCw0LfQstCw0L3QuNGPINGH0LXQutCx0L7QutGB0LAg0LIgdmFsdWUg0LjQvdC/0YPRgtCwINGH0LXQutCx0L7QutGB0LBcclxucXVpeklucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHRpZiAoaW5wdXQudHlwZSA9PSAnY2hlY2tib3gnIHx8IGlucHV0LnR5cGUgPT0gJ3JhZGlvJykge1xyXG5cdFx0aW5wdXQudmFsdWUgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQ7XHJcblx0fVxyXG59KTtcclxuXHJcbnF1aXpGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblx0bGV0IGJsb2NrID0gdGFyZ2V0LmNsb3Nlc3QoJy5xdWl6LWJsb2NrJyk7XHJcblx0bGV0IG5leHRCdG4gPSBxdWl6Rm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uZXh0XScpO1xyXG5cdG5leHRCdG4uZm9yRWFjaChidG4gPT4ge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBidG4pIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRhZGRUb1NlbmQoYmxvY2ssIHF1aXpSZXBseSk7XHJcblx0XHRcdG5leHRRdWVzdGlvbihibG9jayk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0aWYgKHRhcmdldCA9PSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zZW5kXScpKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRhZGRUb1NlbmQoYmxvY2ssIHF1aXpSZXBseSk7XHJcblx0XHRzZW5kKGJsb2NrKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbmV4dFF1ZXN0aW9uKGZvcm0pIHtcclxuXHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdGlmICh2YWxpZCA9PT0gMCAmJiB2YWxpZENoZWNrKGZvcm0pKSB7XHJcblx0XHRzaG93QmxvY2tzKGJsb2NrSW5kZXggKz0gMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZW5kKGZvcm0pIHtcclxuXHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdGlmICh2YWxpZCA9PT0gMCAmJiB2YWxpZENoZWNrKGZvcm0pKSB7XHJcblx0XHRmb3JtUmVtb3ZlRXJyb3IocXVpekZvcm0pO1xyXG5cclxuXHRcdC8vKiA9PT09PT09PSDQodC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGC0L/RgNCw0LLQutC1ID09PT09PT09PT09PVxyXG5cdFx0bGV0IG9rID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcucXVpei1zZW5kX19vaycpO1xyXG5cdFx0bGV0IHRleHRNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcucXVpei1tZXNzYWdlJyk7XHJcblx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JfQsNCz0YDRg9C30LrQsC4uLic7XHJcblx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vKj09PT09PT09PSBGb3JtRGF0YSA9PT09PT09PT09PT09PT1cclxuXHRcdGNvbnN0IHF1aXpGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG5cdFx0Zm9yIChsZXQga2V5IGluIHF1aXpSZXBseSkge1xyXG5cdFx0XHRxdWl6Rm9ybURhdGEuYXBwZW5kKGtleSwgcXVpelJlcGx5W2tleV0pO1xyXG5cdFx0fVxyXG5cdFx0Ly8gZm9ybURhdGEuYXBwZW5kKCdpbWFnZScsIGZvcm1JbWFnZS5maWxlc1swXSk7XHJcblx0XHQvLyog0J/RgNC+0LLQtdGA0LrQsCBGb3JtRGF0YVxyXG5cdFx0Ly8gZm9yKHZhciBwYWlyIG9mIHF1aXpGb3JtRGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdC8vIFx0Y29uc29sZS5sb2cocGFpclswXSsgJzogJysgcGFpclsxXSk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0Ly8qPT09PT09PT09INCe0YLQv9GA0LDQstC60LAg0LTQsNC90L3Ri9GFID09PT09PT09PT09PT09PVxyXG5cdFx0Y29uc3QgcXVpekRhdGEgPSBhc3luYyAodXJsLCBkYXRhKSA9PiB7XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXHJcblx0XHRcdFx0Ym9keTogZGF0YVxyXG5cdFx0XHR9KTtcdFxyXG5cdFx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHJcblx0XHRcdFx0Ly8gbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTsgLy8ganNvbigpIC0g0LTQu9GPINCy0YvQstC+0LTQsCDRgdC+0L7QsdGJ0LXQvdC40Y87XHJcblx0XHRcdFx0Ly8gYWxlcnQocmVzdWx0Lm1lc3NhZ2UpO1xyXG5cclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpOyAvLyB0ZXh0KCkgLSDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1LCDQv9C+0LTQutC70Y7Rh9C40YLRjCBzZXJ2ZXIucGhwKVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdCk7IC8vINGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1XHJcblxyXG5cdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAnT2shJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRjbGVhcklucHV0cyhxdWl6SW5wdXRzKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG9rLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH0sIDUwMDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFsZXJ0KFwi0J7RiNC40LHQutCwIEhUVFA6IFwiICsgcmVzcG9uc2Uuc3RhdHVzKTtcclxuXHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIDUwMDApO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0Ly8gcXVpekRhdGEoJy4uL3NlbmRtYWlsLnBocCcsIHF1aXpGb3JtRGF0YSk7XHJcblx0XHRxdWl6RGF0YSgnLi4vc2VydmVyLnBocCcsIHF1aXpGb3JtRGF0YSkgLy8hINGD0LHRgNCw0YLRjCAo0Y3RgtC+INC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LUpXHJcblxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG9TZW5kKGZvcm0sIG9iaikge1xyXG5cdGxldCB2YWx1ZVN0cmluZyA9ICcnO1xyXG5cdGxldCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IHRleHRhcmVhID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpO1xyXG5cdGlmIChpbnB1dHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IGZpZWxkID0gaW5wdXRzW2ldO1xyXG5cdFx0XHRpZiAoZmllbGQudHlwZSAhPSAnY2hlY2tib3gnICYmIGZpZWxkLnR5cGUgIT0gJ3JhZGlvJyAmJiBmaWVsZC52YWx1ZSkge1xyXG5cdFx0XHRcdG9ialtmaWVsZC5uYW1lXSA9IGZpZWxkLnZhbHVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gJ3JhZGlvJyAmJiBmaWVsZC5jaGVja2VkKSB7XHJcblx0XHRcdFx0b2JqW2ZpZWxkLm5hbWVdID0gZmllbGQudmFsdWU7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PSAnY2hlY2tib3gnICYmIGZpZWxkLmNoZWNrZWQpIHtcclxuXHRcdFx0XHR2YWx1ZVN0cmluZyArPSBmaWVsZC52YWx1ZSArICcsJztcdFx0XHJcblx0XHRcdFx0b2JqW2ZpZWxkLm5hbWVdID0gdmFsdWVTdHJpbmc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKHRleHRhcmVhLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dGFyZWEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IHRleHQgPSB0ZXh0YXJlYVtpXTtcclxuXHRcdFx0aWYgKHRleHQudmFsdWUpIHtcclxuXHRcdFx0XHRvYmpbdGV4dC5uYW1lXSA9IHRleHQudmFsdWU7XHRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSIsImNvbnN0IHJhbmdlU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmdlLXNsaWRlcicpO1xuXG5pZiAocmFuZ2VTbGlkZXIpIHtcblx0bm9VaVNsaWRlci5jcmVhdGUocmFuZ2VTbGlkZXIsIHtcbiAgICBzdGFydDogWzUwMCwgOTk5OTk5XSxcblx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdHN0ZXA6IDEsXG4gICAgcmFuZ2U6IHtcblx0XHRcdCdtaW4nOiBbNTAwXSxcblx0XHRcdCdtYXgnOiBbOTk5OTk5XVxuICAgIH1cblx0fSk7XG5cblx0Y29uc3QgaW5wdXQwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LTAnKTtcblx0Y29uc3QgaW5wdXQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LTEnKTtcblx0Y29uc3QgaW5wdXRzID0gW2lucHV0MCwgaW5wdXQxXTtcblxuXHRyYW5nZVNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSl7XG5cdFx0aW5wdXRzW2hhbmRsZV0udmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlc1toYW5kbGVdKTtcblx0fSk7XG5cblx0Y29uc3Qgc2V0UmFuZ2VTbGlkZXIgPSAoaSwgdmFsdWUpID0+IHtcblx0XHRsZXQgYXJyID0gW251bGwsIG51bGxdO1xuXHRcdGFycltpXSA9IHZhbHVlO1xuXG5cdFx0Y29uc29sZS5sb2coYXJyKTtcblxuXHRcdHJhbmdlU2xpZGVyLm5vVWlTbGlkZXIuc2V0KGFycik7XG5cdH07XG5cblx0aW5wdXRzLmZvckVhY2goKGVsLCBpbmRleCkgPT4ge1xuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhpbmRleCk7XG5cdFx0XHRzZXRSYW5nZVNsaWRlcihpbmRleCwgZS5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcblx0XHR9KTtcblx0fSk7XG59IiwibGV0IHRkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhdGFsb2ctc2l6ZXMgdGQnKTtcclxuXHJcbnRkLmZvckVhY2goaXRlbSA9PiB7XHJcblx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0XHRsZXQgc2VsZiA9IGUuY3VycmVudFRhcmdldDtcclxuXHRcdGl0ZW0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNkYmJiYTknO1xyXG5cdFx0dGQuZm9yRWFjaChidG4gPT4ge1xyXG5cdFx0XHRpZiAoYnRuICE9PSBzZWxmKSB7XHJcblx0XHRcdFx0YnRuLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59KTsiLCJcclxuY29uc3QgbWluU2xpZGVyID0gbmV3IFN3aXBlcignLnNsaWRlci1taW4nLCB7XHJcblx0Z3JhYkN1cnNvcjogdHJ1ZSxcclxuXHRzbGlkZXNQZXJWaWV3OiA2LFxyXG5cdHNwYWNlQmV0d2VlbjogMjAsXHJcblx0ZnJlZU1vZGU6IHRydWUsXHJcblx0Ly8gc3BlZWQ6IDgwMFxyXG59KTtcclxuXHJcbmNvbnN0IG1haW5TbGlkZXIgPSBuZXcgU3dpcGVyKCcuc2xpZGVyLW1haW4nLCB7XHJcblx0c3BhY2VCZXR3ZWVuOiAyMCxcclxuXHRzbGlkZXNQZXJWaWV3OiAxLFxyXG5cdHNpbXVsYXRlVG91Y2g6IGZhbHNlLFxyXG5cdGVmZmVjdDogJ2ZhZGUnLFxyXG5cdGZhZGVFZmZlY3Q6IHtcclxuXHQgIGNyb3NzRmFkZTogdHJ1ZVxyXG5cdH0sXHJcblx0dGh1bWJzOiB7XHJcblx0XHRzd2lwZXI6IG1pblNsaWRlcixcclxuXHR9XHJcbn0pOyIsIi8vKiDQktCw0LvQuNC00LDRhtC40Y8g0YTQvtGA0LzRiyAo0LXRgdC70Lgg0YfQtdC60LHQvtC60YHRiyDQuCDQuNC90L/Rg9GC0Ysg0LIg0L7QtNC90L7QuSDRhNC+0YDQvNC1KVxyXG5mdW5jdGlvbiB2YWxpZENoZWNrKGZvcm0pIHtcclxuXHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IGlzVmFsaWQgPSBmYWxzZTtcclxuXHRpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBlbGVtZW50c1tpbmRleF07XHJcblx0XHRcdGlmICghaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3QtdmFsaWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcImNoZWNrYm94XCIgfHwgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJyYWRpb1wiKSB7XHJcblx0XHRcdFx0XHRpZiAoaW5wdXQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdFx0XHRpc1ZhbGlkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7aXNWYWxpZCA9IHRydWU7fVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7aXNWYWxpZCA9IHRydWU7fVxyXG5cclxuXHRyZXR1cm4gaXNWYWxpZDtcclxufVxyXG5mdW5jdGlvbiB2YWxpZElucHV0KGZvcm0pIHtcclxuXHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IGVycm9yID0gMDtcclxuXHRpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBlbGVtZW50c1tpbmRleF07XHJcblx0XHRcdGxldCBwbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpKSB7XHJcblx0XHRcdFx0aWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZW1haWwnKSkge1xyXG5cdFx0XHRcdFx0aWYgKGVtYWlsVGVzdChpbnB1dCkgfHwgaW5wdXQudmFsdWUgPT0gcGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGlucHV0LnZhbHVlID09ICcnIHx8IGlucHV0LnZhbHVlID09IHBsYWNlaG9sZGVyKSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHRcdGVycm9yKys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIdCy0LrQu9GO0YfQuNGC0YwsINC10YHQu9C4INC90LDQtNC+INCy0LDQu9C40LTQuNGA0L7QstCw0YLRjCB0ZXh0YXJlOlxyXG5cdC8vIGxldCB0ZXh0YXJlYSA9IGZvcm0ucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcclxuXHQvLyBpZiAodGV4dGFyZWEpIHtcclxuXHQvLyBcdGlmICh0ZXh0YXJlYS52YWx1ZSA9PSAnJykge1xyXG5cdC8vIFx0XHRmb3JtQWRkRXJyb3IodGV4dGFyZWEpO1xyXG5cdC8vIFx0XHRlcnJvcisrO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0gXHJcblxyXG5cdHJldHVybiBlcnJvcjtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybUFkZEVycm9yKGl0ZW0pIHtcclxuXHRpdGVtLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuXHRpdGVtLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcblxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMLCDQtdGB0LvQuCDQsiBodG1sINC00L7QsdCw0LLQu9C10L3RiyDQsdC70L7QutC4INGBINGB0L7QvtCx0YnQtdC90LjQtdC8INC+0LEg0L7RiNC40LHQutC1ICguZm9ybS1lcnJvcilcclxuXHQvLyog0LXRgdC70Lgg0YDQsNC30L3Ri9C5INGC0LXQutGB0YIg0L7RiNC40LHQutC4INC00LvRjyDQutCw0LbQtNC+0LPQviBpbnB1dFxyXG5cdC8vIGxldCBpbXB1dEVycm9yID0gaXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblx0Ly8gaWYgKGltcHV0RXJyb3IpIHtcclxuXHQvLyBcdGlmIChpbXB1dEVycm9yLmNsYXNzTGlzdC5jb250YWlucygnaW1wdXQtbWVzc2FnZScpKSB7XHJcblx0Ly8gXHRcdGltcHV0RXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cdC8vKiDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LTQu9GPINCy0YHQtdC5INGE0L7RgNC80YsgKNC40LvQuCDQsdC70L7QutCwINC60LLQuNC30LApOlxyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCDQtdGB0LvQuCDQvdCwINGB0LDQudGC0LUg0LXRgdGC0Ywg0LrQstC40LdcclxuXHRpZiAoaXRlbS5jbG9zZXN0KCcucXVpei1mb3JtJykpIHtcclxuXHRcdGxldCBxdWl6RXJyb3IgPSBpdGVtLmNsb3Nlc3QoJy5xdWl6LWJsb2NrJykucXVlcnlTZWxlY3RvcignLnF1aXotbWVzc2FnZScpO1xyXG5cdFx0aWYgKHF1aXpFcnJvcikge1xyXG5cdFx0XHRxdWl6RXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGxldCBmb3JtRXJyb3IgPSBpdGVtLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tZXJyb3InKTtcclxuXHRcdGlmIChmb3JtRXJyb3IpIHtcclxuXHRcdFx0Zm9ybUVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0Ywg0LXRgdC70Lgg0L3QsCDRgdCw0LnRgtC1INC90LXRgiDQutCy0LjQt9CwICjRgtC+0LvRjNC60L4g0YTQvtGA0LzRiylcclxuXHQvLyBsZXQgZm9ybUVycm9yID0gaXRlbS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWVycm9yJyk7XHJcblx0Ly8gaWYgKGZvcm1FcnJvcikge1xyXG5cdC8vIFx0Zm9ybUVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdC8vIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybVJlbW92ZUVycm9yKGZvcm0pIHtcclxuXHRsZXQgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEnKTtcclxuXHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpbnB1dHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGxldCBpbnB1dCA9IGlucHV0c1tpbmRleF07XHJcblx0XHRcdGlmICghaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3QtdmFsaWQnKSkge1xyXG5cdFx0XHRcdGlucHV0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcclxuXHRcdFx0XHRpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMLCDQtdGB0LvQuCDQsiBodG1sINC00L7QsdCw0LLQu9C10L3RiyDQsdC70L7QutC4INGBINGB0L7QvtCx0YnQtdC90LjQtdC8INC+0LEg0L7RiNC40LHQutC1ICguZm9ybS1lcnJvcilcclxuXHRsZXQgZm9ybUVycm9yID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybS1tZXNzYWdlJyk7XHJcblx0aWYgKGZvcm1FcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZm9ybUVycm9yLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRjb25zdCBlcnJvciA9IGZvcm1FcnJvcltpbmRleF07XHJcblx0XHRcdGVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZW1haWxUZXN0KHNlbGVjdG9yKSB7XHJcblx0cmV0dXJuICEvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsOH0pKyQvLnRlc3Qoc2VsZWN0b3IudmFsdWUpO1xyXG59XHJcblxyXG5jb25zdCB0ZXh0SW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNoZWNrJyk7ICAgXHJcbnRleHRJbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0Ly8g0LXRgdC70Lgg0LfQvdCw0YfQtdC90LjQtSDQutC70LDQstC40YjQuChlLmtleSkg0L3QtSDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0LXRgihtYXRjaCkg0LrQuNGA0LjQu9C70LjRhtC1LCDQv9C+0LvQtSDQvdC1INC30LDQv9C+0LvQvdGP0LXRgtGB0Y9cclxuXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmIChlLmtleS5tYXRjaCgvW17QsC3Rj9GRIDAtOV0vaWcpKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQvLyDQtdGB0LvQuCDQv9GA0Lgg0LDQstGC0L7Qt9Cw0L/QvtC70L3QtdC90LjQuCDQstGL0LHRgNCw0L3QviDRgdC70L7QstC+INC90LUg0LrQuNGA0LjQu9C70LjRhtC10LksINGB0YLRgNC+0LrQsCDQvtGH0LjRgdGC0LjRgtGB0Y9cclxuXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy52YWx1ZT10aGlzLnZhbHVlLnJlcGxhY2UoL1teXFzQsC3Rj9GRIDAtOV0vaWcsXCJcIik7XHJcblx0fSk7XHJcbn0pOyJdfQ==
