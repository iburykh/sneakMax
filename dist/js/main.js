'use strict';

// forEach Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// window.noZensmooth = true;
let menuBody = document.querySelector('.menu');
let menuItem = document.querySelectorAll('.menu__link');
let hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {    
    hamburger.classList.toggle('active');
    menuBody.classList.toggle('active');
    document.body.classList.toggle('scroll-lock');

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
        }
    })
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
//* В атрибуте name инпута указать имя для значения вопроса (напр. size: 37 - где size - имя)

const quizForm = document.querySelector('.quiz-form');
const inputs = quizForm.querySelectorAll('input');
const quizBlocks = quizForm.querySelectorAll('.quiz-block');
let textareaText = null;
let quizTmp = {};
let quizReply = [];
let blockIndex = 0;

// функция показа только первого блока квиза
showBlocks(blockIndex);

function showBlocks(n) {
	quizBlocks.forEach((item) => item.style.display = 'none');
	quizBlocks[blockIndex].style.display = 'block';
}

// запись названия чекбокса в value
inputs.forEach(input => {
	if (input.type == 'checkbox' || input.type == 'radio') {
		input.value = input.nextElementSibling.textContent;
	}
});

// запись данных блока квиза во временный объект
quizForm.addEventListener('change', (e) => {
	let target = e.target;
	if (target.tagName == 'INPUT') {
		quizTmp = serialize(document.querySelector('.quiz-form'));
		// console.log(quizTmp);
	} else if (target.tagName == 'TEXTAREA') {
		textareaText = target.value;
		//! добавить в FormData
	}
});

quizForm.addEventListener('click', (e) => {
	let nextBtn = quizForm.querySelectorAll('[data-next]');
	nextBtn.forEach(btn => {
		if (e.target == btn) {
			e.preventDefault();
			let target = e.target;
			let block = target.closest('.quiz-block');
			addToSend();
			nextQuestion(block);
			console.log(blockIndex);	
		}
	});
	if (e.target == document.querySelector('[data-send]')) {
		send();
	}
});

function nextQuestion(form) {
	let formReq = form.querySelectorAll('.req');
	formRemoveError(formReq);
	let error = formValidate(formReq);
	showBlocks(blockIndex += 1);
	// if (error === 0) {
	// 	showBlocks(blockIndex += 1);
	// }
	// if (this.valid()) {
	// 	console.log('next question!');
	// 	if (this.counter + 1 < this.dataLength) {
	// 		this.counter++;
	// 		this.$el.innerHTML = quizTemplate(quizData[this.counter], this.dataLength, this.options);

	// 		if (this.counter + 1 == this.dataLength) {
	// 			this.$el.insertAdjacentHTML('beforeend', `<button type="button" class="quiz-question__btn" data-send>${this.options.sendBtnText}</button>`);
	// 			this.$el.querySelector('[data-next-btn]').remove();
	// 		}
	// 	}
	// }
}

function addToSend() {
	quizReply.push(quizTmp)
	// console.log(quizReply);
	
}
// функция записи ответов в строку
function serialize(form) {
	let field, s = {};
	let valueString = '';
	if (typeof form == 'object' && form.nodeName == "FORM") {
		let len = inputs.length;
		for (let i = 0; i < len; i++) {
			field = inputs[i];

			if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
				if ((field.type != 'checkbox' && field.type != 'radio' && field.value) || field.checked) {
					valueString += field.value + ',';
					s[field.name] = valueString;
				}
			}
		}
	}
	return s
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
//* Валидация формы
function formValidate(selector) {
	let error = 0;
	if (selector.length > 0) {
		for (let index = 0; index < selector.length; index++) {
			const input = selector[index];
			let placeholder = input.getAttribute('placeholder');
			if (input.classList.contains('email')) {
				if (emailTest(input) || input.value == placeholder) {
					formAddError(input);
					error++;
				}
			} else if (input.getAttribute("type") === "checkbox" || input.getAttribute("type") === "radio" && input.checked === false) {
				formAddError(input);
				error++;
			} else {
				if (input.value == '' || input.value == placeholder) {
					formAddError(input);
					error++;
				}
			}
		}
	}
	return error;
}

function formAddError(item) {
	item.parentElement.classList.add('error');
	item.classList.add('error');

	//! Оставить эту часть, если в html добавлены блоки с сообщением об ошибке (.form-error)
	//* если ошибка для каждого input
	let imputError = item.nextElementSibling;
	if (imputError) {
		if (imputError.classList.contains('imput-message')) {
			imputError.classList.add('active');
		}
	}
	//* если ошибка для всей формы
	let formError = item.parentElement.querySelector('.form-message');
	if (formError) {
		formError.classList.add('active');
	}
}

function formRemoveError(selector) {
	if (selector.length > 0) {
		for (let index = 0; index < selector.length; index++) {
			const input = selector[index];
			input.parentElement.classList.remove('error');
			input.classList.remove('error');
			//! Оставить эту часть, если в html добавлены блоки с сообщением об ошибке (.form-error)
			// если ошибка для каждого input
			let imputError = input.nextElementSibling;
			if (imputError) {
				imputError.classList.remove('active');
			}
			// если ошибка для всей формы
			let formError = input.parentElement.querySelector('.form-error');
			if (formError) {
				formError.classList.remove('active');
			}
		}
	}
}

function emailTest(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImxhenkuanMiLCJxdWl6LmpzIiwicmFuZ2Utc2xpZGVyLmpzIiwidmFsaWRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGZvckVhY2ggUG9seWZpbGxcclxuaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbn1cclxuXHJcbi8vIHdpbmRvdy5ub1plbnNtb290aCA9IHRydWU7IiwibGV0IG1lbnVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcclxubGV0IG1lbnVJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVfX2xpbmsnKTtcclxubGV0IGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKTtcclxuXHJcbmhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBtZW51Qm9keS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2Nyb2xsLWxvY2snKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBtZW51Qm9keS5mb2N1cygpO1xyXG4gICAgfSwgNjAwKTtcclxufSk7XHJcblxyXG5tZW51SXRlbS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChoYW1idXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIG1lbnVCb2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1sb2NrJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSlcclxuIiwiY29uc3QgY2hlY2tCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2F0YWxvZy1jaGVja2JveF9fbGFiZWwsIC5jdXN0b20tY2hlY2tib3hfX3RleHQnKTtcclxuXHJcbmNoZWNrQm94LmZvckVhY2goaXRlbSA9PiB7XHJcblx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuXHRcdGlmIChlLmNvZGUgPT09ICdFbnRlcicgfHwgZS5jb2RlID09PSAnTnVtcGFkRW50ZXInIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xyXG5cdFx0XHRsZXQgY2hlY2sgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRpZiAoY2hlY2sudHlwZSA9PSAncmFkaW8nKSB7XHJcblx0XHRcdFx0aWYgKGNoZWNrLmNoZWNrZWQgPT09IGZhbHNlKSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHR9IFxyXG5cdFx0XHR9IGVsc2UgaWYgKGNoZWNrLnR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG5cdFx0XHRcdGlmIChjaGVjay5jaGVja2VkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fSk7XHJcbn0pOyIsImNvbnN0IGxhenlJbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1zcmNdLHNvdXJjZVtkYXRhLXNyY3NldF0nKTtcclxuY29uc3QgbG9hZE1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkLW1hcCcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKCkgPT4ge1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0aWYgKGxhenlJbWFnZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0bGF6eUltYWdlcy5mb3JFYWNoKGltZyA9PiB7XHJcblx0XHRcdGxldCBpbWdPZmZzZXQgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgcGFnZVlPZmZzZXQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2Nyb2xsWSA+PSBpbWdPZmZzZXQgLSAxMDAwKSB7XHJcblx0XHRcdFx0aWYgKGltZy5kYXRhc2V0LnNyYykge1xyXG5cdFx0XHRcdFx0aW1nLnNyYyA9IGltZy5kYXRhc2V0LnNyYztcclxuXHRcdFx0XHRcdGltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpbWcuZGF0YXNldC5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdGltZy5zcmNzZXQgPSBpbWcuZGF0YXNldC5zcmNzZXQ7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyY3NldCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vTWFwXHJcblx0Ly8gaWYgKCFsb2FkTWFwLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVkJykpIHtcclxuXHQvLyBcdGxldCBtYXBPZmZzZXQgPSBsb2FkTWFwLm9mZnNldFRvcDtcclxuXHQvLyBcdGlmIChzY3JvbGxZID49IG1hcE9mZnNldCAtIDIwMCkge1xyXG5cdC8vIFx0XHRjb25zdCBsb2FkTWFwVXJsID0gbG9hZE1hcC5kYXRhc2V0Lm1hcDtcclxuXHQvLyBcdFx0aWYgKGxvYWRNYXBVcmwpIHtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmluc2VydEFkamFjZW50SFRNTChcclxuXHQvLyBcdFx0XHRcdFwiYmVmb3JlZW5kXCIsXHJcblx0Ly8gXHRcdFx0XHRgPGlmcmFtZSBzcmM9XCIke2xvYWRNYXBVcmx9XCIgc3R5bGU9XCJib3JkZXI6MDtcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBsb2FkaW5nPVwibGF6eVwiPjwvaWZyYW1lPmBcclxuXHQvLyBcdFx0XHQpO1xyXG5cdC8vIFx0XHRcdGxvYWRNYXAuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcbn0pOyIsIi8vKiDQkiDQsNGC0YDQuNCx0YPRgtC1IG5hbWUg0LjQvdC/0YPRgtCwINGD0LrQsNC30LDRgtGMINC40LzRjyDQtNC70Y8g0LfQvdCw0YfQtdC90LjRjyDQstC+0L/RgNC+0YHQsCAo0L3QsNC/0YAuIHNpemU6IDM3IC0g0LPQtNC1IHNpemUgLSDQuNC80Y8pXHJcblxyXG5jb25zdCBxdWl6Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LWZvcm0nKTtcclxuY29uc3QgaW5wdXRzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuY29uc3QgcXVpekJsb2NrcyA9IHF1aXpGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5xdWl6LWJsb2NrJyk7XHJcbmxldCB0ZXh0YXJlYVRleHQgPSBudWxsO1xyXG5sZXQgcXVpelRtcCA9IHt9O1xyXG5sZXQgcXVpelJlcGx5ID0gW107XHJcbmxldCBibG9ja0luZGV4ID0gMDtcclxuXHJcbi8vINGE0YPQvdC60YbQuNGPINC/0L7QutCw0LfQsCDRgtC+0LvRjNC60L4g0L/QtdGA0LLQvtCz0L4g0LHQu9C+0LrQsCDQutCy0LjQt9CwXHJcbnNob3dCbG9ja3MoYmxvY2tJbmRleCk7XHJcblxyXG5mdW5jdGlvbiBzaG93QmxvY2tzKG4pIHtcclxuXHRxdWl6QmxvY2tzLmZvckVhY2goKGl0ZW0pID0+IGl0ZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJyk7XHJcblx0cXVpekJsb2Nrc1tibG9ja0luZGV4XS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxufVxyXG5cclxuLy8g0LfQsNC/0LjRgdGMINC90LDQt9Cy0LDQvdC40Y8g0YfQtdC60LHQvtC60YHQsCDQsiB2YWx1ZVxyXG5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0aWYgKGlucHV0LnR5cGUgPT0gJ2NoZWNrYm94JyB8fCBpbnB1dC50eXBlID09ICdyYWRpbycpIHtcclxuXHRcdGlucHV0LnZhbHVlID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nLnRleHRDb250ZW50O1xyXG5cdH1cclxufSk7XHJcblxyXG4vLyDQt9Cw0L/QuNGB0Ywg0LTQsNC90L3Ri9GFINCx0LvQvtC60LAg0LrQstC40LfQsCDQstC+INCy0YDQtdC80LXQvdC90YvQuSDQvtCx0YrQtdC60YJcclxucXVpekZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcclxuXHRsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblx0aWYgKHRhcmdldC50YWdOYW1lID09ICdJTlBVVCcpIHtcclxuXHRcdHF1aXpUbXAgPSBzZXJpYWxpemUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnF1aXotZm9ybScpKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKHF1aXpUbXApO1xyXG5cdH0gZWxzZSBpZiAodGFyZ2V0LnRhZ05hbWUgPT0gJ1RFWFRBUkVBJykge1xyXG5cdFx0dGV4dGFyZWFUZXh0ID0gdGFyZ2V0LnZhbHVlO1xyXG5cdFx0Ly8hINC00L7QsdCw0LLQuNGC0Ywg0LIgRm9ybURhdGFcclxuXHR9XHJcbn0pO1xyXG5cclxucXVpekZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdGxldCBuZXh0QnRuID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbmV4dF0nKTtcclxuXHRuZXh0QnRuLmZvckVhY2goYnRuID0+IHtcclxuXHRcdGlmIChlLnRhcmdldCA9PSBidG4pIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblx0XHRcdGxldCBibG9jayA9IHRhcmdldC5jbG9zZXN0KCcucXVpei1ibG9jaycpO1xyXG5cdFx0XHRhZGRUb1NlbmQoKTtcclxuXHRcdFx0bmV4dFF1ZXN0aW9uKGJsb2NrKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYmxvY2tJbmRleCk7XHRcclxuXHRcdH1cclxuXHR9KTtcclxuXHRpZiAoZS50YXJnZXQgPT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2VuZF0nKSkge1xyXG5cdFx0c2VuZCgpO1xyXG5cdH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBuZXh0UXVlc3Rpb24oZm9ybSkge1xyXG5cdGxldCBmb3JtUmVxID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcucmVxJyk7XHJcblx0Zm9ybVJlbW92ZUVycm9yKGZvcm1SZXEpO1xyXG5cdGxldCBlcnJvciA9IGZvcm1WYWxpZGF0ZShmb3JtUmVxKTtcclxuXHRzaG93QmxvY2tzKGJsb2NrSW5kZXggKz0gMSk7XHJcblx0Ly8gaWYgKGVycm9yID09PSAwKSB7XHJcblx0Ly8gXHRzaG93QmxvY2tzKGJsb2NrSW5kZXggKz0gMSk7XHJcblx0Ly8gfVxyXG5cdC8vIGlmICh0aGlzLnZhbGlkKCkpIHtcclxuXHQvLyBcdGNvbnNvbGUubG9nKCduZXh0IHF1ZXN0aW9uIScpO1xyXG5cdC8vIFx0aWYgKHRoaXMuY291bnRlciArIDEgPCB0aGlzLmRhdGFMZW5ndGgpIHtcclxuXHQvLyBcdFx0dGhpcy5jb3VudGVyKys7XHJcblx0Ly8gXHRcdHRoaXMuJGVsLmlubmVySFRNTCA9IHF1aXpUZW1wbGF0ZShxdWl6RGF0YVt0aGlzLmNvdW50ZXJdLCB0aGlzLmRhdGFMZW5ndGgsIHRoaXMub3B0aW9ucyk7XHJcblxyXG5cdC8vIFx0XHRpZiAodGhpcy5jb3VudGVyICsgMSA9PSB0aGlzLmRhdGFMZW5ndGgpIHtcclxuXHQvLyBcdFx0XHR0aGlzLiRlbC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInF1aXotcXVlc3Rpb25fX2J0blwiIGRhdGEtc2VuZD4ke3RoaXMub3B0aW9ucy5zZW5kQnRuVGV4dH08L2J1dHRvbj5gKTtcclxuXHQvLyBcdFx0XHR0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXh0LWJ0bl0nKS5yZW1vdmUoKTtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG9TZW5kKCkge1xyXG5cdHF1aXpSZXBseS5wdXNoKHF1aXpUbXApXHJcblx0Ly8gY29uc29sZS5sb2cocXVpelJlcGx5KTtcclxuXHRcclxufVxyXG4vLyDRhNGD0L3QutGG0LjRjyDQt9Cw0L/QuNGB0Lgg0L7RgtCy0LXRgtC+0LIg0LIg0YHRgtGA0L7QutGDXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZShmb3JtKSB7XHJcblx0bGV0IGZpZWxkLCBzID0ge307XHJcblx0bGV0IHZhbHVlU3RyaW5nID0gJyc7XHJcblx0aWYgKHR5cGVvZiBmb3JtID09ICdvYmplY3QnICYmIGZvcm0ubm9kZU5hbWUgPT0gXCJGT1JNXCIpIHtcclxuXHRcdGxldCBsZW4gPSBpbnB1dHMubGVuZ3RoO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRmaWVsZCA9IGlucHV0c1tpXTtcclxuXHJcblx0XHRcdGlmIChmaWVsZC5uYW1lICYmICFmaWVsZC5kaXNhYmxlZCAmJiBmaWVsZC50eXBlICE9ICdmaWxlJyAmJiBmaWVsZC50eXBlICE9ICdyZXNldCcgJiYgZmllbGQudHlwZSAhPSAnc3VibWl0JyAmJiBmaWVsZC50eXBlICE9ICdidXR0b24nKSB7XHJcblx0XHRcdFx0aWYgKChmaWVsZC50eXBlICE9ICdjaGVja2JveCcgJiYgZmllbGQudHlwZSAhPSAncmFkaW8nICYmIGZpZWxkLnZhbHVlKSB8fCBmaWVsZC5jaGVja2VkKSB7XHJcblx0XHRcdFx0XHR2YWx1ZVN0cmluZyArPSBmaWVsZC52YWx1ZSArICcsJztcclxuXHRcdFx0XHRcdHNbZmllbGQubmFtZV0gPSB2YWx1ZVN0cmluZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHNcclxufSIsImNvbnN0IHJhbmdlU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmdlLXNsaWRlcicpO1xuXG5pZiAocmFuZ2VTbGlkZXIpIHtcblx0bm9VaVNsaWRlci5jcmVhdGUocmFuZ2VTbGlkZXIsIHtcbiAgICBzdGFydDogWzUwMCwgOTk5OTk5XSxcblx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdHN0ZXA6IDEsXG4gICAgcmFuZ2U6IHtcblx0XHRcdCdtaW4nOiBbNTAwXSxcblx0XHRcdCdtYXgnOiBbOTk5OTk5XVxuICAgIH1cblx0fSk7XG5cblx0Y29uc3QgaW5wdXQwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LTAnKTtcblx0Y29uc3QgaW5wdXQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LTEnKTtcblx0Y29uc3QgaW5wdXRzID0gW2lucHV0MCwgaW5wdXQxXTtcblxuXHRyYW5nZVNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSl7XG5cdFx0aW5wdXRzW2hhbmRsZV0udmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlc1toYW5kbGVdKTtcblx0fSk7XG5cblx0Y29uc3Qgc2V0UmFuZ2VTbGlkZXIgPSAoaSwgdmFsdWUpID0+IHtcblx0XHRsZXQgYXJyID0gW251bGwsIG51bGxdO1xuXHRcdGFycltpXSA9IHZhbHVlO1xuXG5cdFx0Y29uc29sZS5sb2coYXJyKTtcblxuXHRcdHJhbmdlU2xpZGVyLm5vVWlTbGlkZXIuc2V0KGFycik7XG5cdH07XG5cblx0aW5wdXRzLmZvckVhY2goKGVsLCBpbmRleCkgPT4ge1xuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhpbmRleCk7XG5cdFx0XHRzZXRSYW5nZVNsaWRlcihpbmRleCwgZS5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcblx0XHR9KTtcblx0fSk7XG59IiwiLy8qINCS0LDQu9C40LTQsNGG0LjRjyDRhNC+0YDQvNGLXHJcbmZ1bmN0aW9uIGZvcm1WYWxpZGF0ZShzZWxlY3Rvcikge1xyXG5cdGxldCBlcnJvciA9IDA7XHJcblx0aWYgKHNlbGVjdG9yLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBzZWxlY3Rvci5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0Y29uc3QgaW5wdXQgPSBzZWxlY3RvcltpbmRleF07XHJcblx0XHRcdGxldCBwbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcclxuXHRcdFx0aWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZW1haWwnKSkge1xyXG5cdFx0XHRcdGlmIChlbWFpbFRlc3QoaW5wdXQpIHx8IGlucHV0LnZhbHVlID09IHBsYWNlaG9sZGVyKSB7XHJcblx0XHRcdFx0XHRmb3JtQWRkRXJyb3IoaW5wdXQpO1xyXG5cdFx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJjaGVja2JveFwiIHx8IGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwicmFkaW9cIiAmJiBpbnB1dC5jaGVja2VkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoaW5wdXQudmFsdWUgPT0gJycgfHwgaW5wdXQudmFsdWUgPT0gcGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHRlcnJvcisrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gZXJyb3I7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1BZGRFcnJvcihpdGVtKSB7XHJcblx0aXRlbS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcblx0aXRlbS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCwg0LXRgdC70Lgg0LIgaHRtbCDQtNC+0LHQsNCy0LvQtdC90Ysg0LHQu9C+0LrQuCDRgSDRgdC+0L7QsdGJ0LXQvdC40LXQvCDQvtCxINC+0YjQuNCx0LrQtSAoLmZvcm0tZXJyb3IpXHJcblx0Ly8qINC10YHQu9C4INC+0YjQuNCx0LrQsCDQtNC70Y8g0LrQsNC20LTQvtCz0L4gaW5wdXRcclxuXHRsZXQgaW1wdXRFcnJvciA9IGl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cdGlmIChpbXB1dEVycm9yKSB7XHJcblx0XHRpZiAoaW1wdXRFcnJvci5jbGFzc0xpc3QuY29udGFpbnMoJ2ltcHV0LW1lc3NhZ2UnKSkge1xyXG5cdFx0XHRpbXB1dEVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvLyog0LXRgdC70Lgg0L7RiNC40LHQutCwINC00LvRjyDQstGB0LXQuSDRhNC+0YDQvNGLXHJcblx0bGV0IGZvcm1FcnJvciA9IGl0ZW0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybS1tZXNzYWdlJyk7XHJcblx0aWYgKGZvcm1FcnJvcikge1xyXG5cdFx0Zm9ybUVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybVJlbW92ZUVycm9yKHNlbGVjdG9yKSB7XHJcblx0aWYgKHNlbGVjdG9yLmxlbmd0aCA+IDApIHtcclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBzZWxlY3Rvci5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0Y29uc3QgaW5wdXQgPSBzZWxlY3RvcltpbmRleF07XHJcblx0XHRcdGlucHV0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcclxuXHRcdFx0aW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcclxuXHRcdFx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwsINC10YHQu9C4INCyIGh0bWwg0LTQvtCx0LDQstC70LXQvdGLINCx0LvQvtC60Lgg0YEg0YHQvtC+0LHRidC10L3QuNC10Lwg0L7QsSDQvtGI0LjQsdC60LUgKC5mb3JtLWVycm9yKVxyXG5cdFx0XHQvLyDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LTQu9GPINC60LDQttC00L7Qs9C+IGlucHV0XHJcblx0XHRcdGxldCBpbXB1dEVycm9yID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRpZiAoaW1wdXRFcnJvcikge1xyXG5cdFx0XHRcdGltcHV0RXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8g0LXRgdC70Lgg0L7RiNC40LHQutCwINC00LvRjyDQstGB0LXQuSDRhNC+0YDQvNGLXHJcblx0XHRcdGxldCBmb3JtRXJyb3IgPSBpbnB1dC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWVycm9yJyk7XHJcblx0XHRcdGlmIChmb3JtRXJyb3IpIHtcclxuXHRcdFx0XHRmb3JtRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVtYWlsVGVzdChpbnB1dCkge1xyXG5cdHJldHVybiAhL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDh9KSskLy50ZXN0KGlucHV0LnZhbHVlKTtcclxufVxyXG5cclxuY29uc3QgdGV4dElucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jaGVjaycpOyAgIFxyXG50ZXh0SW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdC8vINC10YHQu9C4INC30L3QsNGH0LXQvdC40LUg0LrQu9Cw0LLQuNGI0LgoZS5rZXkpINC90LUg0YHQvtC+0YLQstC10YLRgdGC0LLRg9C10YIobWF0Y2gpINC60LjRgNC40LvQu9C40YbQtSwg0L/QvtC70LUg0L3QtSDQt9Cw0L/QvtC70L3Rj9C10YLRgdGPXHJcblx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRpZiAoZS5rZXkubWF0Y2goL1te0LAt0Y/RkSAwLTldL2lnKSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Ly8g0LXRgdC70Lgg0L/RgNC4INCw0LLRgtC+0LfQsNC/0L7Qu9C90LXQvdC40Lgg0LLRi9Cx0YDQsNC90L4g0YHQu9C+0LLQviDQvdC1INC60LjRgNC40LvQu9C40YbQtdC5LCDRgdGC0YDQvtC60LAg0L7Rh9C40YHRgtC40YLRgdGPXHJcblx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudmFsdWU9dGhpcy52YWx1ZS5yZXBsYWNlKC9bXlxc0LAt0Y/RkSAwLTldL2lnLFwiXCIpO1xyXG5cdH0pO1xyXG59KTsiXX0=
