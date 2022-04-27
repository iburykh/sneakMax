//? Параметры:
//* triggerSelector - кнопка открытия модального окна
//* modalSelector - модальное окно внутри фона modal
//* closeSelector - крестик, закрывающий окно
//* speed - время выполнения, ставится в соответствии с $transition-time

//TODO Добавить классы:
//* data-modal - добавить всем модальным окнам (modal-name) (если их несколько)
//* lock - добавить класс для блоков с position: absolute или fixed (добавится padding)
//* small-lock - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)


bindModal('.modal-btn', '.modal-prod', '.modal__close', 500);

function bindModal(triggerSelector, modalSelector, closeSelector, speed) {
    const trigger = document.querySelectorAll(triggerSelector),
            modal = document.querySelector('.modal-overlay'),
            modalContent = document.querySelector(modalSelector),
            close = document.querySelector(closeSelector),
            windows = document.querySelectorAll('[data-modal]'),
            fixScroll = document.querySelectorAll('.lock'),
            smallFix = document.querySelectorAll('.small-lock'),
            speedTime = (speed),
            scroll = calcScroll();
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

    trigger.forEach(function(item) {
        item.addEventListener('click', function(e) {
            let target = e.target
            if (target) {
                e.preventDefault();
            }
            modalOpen = true;
            windows.forEach(item => {
                item.classList.remove('modal-open');
            });

            modal.classList.add('is-open');
            disableScroll();

            document.body.style.paddingRight = `${scroll}px`;
            if (fixScroll.length > 0) {
                fixScroll.forEach(item => {
                    item.style.paddingRight = `${scroll}px`;
                })
            }
            if (smallFix.length > 0) {
                smallFix.forEach(item => {
                    item.style.marginRight = `${scroll}px`;
                })
            }

            modalContent.classList.add('modal-open');
            modalContent.setAttribute('aria-hidden', false);
            lastFocus = document.activeElement;
            modal.setAttribute('tabindex', '0');

            setTimeout(() => {
                modal.focus();
                /** если фокус на первый активный элемент, то  focusTrap*/
				// focusTrap();
            }, speedTime);
        });
    });

    close.addEventListener('click', () => {
        popapClose();
        lastFocus.focus();
    });

    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
            popapClose();
            lastFocus.focus();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalOpen) {
            popapClose();
            lastFocus.focus();
        }

        if (e.code === 'Tab' && modalOpen) {
            focusCatch(e);
        }
    });

    function focusTrap() {
		const focusable = modalContent.querySelectorAll(focusElements);
		if (modalOpen) {
			focusable[0].focus();
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

    function popapClose() {
        modalOpen = false;
        windows.forEach(item => {
            item.classList.remove('modal-open');
        });
        modal.classList.remove('is-open');
        enableScroll();

        document.body.style.paddingRight = `0px`;
        if (fixScroll.length > 0) {
            fixScroll.forEach(item => {
                item.style.paddingRight = `0px`;
            })
        }
        if (smallFix.length > 0) {
            smallFix.forEach(item => {
                item.style.marginRight = `0px`;
            })
        }
        modal.classList.remove('is-open');
        modalContent.setAttribute('aria-hidden', true);
        modal.setAttribute('tabindex', '-1');
    }

    function calcScroll() {
        let div = document.createElement('div');

        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';

        document.body.appendChild(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        return scrollWidth;
    }
};