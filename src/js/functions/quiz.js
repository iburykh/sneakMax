const quizForm = document.querySelector('.quiz-form');
// const inputs = quizForm.querySelectorAll('input');

// объект для записи ответов
let quizReply = {};

// фукция записи данных в объект quizReply
// elem - определенные элементы выбора, prop - название выбранного элемента


function dataRecord (elem, prop) {
	elem.forEach((item) => {
		if (!item.disabled && item.type != 'file' && item.type != 'reset' && item.type != 'submit' && item.type != 'button') {
			if (item.type != 'checkbox' && item.type != 'radio' && item.value) {
				quizReply[prop] = item.value;
			}
		}
	});
}	
quizForm.addEventListener('change', (e) => {
	let target = e.target;
	if (target.tagName == 'INPUT') {
		if (!target.type.disabled && target.type.type != 'file' && target.type != 'reset' && target.type != 'submit' && target.type != 'button') {
			if (target.type != 'checkbox' && target.type != 'radio' && target.value) {
				//!создать prop
				quizReply[prop] = item.value;
			} else if (target.type == 'checkbox' && target.type == 'radio' && target.checked) {
				//!создать prop и value
				quizReply[prop] = item.value;
			}
		}
	} else {
		let textarea = quizForm.querySelector('textarea');
		textareaText = textarea.value;
	}
});