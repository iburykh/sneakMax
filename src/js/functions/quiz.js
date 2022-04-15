//* В атрибуте name инпута указать имя для значения вопроса (напр. size: 37 - где size - имя)
//* not-valid - класс для инпутов, которые не надо валидировать

const quizForm = document.querySelector('.quiz-form');
const inputs = quizForm.querySelectorAll('input');
const quizBlocks = quizForm.querySelectorAll('.quiz-block');
let textareaText = null;
let quizTmp = {};
let quizReply = [];
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
			nextQuestion(block);	
		}
	});
	if (target == document.querySelector('[data-send]')) {
		e.preventDefault();
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
		let elements = form.querySelectorAll('input');
		formRemoveError(elements);

		//* ======== Сообщение об отправке ============
		let ok = form.querySelector('.quiz-send__ok');
		let textMessage = form.querySelector('.form-message');
		if (textMessage) {
			textMessage.textContent = 'Загрузка...';
			textMessage.classList.add('active');
		}

		//*========= FormData (сама собирает все из формы) ===============
		const quizFormData = new FormData(quizForm);
		// formData.append('image', formImage.files[0]);
		//Добавить данные к отправке из других окон (не формы)
		// if (item.getAttribute('data-calc') === "end") { 
		// 	let val = costBlock.innerHTML;
		// 	let obj = {
		// 		cost: val
		// 	};
		// 	console.log(obj);
		// 	for (let key in obj) {
		// 		formData.append(key, obj[key]);
		// 	}
		// }
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
			return await response.json(); // res.text() - для проверки на сервере) или res.json() - для отправки на почту;
		};
		postData('../sendmail.php', quizFormData)
		// postData('../server.php', quizFormData) //! убрать (это для проверки на сервере)
		.then(response => {
			console.log(response); //! убрать (это для проверки на сервере)
			// let result = postData('../sendmail.php', quizFormData);
			// console.log(result.message)
			// alert(result.message);
			if (textMessage) {
				textMessage.textContent = 'Ok!';
				textMessage.classList.add('active');
			}
			ok.classList.add('active');
		})
		.catch(() => {
			if (textMessage) {
				textMessage.textContent = 'Что-то пошло не так...';
				textMessage.classList.add('active');
			}
		})
		.finally(() => {
			clearInputs(inputs);
			setTimeout(() => {
				if (textMessage) {
					textMessage.classList.remove('active');
				}
				ok.classList.remove('active');
			}, 5000);
		});
	}
}