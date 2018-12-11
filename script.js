const brexitWords = 'blah blah brexit democracy referendum means blah blah sovreignity control blah EU blah soft hard blah red-lines deal wto easy'.split(' ');

document.addEventListener('DOMContentLoaded', e => {

	const mace = document.getElementById('mace'),
		house = document.getElementById('house'),
		nonsenseContainer = document.getElementById('nonsense'),
		berks = Array.from(document.getElementsByClassName('berk')),
		overlay = document.getElementById('overlay');

	window.addEventListener('resize', resize);
	resize();
	function resize() {
		const w = window.innerWidth,
			h = window.innerHeight,
			ar = w / h,
			scale = (ar < 820 / 546) ? (w / 820) : (h / 546);
		house.style.transform = `scale(${scale})`;
		house.style.left = `${w / 2 - (410 * scale)}px`;
		house.style.top = `${h / 2 - (273 * scale)}px`;
	}

	document.body.addEventListener('mousemove', e => {
		mace.style.top = `${e.pageY}px`;
		mace.style.left = `${e.pageX}px`;
	});

	let lastSmash, lastSmashTime = 0;
	document.body.addEventListener('click', e => {
		const now = Date.now();
		if (now < lastSmashTime + 400) return;
		lastSmashTime = now;
		mace.classList.add('smash');
		if (lastSmash) clearTimeout(lastSmash);
		lastSmash = setTimeout(() => mace.classList.remove('smash'), 200);
		if (!beenHit &&
			e.target.classList.contains('berk') &&
			e.offsetX > 110 && e.offsetX < 250 &&
			e.offsetY < 175 && e.offsetY > 10)
		{
			setTimeout(() => {
				if (!e.target.classList.contains('should-shut-up')) {
					console.log('you missed', e.target.className);
					return;
				}
				e.target.classList.remove('should-shut-up');
				console.log('you hit', e.target.className);
				beenHit = true;
				updateScore(++score);
			}, 200);
		}
	});

	let standingUpTimer,
		nonsenseTimer,
		standingBerk,
		nonsenseSpewed,
		beenHit,
		score;
	function startGame() {
		standingUpTimer = setInterval(() => {
			if (beenHit || (Math.random() > .9)) {
				for (const berk of berks) berk.classList.remove('should-shut-up');
				standingBerk = ~~(Math.random() * berks.length);
				berks[standingBerk].classList.add('should-shut-up');
				beenHit = false;
			}
		}, 600);
		nonsenseTimer = setInterval(() => {
			if (beenHit) return;
			++nonsenseSpewed;
			const nonsense = document.createElement('div');
			nonsense.style.transform =
				window.getComputedStyle(berks[standingBerk]).transform;
			nonsense.appendChild(document.createTextNode(
				brexitWords[~~(Math.random() * brexitWords.length)]));
			nonsenseContainer.appendChild(nonsense);
			setTimeout(() => nonsense.style.transform =
				`translate(${Math.random() * 800 - 250}px,
					${Math.random() * 100 - 230}px)
				rotate(${Math.random() * 40 - 20}deg)`,
				50);
			if (nonsenseSpewed >= 500)
				stopGame();
		}, 73);
		updateScore(score = 0);
		nonsenseSpewed = 0;
		beenHit = true;
		document.body.classList.remove('unstarted');
		document.body.classList.remove('game-over');
		document.body.classList.add('game-on');
	}

	let gameOver = 0;
	function stopGame() {
		clearInterval(standingUpTimer);
		clearInterval(nonsenseTimer);
		for (const berk of berks) berk.classList.remove('should-shut-up');
		nonsenseContainer.innerHTML = '';
		document.body.classList.add('game-over');
		document.body.classList.remove('game-on');
		gameOver = Date.now();
	}

	overlay.addEventListener('click', e => {
		if (gameOver + 1000 < Date.now())
			startGame();
	});

	function updateScore() {
		document.getElementById('score').innerHTML = `Score: ${score}`;
	}
});
