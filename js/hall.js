function sendRequest(body, callback) {

	fetch('https://jscp-diplom.netoserver.ru/', {
			method: 'POST',
			body: body,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Произошла ошибка!')
			}
			return response.json()
		})
		.then((data) => {
			callback(data);
		})
		.catch((error) => {
			console.log(error)
		});

};

let seanceInfo = JSON.parse(sessionStorage.getItem('session'));
let updateRequest = `event=get_hallConfig&timestamp=${seanceInfo.timestamp}&hallId=${seanceInfo.hallId}&seanceId=${seanceInfo.seanceId}`;

let buyingTitle = document.querySelector('.buying__info-title');
let buyingStart = document.querySelector('.buying__info-start');
let buyingHall = document.querySelector('.buying__info-hall');
let priceStandart = document.querySelector('.price-standart');
let priceVip = document.querySelector('.price-vip');

let date = new Date(seanceInfo.timestamp * 1000);
let dateString = date.toLocaleString().slice(0, -3)

buyingTitle.innerHTML = seanceInfo.filmName;
buyingStart.innerHTML = `Начало сеанса ${dateString}`;
buyingHall.innerHTML = seanceInfo.hallName.split('Зал').join('Зал ');;
priceStandart.innerHTML = seanceInfo.priceStandart;
priceVip.innerHTML = seanceInfo.priceVip;
//делаю увеличение????
let zoom = document.querySelector('.buying__info-hint');
zoom.addEventListener('dblclick', ()=>{
	zoom.classList.toggle('zoom');
	if (zoom.classList.contains('zoom')){
		zoom.style.transform = "scale(1.5)"
	} else{
		zoom.style.transform = "scale(1)"
	};
});

let configHall = document.querySelector('.conf-step__wrapper');
let acceptinButton = document.querySelector('.acceptin-button');
acceptinButton.setAttribute('disabled', true);

sendRequest(updateRequest, (response) => {
	if (response) {
		seanceInfo.hallConfig = response;
	};
	configHall.innerHTML = seanceInfo.hallConfig;


	let arrOfChairs = document.querySelectorAll('.conf-step__chair');
	arrOfChairs.forEach(el => {
		el.addEventListener('click', (event) => {
			let target = event.target;
			if (target.closest('.conf-step__legend-price') || target.classList.contains('conf-step__chair_taken') || target.classList.contains('conf-step__chair_disabled')) {
				return;
			} else {
				target.classList.toggle('conf-step__chair_selected');
				checkButton();
			};
		});
	});

	function checkButton() {
		let selectedChairs = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
		if (selectedChairs.length > 0) {
			acceptinButton.removeAttribute('disabled');
		} else {
			acceptinButton.setAttribute('disabled', true);
		};
	};

	acceptinButton.addEventListener('click', () => {
		let selectedInfo = [];
        let selectedChairs = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
        selectedChairs.forEach(chair => {
            let row = chair.closest('.conf-step__row');
            let rowNumber = Array.from(row.parentNode.children).indexOf(row) + 1;
            let placeNumber = Array.from(row.children).indexOf(chair) + 1;
            let placeType = (chair.classList.contains('conf-step__chair_standart')) ? 'standart' : 'vip';
            selectedInfo.push({
                row: rowNumber,
                place: placeNumber,
                placeType: placeType
            });
        });
        seanceInfo.hallConfig = configHall.innerHTML;
	    seanceInfo.selectedPlaces = selectedInfo;
	    sessionStorage.setItem('session', JSON.stringify(seanceInfo));
	    window.location.href = 'payment.html';
	});
});
