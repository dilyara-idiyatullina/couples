document.addEventListener('DOMContentLoaded', () => {    
    const GAME_TIME = 60;
    let doubleClickCounter;
    let cardsCounter;
    let cardsCount;
    let hCount;
    let vCount;
    let timerId;
    let counter;
    let wrapper = document.getElementById('couples-game');
    let timer = document.getElementById('timer');
    const startBtn = document.getElementById('start');
    const onemoreBtn = document.getElementById('onemore');

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateCouplesArray(length) {
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(i + 1);
            arr.push(i + 1);
        }
        return arr;
    }

    function decreaseCounter() {
        counter--;
        timer.textContent = counter;           
        if (counter === -1) {
            clearInterval(timerId);
            onemoreBtn.classList.remove('not-visible');
            timer.innerText = 'Вы не успели :(';
            document.querySelectorAll('.card').forEach(function(card) {
                card.onclick = null;
                card.style.cursor = 'auto';
            })
        }               
    }

    function runTimer() {    
        clearInterval(timerId);
        counter = GAME_TIME;
        if (isFinite(counter) && counter >= 0) {
            timer.textContent = counter;
            timerId = setInterval(decreaseCounter, 1000);
        }
    }

    // Кнопка "начать игру"
    startBtn.onclick = function(event) {
        doubleClickCounter = 0;
        cardsCounter = 0;
        document.querySelector('.md-overlay').classList.remove('md-show');
        document.querySelector('.md-modal').classList.remove('md-show');
        onemoreBtn.classList.add('not-visible');
        hCount = document.getElementById('h-count').value;
        vCount = document.getElementById('v-count').value;
        if ((hCount === '') || (hCount < 2) || (hCount > 10) || (hCount % 2 != 0)) {
            hCount = 4;
        }
        if ((vCount === '') || (vCount < 2) || (vCount > 10) || (vCount % 2 != 0)) {
            vCount = 4;
        }
        cardsCount = hCount * vCount;
        let arr = generateCouplesArray(cardsCount / 2);
        shuffle(arr);
        for (let i = 0; i < cardsCount; i++) {
            let card = document.createElement('div');
            card.classList.add('card');
            card.onclick = cardOnclickHandler;
            let front = document.createElement('div');
            front.classList.add('card-face');
            front.classList.add('front');
            let back = document.createElement('div');
            back.classList.add('card-face'); 
            back.classList.add('back');  
            back.innerText = arr[i];        
            card.append(front);
            card.append(back);
            wrapper.append(card);
        }
        wrapper.style.gridTemplateColumns = `repeat(${hCount}, 1fr)`;
        runTimer();
    }

    // Кнопка "сыграть еще раз"
    onemoreBtn.onclick = function(event) {
        document.querySelector('.md-overlay').classList.add('md-show');
        document.querySelector('.md-modal').classList.add('md-show');
        //очистка поля
        document.querySelectorAll('.card').forEach(function(card) {
            card.remove();
        });
    };

    // нажатие на карточку
    function cardOnclickHandler() {
        if (this.style.transform === 'rotateY(180deg)') {
            return;
        }
        doubleClickCounter++;            
        this.style.transform = 'rotateY(180deg)';
        this.style.cursor = 'auto';
        switch (doubleClickCounter) {
            case 1:
                if (document.querySelector('.second') !== null) {
                    if (document.querySelector('.first').innerText !== document.querySelector('.second').innerText) {
                        document.querySelector('.first').style.transform = 'none';
                        document.querySelector('.first').style.cursor = 'pointer';
                        document.querySelector('.second').style.transform = 'none';
                        document.querySelector('.second').style.cursor = 'pointer';
                    } 
                    document.querySelector('.first').classList.remove('first');
                    document.querySelector('.second').classList.remove('second');
                }
                this.classList.add('first');
                break; 
            case 2:
                this.classList.add('second');
                doubleClickCounter = 0;
                break;                
        }
        if (document.querySelector('.second') !== null) {
            if (document.querySelector('.first').innerText === document.querySelector('.second').innerText) {
                cardsCounter = cardsCounter + 2;
            }
        }
        if (cardsCounter === cardsCount) {
            clearInterval(timerId);
            onemoreBtn.classList.remove('not-visible');
            timer.innerText = 'Ура, вы победили!';
        }
    }
});
