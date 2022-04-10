const checkBox = document.querySelectorAll('.name-checkbox__label');

checkBox.forEach(item => {
	item.addEventListener('keydown', (e) => {
		if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space') {
			let check = e.target.previousElementSibling;
			console.log(check.checked);
			if (check.checked === false) {
				check.checked = true;
			} 
		}
	});
});