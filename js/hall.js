let seanceInfo = JSON.parse(sessionStorage.getItem('session'));
let updateRequest = `event=get_hallConfig&timestamp=${seanceInfo.timestamp}&hallId=${seanceInfo.hallId}&seanceId=${seanceInfo.seanceId}`;

let buyingTitle = document.querySelector('.buying__info-title');
let buyingStart = document.querySelector('.buying__info-start');
let buyingHall = document.querySelector('.buying__info-hall');
let priceStandart = document.querySelector('.price-standart');
let priceVip = document.querySelector('.price-vip');
// добавляю инфу на страницу
buyingTitle.innerHTML = seanceInfo.filmName;
buyingStart.innerHTML = `Начало сеанса ${seanceInfo.seanceTime}`;
buyingHall.innerHTML = seanceInfo.hallName;
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
let arrOfChairs = Array.from(document.querySelectorAll('.conf-step__chair'));
let acceptinButton = document.querySelector('.acceptin-button');
//выбираем место
arrOfChairs.forEach(chair => {
    chair.addEventListener('click', (event) => {
        let target = event.target;
        if (target.closest('.conf-step__legend-price') || target.classList.contains('conf-step__chair_taken') || target.classList.contains('conf-step__chair_disabled')) {
            return;
        } else {
            target.classList.toggle('conf-step__chair_selected');
        };
    });
});

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

