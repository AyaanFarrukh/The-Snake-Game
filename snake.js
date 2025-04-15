let snakeBody = [{
    x: 5,
    y: 5
},{
    x: 4,
    y: 5
},{
   x: 3,
   y: 5
}];

let directions = {
    x: 1,
    y: 0
};

let goldenFoodPosition;
let foodPosition;
let endBox = document.querySelector('.playagain');
let againButton = document.querySelector('.btn-again');
let msg = document.querySelector('.msg');
let scoreMsg = document.querySelector('.score');
let playButton = document.querySelector('.play-btn');
let startBox = document.querySelector('.startbox');
let x = 200;
let play = 10000;
let scoreCounter = 0;
let highestScore = 0;
const eatSound = new Audio("./audios/bite.mp3");
let goldenFoodIndex;
let goldenInterval;

function snakeBodyDisplay() {
    let cells = document.querySelectorAll('.cell');

    cells.forEach((cell,i) => {
        foodIndex = foodPosition.y * 20 + foodPosition.x;
        if(goldenFoodPosition) {
            goldenFoodIndex = goldenFoodPosition.y * 20 + goldenFoodPosition.x;
        }

        if(i !== foodIndex && i !== goldenFoodIndex) {
            cell.style.backgroundColor = "";
            cell.style.backgroundImage = "";
        }
    });

    //rendering snake moving:
    snakeBody.forEach((bodyPart,i) => {
    let index = bodyPart.y * 20 + bodyPart.x; //rendering index
    cells[index].style.backgroundColor = "green";

     if(i === 0 && directions.x === 1) { //rendering rounded corners of new heads of snake
         cells[index].style.borderTopRightRadius = "10px";
         cells[index].style.borderBottomRightRadius = "10px";
    } else if(i === 0 && directions.x === -1) {
         cells[index].style.borderTopLeftRadius = "10px";
         cells[index].style.borderBottomLeftRadius = "10px";

     } else if(i === 0 && directions.y === 1) {
         cells[index].style.borderBottomRightRadius = "10px";
         cells[index].style.borderBottomLeftRadius = "10px";

     } else if(i === 0 && directions.y === -1) {
         cells[index].style.borderTopRightRadius = "10px";
        cells[index].style.borderTopLeftRadius = "10px";
     } else {
         cells[index].style.borderRadius = "0px";
     }

    }) 

};

foodAppear();
snakeBodyDisplay();

function foodAppear() {
    while(true) {
        const x = Math.floor(Math.random()*20);
        const y = Math.floor(Math.random()*20);
        //check if food on snake
        const isOnSnake = snakeBody.some(part => part.x === x && part.y === y);
        if(!isOnSnake) {
            foodPosition = {x,y};
            let index = y * 20 + x; 
            let cells = document.querySelectorAll('.cell');
            cells[index].style.backgroundImage = "url('https://freesvg.org/img/simple-apple.png')";
            cells[index].style.backgroundSize = "60%";
            cells[index].style.backgroundRepeat = "no-repeat";
            cells[index].style.backgroundPosition = "center";
            break;
        }
    }
}

function GoldenfoodAppear() {
    while(true) {
        const x = Math.floor(Math.random()*20);
        const y = Math.floor(Math.random()*20);
        //check if food on snake
        const isOnSnake = snakeBody.some(part => part.x === x && part.y === y);
        if(!isOnSnake && x !== foodPosition.x && y !== foodPosition.y) {
            goldenFoodPosition = {x,y};
            let index = y * 20 + x; 
            let cells = document.querySelectorAll('.cell');
            cells[index].style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/2298/2298998.png')";
            cells[index].style.backgroundSize = "60%";
            cells[index].style.backgroundRepeat = "no-repeat";
            cells[index].style.backgroundPosition = "center";
            break;
        }
    }
}

function gameEndMsg() {
    endBox.classList.add('js-endbox');
}

function moveSnake() {

    //checking if snake covers all area? u win:) nice>
    if(snakeBody.length === 400) {
        clearInterval(gameInterval);
        msg.innerHTML = "You Won!"
        if(scoreCounter > highestScore) { //scores checking
            highestScore = scoreCounter;
        };
        scoreMsg.innerHTML = `Your Score: ${scoreCounter} | Highest Score: ${highestScore}`;
        gameEndMsg();
    }

let head = snakeBody[0];

let newHead = {
    x: head.x + directions.x,
    y: head.y + directions.y
};

snakeBody.forEach((bodyPart) => {
    if(newHead.x === bodyPart.x && newHead.y === bodyPart.y) { //check body collision
        if(scoreCounter > highestScore) { //scores checking
            highestScore = scoreCounter;
        };
        scoreMsg.innerHTML = `Your Score: ${scoreCounter} | Highest Score: ${highestScore}`;
        gameEndMsg();
        clearInterval(gameInterval); 
        play = 30000;
        clearInterval(goldenInterval);
        scoreCounter = 0;
        return;
    }
   });

    // Check wall collision
if (
    newHead.x < 0 || newHead.x >= 20 || // horizontal 
    newHead.y < 0 || newHead.y >= 20    // vertical 
) {
    if(scoreCounter > highestScore) {
        highestScore = scoreCounter;
    };
    scoreMsg.innerHTML = `Your Score: ${scoreCounter} | Highest Score: ${highestScore}`;
    gameEndMsg();
    clearInterval(gameInterval);
    play = 30000;
    clearInterval(goldenInterval);
    scoreCounter = 0;
    return;
}

if(newHead.x === foodPosition.x && newHead.y === foodPosition.y ) { //snake eat food
    snakeBody.unshift(newHead);
    eatSound.play();
    setTimeout(() => {
        eatSound.pause();
        eatSound.currentTime = 0;
    },1000)
    foodAppear();
    x -= 5; //speed update
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake,x);
    scoreCounter++; //score updates
    if(scoreCounter > highestScore) {
        highestScore = scoreCounter;
    };

} else {
    snakeBody.unshift(newHead);
    snakeBody.pop();
}

if(goldenFoodPosition) { //added the golden feature
    if(newHead.x === goldenFoodPosition.x && newHead.y === goldenFoodPosition.y ) {
        eatSound.play();
        setTimeout(() => {
            eatSound.pause();
            eatSound.currentTime = 0;
        },1000)
        snakeBody = [snakeBody[0]];
           play = 60000;
           clearInterval(goldenInterval);
          goldenInterval = setInterval(() => {
           GoldenfoodAppear();
           },play);
           goldenFoodPosition = {x: null, y: null};
        }
}



snakeBodyDisplay();
}

document.body.addEventListener('keydown', (event) => {
   
    if(event.key === "ArrowRight" && directions.x !== -1) {
        directions = {
            x: 1,
            y: 0
        }
    }
    if(event.key === "ArrowLeft" && directions.x !== 1) {
        directions = {
            x: -1,
            y: 0
        }
    }
    if(event.key === "ArrowUp" && directions.y !== 1) {
        directions = {
            x: 0,
            y: -1
        }
    }
    if(event.key === "ArrowDown" && directions.y !== -1) {
        directions = {
            x: 0,
            y: 1
        }
    }
});

let gameInterval;

againButton.addEventListener('click', () => {
    snakeBody = [{
        x: 5,
        y: 5
    },{
        x: 4,
        y: 5
    },{
       x: 3,
       y: 5
    }];

    directions = {
        x: 1,
        y: 0
    };
    x = 200;
    snakeBodyDisplay();
    foodAppear();
    GoldenfoodAppear();
    gameInterval = setInterval(moveSnake,x);
    endBox.classList.remove('js-endbox');
    play = 30000;
    clearInterval(goldenInterval);
    goldenInterval = setInterval(() => {
        GoldenfoodAppear();
        },play)
});

playButton.addEventListener('click',() => {
startBox.classList.add('js-startbox');
gameInterval = setInterval(moveSnake,x);
});

goldenInterval = setInterval(() => {
GoldenfoodAppear();
},play)