const cartBtn = document.querySelector('.cart');
const miniCart = document.querySelector('.mini-cart');
const miniCartItem = document.querySelectorAll('.mini-cart__item');

cartBtn.addEventListener('click', () => {
	miniCart.classList.toggle('mini-cart--open');
});

document.addEventListener('click', (e) => {
	if (!e.target.classList.contains('mini-cart') && !e.target.closest('.mini-cart') && !e.target.classList.contains('cart')) {
		miniCart.classList.remove('mini-cart--open');
	}
});

miniCartItem.forEach(item => {
	item.addEventListener('click', (e) => {
		
		miniCartItem.forEach(btn => {
			if (!btn.contains(e.target)) {
				btn.classList.remove('mini-cart__item--active');
			}
		});

		item.classList.add('mini-cart__item--active');
	});
});