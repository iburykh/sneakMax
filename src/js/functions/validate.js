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