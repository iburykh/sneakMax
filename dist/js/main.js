'use strict';

// forEach Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

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
const quizForm = document.querySelector('.quiz-form');
const inputs = quizForm.querySelectorAll('input');
const quizBlocks = quizForm.querySelectorAll('.quiz-block');

let textareaText = null;
let quizReply  = {};
let blockIndex = 0;

const clearInputs = () => {
	inputs.forEach(item => {
		item.value = '';
	});

	//* если есть загрузка файла (в атрибут добавить file)
	// if (file) {
	// 	file.textContent = "Файл не выбран";
	// }

	//* если есть checkbox
	let checkboxes = quizForm.querySelectorAll('.custom-checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
};

// функция показа только первого блока квиза
showBlocks(blockIndex);

function showBlocks() {
	quizBlocks.forEach((item) => item.style.display = 'none');
	quizBlocks[blockIndex].style.display = 'block';
}

// запись названия чекбокса в value инпута чекбокса
inputs.forEach(input => {
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
		let textMessage = form.querySelector('.form-message');
		if (textMessage) {
			textMessage.textContent = 'Загрузка...';
			textMessage.classList.add('active');
		}

		//*========= FormData (сама собирает все из формы) ===============
		const quizFormData = new FormData();
		for (let key in quizReply) {
			quizFormData.append(key, quizReply[key]);
		}
		// formData.append('image', formImage.files[0]);
		//* Проверка формы
		// for(var pair of quizFormData.entries()) {
		// 	console.log(pair[0]+ ': '+ pair[1]);
		// }

		//*========= Отправка формы ===============
		const postData = async (url, data) => {
			let response = await fetch(url, {
				method: "POST",
				body: data
			});	
			if (response.ok) {

				// let result = await response.json(); // json() - для вывода сообщения;
				// alert(result.message);

				// let result = await response.text(); // text() - для проверки на сервере, подключить server.php)
				// console.log(result); // это для проверки на сервере

				if (textMessage) {
					textMessage.textContent = 'Ok!';
					textMessage.classList.add('active');
				}
				ok.classList.add('active');
				clearInputs(inputs);
				setTimeout(() => {
					if (textMessage) {
						textMessage.classList.remove('active');
					}
					ok.classList.remove('active');
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
		postData('../sendmail.php', quizFormData);
		// postData('../server.php', quizFormData) //! убрать (это для проверки на сервере)
		
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
		let quizError = item.closest('.quiz-block').querySelector('.form-message');
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
			const input = inputs[index];
			input.parentElement.classList.remove('error');
			input.classList.remove('error');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJhY2NvcmRpb24uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImxhenkuanMiLCJtYXAuanMiLCJxdWl6LmpzIiwicmFuZ2Utc2xpZGVyLmpzIiwic2l6ZXMuanMiLCJ2YWxpZGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGZvckVhY2ggUG9seWZpbGxcclxuaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbn1cclxuXHJcbi8vIHdpbmRvdy5ub1plbnNtb290aCA9IHRydWU7IiwiY29uc3QgYWNjb3JkaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24nKTtcblxuYWNjb3JkaW9ucy5mb3JFYWNoKGVsID0+IHtcblx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdGNvbnN0IHNlbGYgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0Y29uc3QgY29udHJvbCA9IHNlbGYucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udHJvbCcpO1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRlbnQnKTtcblxuXHRcdC8vKiDQtdGB0LvQuCDQvdC10L7QsdGF0L7QtNC40LzQviDRh9GC0L7QsdGLINCy0YHQtSDQsdC70L7QutC4INC30LDQutGA0YvQstCw0LvQuNGB0Ywg0L/RgNC4INC+0YLQutGA0YvRgtC40Lgg0LHQu9C+0LrQsCAtINC/0YDQvtGB0YLQviDRgNCw0YHQutC+0LzQtdC90YLQuNGA0L7QstCw0YLRjCDRjdGC0YMg0YfQsNGB0YLRjCFcblx0XHQvLyBhY2NvcmRpb25zLmZvckVhY2goYnRuID0+IHtcblx0XHQvLyBcdGNvbnN0IGNvbnRyb2wgPSBidG4ucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udHJvbCcpO1xuXHRcdC8vIFx0Y29uc3QgY29udGVudCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50Jyk7XG5cdFx0Ly8gXHRpZiAoYnRuICE9PSBzZWxmKSB7XG5cdFx0Ly8gXHRcdGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG5cdFx0Ly8gXHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXHRcdC8vIFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHQvLyBcdFx0Y29udGVudC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH0pO1xuXG5cdFx0c2VsZi5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG5cblx0XHQvLyDQtdGB0LvQuCDQvtGC0LrRgNGL0YIg0LDQutC60L7RgNC00LXQvtC9XG5cdFx0aWYgKHNlbGYuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVuJykpIHtcblx0XHRcdGNvbnRyb2wuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnN0eWxlLm1heEhlaWdodCA9IGNvbnRlbnQuc2Nyb2xsSGVpZ2h0ICsgJ3B4Jztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udHJvbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHRcdGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcblx0XHR9XG5cdH0pO1xufSk7IiwibGV0IG1lbnVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcclxubGV0IG1lbnVJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVfX2xpbmsnKTtcclxubGV0IGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKTtcclxuXHJcbmhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBtZW51Qm9keS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2Nyb2xsLWxvY2snKTtcclxuICAgIGlmIChoYW1idXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGhhbWJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0LfQsNC60YDRi9GC0Ywg0L3QsNCy0LjQs9Cw0YbQuNGOJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbWJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0L3QsNCy0LjQs9Cw0YbQuNGOJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgbWVudUJvZHkuZm9jdXMoKTtcclxuICAgIH0sIDYwMCk7XHJcbn0pO1xyXG5cclxubWVudUl0ZW0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBtZW51Qm9keS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtbG9jaycpO1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9C+0YLQutGA0YvRgtGMINC90LDQstC40LPQsNGG0LjRjicpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcblxyXG5sZXQgZmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlcnMnKTtcclxubGV0IGZpbHRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19idG4nKTtcclxubGV0IGZpbHRlckJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nLWhhbWJ1cmdlcicpO1xyXG5cclxuZmlsdGVyQnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyAgICBcclxuICAgIGZpbHRlckJ1cmdlci5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGZpbHRlci5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGlmIChmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0LfQsNC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0L7RgtC60YDRi9GC0Ywg0YTQuNC70YzRgtGAJyk7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBmaWx0ZXIuZm9jdXMoKTtcclxuICAgIH0sIDYwMCk7XHJcbn0pO1xyXG5cclxuZmlsdGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChmaWx0ZXJCdXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGZpbHRlckJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgZmlsdGVyQnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQvtGC0LrRgNGL0YLRjCDRhNC40LvRjNGC0YAnKTsgXHJcbiAgICB9XHJcbn0pXHJcbiIsImNvbnN0IGNoZWNrQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhdGFsb2ctY2hlY2tib3hfX2xhYmVsLCAuY3VzdG9tLWNoZWNrYm94X190ZXh0Jyk7XHJcblxyXG5jaGVja0JveC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcblx0XHRpZiAoZS5jb2RlID09PSAnRW50ZXInIHx8IGUuY29kZSA9PT0gJ051bXBhZEVudGVyJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcclxuXHRcdFx0bGV0IGNoZWNrID0gZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHRcdFx0aWYgKGNoZWNrLnR5cGUgPT0gJ3JhZGlvJykge1xyXG5cdFx0XHRcdGlmIChjaGVjay5jaGVja2VkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0fSBcclxuXHRcdFx0fSBlbHNlIGlmIChjaGVjay50eXBlID09ICdjaGVja2JveCcpIHtcclxuXHRcdFx0XHRpZiAoY2hlY2suY2hlY2tlZCA9PT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG59KTsiLCJjb25zdCBsYXp5SW1hZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtc3JjXSxzb3VyY2VbZGF0YS1zcmNzZXRdJyk7XHJcbmNvbnN0IGxvYWRNYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZC1tYXAnKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsICgpID0+IHtcclxuXHRsZXQgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cdGlmIChsYXp5SW1hZ2VzLmxlbmd0aCA+IDApIHtcclxuXHRcdGxhenlJbWFnZXMuZm9yRWFjaChpbWcgPT4ge1xyXG5cdFx0XHRsZXQgaW1nT2Zmc2V0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHBhZ2VZT2Zmc2V0O1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHNjcm9sbFkgPj0gaW1nT2Zmc2V0IC0gMTAwMCkge1xyXG5cdFx0XHRcdGlmIChpbWcuZGF0YXNldC5zcmMpIHtcclxuXHRcdFx0XHRcdGltZy5zcmMgPSBpbWcuZGF0YXNldC5zcmM7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyYycpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoaW1nLmRhdGFzZXQuc3Jjc2V0KSB7XHJcblx0XHRcdFx0XHRpbWcuc3Jjc2V0ID0gaW1nLmRhdGFzZXQuc3Jjc2V0O1xyXG5cdFx0XHRcdFx0aW1nLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmNzZXQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvL01hcFxyXG5cdC8vIGlmICghbG9hZE1hcC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvYWRlZCcpKSB7XHJcblx0Ly8gXHRsZXQgbWFwT2Zmc2V0ID0gbG9hZE1hcC5vZmZzZXRUb3A7XHJcblx0Ly8gXHRpZiAoc2Nyb2xsWSA+PSBtYXBPZmZzZXQgLSAyMDApIHtcclxuXHQvLyBcdFx0Y29uc3QgbG9hZE1hcFVybCA9IGxvYWRNYXAuZGF0YXNldC5tYXA7XHJcblx0Ly8gXHRcdGlmIChsb2FkTWFwVXJsKSB7XHJcblx0Ly8gXHRcdFx0bG9hZE1hcC5pbnNlcnRBZGphY2VudEhUTUwoXHJcblx0Ly8gXHRcdFx0XHRcImJlZm9yZWVuZFwiLFxyXG5cdC8vIFx0XHRcdFx0YDxpZnJhbWUgc3JjPVwiJHtsb2FkTWFwVXJsfVwiIHN0eWxlPVwiYm9yZGVyOjA7XCIgYWxsb3dmdWxsc2NyZWVuPVwiXCIgbG9hZGluZz1cImxhenlcIj48L2lmcmFtZT5gXHJcblx0Ly8gXHRcdFx0KTtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG59KTsiLCJsZXQgZmxhZyA9IDA7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKXtcclxuXHRsZXQgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cdGxldCBtYXBPZmZzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hcFwiKS5vZmZzZXRUb3A7XHJcblxyXG5cdGlmICgoc2Nyb2xsWSA+PSBtYXBPZmZzZXQgLSA1MDApICYmIChmbGFnID09IDApKSB7XHJcblx0XHR5bWFwcy5yZWFkeShpbml0KTtcclxuXHJcblx0XHRmdW5jdGlvbiBpbml0KCl7XHJcblx0XHRcdGNvbnN0IG15TWFwID0gbmV3IHltYXBzLk1hcChcIm1hcFwiLCB7XHJcblx0XHRcdFx0Y2VudGVyOiBbNTkuODMwNDgxLCAzMC4xNDIxOTddLFxyXG5cdFx0XHRcdHpvb206IDEwLFxyXG5cdFx0XHRcdGNvbnRyb2xzOiBbXVxyXG5cdFx0XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgbXlQbGFjZW1hcmsgID0gbmV3IHltYXBzLlBsYWNlbWFyayhbNTkuODMwNDgxLCAzMC4xNDIxOTddLCB7fSwge1xyXG5cdFx0XHRcdGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuXHRcdFx0XHRpY29uSW1hZ2VIcmVmOiAnaW1nL3BsYWNlbWFyay5wbmcnLFxyXG5cdFx0XHRcdGljb25JbWFnZVNpemU6IFsyNSwgMzRdLFxyXG5cdFx0XHRcdGljb25JbWFnZU9mZnNldDogWy0xOSwgLTQ0XVxyXG5cdFx0XHR9KTtcdFx0XHRcclxuXHRcdFx0bXlNYXAuZ2VvT2JqZWN0cy5hZGQobXlQbGFjZW1hcmspO1xyXG5cdFx0XHRteU1hcC5iZWhhdmlvcnMuZGlzYWJsZShbJ3Njcm9sbFpvb20nXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZmxhZyA9IDE7XHJcblx0fVxyXG59KTsiLCJjb25zdCBxdWl6Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LWZvcm0nKTtcclxuY29uc3QgaW5wdXRzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuY29uc3QgcXVpekJsb2NrcyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5xdWl6LWJsb2NrJyk7XHJcblxyXG5sZXQgdGV4dGFyZWFUZXh0ID0gbnVsbDtcclxubGV0IHF1aXpSZXBseSAgPSB7fTtcclxubGV0IGJsb2NrSW5kZXggPSAwO1xyXG5cclxuY29uc3QgY2xlYXJJbnB1dHMgPSAoKSA9PiB7XHJcblx0aW5wdXRzLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRpdGVtLnZhbHVlID0gJyc7XHJcblx0fSk7XHJcblxyXG5cdC8vKiDQtdGB0LvQuCDQtdGB0YLRjCDQt9Cw0LPRgNGD0LfQutCwINGE0LDQudC70LAgKNCyINCw0YLRgNC40LHRg9GCINC00L7QsdCw0LLQuNGC0YwgZmlsZSlcclxuXHQvLyBpZiAoZmlsZSkge1xyXG5cdC8vIFx0ZmlsZS50ZXh0Q29udGVudCA9IFwi0KTQsNC50Lsg0L3QtSDQstGL0LHRgNCw0L1cIjtcclxuXHQvLyB9XHJcblxyXG5cdC8vKiDQtdGB0LvQuCDQtdGB0YLRjCBjaGVja2JveFxyXG5cdGxldCBjaGVja2JveGVzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmN1c3RvbS1jaGVja2JveF9faW5wdXQnKTtcclxuXHRpZiAoY2hlY2tib3hlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY2hlY2tib3hlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0Y29uc3QgY2hlY2tib3ggPSBjaGVja2JveGVzW2luZGV4XTtcclxuXHRcdFx0Y2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8vINGE0YPQvdC60YbQuNGPINC/0L7QutCw0LfQsCDRgtC+0LvRjNC60L4g0L/QtdGA0LLQvtCz0L4g0LHQu9C+0LrQsCDQutCy0LjQt9CwXHJcbnNob3dCbG9ja3MoYmxvY2tJbmRleCk7XHJcblxyXG5mdW5jdGlvbiBzaG93QmxvY2tzKCkge1xyXG5cdHF1aXpCbG9ja3MuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnKTtcclxuXHRxdWl6QmxvY2tzW2Jsb2NrSW5kZXhdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG59XHJcblxyXG4vLyDQt9Cw0L/QuNGB0Ywg0L3QsNC30LLQsNC90LjRjyDRh9C10LrQsdC+0LrRgdCwINCyIHZhbHVlINC40L3Qv9GD0YLQsCDRh9C10LrQsdC+0LrRgdCwXHJcbmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHRpZiAoaW5wdXQudHlwZSA9PSAnY2hlY2tib3gnIHx8IGlucHV0LnR5cGUgPT0gJ3JhZGlvJykge1xyXG5cdFx0aW5wdXQudmFsdWUgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQ7XHJcblx0fVxyXG59KTtcclxuXHJcbnF1aXpGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblx0bGV0IGJsb2NrID0gdGFyZ2V0LmNsb3Nlc3QoJy5xdWl6LWJsb2NrJyk7XHJcblx0bGV0IG5leHRCdG4gPSBxdWl6Rm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uZXh0XScpO1xyXG5cdG5leHRCdG4uZm9yRWFjaChidG4gPT4ge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBidG4pIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRhZGRUb1NlbmQoYmxvY2ssIHF1aXpSZXBseSk7XHJcblx0XHRcdG5leHRRdWVzdGlvbihibG9jayk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0aWYgKHRhcmdldCA9PSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zZW5kXScpKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRhZGRUb1NlbmQoYmxvY2ssIHF1aXpSZXBseSk7XHJcblx0XHRzZW5kKGJsb2NrKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbmV4dFF1ZXN0aW9uKGZvcm0pIHtcclxuXHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdGlmICh2YWxpZCA9PT0gMCAmJiB2YWxpZENoZWNrKGZvcm0pKSB7XHJcblx0XHRzaG93QmxvY2tzKGJsb2NrSW5kZXggKz0gMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZW5kKGZvcm0pIHtcclxuXHRsZXQgdmFsaWQgPSB2YWxpZElucHV0KGZvcm0pO1xyXG5cdGlmICh2YWxpZCA9PT0gMCAmJiB2YWxpZENoZWNrKGZvcm0pKSB7XHJcblx0XHRmb3JtUmVtb3ZlRXJyb3IocXVpekZvcm0pO1xyXG5cclxuXHRcdC8vKiA9PT09PT09PSDQodC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGC0L/RgNCw0LLQutC1ID09PT09PT09PT09PVxyXG5cdFx0bGV0IG9rID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcucXVpei1zZW5kX19vaycpO1xyXG5cdFx0bGV0IHRleHRNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1tZXNzYWdlJyk7XHJcblx0XHRpZiAodGV4dE1lc3NhZ2UpIHtcclxuXHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JfQsNCz0YDRg9C30LrQsC4uLic7XHJcblx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vKj09PT09PT09PSBGb3JtRGF0YSAo0YHQsNC80LAg0YHQvtCx0LjRgNCw0LXRgiDQstGB0LUg0LjQtyDRhNC+0YDQvNGLKSA9PT09PT09PT09PT09PT1cclxuXHRcdGNvbnN0IHF1aXpGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG5cdFx0Zm9yIChsZXQga2V5IGluIHF1aXpSZXBseSkge1xyXG5cdFx0XHRxdWl6Rm9ybURhdGEuYXBwZW5kKGtleSwgcXVpelJlcGx5W2tleV0pO1xyXG5cdFx0fVxyXG5cdFx0Ly8gZm9ybURhdGEuYXBwZW5kKCdpbWFnZScsIGZvcm1JbWFnZS5maWxlc1swXSk7XHJcblx0XHQvLyog0J/RgNC+0LLQtdGA0LrQsCDRhNC+0YDQvNGLXHJcblx0XHQvLyBmb3IodmFyIHBhaXIgb2YgcXVpekZvcm1EYXRhLmVudHJpZXMoKSkge1xyXG5cdFx0Ly8gXHRjb25zb2xlLmxvZyhwYWlyWzBdKyAnOiAnKyBwYWlyWzFdKTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyo9PT09PT09PT0g0J7RgtC/0YDQsNCy0LrQsCDRhNC+0YDQvNGLID09PT09PT09PT09PT09PVxyXG5cdFx0Y29uc3QgcG9zdERhdGEgPSBhc3luYyAodXJsLCBkYXRhKSA9PiB7XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXHJcblx0XHRcdFx0Ym9keTogZGF0YVxyXG5cdFx0XHR9KTtcdFxyXG5cdFx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHJcblx0XHRcdFx0Ly8gbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTsgLy8ganNvbigpIC0g0LTQu9GPINCy0YvQstC+0LTQsCDRgdC+0L7QsdGJ0LXQvdC40Y87XHJcblx0XHRcdFx0Ly8gYWxlcnQocmVzdWx0Lm1lc3NhZ2UpO1xyXG5cclxuXHRcdFx0XHQvLyBsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpOyAvLyB0ZXh0KCkgLSDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1LCDQv9C+0LTQutC70Y7Rh9C40YLRjCBzZXJ2ZXIucGhwKVxyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7IC8vINGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1XHJcblxyXG5cdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0dGV4dE1lc3NhZ2UudGV4dENvbnRlbnQgPSAnT2shJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRjbGVhcklucHV0cyhpbnB1dHMpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0b2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0fSwgNTAwMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gYWxlcnQoXCLQntGI0LjQsdC60LBcIik7XHJcblx0XHRcdFx0aWYgKHRleHRNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHR0ZXh0TWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuXHRcdFx0XHRcdHRleHRNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdGlmICh0ZXh0TWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHR0ZXh0TWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCA1MDAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdHBvc3REYXRhKCcuLi9zZW5kbWFpbC5waHAnLCBxdWl6Rm9ybURhdGEpO1xyXG5cdFx0Ly8gcG9zdERhdGEoJy4uL3NlcnZlci5waHAnLCBxdWl6Rm9ybURhdGEpIC8vISDRg9Cx0YDQsNGC0YwgKNGN0YLQviDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCwINGB0LXRgNCy0LXRgNC1KVxyXG5cdFx0XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb1NlbmQoZm9ybSwgb2JqKSB7XHJcblx0bGV0IHZhbHVlU3RyaW5nID0gJyc7XHJcblx0bGV0IGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuXHRsZXQgdGV4dGFyZWEgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJyk7XHJcblx0aWYgKGlucHV0cy5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgZmllbGQgPSBpbnB1dHNbaV07XHJcblx0XHRcdGlmIChmaWVsZC50eXBlICE9ICdjaGVja2JveCcgJiYgZmllbGQudHlwZSAhPSAncmFkaW8nICYmIGZpZWxkLnZhbHVlKSB7XHJcblx0XHRcdFx0b2JqW2ZpZWxkLm5hbWVdID0gZmllbGQudmFsdWU7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PSAncmFkaW8nICYmIGZpZWxkLmNoZWNrZWQpIHtcclxuXHRcdFx0XHRvYmpbZmllbGQubmFtZV0gPSBmaWVsZC52YWx1ZTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWVsZC50eXBlID09ICdjaGVja2JveCcgJiYgZmllbGQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdHZhbHVlU3RyaW5nICs9IGZpZWxkLnZhbHVlICsgJywnO1x0XHRcclxuXHRcdFx0XHRvYmpbZmllbGQubmFtZV0gPSB2YWx1ZVN0cmluZztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0gZWxzZSBpZiAodGV4dGFyZWEubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0YXJlYS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgdGV4dCA9IHRleHRhcmVhW2ldO1xyXG5cdFx0XHRpZiAodGV4dC52YWx1ZSkge1xyXG5cdFx0XHRcdG9ialt0ZXh0Lm5hbWVdID0gdGV4dC52YWx1ZTtcdFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59IiwiY29uc3QgcmFuZ2VTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZ2Utc2xpZGVyJyk7XG5cbmlmIChyYW5nZVNsaWRlcikge1xuXHRub1VpU2xpZGVyLmNyZWF0ZShyYW5nZVNsaWRlciwge1xuICAgIHN0YXJ0OiBbNTAwLCA5OTk5OTldLFxuXHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0c3RlcDogMSxcbiAgICByYW5nZToge1xuXHRcdFx0J21pbic6IFs1MDBdLFxuXHRcdFx0J21heCc6IFs5OTk5OTldXG4gICAgfVxuXHR9KTtcblxuXHRjb25zdCBpbnB1dDAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtMCcpO1xuXHRjb25zdCBpbnB1dDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtMScpO1xuXHRjb25zdCBpbnB1dHMgPSBbaW5wdXQwLCBpbnB1dDFdO1xuXG5cdHJhbmdlU2xpZGVyLm5vVWlTbGlkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKHZhbHVlcywgaGFuZGxlKXtcblx0XHRpbnB1dHNbaGFuZGxlXS52YWx1ZSA9IE1hdGgucm91bmQodmFsdWVzW2hhbmRsZV0pO1xuXHR9KTtcblxuXHRjb25zdCBzZXRSYW5nZVNsaWRlciA9IChpLCB2YWx1ZSkgPT4ge1xuXHRcdGxldCBhcnIgPSBbbnVsbCwgbnVsbF07XG5cdFx0YXJyW2ldID0gdmFsdWU7XG5cblx0XHRjb25zb2xlLmxvZyhhcnIpO1xuXG5cdFx0cmFuZ2VTbGlkZXIubm9VaVNsaWRlci5zZXQoYXJyKTtcblx0fTtcblxuXHRpbnB1dHMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG5cdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGluZGV4KTtcblx0XHRcdHNldFJhbmdlU2xpZGVyKGluZGV4LCBlLmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuXHRcdH0pO1xuXHR9KTtcbn0iLCJsZXQgdGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2F0YWxvZy1zaXplcyB0ZCcpO1xyXG5cclxudGQuZm9yRWFjaChpdGVtID0+IHtcclxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdGxldCBzZWxmID0gZS5jdXJyZW50VGFyZ2V0O1xyXG5cdFx0aXRlbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2RiYmJhOSc7XHJcblx0XHR0ZC5mb3JFYWNoKGJ0biA9PiB7XHJcblx0XHRcdGlmIChidG4gIT09IHNlbGYpIHtcclxuXHRcdFx0XHRidG4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3RyYW5zcGFyZW50JztcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0pOyIsIi8vKiDQktCw0LvQuNC00LDRhtC40Y8g0YTQvtGA0LzRiyAo0LXRgdC70Lgg0YfQtdC60LHQvtC60YHRiyDQuCDQuNC90L/Rg9GC0Ysg0LIg0L7QtNC90L7QuSDRhNC+0YDQvNC1KVxyXG5mdW5jdGlvbiB2YWxpZENoZWNrKGZvcm0pIHtcclxuXHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IGlzVmFsaWQgPSBmYWxzZTtcclxuXHRpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBlbGVtZW50c1tpbmRleF07XHJcblx0XHRcdGlmICghaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3QtdmFsaWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcImNoZWNrYm94XCIgfHwgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJyYWRpb1wiKSB7XHJcblx0XHRcdFx0XHRpZiAoaW5wdXQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdFx0XHRpc1ZhbGlkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7aXNWYWxpZCA9IHRydWU7fVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7aXNWYWxpZCA9IHRydWU7fVxyXG5cclxuXHRyZXR1cm4gaXNWYWxpZDtcclxufVxyXG5mdW5jdGlvbiB2YWxpZElucHV0KGZvcm0pIHtcclxuXHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcblx0bGV0IGVycm9yID0gMDtcclxuXHRpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBlbGVtZW50c1tpbmRleF07XHJcblx0XHRcdGxldCBwbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcclxuXHRcdFx0aWYgKCFpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdC12YWxpZCcpKSB7XHJcblx0XHRcdFx0aWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZW1haWwnKSkge1xyXG5cdFx0XHRcdFx0aWYgKGVtYWlsVGVzdChpbnB1dCkgfHwgaW5wdXQudmFsdWUgPT0gcGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGlucHV0LnZhbHVlID09ICcnIHx8IGlucHV0LnZhbHVlID09IHBsYWNlaG9sZGVyKSB7XHJcblx0XHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHRcdGVycm9yKys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIdCy0LrQu9GO0YfQuNGC0YwsINC10YHQu9C4INC90LDQtNC+INCy0LDQu9C40LTQuNGA0L7QstCw0YLRjCB0ZXh0YXJlOlxyXG5cdC8vIGxldCB0ZXh0YXJlYSA9IGZvcm0ucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcclxuXHQvLyBpZiAodGV4dGFyZWEpIHtcclxuXHQvLyBcdGlmICh0ZXh0YXJlYS52YWx1ZSA9PSAnJykge1xyXG5cdC8vIFx0XHRmb3JtQWRkRXJyb3IodGV4dGFyZWEpO1xyXG5cdC8vIFx0XHRlcnJvcisrO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0gXHJcblxyXG5cdHJldHVybiBlcnJvcjtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybUFkZEVycm9yKGl0ZW0pIHtcclxuXHRpdGVtLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuXHRpdGVtLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcblxyXG5cdC8vISDQntGB0YLQsNCy0LjRgtGMINGN0YLRgyDRh9Cw0YHRgtGMLCDQtdGB0LvQuCDQsiBodG1sINC00L7QsdCw0LLQu9C10L3RiyDQsdC70L7QutC4INGBINGB0L7QvtCx0YnQtdC90LjQtdC8INC+0LEg0L7RiNC40LHQutC1ICguZm9ybS1lcnJvcilcclxuXHQvLyog0LXRgdC70Lgg0YDQsNC30L3Ri9C5INGC0LXQutGB0YIg0L7RiNC40LHQutC4INC00LvRjyDQutCw0LbQtNC+0LPQviBpbnB1dFxyXG5cdC8vIGxldCBpbXB1dEVycm9yID0gaXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblx0Ly8gaWYgKGltcHV0RXJyb3IpIHtcclxuXHQvLyBcdGlmIChpbXB1dEVycm9yLmNsYXNzTGlzdC5jb250YWlucygnaW1wdXQtbWVzc2FnZScpKSB7XHJcblx0Ly8gXHRcdGltcHV0RXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cdC8vKiDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LTQu9GPINCy0YHQtdC5INGE0L7RgNC80YsgKNC40LvQuCDQsdC70L7QutCwINC60LLQuNC30LApOlxyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCDQtdGB0LvQuCDQvdCwINGB0LDQudGC0LUg0LXRgdGC0Ywg0LrQstC40LdcclxuXHRpZiAoaXRlbS5jbG9zZXN0KCcucXVpei1mb3JtJykpIHtcclxuXHRcdGxldCBxdWl6RXJyb3IgPSBpdGVtLmNsb3Nlc3QoJy5xdWl6LWJsb2NrJykucXVlcnlTZWxlY3RvcignLmZvcm0tbWVzc2FnZScpO1xyXG5cdFx0aWYgKHF1aXpFcnJvcikge1xyXG5cdFx0XHRxdWl6RXJyb3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGxldCBmb3JtRXJyb3IgPSBpdGVtLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tZXJyb3InKTtcclxuXHRcdGlmIChmb3JtRXJyb3IpIHtcclxuXHRcdFx0Zm9ybUVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0Ywg0LXRgdC70Lgg0L3QsCDRgdCw0LnRgtC1INC90LXRgiDQutCy0LjQt9CwICjRgtC+0LvRjNC60L4g0YTQvtGA0LzRiylcclxuXHQvLyBsZXQgZm9ybUVycm9yID0gaXRlbS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWVycm9yJyk7XHJcblx0Ly8gaWYgKGZvcm1FcnJvcikge1xyXG5cdC8vIFx0Zm9ybUVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdC8vIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybVJlbW92ZUVycm9yKGZvcm0pIHtcclxuXHRsZXQgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEnKTtcclxuXHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpbnB1dHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGNvbnN0IGlucHV0ID0gaW5wdXRzW2luZGV4XTtcclxuXHRcdFx0aW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cdFx0XHRpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCwg0LXRgdC70Lgg0LIgaHRtbCDQtNC+0LHQsNCy0LvQtdC90Ysg0LHQu9C+0LrQuCDRgSDRgdC+0L7QsdGJ0LXQvdC40LXQvCDQvtCxINC+0YjQuNCx0LrQtSAoLmZvcm0tZXJyb3IpXHJcblx0bGV0IGZvcm1FcnJvciA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmZvcm0tbWVzc2FnZScpO1xyXG5cdGlmIChmb3JtRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGZvcm1FcnJvci5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0Y29uc3QgZXJyb3IgPSBmb3JtRXJyb3JbaW5kZXhdO1xyXG5cdFx0XHRlcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVtYWlsVGVzdChzZWxlY3Rvcikge1xyXG5cdHJldHVybiAhL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDh9KSskLy50ZXN0KHNlbGVjdG9yLnZhbHVlKTtcclxufVxyXG5cclxuY29uc3QgdGV4dElucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jaGVjaycpOyAgIFxyXG50ZXh0SW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdC8vINC10YHQu9C4INC30L3QsNGH0LXQvdC40LUg0LrQu9Cw0LLQuNGI0LgoZS5rZXkpINC90LUg0YHQvtC+0YLQstC10YLRgdGC0LLRg9C10YIobWF0Y2gpINC60LjRgNC40LvQu9C40YbQtSwg0L/QvtC70LUg0L3QtSDQt9Cw0L/QvtC70L3Rj9C10YLRgdGPXHJcblx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRpZiAoZS5rZXkubWF0Y2goL1te0LAt0Y/RkSAwLTldL2lnKSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Ly8g0LXRgdC70Lgg0L/RgNC4INCw0LLRgtC+0LfQsNC/0L7Qu9C90LXQvdC40Lgg0LLRi9Cx0YDQsNC90L4g0YHQu9C+0LLQviDQvdC1INC60LjRgNC40LvQu9C40YbQtdC5LCDRgdGC0YDQvtC60LAg0L7Rh9C40YHRgtC40YLRgdGPXHJcblx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudmFsdWU9dGhpcy52YWx1ZS5yZXBsYWNlKC9bXlxc0LAt0Y/RkSAwLTldL2lnLFwiXCIpO1xyXG5cdH0pO1xyXG59KTsiXX0=
