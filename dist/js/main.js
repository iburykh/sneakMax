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
    document.body.classList.toggle('scroll-lock');
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
            document.body.classList.remove('scroll-lock');
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
//* tab-last - добавить класс для последнего интерактивного элемента в форме
//* lock - добавить класс для блоков с position: absolute или fixed (добавится padding)
//* small-lock - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)


bindModal('.modal-btn', '.modal-name', '.modal-name__close', 500);

function bindModal(triggerSelector, modalSelector, closeSelector, speed) {
    const trigger = document.querySelectorAll(triggerSelector),
            modal = document.querySelector('.overlay'),
            modalContent = document.querySelector(modalSelector),
            close = document.querySelector(closeSelector),
            windows = document.querySelectorAll('[data-modal]'),
            fixScroll = document.querySelectorAll('.lock'),
            smallFix = document.querySelectorAll('.small-lock'),
            tabLast = modal.querySelector('.tab-last'),
            speedTime = (speed),
            scroll = calcScroll();
    let modalOpen = false;
    let lastFocus;

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
            document.body.classList.add('scroll-lock');

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
            lastFocus = document.activeElement;
            modal.setAttribute('tabindex', '0');

            setTimeout(() => {
                modal.focus();
            }, speedTime);
        });
    });

    tabLast.addEventListener('keydown', (e) => {
        if (e.code === 'Tab' && modalOpen) {
            modal.focus();
        }
    });

    function popapClose() {
        modalOpen = false;
        windows.forEach(item => {
            item.classList.remove('modal-open');
        });
        modal.classList.remove('is-open');
        document.body.classList.remove('scroll-lock');
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
        modal.setAttribute('tabindex', '-1');
    }

    close.addEventListener('click', () => {
        popapClose();
        lastFocus.focus();
    });

    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
            popapClose(); 
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalOpen) {
            popapClose();
            lastFocus.focus();
        }
    });

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJhY2NvcmRpb24uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImZvcm0uanMiLCJsYXp5LmpzIiwibWFwLmpzIiwibWFzay10ZWwuanMiLCJtb2RhbC5qcyIsInF1aXouanMiLCJyYW5nZS1zbGlkZXIuanMiLCJzaXplcy5qcyIsInZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gZm9yRWFjaCBQb2x5ZmlsbFxyXG5pZiAod2luZG93Lk5vZGVMaXN0ICYmICFOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCkge1xyXG4gICAgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcclxufVxyXG5cclxuY29uc3QgY2xlYXJJbnB1dHMgPSAoc2VsZWN0b3IpID0+IHtcclxuXHRzZWxlY3Rvci5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdFx0aXRlbS52YWx1ZSA9ICcnO1xyXG5cdH0pO1xyXG5cdGxldCBjaGVja2JveGVzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmN1c3RvbS1jaGVja2JveF9faW5wdXQnKTtcclxuXHRpZiAoY2hlY2tib3hlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY2hlY2tib3hlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0Y29uc3QgY2hlY2tib3ggPSBjaGVja2JveGVzW2luZGV4XTtcclxuXHRcdFx0Y2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8vIHdpbmRvdy5ub1plbnNtb290aCA9IHRydWU7IiwiY29uc3QgYWNjb3JkaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24nKTtcblxuYWNjb3JkaW9ucy5mb3JFYWNoKGVsID0+IHtcblx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdGNvbnN0IHNlbGYgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0Y29uc3QgY29udHJvbCA9IHNlbGYucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udHJvbCcpO1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRlbnQnKTtcblxuXHRcdC8vKiDQtdGB0LvQuCDQvdC10L7QsdGF0L7QtNC40LzQviDRh9GC0L7QsdGLINCy0YHQtSDQsdC70L7QutC4INC30LDQutGA0YvQstCw0LvQuNGB0Ywg0L/RgNC4INC+0YLQutGA0YvRgtC40Lgg0LHQu9C+0LrQsCAtINC/0YDQvtGB0YLQviDRgNCw0YHQutC+0LzQtdC90YLQuNGA0L7QstCw0YLRjCDRjdGC0YMg0YfQsNGB0YLRjCFcblx0XHQvLyBhY2NvcmRpb25zLmZvckVhY2goYnRuID0+IHtcblx0XHQvLyBcdGNvbnN0IGNvbnRyb2wgPSBidG4ucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udHJvbCcpO1xuXHRcdC8vIFx0Y29uc3QgY29udGVudCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50Jyk7XG5cdFx0Ly8gXHRpZiAoYnRuICE9PSBzZWxmKSB7XG5cdFx0Ly8gXHRcdGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG5cdFx0Ly8gXHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXHRcdC8vIFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHQvLyBcdFx0Y29udGVudC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH0pO1xuXG5cdFx0c2VsZi5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG5cblx0XHQvLyDQtdGB0LvQuCDQvtGC0LrRgNGL0YIg0LDQutC60L7RgNC00LXQvtC9XG5cdFx0aWYgKHNlbGYuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVuJykpIHtcblx0XHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnN0eWxlLm1heEhlaWdodCA9IGNvbnRlbnQuc2Nyb2xsSGVpZ2h0ICsgJ3B4Jztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udHJvbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHRcdGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcblx0XHR9XG5cdH0pO1xufSk7IiwibGV0IG1lbnVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcclxubGV0IG1lbnVJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVfX2xpbmsnKTtcclxubGV0IGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKTtcclxuXHJcbmhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBtZW51Qm9keS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2Nyb2xsLWxvY2snKTtcclxuICAgIGlmIChoYW1idXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGhhbWJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0LfQsNC60YDRi9GC0Ywg0L3QsNCy0LjQs9Cw0YbQuNGOJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbWJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0L3QsNCy0LjQs9Cw0YbQuNGOJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgbWVudUJvZHkuZm9jdXMoKTtcclxuICAgIH0sIDYwMCk7XHJcbn0pO1xyXG5cclxubWVudUl0ZW0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBtZW51Qm9keS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtbG9jaycpO1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcblxyXG5sZXQgZmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlcnMnKTtcclxubGV0IGZpbHRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19idG4nKTtcclxubGV0IGZpbHRlckJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nLWhhbWJ1cmdlcicpO1xyXG5cclxuZmlsdGVyQnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyAgICBcclxuICAgIGZpbHRlckJ1cmdlci5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGZpbHRlci5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGlmIChmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0LfQsNC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBmaWx0ZXIuZm9jdXMoKTtcclxuICAgIH0sIDYwMCk7XHJcbn0pO1xyXG5cclxuZmlsdGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgZmlsdGVyQnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQvtGC0LrRgNGL0YLRjCDRhNC40LvRjNGC0YAnKTsgXHJcbiAgICB9XHJcbn0pXHJcbiIsImNvbnN0IGNoZWNrQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhdGFsb2ctY2hlY2tib3hfX2xhYmVsLCAuY3VzdG9tLWNoZWNrYm94X190ZXh0Jyk7XHJcblxyXG5jaGVja0JveC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcblx0XHRpZiAoZS5jb2RlID09PSAnRW50ZXInIHx8IGUuY29kZSA9PT0gJ051bXBhZEVudGVyJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcclxuXHRcdFx0bGV0IGNoZWNrID0gZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHRcdFx0aWYgKGNoZWNrLnR5cGUgPT0gJ3JhZGlvJykge1xyXG5cdFx0XHRcdGlmIChjaGVjay5jaGVja2VkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0fSBcclxuXHRcdFx0fSBlbHNlIGlmIChjaGVjay50eXBlID09ICdjaGVja2JveCcpIHtcclxuXHRcdFx0XHRpZiAoY2hlY2suY2hlY2tlZCA9PT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG59KTsiLCJjb25zdCBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Zvcm0nKTtcclxuXHJcbmlmIChmb3Jtcy5sZW5ndGggPiAwKSB7XHJcblx0Zm9ybXMuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRsZXQgZm9ybSA9IGUudGFyZ2V0O1x0XHJcblx0XHRcdGxldCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0XHRcdC8vIGxldCBmaWxlTmFtZSA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpOyAvLyDQtdGB0LvQuCDQtdGB0YLRjCDQt9Cw0LPRgNGD0LfQutCwINGE0LDQudC70LAgKNCyINCw0YLRgNC40LHRg9GCINC00L7QsdCw0LLQuNGC0YwgZmlsZSlcclxuXHRcdFx0bGV0IHZhbGlkID0gdmFsaWRJbnB1dChmb3JtKTtcclxuXHRcdFx0aWYgKHZhbGlkID09PSAwICYmIHZhbGlkQ2hlY2soZm9ybSkpIHtcclxuXHRcdFx0XHRmb3JtUmVtb3ZlRXJyb3IoZm9ybSk7XHJcblxyXG5cdFx0XHRcdC8vKiA9PT09PT09PSDQodC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGC0L/RgNCw0LLQutC1ID09PT09PT09PT09PVxyXG5cdFx0XHRcdGxldCB0ZXh0TWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm0tbWVzc2FnZScpO1xyXG5cdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JfQsNCz0YDRg9C30LrQsC4uLic7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vKiDQl9Cw0L/QuNGB0Ywg0L3QsNC30LLQsNC90LjRjyDRh9C10LrQsdC+0LrRgdCwINCyIHZhbHVlINC40L3Qv9GD0YLQsCDRh9C10LrQsdC+0LrRgdCwICjQtdGB0LvQuCDQtdGB0YLRjCDRh9C10LrQsdC+0LrRgdGLKVxyXG5cdFx0XHRcdC8vIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHRcdFx0XHQvLyBcdGlmIChpbnB1dC50eXBlID09ICdjaGVja2JveCcgfHwgaW5wdXQudHlwZSA9PSAncmFkaW8nKSB7XHJcblx0XHRcdFx0Ly8gXHRcdGlucHV0LnZhbHVlID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nLnRleHRDb250ZW50O1xyXG5cdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdC8vIH0pO1xyXG5cclxuXHRcdFx0XHQvLyo9PT09PT09PT0gRm9ybURhdGEgPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHRcdGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGl0ZW0pO1xyXG5cdFx0XHRcdC8vIGZvcm1EYXRhLmFwcGVuZCgnaW1hZ2UnLCBmb3JtSW1hZ2UuZmlsZXNbMF0pO1xyXG5cclxuXHRcdFx0XHQvLyogPT09PT0g0J/RgNC+0LLQtdGA0LrQsCDRhNC+0YDQvNGLID09PT09XHJcblx0XHRcdFx0Ly8gZm9yKHZhciBwYWlyIG9mIGZvcm1EYXRhLmVudHJpZXMoKSkge1xyXG5cdFx0XHRcdC8vIFx0Y29uc29sZS5sb2cocGFpclswXSsgJywgJysgcGFpclsxXSk7XHJcblx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHQvLyo9PT09PT09PT0g0J7RgtC/0YDQsNCy0LrQsCDQtNCw0L3QvdGL0YUgPT09PT09PT09PT09PT09XHJcblx0XHRcdFx0Y29uc3QgcG9zdERhdGEgPSBhc3luYyAodXJsLCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcclxuXHRcdFx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcclxuXHRcdFx0XHRcdFx0Ym9keTogZGF0YVxyXG5cdFx0XHRcdFx0fSk7XHRcclxuXHRcdFx0XHRcdGlmIChyZXNwb25zZS5vaykge1xyXG5cclxuXHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTsgLy8ganNvbigpIC0g0LTQu9GPINCy0YvQstC+0LTQsCDRgdC+0L7QsdGJ0LXQvdC40Y87XHJcblx0XHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5tZXNzYWdlKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7IC8vIHRleHQoKSAtINC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LAg0YHQtdGA0LLQtdGA0LUsINC/0L7QtNC60LvRjtGH0LjRgtGMIHNlcnZlci5waHApXHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7IC8vINGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICdPayEnO1xyXG5cdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNsZWFySW5wdXRzKGlucHV0cyk7XHJcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGFsZXJ0KFwi0J7RiNC40LHQutCwXCIpO1xyXG5cdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuXHRcdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSwgNTAwMCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRwb3N0RGF0YSgnLi4vc2VuZG1haWwucGhwJywgZm9ybURhdGEpO1xyXG5cdFx0XHRcdC8vIHBvc3REYXRhKCcuLi9zZXJ2ZXIucGhwJywgcXVpekZvcm1EYXRhKSAvLyEg0YPQsdGA0LDRgtGMICjRjdGC0L4g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSlcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0iLCJjb25zdCBsYXp5SW1hZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtc3JjXSxzb3VyY2VbZGF0YS1zcmNzZXRdJyk7XHJcbmNvbnN0IGxvYWRNYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZC1tYXAnKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsICgpID0+IHtcclxuXHRsZXQgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cdGlmIChsYXp5SW1hZ2VzLmxlbmd0aCA+IDApIHtcclxuXHRcdGxhenlJbWFnZXMuZm9yRWFjaChpbWcgPT4ge1xyXG5cdFx0XHRsZXQgaW1nT2Zmc2V0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHBhZ2VZT2Zmc2V0O1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHNjcm9sbFkgPj0gaW1nT2Zmc2V0IC0gMTAwMCkge1xyXG5cdFx0XHRcdGlmIChpbWcuZGF0YXNldC5zcmMpIHtcclxuXHRcdFx0XHRcdGltZy5zcmMgPSBpbWcuZGF0YXNldC5zcmM7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyYycpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoaW1nLmRhdGFzZXQuc3Jjc2V0KSB7XHJcblx0XHRcdFx0XHRpbWcuc3Jjc2V0ID0gaW1nLmRhdGFzZXQuc3Jjc2V0O1xyXG5cdFx0XHRcdFx0aW1nLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmNzZXQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvL01hcFxyXG5cdC8vIGlmICghbG9hZE1hcC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvYWRlZCcpKSB7XHJcblx0Ly8gXHRsZXQgbWFwT2Zmc2V0ID0gbG9hZE1hcC5vZmZzZXRUb3A7XHJcblx0Ly8gXHRpZiAoc2Nyb2xsWSA+PSBtYXBPZmZzZXQgLSAyMDApIHtcclxuXHQvLyBcdFx0Y29uc3QgbG9hZE1hcFVybCA9IGxvYWRNYXAuZGF0YXNldC5tYXA7XHJcblx0Ly8gXHRcdGlmIChsb2FkTWFwVXJsKSB7XHJcblx0Ly8gXHRcdFx0bG9hZE1hcC5pbnNlcnRBZGphY2VudEhUTUwoXHJcblx0Ly8gXHRcdFx0XHRcImJlZm9yZWVuZFwiLFxyXG5cdC8vIFx0XHRcdFx0YDxpZnJhbWUgc3JjPVwiJHtsb2FkTWFwVXJsfVwiIHN0eWxlPVwiYm9yZGVyOjA7XCIgYWxsb3dmdWxsc2NyZWVuPVwiXCIgbG9hZGluZz1cImxhenlcIj48L2lmcmFtZT5gXHJcblx0Ly8gXHRcdFx0KTtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG59KTsiLCJsZXQgZmxhZyA9IDA7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKXtcclxuXHRsZXQgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cdGxldCBtYXBPZmZzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hcFwiKS5vZmZzZXRUb3A7XHJcblxyXG5cdGlmICgoc2Nyb2xsWSA+PSBtYXBPZmZzZXQgLSA1MDApICYmIChmbGFnID09IDApKSB7XHJcblx0XHR5bWFwcy5yZWFkeShpbml0KTtcclxuXHJcblx0XHRmdW5jdGlvbiBpbml0KCl7XHJcblx0XHRcdGNvbnN0IG15TWFwID0gbmV3IHltYXBzLk1hcChcIm1hcFwiLCB7XHJcblx0XHRcdFx0Y2VudGVyOiBbNTkuODMwNDgxLCAzMC4xNDIxOTddLFxyXG5cdFx0XHRcdHpvb206IDEwLFxyXG5cdFx0XHRcdGNvbnRyb2xzOiBbXVxyXG5cdFx0XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgbXlQbGFjZW1hcmsgID0gbmV3IHltYXBzLlBsYWNlbWFyayhbNTkuODMwNDgxLCAzMC4xNDIxOTddLCB7fSwge1xyXG5cdFx0XHRcdGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuXHRcdFx0XHRpY29uSW1hZ2VIcmVmOiAnaW1nL3BsYWNlbWFyay5wbmcnLFxyXG5cdFx0XHRcdGljb25JbWFnZVNpemU6IFsyNSwgMzRdLFxyXG5cdFx0XHRcdGljb25JbWFnZU9mZnNldDogWy0xOSwgLTQ0XVxyXG5cdFx0XHR9KTtcdFx0XHRcclxuXHRcdFx0bXlNYXAuZ2VvT2JqZWN0cy5hZGQobXlQbGFjZW1hcmspO1xyXG5cdFx0XHRteU1hcC5iZWhhdmlvcnMuZGlzYWJsZShbJ3Njcm9sbFpvb20nXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZmxhZyA9IDE7XHJcblx0fVxyXG59KTsiLCJsZXQgc2V0Q3Vyc29yUG9zaXRpb24gPSAocG9zLCBlbGVtKSA9PiB7XHJcbiAgICBlbGVtLmZvY3VzKCk7XHJcbiAgICBpZiAoZWxlbS5zZXRTZWxlY3Rpb25SYW5nZSkge1xyXG4gICAgICAgIGVsZW0uc2V0U2VsZWN0aW9uUmFuZ2UocG9zLCBwb3MpO1xyXG4gICAgfSBlbHNlIGlmIChlbGVtLmNyZWF0ZVRleHRSYW5nZSkge1xyXG4gICAgICAgIGxldCByYW5nZSA9IGVsZW0uY3JlYXRlVGV4dFJhbmdlKCk7XHJcblxyXG4gICAgICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xyXG4gICAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIHBvcyk7XHJcbiAgICAgICAgcmFuZ2UubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCBwb3MpO1xyXG4gICAgICAgIHJhbmdlLnNlbGVjdCgpO1xyXG4gICAgfVxyXG59O1xyXG5mdW5jdGlvbiBjcmVhdGVNYXNrKGV2ZW50KSB7XHJcbiAgICBsZXQgbWF0cml4ID0gJys3IChfX18pIF9fXyBfXyBfXycsXHJcbiAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgZGVmID0gbWF0cml4LnJlcGxhY2UoL1xcRC9nLCAnJyksXHJcbiAgICAgICAgdmFsID0gdGhpcy52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xyXG4gICAgaWYgKGRlZi5sZW5ndGggPj0gdmFsLmxlbmd0aCkge1xyXG4gICAgICAgIHZhbCA9IGRlZjtcclxuICAgIH1cclxuICAgIHRoaXMudmFsdWUgPSBtYXRyaXgucmVwbGFjZSgvLi9nLCBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgcmV0dXJuIC9bX1xcZF0vLnRlc3QoYSkgJiYgaSA8IHZhbC5sZW5ndGggPyB2YWwuY2hhckF0KGkrKykgOiBpID49IHZhbC5sZW5ndGggPyAnJyA6IGE7XHJcbiAgICB9KTtcclxuICAgIGlmIChldmVudC50eXBlID09PSdibHVyJykge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PSAyIHx8IHRoaXMudmFsdWUubGVuZ3RoIDwgbWF0cml4Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSdrZXl1cCcgfHwgZXZlbnQudHlwZSA9PT0nbW91c2V1cCcpIHtcclxuICAgICAgICBsZXQgY3VyID0gdGhpcy5zZWxlY3Rpb25TdGFydDtcclxuICAgICAgICBpZiAoY3VyID09ICcwJykge1xyXG4gICAgICAgICAgICBzZXRDdXJzb3JQb3NpdGlvbih0aGlzLnZhbHVlLmxlbmd0aCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRDdXJzb3JQb3NpdGlvbih0aGlzLnZhbHVlLmxlbmd0aCwgdGhpcyk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5sZXQgdGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRlbCcpO1xyXG50ZWwuZm9yRWFjaChpbnB1dCA9PiB7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGNyZWF0ZU1hc2spO1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBjcmVhdGVNYXNrKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBjcmVhdGVNYXNrKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgY3JlYXRlTWFzayk7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgY3JlYXRlTWFzayk7XHJcbn0pOyIsIi8vPyDQn9Cw0YDQsNC80LXRgtGA0Ys6XHJcbi8vKiB0cmlnZ2VyU2VsZWN0b3IgLSDQutC90L7Qv9C60LAg0L7RgtC60YDRi9GC0LjRjyDQvNC+0LTQsNC70YzQvdC+0LPQviDQvtC60L3QsFxyXG4vLyogbW9kYWxTZWxlY3RvciAtINC80L7QtNCw0LvRjNC90L7QtSDQvtC60L3QviDQstC90YPRgtGA0Lgg0YTQvtC90LAgbW9kYWxcclxuLy8qIGNsb3NlU2VsZWN0b3IgLSDQutGA0LXRgdGC0LjQuiwg0LfQsNC60YDRi9Cy0LDRjtGJ0LjQuSDQvtC60L3QvlxyXG4vLyogc3BlZWQgLSDQstGA0LXQvNGPINCy0YvQv9C+0LvQvdC10L3QuNGPLCDRgdGC0LDQstC40YLRgdGPINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQuCDRgSAkdHJhbnNpdGlvbi10aW1lXHJcblxyXG4vL1RPRE8g0JTQvtCx0LDQstC40YLRjCDQutC70LDRgdGB0Ys6XHJcbi8vKiBkYXRhLW1vZGFsIC0g0LTQvtCx0LDQstC40YLRjCDQstGB0LXQvCDQvNC+0LTQsNC70YzQvdGL0Lwg0L7QutC90LDQvCAobW9kYWwtbmFtZSkgKNC10YHQu9C4INC40YUg0L3QtdGB0LrQvtC70YzQutC+KVxyXG4vLyogdGFiLWxhc3QgLSDQtNC+0LHQsNCy0LjRgtGMINC60LvQsNGB0YEg0LTQu9GPINC/0L7RgdC70LXQtNC90LXQs9C+INC40L3RgtC10YDQsNC60YLQuNCy0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQsiDRhNC+0YDQvNC1XHJcbi8vKiBsb2NrIC0g0LTQvtCx0LDQstC40YLRjCDQutC70LDRgdGBINC00LvRjyDQsdC70L7QutC+0LIg0YEgcG9zaXRpb246IGFic29sdXRlINC40LvQuCBmaXhlZCAo0LTQvtCx0LDQstC40YLRgdGPIHBhZGRpbmcpXHJcbi8vKiBzbWFsbC1sb2NrIC0g0LTQvtCx0LDQstC40YLRjCDQutC70LDRgdGBINC00LvRjyDQvNCw0LvQtdC90YzQutC40YUg0LHQu9C+0LrQvtCyINGBIHBvc2l0aW9uOiBhYnNvbHV0ZSDQuNC70LggZml4ZWQgKNC00L7QsdCw0LLQuNGC0YHRjyBtYXJnaW4pXHJcblxyXG5cclxuYmluZE1vZGFsKCcubW9kYWwtYnRuJywgJy5tb2RhbC1uYW1lJywgJy5tb2RhbC1uYW1lX19jbG9zZScsIDUwMCk7XHJcblxyXG5mdW5jdGlvbiBiaW5kTW9kYWwodHJpZ2dlclNlbGVjdG9yLCBtb2RhbFNlbGVjdG9yLCBjbG9zZVNlbGVjdG9yLCBzcGVlZCkge1xyXG4gICAgY29uc3QgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodHJpZ2dlclNlbGVjdG9yKSxcclxuICAgICAgICAgICAgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheScpLFxyXG4gICAgICAgICAgICBtb2RhbENvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG1vZGFsU2VsZWN0b3IpLFxyXG4gICAgICAgICAgICBjbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY2xvc2VTZWxlY3RvciksXHJcbiAgICAgICAgICAgIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbF0nKSxcclxuICAgICAgICAgICAgZml4U2Nyb2xsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmxvY2snKSxcclxuICAgICAgICAgICAgc21hbGxGaXggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc21hbGwtbG9jaycpLFxyXG4gICAgICAgICAgICB0YWJMYXN0ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLnRhYi1sYXN0JyksXHJcbiAgICAgICAgICAgIHNwZWVkVGltZSA9IChzcGVlZCksXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IGNhbGNTY3JvbGwoKTtcclxuICAgIGxldCBtb2RhbE9wZW4gPSBmYWxzZTtcclxuICAgIGxldCBsYXN0Rm9jdXM7XHJcblxyXG4gICAgdHJpZ2dlci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXRcclxuICAgICAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1vZGFsT3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHdpbmRvd3MuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtbG9jaycpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgJHtzY3JvbGx9cHhgO1xyXG4gICAgICAgICAgICBpZiAoZml4U2Nyb2xsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZpeFNjcm9sbC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUucGFkZGluZ1JpZ2h0ID0gYCR7c2Nyb2xsfXB4YDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNtYWxsRml4Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNtYWxsRml4LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5tYXJnaW5SaWdodCA9IGAke3Njcm9sbH1weGA7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtb2RhbENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpO1xyXG4gICAgICAgICAgICBsYXN0Rm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgc3BlZWRUaW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRhYkxhc3QuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcbiAgICAgICAgaWYgKGUuY29kZSA9PT0gJ1RhYicgJiYgbW9kYWxPcGVuKSB7XHJcbiAgICAgICAgICAgIG1vZGFsLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gcG9wYXBDbG9zZSgpIHtcclxuICAgICAgICBtb2RhbE9wZW4gPSBmYWxzZTtcclxuICAgICAgICB3aW5kb3dzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1sb2NrJyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgMHB4YDtcclxuICAgICAgICBpZiAoZml4U2Nyb2xsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZml4U2Nyb2xsLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAwcHhgO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc21hbGxGaXgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBzbWFsbEZpeC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5tYXJnaW5SaWdodCA9IGAwcHhgO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHBvcGFwQ2xvc2UoKTtcclxuICAgICAgICBsYXN0Rm9jdXMuZm9jdXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBpZiAoZS50YXJnZXQgPT0gbW9kYWwpIHtcclxuICAgICAgICAgICAgcG9wYXBDbG9zZSgpOyBcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuICAgICAgICBpZiAoZS5jb2RlID09PSAnRXNjYXBlJyAmJiBtb2RhbE9wZW4pIHtcclxuICAgICAgICAgICAgcG9wYXBDbG9zZSgpO1xyXG4gICAgICAgICAgICBsYXN0Rm9jdXMuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBjYWxjU2Nyb2xsKCkge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbiAgICAgICAgZGl2LnN0eWxlLndpZHRoID0gJzUwcHgnO1xyXG4gICAgICAgIGRpdi5zdHlsZS5oZWlnaHQgPSAnNTBweCc7XHJcbiAgICAgICAgZGl2LnN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xyXG4gICAgICAgIGRpdi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICBsZXQgc2Nyb2xsV2lkdGggPSBkaXYub2Zmc2V0V2lkdGggLSBkaXYuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgZGl2LnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiBzY3JvbGxXaWR0aDtcclxuICAgIH1cclxufTsiLCJjb25zdCBxdWl6Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LWZvcm0nKTtcclxuY29uc3QgcXVpeklucHV0cyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcbmNvbnN0IHF1aXpCbG9ja3MgPSBxdWl6Rm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcucXVpei1ibG9jaycpO1xyXG5cclxubGV0IHRleHRhcmVhVGV4dCA9IG51bGw7XHJcbmxldCBxdWl6UmVwbHkgID0ge307XHJcbmxldCBibG9ja0luZGV4ID0gMDtcclxuXHJcbi8vINGE0YPQvdC60YbQuNGPINC/0L7QutCw0LfQsCDRgtC+0LvRjNC60L4g0L/QtdGA0LLQvtCz0L4g0LHQu9C+0LrQsCDQutCy0LjQt9CwXHJcbnNob3dCbG9ja3MoYmxvY2tJbmRleCk7XHJcblxyXG5mdW5jdGlvbiBzaG93QmxvY2tzKCkge1xyXG5cdHF1aXpCbG9ja3MuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnKTtcclxuXHRxdWl6QmxvY2tzW2Jsb2NrSW5kZXhdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG59XHJcblxyXG4vLyDQt9Cw0L/QuNGB0Ywg0L3QsNC30LLQsNC90LjRjyDRh9C10LrQsdC+0LrRgdCwINCyIHZhbHVlINC40L3Qv9GD0YLQsCDRh9C10LrQsdC+0LrRgdCwXHJcbnF1aXpJbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0aWYgKGlucHV0LnR5cGUgPT0gJ2NoZWNrYm94JyB8fCBpbnB1dC50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdGlucHV0LnZhbHVlID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nLnRleHRDb250ZW50O1xyXG5cdH1cclxufSk7XHJcblxyXG5xdWl6Rm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0bGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cdGxldCBibG9jayA9IHRhcmdldC5jbG9zZXN0KCcucXVpei1ibG9jaycpO1xyXG5cdGxldCBuZXh0QnRuID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbmV4dF0nKTtcclxuXHRuZXh0QnRuLmZvckVhY2goYnRuID0+IHtcclxuXHRcdGlmICh0YXJnZXQgPT0gYnRuKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0YWRkVG9TZW5kKGJsb2NrLCBxdWl6UmVwbHkpO1xyXG5cdFx0XHRuZXh0UXVlc3Rpb24oYmxvY2spO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdGlmICh0YXJnZXQgPT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2VuZF0nKSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0YWRkVG9TZW5kKGJsb2NrLCBxdWl6UmVwbHkpO1xyXG5cdFx0c2VuZChibG9jayk7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG5leHRRdWVzdGlvbihmb3JtKSB7XHJcblx0bGV0IHZhbGlkID0gdmFsaWRJbnB1dChmb3JtKTtcclxuXHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0c2hvd0Jsb2NrcyhibG9ja0luZGV4ICs9IDEpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2VuZChmb3JtKSB7XHJcblx0bGV0IHZhbGlkID0gdmFsaWRJbnB1dChmb3JtKTtcclxuXHRpZiAodmFsaWQgPT09IDAgJiYgdmFsaWRDaGVjayhmb3JtKSkge1xyXG5cdFx0Zm9ybVJlbW92ZUVycm9yKHF1aXpGb3JtKTtcclxuXHJcblx0XHQvLyogPT09PT09PT0g0KHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RgtC/0YDQsNCy0LrQtSA9PT09PT09PT09PT1cclxuXHRcdGxldCBvayA9IGZvcm0ucXVlcnlTZWxlY3RvcignLnF1aXotc2VuZF9fb2snKTtcclxuXHRcdGxldCB0ZXh0TWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLnF1aXotbWVzc2FnZScpO1xyXG5cdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ9CX0LDQs9GA0YPQt9C60LAuLi4nO1xyXG5cdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyo9PT09PT09PT0gRm9ybURhdGEgPT09PT09PT09PT09PT09XHJcblx0XHRjb25zdCBxdWl6Rm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBxdWl6UmVwbHkpIHtcclxuXHRcdFx0cXVpekZvcm1EYXRhLmFwcGVuZChrZXksIHF1aXpSZXBseVtrZXldKTtcclxuXHRcdH1cclxuXHRcdC8vIGZvcm1EYXRhLmFwcGVuZCgnaW1hZ2UnLCBmb3JtSW1hZ2UuZmlsZXNbMF0pO1xyXG5cdFx0Ly8qINCf0YDQvtCy0LXRgNC60LAgRm9ybURhdGFcclxuXHRcdC8vIGZvcih2YXIgcGFpciBvZiBxdWl6Rm9ybURhdGEuZW50cmllcygpKSB7XHJcblx0XHQvLyBcdGNvbnNvbGUubG9nKHBhaXJbMF0rICc6ICcrIHBhaXJbMV0pO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vKj09PT09PT09PSDQntGC0L/RgNCw0LLQutCwINC00LDQvdC90YvRhSA9PT09PT09PT09PT09PT1cclxuXHRcdGNvbnN0IHF1aXpEYXRhID0gYXN5bmMgKHVybCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcclxuXHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdGJvZHk6IGRhdGFcclxuXHRcdFx0fSk7XHRcclxuXHRcdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblxyXG5cdFx0XHRcdC8vIGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7IC8vIGpzb24oKSAtINC00LvRjyDQstGL0LLQvtC00LAg0YHQvtC+0LHRidC10L3QuNGPO1xyXG5cdFx0XHRcdC8vIGFsZXJ0KHJlc3VsdC5tZXNzYWdlKTtcclxuXHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTsgLy8gdGV4dCgpIC0g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtSwg0L/QvtC00LrQu9GO0YfQuNGC0Ywgc2VydmVyLnBocClcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXN1bHQpOyAvLyDRjdGC0L4g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDRgdC10YDQstC10YDQtVxyXG5cclxuXHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLnRleHRDb250ZW50ID0gJ09rISc7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2suY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdFx0Y2xlYXJJbnB1dHMocXVpeklucHV0cyk7XHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0dGV4dE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRvay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhbGVydChcItCe0YjQuNCx0LrQsCBIVFRQOiBcIiArIHJlc3BvbnNlLnN0YXR1cyk7XHJcblx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdC8vIHF1aXpEYXRhKCcuLi9zZW5kbWFpbC5waHAnLCBxdWl6Rm9ybURhdGEpO1xyXG5cdFx0cXVpekRhdGEoJy4uL3NlcnZlci5waHAnLCBxdWl6Rm9ybURhdGEpIC8vISDRg9Cx0YDQsNGC0YwgKNGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1KVxyXG5cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvU2VuZChmb3JtLCBvYmopIHtcclxuXHRsZXQgdmFsdWVTdHJpbmcgPSAnJztcclxuXHRsZXQgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG5cdGxldCB0ZXh0YXJlYSA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKTtcclxuXHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBmaWVsZCA9IGlucHV0c1tpXTtcclxuXHRcdFx0aWYgKGZpZWxkLnR5cGUgIT0gJ2NoZWNrYm94JyAmJiBmaWVsZC50eXBlICE9ICdyYWRpbycgJiYgZmllbGQudmFsdWUpIHtcclxuXHRcdFx0XHRvYmpbZmllbGQubmFtZV0gPSBmaWVsZC52YWx1ZTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWVsZC50eXBlID09ICdyYWRpbycgJiYgZmllbGQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdG9ialtmaWVsZC5uYW1lXSA9IGZpZWxkLnZhbHVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gJ2NoZWNrYm94JyAmJiBmaWVsZC5jaGVja2VkKSB7XHJcblx0XHRcdFx0dmFsdWVTdHJpbmcgKz0gZmllbGQudmFsdWUgKyAnLCc7XHRcdFxyXG5cdFx0XHRcdG9ialtmaWVsZC5uYW1lXSA9IHZhbHVlU3RyaW5nO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSBlbHNlIGlmICh0ZXh0YXJlYS5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRleHRhcmVhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCB0ZXh0ID0gdGV4dGFyZWFbaV07XHJcblx0XHRcdGlmICh0ZXh0LnZhbHVlKSB7XHJcblx0XHRcdFx0b2JqW3RleHQubmFtZV0gPSB0ZXh0LnZhbHVlO1x0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0iLCJjb25zdCByYW5nZVNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5nZS1zbGlkZXInKTtcblxuaWYgKHJhbmdlU2xpZGVyKSB7XG5cdG5vVWlTbGlkZXIuY3JlYXRlKHJhbmdlU2xpZGVyLCB7XG4gICAgc3RhcnQ6IFs1MDAsIDk5OTk5OV0sXG5cdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRzdGVwOiAxLFxuICAgIHJhbmdlOiB7XG5cdFx0XHQnbWluJzogWzUwMF0sXG5cdFx0XHQnbWF4JzogWzk5OTk5OV1cbiAgICB9XG5cdH0pO1xuXG5cdGNvbnN0IGlucHV0MCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC0wJyk7XG5cdGNvbnN0IGlucHV0MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC0xJyk7XG5cdGNvbnN0IGlucHV0cyA9IFtpbnB1dDAsIGlucHV0MV07XG5cblx0cmFuZ2VTbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24odmFsdWVzLCBoYW5kbGUpe1xuXHRcdGlucHV0c1toYW5kbGVdLnZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZXNbaGFuZGxlXSk7XG5cdH0pO1xuXG5cdGNvbnN0IHNldFJhbmdlU2xpZGVyID0gKGksIHZhbHVlKSA9PiB7XG5cdFx0bGV0IGFyciA9IFtudWxsLCBudWxsXTtcblx0XHRhcnJbaV0gPSB2YWx1ZTtcblxuXHRcdGNvbnNvbGUubG9nKGFycik7XG5cblx0XHRyYW5nZVNsaWRlci5ub1VpU2xpZGVyLnNldChhcnIpO1xuXHR9O1xuXG5cdGlucHV0cy5mb3JFYWNoKChlbCwgaW5kZXgpID0+IHtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coaW5kZXgpO1xuXHRcdFx0c2V0UmFuZ2VTbGlkZXIoaW5kZXgsIGUuY3VycmVudFRhcmdldC52YWx1ZSk7XG5cdFx0fSk7XG5cdH0pO1xufSIsImxldCB0ZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRhbG9nLXNpemVzIHRkJyk7XHJcblxyXG50ZC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0bGV0IHNlbGYgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblx0XHRpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZGJiYmE5JztcclxuXHRcdHRkLmZvckVhY2goYnRuID0+IHtcclxuXHRcdFx0aWYgKGJ0biAhPT0gc2VsZikge1xyXG5cdFx0XHRcdGJ0bi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAndHJhbnNwYXJlbnQnO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSk7IiwiLy8qINCS0LDQu9C40LTQsNGG0LjRjyDRhNC+0YDQvNGLICjQtdGB0LvQuCDRh9C10LrQsdC+0LrRgdGLINC4INC40L3Qv9GD0YLRiyDQsiDQvtC00L3QvtC5INGE0L7RgNC80LUpXHJcbmZ1bmN0aW9uIHZhbGlkQ2hlY2soZm9ybSkge1xyXG5cdGxldCBlbGVtZW50cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRsZXQgaXNWYWxpZCA9IGZhbHNlO1xyXG5cdGlmIChlbGVtZW50cy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZWxlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGxldCBpbnB1dCA9IGVsZW1lbnRzW2luZGV4XTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwiY2hlY2tib3hcIiB8fCBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcInJhZGlvXCIpIHtcclxuXHRcdFx0XHRcdGlmIChpbnB1dC5jaGVja2VkKSB7XHJcblx0XHRcdFx0XHRcdGlzVmFsaWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtpc1ZhbGlkID0gdHJ1ZTt9XHJcblx0XHR9XHJcblx0fSBlbHNlIHtpc1ZhbGlkID0gdHJ1ZTt9XHJcblxyXG5cdHJldHVybiBpc1ZhbGlkO1xyXG59XHJcbmZ1bmN0aW9uIHZhbGlkSW5wdXQoZm9ybSkge1xyXG5cdGxldCBlbGVtZW50cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRsZXQgZXJyb3IgPSAwO1xyXG5cdGlmIChlbGVtZW50cy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZWxlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGxldCBpbnB1dCA9IGVsZW1lbnRzW2luZGV4XTtcclxuXHRcdFx0bGV0IHBsYWNlaG9sZGVyID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xyXG5cdFx0XHRpZiAoIWlucHV0LmNsYXNzTGlzdC5jb250YWlucygnbm90LXZhbGlkJykpIHtcclxuXHRcdFx0XHRpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbWFpbCcpKSB7XHJcblx0XHRcdFx0XHRpZiAoZW1haWxUZXN0KGlucHV0KSB8fCBpbnB1dC52YWx1ZSA9PSBwbGFjZWhvbGRlcikge1xyXG5cdFx0XHRcdFx0XHRmb3JtQWRkRXJyb3IoaW5wdXQpO1xyXG5cdFx0XHRcdFx0XHRlcnJvcisrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoaW5wdXQudmFsdWUgPT0gJycgfHwgaW5wdXQudmFsdWUgPT0gcGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0Ly8h0LLQutC70Y7Rh9C40YLRjCwg0LXRgdC70Lgg0L3QsNC00L4g0LLQsNC70LjQtNC40YDQvtCy0LDRgtGMIHRleHRhcmU6XHJcblx0Ly8gbGV0IHRleHRhcmVhID0gZm9ybS5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xyXG5cdC8vIGlmICh0ZXh0YXJlYSkge1xyXG5cdC8vIFx0aWYgKHRleHRhcmVhLnZhbHVlID09ICcnKSB7XHJcblx0Ly8gXHRcdGZvcm1BZGRFcnJvcih0ZXh0YXJlYSk7XHJcblx0Ly8gXHRcdGVycm9yKys7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSBcclxuXHJcblx0cmV0dXJuIGVycm9yO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtQWRkRXJyb3IoaXRlbSkge1xyXG5cdGl0ZW0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG5cdGl0ZW0uY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuXHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwsINC10YHQu9C4INCyIGh0bWwg0LTQvtCx0LDQstC70LXQvdGLINCx0LvQvtC60Lgg0YEg0YHQvtC+0LHRidC10L3QuNC10Lwg0L7QsSDQvtGI0LjQsdC60LUgKC5mb3JtLWVycm9yKVxyXG5cdC8vKiDQtdGB0LvQuCDRgNCw0LfQvdGL0Lkg0YLQtdC60YHRgiDQvtGI0LjQsdC60Lgg0LTQu9GPINC60LDQttC00L7Qs9C+IGlucHV0XHJcblx0Ly8gbGV0IGltcHV0RXJyb3IgPSBpdGVtLm5leHRFbGVtZW50U2libGluZztcclxuXHQvLyBpZiAoaW1wdXRFcnJvcikge1xyXG5cdC8vIFx0aWYgKGltcHV0RXJyb3IuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbXB1dC1tZXNzYWdlJykpIHtcclxuXHQvLyBcdFx0aW1wdXRFcnJvci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblx0Ly8qINC10YHQu9C4INC+0YjQuNCx0LrQsCDQtNC70Y8g0LLRgdC10Lkg0YTQvtGA0LzRiyAo0LjQu9C4INCx0LvQvtC60LAg0LrQstC40LfQsCk6XHJcblxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMINC10YHQu9C4INC90LAg0YHQsNC50YLQtSDQtdGB0YLRjCDQutCy0LjQt1xyXG5cdGlmIChpdGVtLmNsb3Nlc3QoJy5xdWl6LWZvcm0nKSkge1xyXG5cdFx0bGV0IHF1aXpFcnJvciA9IGl0ZW0uY2xvc2VzdCgnLnF1aXotYmxvY2snKS5xdWVyeVNlbGVjdG9yKCcucXVpei1tZXNzYWdlJyk7XHJcblx0XHRpZiAocXVpekVycm9yKSB7XHJcblx0XHRcdHF1aXpFcnJvci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0bGV0IGZvcm1FcnJvciA9IGl0ZW0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybS1lcnJvcicpO1xyXG5cdFx0aWYgKGZvcm1FcnJvcikge1xyXG5cdFx0XHRmb3JtRXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCDQtdGB0LvQuCDQvdCwINGB0LDQudGC0LUg0L3QtdGCINC60LLQuNC30LAgKNGC0L7Qu9GM0LrQviDRhNC+0YDQvNGLKVxyXG5cdC8vIGxldCBmb3JtRXJyb3IgPSBpdGVtLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tZXJyb3InKTtcclxuXHQvLyBpZiAoZm9ybUVycm9yKSB7XHJcblx0Ly8gXHRmb3JtRXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0Ly8gfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtUmVtb3ZlRXJyb3IoZm9ybSkge1xyXG5cdGxldCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cdGlmIChpbnB1dHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGlucHV0cy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0bGV0IGlucHV0ID0gaW5wdXRzW2luZGV4XTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpKSB7XHJcblx0XHRcdFx0aW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cdFx0XHRcdGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwsINC10YHQu9C4INCyIGh0bWwg0LTQvtCx0LDQstC70LXQvdGLINCx0LvQvtC60Lgg0YEg0YHQvtC+0LHRidC10L3QuNC10Lwg0L7QsSDQvtGI0LjQsdC60LUgKC5mb3JtLWVycm9yKVxyXG5cdGxldCBmb3JtRXJyb3IgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtLW1lc3NhZ2UnKTtcclxuXHRpZiAoZm9ybUVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBmb3JtRXJyb3IubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGNvbnN0IGVycm9yID0gZm9ybUVycm9yW2luZGV4XTtcclxuXHRcdFx0ZXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbWFpbFRlc3Qoc2VsZWN0b3IpIHtcclxuXHRyZXR1cm4gIS9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7Miw4fSkrJC8udGVzdChzZWxlY3Rvci52YWx1ZSk7XHJcbn1cclxuXHJcbmNvbnN0IHRleHRJbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hlY2snKTsgICBcclxudGV4dElucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHQvLyDQtdGB0LvQuCDQt9C90LDRh9C10L3QuNC1INC60LvQsNCy0LjRiNC4KGUua2V5KSDQvdC1INGB0L7QvtGC0LLQtdGC0YHRgtCy0YPQtdGCKG1hdGNoKSDQutC40YDQuNC70LvQuNGG0LUsINC/0L7Qu9C1INC90LUg0LfQsNC/0L7Qu9C90Y/QtdGC0YHRj1xyXG5cdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYgKGUua2V5Lm1hdGNoKC9bXtCwLdGP0ZEgMC05XS9pZykpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdC8vINC10YHQu9C4INC/0YDQuCDQsNCy0YLQvtC30LDQv9C+0LvQvdC10L3QuNC4INCy0YvQsdGA0LDQvdC+INGB0LvQvtCy0L4g0L3QtSDQutC40YDQuNC70LvQuNGG0LXQuSwg0YHRgtGA0L7QutCwINC+0YfQuNGB0YLQuNGC0YHRj1xyXG5cdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnZhbHVlPXRoaXMudmFsdWUucmVwbGFjZSgvW15cXNCwLdGP0ZEgMC05XS9pZyxcIlwiKTtcclxuXHR9KTtcclxufSk7Il19
