const root = document.querySelector(':root');
const body = document.querySelector('body');
let playing = false;
let entered = false;
let time = 0;
let game = 'p';
let closedWindow = false;
let previousWindowWidth = window.innerWidth;
let previousWindowHeight = window.innerHeight;
if(localStorage['Previous Cheater'] != undefined) {
    if(JSON.parse(localStorage['Previous Cheater'])) {
        window.close();
        location.reload();
        closedWindow = true;
    }
} else {
    localStorage['Previous Cheater'] = JSON.stringify(false);
}

window.onresize = () => {
    if(Math.abs(previousWindowWidth - window.innerWidth) > 50) {
        location.reload();
        closedWindow = true;
    }
    if(Math.abs(previousWindowHeight - window.innerHeight) > 50) {
        location.reload();
        closedWindow = true;
    }
    previousWindowWidth = window.innerWidth;
    previousWindowHeight = window.innerHeight;
}

document.addEventListener('keydown', (event) => {
    console.log(event.key);
    if(event.key == 'Enter') {
        if(!playing) {
            let p = document.querySelector('.numbers');
            if(p) {
                p.remove(); 
            }
            newNumber();
        }
    } else if(event.key == 's') {
        game = 's';
        time = 0;
    } else if(event.key == 'm') {
        game = 'm';
        time = 0;
    } else if(event.key == 'p') {
        game = 'p';
        time = 0;
    } else if(event.key == 'ç') {
        window.close();
        location.reload();
        closedWindow = true;
    } else if(event.key == '^') {
        window.close();
        location.reload();
        closedWindow = true;
    }
});

document.addEventListener('keyup', (event) => {
    if(event.key == 'Meta') {
        commandKey = false;
    } else if(event.key == 'Alt') {
        optionKey = false;
    }
});

document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

let findNumber = () => {
    if(game == 'p') {
        let number = Math.floor(Math.random() * 146 + 4);
        let originalNumber = number;
        let newArr = [];
        for(let j = 2; j < number; j++) {
            if(number % j == 0) {
                newArr.push(j);
                number /= j;
                j = 1;
            }
        }
        newArr.push(number);

        return [originalNumber, newArr];
    } else if(game == 's') {
        let number = Math.floor(Math.random() * 105 + 1);
        return number;
    } else if(game == 'm') {
        let number1 = Math.floor(Math.random() * 105 + 1);
        let even = number1 % 2 == 0;
        let number2;
        let permission = false;
        while(!permission) {
            number2 = Math.floor(Math.random() * 105 + 1);
            if(even == (number2 % 2 == 0)) {
                permission = true;
            }
        }
        console.log([number1, number2]);
        return [number1, number2];
    }
}

let newNumber = () => {
    let correctNum = 0;
    let incorrectNum = 0;

    playing = true;
    time = 30;
    let timer = document.createElement('p');
    timer.classList.add('timer');
    body.appendChild(timer);

    let p = document.createElement('p');
    p.classList.add('numbers');
    body.appendChild(p);

    let textarea = document.createElement('textarea');
    textarea.classList.add('textareas');
    body.appendChild(textarea);
    textarea.rows = 1;

    let actuallyPlaying = false;
    let previousCharacterAmount = 0;

    if(game == 'p') {
        let temp = findNumber();
        let originalNumber = temp[0];
        let newArr = [...temp[1]];

        p.innerHTML = originalNumber;

        textarea.placeholder = 'Prime Factors';
        let lastTime = 'Nothing';
        let timeArr = [];

        textarea.addEventListener('keydown', (event) => {
            let thisTime = Date.now();
            if(lastTime != 'Nothing') {
                timeArr.push(thisTime - lastTime);
            }
            lastTime = thisTime;
            setTimeout(() => {
                if(textarea.value.length - previousCharacterAmount > 1) {
                    window.close();
                    location.reload();
                    closedWindow = true;
                }
                previousCharacterAmount = textarea.value.length;
            });
            if(event.key == 'Enter' && actuallyPlaying) {
                let value = textarea.value;
                let arr = value.split(/[, ]+/).map(num => parseInt(num));
                let correct = true;
                for(let i = 0; i < newArr.length; i++) {
                    if(arr.indexOf(newArr[i]) != -1) {
                        arr.splice(arr.indexOf(newArr[i]),1);
                    } else {
                        correct = false;
                    }
                }
                for(let i = 0; i < arr.length; i++) {
                    if([1, ' '].indexOf(arr[i]) != -1 || isNaN(arr[i])) {
                        arr.splice(i,1);
                        i--;
                    }
                }
                if(arr.length != 0) {
                    correct = false;
                }
                let deviation = meanDeviation(timeArr);
                if(deviation < 1) {
                    correct = false;
                    localStorage['Previous Cheater'] = JSON.stringify(true);
                }
                if(closedWindow) {
                    window.close();
                    location.reload();
                    localStorage['Previous Cheater'] = JSON.stringify(true);
                    correct = false;
                }
                if(correct) {
                    correctNum++;
                    color(true);
                    time = parseFloat(time) + 2;
                } else {
                    incorrectNum++;
                    color(false);
                }

                temp = findNumber();
                originalNumber = temp[0];
                newArr = [...temp[1]];
                p.innerHTML = originalNumber;
                setTimeout(() => {
                    textarea.value = '';
                },10);
                setTimeout(() => {
                    previousCharacterAmount = 0;
                });
                timeArr = [];
                lastTime = 'Nothing';
            }
        });
    } else if(game == 's') {
        let number = findNumber();
        p.innerHTML = `${number}<sup style="font-size: 1rem; vertical-align: 2rem;"> <span style="font-size: 2rem;">2</span></sup>`;
        textarea.placeholder = 'Product';
        textarea.addEventListener('keydown', (event) => {
            if(event.key == 'Enter' && actuallyPlaying) {
                let guess = parseInt(textarea.value);
                if(guess == Math.pow(number, 2)) {
                    correctNum++;
                    color(true);
                    time = parseFloat(time) + 7;
                } else {
                    incorrectNum++;
                    color(false);
                }
                number = findNumber();
                p.innerHTML = `${number}<sup style="font-size: 1rem; vertical-align: 2rem;"> <span style="font-size: 2rem;">2</span></sup>`;
                setTimeout(() => {
                    textarea.value = '';
                },10);
            }
        });
    } else if(game == 'm') {
        let numberArr = findNumber();
        p.innerHTML = `${numberArr[0]} * ${numberArr[1]}`;
        textarea.placeholder = 'Product';
        textarea.addEventListener('keydown', (event) => {
            if(event.key == 'Enter' && actuallyPlaying) {
                let guess = parseInt(textarea.value);
                if(guess == numberArr[0] * numberArr[1]) {
                    correctNum++;
                    color(true);
                    time = parseFloat(time) + 7;
                } else {
                    incorrectNum++;
                    color(false);
                }
                numberArr= findNumber();
                p.innerHTML = `${numberArr[0]} * ${numberArr[1]}`;
                setTimeout(() => {
                    textarea.value = '';
                },10);
            }
        });
    }

    timer.innerHTML = 3;
    textarea.readOnly = true;
    textarea.focus();
    setTimeout(() => {
        timer.innerHTML = 2;
        setTimeout(() => {
            timer.innerHTML = 1;
            setTimeout(() => {
                textarea.readOnly = false;
                actuallyPlaying = true;
                textarea.focus();
    let timeUpdate = setInterval(() => {
        timer.innerHTML = time;
        time = (time - 0.1).toFixed(1);
        if(time <= 0) {
            playing = false;
            textarea.remove();
            timer.remove();
            clearInterval(timeUpdate);
            p.innerHTML = `Correct: ${correctNum},   Incorrect: ${incorrectNum}`;
        }
    },100);

    },1000);
    },1000);
    },1000);

}

let color = (correct) => {
    let shader = document.createElement('div');
    shader.classList.add('shader');
    body.appendChild(shader);
    if(correct) {
        shader.style.backgroundColor = 'rgb(60, 100, 60)';
    } else {
        shader.style.backgroundColor = 'rgb(100, 60, 60)';
    }

    shader.classList.add('fadeIn');
    setTimeout(() => {
        shader.classList.remove('fadeIn');
        shader.classList.add('fadeOut');
        setTimeout(() => {
            shader.remove();
        },150);
    },150);
}

let meanDeviation = (arr) => {
    let mean = 0;
    arr.forEach(num => {
        mean += num;
    });
    mean /= arr.length;
    let meanDeviation = 0;
    for(let i = 0; i < arr.length; i++) {
        meanDeviation += Math.abs(mean-arr[i]);
    }
    meanDeviation /= arr.length;
    return meanDeviation;
}