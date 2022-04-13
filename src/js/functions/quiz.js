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