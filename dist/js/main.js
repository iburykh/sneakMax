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
let textareaText = null;
let quizTmp = {};
let quizReply = [];

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
		console.log(quizTmp);
	} else if (target.tagName == 'TEXTAREA') {
		textareaText = target.value;
		//! добавить в FormData
	}
});

quizForm.addEventListener('click', (e) => {
	if (e.target == document.querySelector('[data-next]')) {
		addToSend();
		nextQuestion();
	}

	if (e.target == document.querySelector('[data-send]')) {
		send();
	}
});

// function nextQuestion() {
// 	if (this.valid()) {
// 		console.log('next question!');
// 		if (this.counter + 1 < this.dataLength) {
// 			this.counter++;
// 			this.$el.innerHTML = quizTemplate(quizData[this.counter], this.dataLength, this.options);

// 			if (this.counter + 1 == this.dataLength) {
// 				this.$el.insertAdjacentHTML('beforeend', `<button type="button" class="quiz-question__btn" data-send>${this.options.sendBtnText}</button>`);
// 				this.$el.querySelector('[data-next-btn]').remove();
// 			}
// 		}
// 	}
// }

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
			} else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
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
	let formError = item.nextElementSibling;
	if (formError.classList.contains('form-error')) {
		formError.classList.add('active');
	}

	//* если ошибка для всей формы
	// let formError = item.parentElement.querySelector('.form-error');
	// formError.classList.add('active');
}

function formRemoveError(selector) {
	if (selector.length > 0) {
		for (let index = 0; index < selector.length; index++) {
			const input = selector[index];
			input.parentElement.classList.remove('error');
			input.classList.remove('error');

			//! Оставить эту часть, если в html добавлены блоки с сообщением об ошибке (.form-error)
			let formError = input.nextElementSibling; // если ошибка для каждого input
			// let formError = input.parentElement.querySelector('.form-error'); // если ошибка для всей формы
			formError.classList.remove('active');
		}
	}
}

function emailTest(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImxhenkuanMiLCJxdWl6LmpzIiwicmFuZ2Utc2xpZGVyLmpzIiwidmFsaWRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGZvckVhY2ggUG9seWZpbGxcclxuaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbn1cclxuXHJcbi8vIHdpbmRvdy5ub1plbnNtb290aCA9IHRydWU7IiwibGV0IG1lbnVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcclxubGV0IG1lbnVJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVfX2xpbmsnKTtcclxubGV0IGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKTtcclxuXHJcbmhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBtZW51Qm9keS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2Nyb2xsLWxvY2snKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBtZW51Qm9keS5mb2N1cygpO1xyXG4gICAgfSwgNjAwKTtcclxufSk7XHJcblxyXG5tZW51SXRlbS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChoYW1idXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIG1lbnVCb2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1sb2NrJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSlcclxuIiwiY29uc3QgY2hlY2tCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2F0YWxvZy1jaGVja2JveF9fbGFiZWwsIC5jdXN0b20tY2hlY2tib3hfX3RleHQnKTtcclxuXHJcbmNoZWNrQm94LmZvckVhY2goaXRlbSA9PiB7XHJcblx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuXHRcdGlmIChlLmNvZGUgPT09ICdFbnRlcicgfHwgZS5jb2RlID09PSAnTnVtcGFkRW50ZXInIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xyXG5cdFx0XHRsZXQgY2hlY2sgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRpZiAoY2hlY2sudHlwZSA9PSAncmFkaW8nKSB7XHJcblx0XHRcdFx0aWYgKGNoZWNrLmNoZWNrZWQgPT09IGZhbHNlKSB7XHJcblx0XHRcdFx0XHRjaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHR9IFxyXG5cdFx0XHR9IGVsc2UgaWYgKGNoZWNrLnR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG5cdFx0XHRcdGlmIChjaGVjay5jaGVja2VkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0Y2hlY2suY2hlY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNoZWNrLmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fSk7XHJcbn0pOyIsImNvbnN0IGxhenlJbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1zcmNdLHNvdXJjZVtkYXRhLXNyY3NldF0nKTtcclxuY29uc3QgbG9hZE1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkLW1hcCcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKCkgPT4ge1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0aWYgKGxhenlJbWFnZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0bGF6eUltYWdlcy5mb3JFYWNoKGltZyA9PiB7XHJcblx0XHRcdGxldCBpbWdPZmZzZXQgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgcGFnZVlPZmZzZXQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2Nyb2xsWSA+PSBpbWdPZmZzZXQgLSAxMDAwKSB7XHJcblx0XHRcdFx0aWYgKGltZy5kYXRhc2V0LnNyYykge1xyXG5cdFx0XHRcdFx0aW1nLnNyYyA9IGltZy5kYXRhc2V0LnNyYztcclxuXHRcdFx0XHRcdGltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpbWcuZGF0YXNldC5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdGltZy5zcmNzZXQgPSBpbWcuZGF0YXNldC5zcmNzZXQ7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyY3NldCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vTWFwXHJcblx0Ly8gaWYgKCFsb2FkTWFwLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVkJykpIHtcclxuXHQvLyBcdGxldCBtYXBPZmZzZXQgPSBsb2FkTWFwLm9mZnNldFRvcDtcclxuXHQvLyBcdGlmIChzY3JvbGxZID49IG1hcE9mZnNldCAtIDIwMCkge1xyXG5cdC8vIFx0XHRjb25zdCBsb2FkTWFwVXJsID0gbG9hZE1hcC5kYXRhc2V0Lm1hcDtcclxuXHQvLyBcdFx0aWYgKGxvYWRNYXBVcmwpIHtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmluc2VydEFkamFjZW50SFRNTChcclxuXHQvLyBcdFx0XHRcdFwiYmVmb3JlZW5kXCIsXHJcblx0Ly8gXHRcdFx0XHRgPGlmcmFtZSBzcmM9XCIke2xvYWRNYXBVcmx9XCIgc3R5bGU9XCJib3JkZXI6MDtcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBsb2FkaW5nPVwibGF6eVwiPjwvaWZyYW1lPmBcclxuXHQvLyBcdFx0XHQpO1xyXG5cdC8vIFx0XHRcdGxvYWRNYXAuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcbn0pOyIsIi8vKiDQkiDQsNGC0YDQuNCx0YPRgtC1IG5hbWUg0LjQvdC/0YPRgtCwINGD0LrQsNC30LDRgtGMINC40LzRjyDQtNC70Y8g0LfQvdCw0YfQtdC90LjRjyDQstC+0L/RgNC+0YHQsCAo0L3QsNC/0YAuIHNpemU6IDM3IC0g0LPQtNC1IHNpemUgLSDQuNC80Y8pXHJcblxyXG5jb25zdCBxdWl6Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LWZvcm0nKTtcclxuY29uc3QgaW5wdXRzID0gcXVpekZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxubGV0IHRleHRhcmVhVGV4dCA9IG51bGw7XHJcbmxldCBxdWl6VG1wID0ge307XHJcbmxldCBxdWl6UmVwbHkgPSBbXTtcclxuXHJcbi8vINC30LDQv9C40YHRjCDQvdCw0LfQstCw0L3QuNGPINGH0LXQutCx0L7QutGB0LAg0LIgdmFsdWVcclxuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdGlmIChpbnB1dC50eXBlID09ICdjaGVja2JveCcgfHwgaW5wdXQudHlwZSA9PSAncmFkaW8nKSB7XHJcblx0XHRpbnB1dC52YWx1ZSA9IGlucHV0Lm5leHRFbGVtZW50U2libGluZy50ZXh0Q29udGVudDtcclxuXHR9XHJcbn0pO1xyXG5cclxuLy8g0LfQsNC/0LjRgdGMINC00LDQvdC90YvRhSDQsdC70L7QutCwINC60LLQuNC30LAg0LLQviDQstGA0LXQvNC10L3QvdGL0Lkg0L7QsdGK0LXQutGCXHJcbnF1aXpGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XHJcblx0bGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cdGlmICh0YXJnZXQudGFnTmFtZSA9PSAnSU5QVVQnKSB7XHJcblx0XHRxdWl6VG1wID0gc2VyaWFsaXplKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl6LWZvcm0nKSk7XHJcblx0XHRjb25zb2xlLmxvZyhxdWl6VG1wKTtcclxuXHR9IGVsc2UgaWYgKHRhcmdldC50YWdOYW1lID09ICdURVhUQVJFQScpIHtcclxuXHRcdHRleHRhcmVhVGV4dCA9IHRhcmdldC52YWx1ZTtcclxuXHRcdC8vISDQtNC+0LHQsNCy0LjRgtGMINCyIEZvcm1EYXRhXHJcblx0fVxyXG59KTtcclxuXHJcbnF1aXpGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRpZiAoZS50YXJnZXQgPT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV4dF0nKSkge1xyXG5cdFx0YWRkVG9TZW5kKCk7XHJcblx0XHRuZXh0UXVlc3Rpb24oKTtcclxuXHR9XHJcblxyXG5cdGlmIChlLnRhcmdldCA9PSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zZW5kXScpKSB7XHJcblx0XHRzZW5kKCk7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vIGZ1bmN0aW9uIG5leHRRdWVzdGlvbigpIHtcclxuLy8gXHRpZiAodGhpcy52YWxpZCgpKSB7XHJcbi8vIFx0XHRjb25zb2xlLmxvZygnbmV4dCBxdWVzdGlvbiEnKTtcclxuLy8gXHRcdGlmICh0aGlzLmNvdW50ZXIgKyAxIDwgdGhpcy5kYXRhTGVuZ3RoKSB7XHJcbi8vIFx0XHRcdHRoaXMuY291bnRlcisrO1xyXG4vLyBcdFx0XHR0aGlzLiRlbC5pbm5lckhUTUwgPSBxdWl6VGVtcGxhdGUocXVpekRhdGFbdGhpcy5jb3VudGVyXSwgdGhpcy5kYXRhTGVuZ3RoLCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuLy8gXHRcdFx0aWYgKHRoaXMuY291bnRlciArIDEgPT0gdGhpcy5kYXRhTGVuZ3RoKSB7XHJcbi8vIFx0XHRcdFx0dGhpcy4kZWwuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxdWl6LXF1ZXN0aW9uX19idG5cIiBkYXRhLXNlbmQ+JHt0aGlzLm9wdGlvbnMuc2VuZEJ0blRleHR9PC9idXR0b24+YCk7XHJcbi8vIFx0XHRcdFx0dGhpcy4kZWwucXVlcnlTZWxlY3RvcignW2RhdGEtbmV4dC1idG5dJykucmVtb3ZlKCk7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdH1cclxuLy8gXHR9XHJcbi8vIH1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvU2VuZCgpIHtcclxuXHRxdWl6UmVwbHkucHVzaChxdWl6VG1wKVxyXG5cdC8vIGNvbnNvbGUubG9nKHF1aXpSZXBseSk7XHJcblx0XHJcbn1cclxuLy8g0YTRg9C90LrRhtC40Y8g0LfQsNC/0LjRgdC4INC+0YLQstC10YLQvtCyINCyINGB0YLRgNC+0LrRg1xyXG5mdW5jdGlvbiBzZXJpYWxpemUoZm9ybSkge1xyXG5cdGxldCBmaWVsZCwgcyA9IHt9O1xyXG5cdGxldCB2YWx1ZVN0cmluZyA9ICcnO1xyXG5cdGlmICh0eXBlb2YgZm9ybSA9PSAnb2JqZWN0JyAmJiBmb3JtLm5vZGVOYW1lID09IFwiRk9STVwiKSB7XHJcblx0XHRsZXQgbGVuID0gaW5wdXRzLmxlbmd0aDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0ZmllbGQgPSBpbnB1dHNbaV07XHJcblxyXG5cdFx0XHRpZiAoZmllbGQubmFtZSAmJiAhZmllbGQuZGlzYWJsZWQgJiYgZmllbGQudHlwZSAhPSAnZmlsZScgJiYgZmllbGQudHlwZSAhPSAncmVzZXQnICYmIGZpZWxkLnR5cGUgIT0gJ3N1Ym1pdCcgJiYgZmllbGQudHlwZSAhPSAnYnV0dG9uJykge1xyXG5cdFx0XHRcdGlmICgoZmllbGQudHlwZSAhPSAnY2hlY2tib3gnICYmIGZpZWxkLnR5cGUgIT0gJ3JhZGlvJyAmJiBmaWVsZC52YWx1ZSkgfHwgZmllbGQuY2hlY2tlZCkge1xyXG5cdFx0XHRcdFx0dmFsdWVTdHJpbmcgKz0gZmllbGQudmFsdWUgKyAnLCc7XHJcblx0XHRcdFx0XHRzW2ZpZWxkLm5hbWVdID0gdmFsdWVTdHJpbmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBzXHJcbn0iLCJjb25zdCByYW5nZVNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5nZS1zbGlkZXInKTtcblxuaWYgKHJhbmdlU2xpZGVyKSB7XG5cdG5vVWlTbGlkZXIuY3JlYXRlKHJhbmdlU2xpZGVyLCB7XG4gICAgc3RhcnQ6IFs1MDAsIDk5OTk5OV0sXG5cdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRzdGVwOiAxLFxuICAgIHJhbmdlOiB7XG5cdFx0XHQnbWluJzogWzUwMF0sXG5cdFx0XHQnbWF4JzogWzk5OTk5OV1cbiAgICB9XG5cdH0pO1xuXG5cdGNvbnN0IGlucHV0MCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC0wJyk7XG5cdGNvbnN0IGlucHV0MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC0xJyk7XG5cdGNvbnN0IGlucHV0cyA9IFtpbnB1dDAsIGlucHV0MV07XG5cblx0cmFuZ2VTbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24odmFsdWVzLCBoYW5kbGUpe1xuXHRcdGlucHV0c1toYW5kbGVdLnZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZXNbaGFuZGxlXSk7XG5cdH0pO1xuXG5cdGNvbnN0IHNldFJhbmdlU2xpZGVyID0gKGksIHZhbHVlKSA9PiB7XG5cdFx0bGV0IGFyciA9IFtudWxsLCBudWxsXTtcblx0XHRhcnJbaV0gPSB2YWx1ZTtcblxuXHRcdGNvbnNvbGUubG9nKGFycik7XG5cblx0XHRyYW5nZVNsaWRlci5ub1VpU2xpZGVyLnNldChhcnIpO1xuXHR9O1xuXG5cdGlucHV0cy5mb3JFYWNoKChlbCwgaW5kZXgpID0+IHtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coaW5kZXgpO1xuXHRcdFx0c2V0UmFuZ2VTbGlkZXIoaW5kZXgsIGUuY3VycmVudFRhcmdldC52YWx1ZSk7XG5cdFx0fSk7XG5cdH0pO1xufSIsIi8vKiDQktCw0LvQuNC00LDRhtC40Y8g0YTQvtGA0LzRi1xyXG5mdW5jdGlvbiBmb3JtVmFsaWRhdGUoc2VsZWN0b3IpIHtcclxuXHRsZXQgZXJyb3IgPSAwO1xyXG5cdGlmIChzZWxlY3Rvci5sZW5ndGggPiAwKSB7XHJcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc2VsZWN0b3IubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGNvbnN0IGlucHV0ID0gc2VsZWN0b3JbaW5kZXhdO1xyXG5cdFx0XHRsZXQgcGxhY2Vob2xkZXIgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJyk7XHJcblx0XHRcdGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2VtYWlsJykpIHtcclxuXHRcdFx0XHRpZiAoZW1haWxUZXN0KGlucHV0KSB8fCBpbnB1dC52YWx1ZSA9PSBwbGFjZWhvbGRlcikge1xyXG5cdFx0XHRcdFx0Zm9ybUFkZEVycm9yKGlucHV0KTtcclxuXHRcdFx0XHRcdGVycm9yKys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwiY2hlY2tib3hcIiAmJiBpbnB1dC5jaGVja2VkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0ZXJyb3IrKztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoaW5wdXQudmFsdWUgPT0gJycgfHwgaW5wdXQudmFsdWUgPT0gcGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRcdGZvcm1BZGRFcnJvcihpbnB1dCk7XHJcblx0XHRcdFx0XHRlcnJvcisrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gZXJyb3I7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1BZGRFcnJvcihpdGVtKSB7XHJcblx0aXRlbS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcblx0aXRlbS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG5cclxuXHQvLyEg0J7RgdGC0LDQstC40YLRjCDRjdGC0YMg0YfQsNGB0YLRjCwg0LXRgdC70Lgg0LIgaHRtbCDQtNC+0LHQsNCy0LvQtdC90Ysg0LHQu9C+0LrQuCDRgSDRgdC+0L7QsdGJ0LXQvdC40LXQvCDQvtCxINC+0YjQuNCx0LrQtSAoLmZvcm0tZXJyb3IpXHJcblxyXG5cdC8vKiDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LTQu9GPINC60LDQttC00L7Qs9C+IGlucHV0XHJcblx0bGV0IGZvcm1FcnJvciA9IGl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cdGlmIChmb3JtRXJyb3IuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtLWVycm9yJykpIHtcclxuXHRcdGZvcm1FcnJvci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHR9XHJcblxyXG5cdC8vKiDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LTQu9GPINCy0YHQtdC5INGE0L7RgNC80YtcclxuXHQvLyBsZXQgZm9ybUVycm9yID0gaXRlbS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWVycm9yJyk7XHJcblx0Ly8gZm9ybUVycm9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtUmVtb3ZlRXJyb3Ioc2VsZWN0b3IpIHtcclxuXHRpZiAoc2VsZWN0b3IubGVuZ3RoID4gMCkge1xyXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHNlbGVjdG9yLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRjb25zdCBpbnB1dCA9IHNlbGVjdG9yW2luZGV4XTtcclxuXHRcdFx0aW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cdFx0XHRpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG5cclxuXHRcdFx0Ly8hINCe0YHRgtCw0LLQuNGC0Ywg0Y3RgtGDINGH0LDRgdGC0YwsINC10YHQu9C4INCyIGh0bWwg0LTQvtCx0LDQstC70LXQvdGLINCx0LvQvtC60Lgg0YEg0YHQvtC+0LHRidC10L3QuNC10Lwg0L7QsSDQvtGI0LjQsdC60LUgKC5mb3JtLWVycm9yKVxyXG5cdFx0XHRsZXQgZm9ybUVycm9yID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nOyAvLyDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LTQu9GPINC60LDQttC00L7Qs9C+IGlucHV0XHJcblx0XHRcdC8vIGxldCBmb3JtRXJyb3IgPSBpbnB1dC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWVycm9yJyk7IC8vINC10YHQu9C4INC+0YjQuNCx0LrQsCDQtNC70Y8g0LLRgdC10Lkg0YTQvtGA0LzRi1xyXG5cdFx0XHRmb3JtRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbWFpbFRlc3QoaW5wdXQpIHtcclxuXHRyZXR1cm4gIS9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7Miw4fSkrJC8udGVzdChpbnB1dC52YWx1ZSk7XHJcbn0iXX0=
