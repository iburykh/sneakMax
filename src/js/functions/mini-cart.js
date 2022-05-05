const cartBtn = document.querySelector('.cart');
const miniCart = document.querySelector('.mini-cart');
// const miniCartItem = document.querySelectorAll('.mini-cart__item');

cartBtn.addEventListener('click', () => {
	miniCart.classList.toggle('mini-cart--open');
});

document.addEventListener('click', (e) => {
	if (!e.target.classList.contains('mini-cart') && !e.target.closest('.mini-cart') && !e.target.classList.contains('cart') && !e.target.classList.contains('mini-cart__delete')
	|| e.target.classList.contains('mini-cart__btn')) {
		miniCart.classList.remove('mini-cart--open');
	}
});