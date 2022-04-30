//? Параметры:
//* btnSelector - кнопка открытия модального окна
//* modalSelector - модальное окно внутри фона modal
//* speed - время выполнения, ставится в соответствии с $transition-time (500)

//TODO Добавить классы:
//* data-modal - добавить всем модальным окнам (modal-name) (если их несколько)
//* block-fix - добавить класс для блоков с position: absolute или fixed (добавится padding)
//* small-fix - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)

bindModal('.modal-btn', '.modal-prod');
bindModal('.i-btn', '.modal-i');

function bindModal(btnSelector, modalSelector, speed=500) {
    const modalBtn = document.querySelectorAll(btnSelector);
	const modal = document.querySelector('.modal-overlay');
	const modalContent = document.querySelector(modalSelector);
	const modalclose = modalContent.querySelector('.modal__close');
	const openWindows = document.querySelectorAll('[data-modal]');
	const fixBlocks = document.querySelectorAll('.block-fix ');
	const fixSmall = document.querySelectorAll('.small-fix');
	const speedTime = (speed);
    const modalScroll = window.innerWidth - document.body.offsetWidth;
    let modalOpen = false;
    let lastFocus;
    const focusElements = [
		'a[href]',
		'input',
		'button',
		'select',
		'textarea',
		'[tabindex]'
	];
	console.log(modalOpen);
	
	if (modal) {
		modalBtn.forEach(function(item) {
			item.addEventListener('click', function(e) {
				let target = e.target
				if (target) {
					e.preventDefault();
				}
				openModal();
			});
		});
	
		modalclose.addEventListener('click', () => {
			closeModal();
		});
	
		modal.addEventListener('click', (e) => {
			if (e.target == modal) {
				closeModal();
			}
		});
	
		document.addEventListener('keydown', (e) => {
			if (e.code === 'Escape' && modalOpen) {
				closeModal();
			}
	
			if (e.code === 'Tab' && modalOpen) {
				focusCatch(e);
			}
		});
	}
	function openModal() {

		openWindows.forEach(item => {
			item.classList.remove('modal-open');
		});

		modalOpen = true;

		modal.classList.add('is-open');
		modal.setAttribute('tabindex', '0');

		disableScroll();

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

		lastFocus = document.activeElement;


		setTimeout(() => {
			focusTrap();
		}, speedTime);

	}

	function closeModal() {
		modalOpen = false;

		openWindows.forEach(item => {
			item.classList.remove('modal-open');
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

		modalContent.classList.remove('modal-open');
		modalContent.setAttribute('aria-hidden', true);

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
        document.body.style.top = 'auto';
        document.body.classList.remove('scroll-lock');
        window.scroll({ top: pagePosition, left: 0 });
        document.body.removeAttribute('data-position');
    }

    function focusTrap() {
		// const nodes = this.modalContainer.querySelectorAll(this._focusElements); //* для фокуса на первом элементе окна
		if (modalOpen) {
            modal.focus();
			// if (nodes.length) nodes[0].focus(); //* для фокуса на первом элементе окна
		} else {
			lastFocus.focus();
		}
	}

	function focusCatch(e) {
		const focusable = modalContent.querySelectorAll(focusElements);
		const focusArray = Array.prototype.slice.call(focusable); //Преобразуем псевдомассив в массив
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

    // function calcScroll() {
    //     // let div = document.createElement('div');

    //     // div.style.width = '50px';
    //     // div.style.height = '50px';
    //     // div.style.overflowY = 'scroll';
    //     // div.style.visibility = 'hidden';

    //     // document.body.appendChild(div);
    //     // let scrollWidth = div.offsetWidth - div.clientWidth;
    //     // div.remove();
	// 	let scrollWidth = window.innerWidth - document.body.offsetWidth;
    //     return scrollWidth;
    // }
};