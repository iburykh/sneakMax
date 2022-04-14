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