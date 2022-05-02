//? Параметры:
//* btnSelector - кнопка открытия модального окна
//* modalSelector - модальное окно внутри фона modal

//? эти парвметры менять по умолчанию, либо указывать их как аргумент, если они разные для разных окон
//* animate - анимация при открытии модального окна (контента внутри оболочки)
//* speed - время выполнения, ставится в соответствии с $transition-time

//TODO Добавить классы:
//* data-modal - добавить всем модальным окнам (modal-name) (если их несколько)
//* block-fix - добавить класс для блоков с position: absolute или fixed (добавится padding)
//* small-fix - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)
//* data-inside - добавить кнопкам внутри модального окна, которые открывают следующее модальное окно (что бы сохранить фокус на кнопке вне окна)

bindModal('.modal-btn', '.modal-prod');

let lastFocus = false;

function bindModal(btnSelector, modalSelector, func, animate='fade', speed=500,) {
    const modalBtn = document.querySelectorAll(btnSelector);
	const modal = document.querySelector('.modal-overlay');
	const modalContent = document.querySelector(modalSelector);
	const modalclose = modalContent.querySelector('.modal__close');
	const openWindows = document.querySelectorAll('[data-modal]');
	const fixBlocks = document.querySelectorAll('.block-fix ');
	const fixSmall = document.querySelectorAll('.small-fix');
	const speedTime = (speed);
	// const modalAnimation = animate;
    const modalScroll = window.innerWidth - document.body.offsetWidth;
    const focusElements = [
		'a[href]',
		'input',
		'select',
		'textarea',
		'button',
		'iframe',
		'[contenteditable]',
		'[tabindex]:not([tabindex^="-"])'
	];
	
	if (modal) {
		modalBtn.forEach(function(item) {
			item.addEventListener('click', function(e) {
				let target = e.target
				if (target) {
					e.preventDefault();
					openModal(target);
				}
			});
		});
	
		modalclose.addEventListener('click', () => {
			if (modal.classList.contains("is-open")) {
				closeModal();
			}
		});
	
		document.addEventListener('click', (e) => {
			if (e.target.classList.contains('modal-overlay') && e.target.classList.contains("is-open")) {
				closeModal();			
			}
		});
		
	
		document.addEventListener('keydown', (e) => {
			if (e.code === 'Escape' && modal.classList.contains("is-open")) {
				closeModal();
			}
	
			if (e.code === 'Tab' && modal.classList.contains("is-open")) {
				focusCatch(e);
			}
		});
	}
	function openModal(tar) {
		if (!tar.closest(`[data-inside]`)) {
			lastFocus = document.activeElement;
		}

		openWindows.forEach(item => {
			item.classList.remove('modal-open');
			item.setAttribute('aria-hidden', true);
			// item.classList.remove('animate-open');
			// item.classList.remove(modalAnimation);
		});

		if (!modal.classList.contains('is-open')){
			disableScroll();
		}

		if (modalContent.classList.contains('modal-prod')) {
			let openBtnId = lastFocus.dataset.id;	
			func(openBtnId);
		}

		modal.classList.add('is-open');
		modal.setAttribute('tabindex', '0');

		document.body.style.paddingRight = `${modalScroll}px`;
		if (fixBlocks.length > 0) {
			fixBlocks.forEach(item => {
				item.style.paddingRight = `${modalScroll}px`;
			})
		}
		if (fixSmall.length > 0) {
			fixSmall.forEach(item => {
				item.style.marginRight = `${modalScroll}px`;
			})
		}

		modalContent.classList.add('modal-open');
		modalContent.setAttribute('aria-hidden', false);
		// modalContent.classList.add(modalAnimation);

		setTimeout(() => {
			// modalContent.classList.add('animate-open');
			focusTrap();
		}, speedTime);
	}

	function closeModal() {
		openWindows.forEach(item => {
			item.classList.remove('modal-open');
			item.setAttribute('aria-hidden', true);
			// item.classList.remove('animate-open');
			// item.classList.remove(modalAnimation);
		});

		enableScroll();

		document.body.style.paddingRight = `0px`;
		if (fixBlocks.length > 0) {
			fixBlocks.forEach(item => {
				item.style.paddingRight = `0px`;
			})
		}
		if (fixSmall.length > 0) {
			fixSmall.forEach(item => {
				item.style.marginRight = `0px`;
			})
		}

		modal.classList.remove('is-open');
		modal.setAttribute('tabindex', '-1');

		focusTrap();
	}

    function disableScroll() {
        let pagePosition = window.scrollY;
        document.body.classList.add('scroll-lock');
        document.body.dataset.position = pagePosition;
        document.body.style.top = -pagePosition + 'px';
    }

    function enableScroll() {
        let pagePosition = parseInt(document.body.dataset.position, 10);
        document.body.style.top = '';
        document.body.classList.remove('scroll-lock');
        window.scroll({ top: pagePosition, left: 0 });
        document.body.removeAttribute('data-position');
    }

    function focusTrap() {
		// const nodes = this.modalContainer.querySelectorAll(this._focusElements); //* для фокуса на первом элементе окна
		if (modal.classList.contains("is-open")) {
            modal.focus();
			// if (nodes.length) nodes[0].focus(); //* для фокуса на первом элементе окна
		} else {
			lastFocus.focus();	
		}
	}

	function focusCatch(e) {
		const focusable = modalContent.querySelectorAll(focusElements);
		const focusArray = Array.prototype.slice.call(focusable);
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
};