const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");

const tileCount = 16;
let tiles = [];

let isPlaying = false;
let timeInterval = null;
let time = 0;

const dragged = {
    el : null,
    class : null,
    index : null
}


// functions
function setGame(){
    isPlaying = true;
    container.innerHTML ="";

    tiles = createImageTiles();
    tiles.forEach(tile => container.appendChild(tile));
    time = 0;
    clearInterval(timeInterval);
    setTimeout(()=>{
        shuffle(tiles).forEach(tile => container.appendChild(tile));
        timeInterval = setInterval(() => {
            time ++;
            playTime.innerText = time;
        }, 1000);
    }, 4000);
}


function checkStatus(){
    if(!isPlaying) return;
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index);
    if(unMatchedList.length === 0){
        // game finished
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval);
    }
}

function createImageTiles(){
    const tempArray = [];
    Array(tileCount).fill().forEach((_ , i) => {
        const li = document.createElement("li");
        li.setAttribute("data-index" , i );
        li.setAttribute("draggable",  "true");
        li.classList.add(`list${i}`);
        tempArray.push(li);
    })
    return tempArray;
}


function shuffle(array){
    let index = 0;
    while(index < array.length){
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
        index ++;
    }

    return array;
}


////////////////////////////////////
// event

container.addEventListener("dragstart", event => {
    if(!isPlaying) return;

    const obj = event.target;
    dragged.el = obj;
    dragged.class = event.target.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);
})

container.addEventListener("dragover", event => {
    if(!isPlaying) return;
    event.preventDefault();
})

container.addEventListener("drop", event => {
    if(!isPlaying) return;
    const obj = event.target;

    if(obj.className !== dragged.class){
        let originPlace;
        let isLast = false;

        if(dragged.el.nextSibling){
            originPlace = dragged.el.nextSibling;
        } else{
            originPlace = dragged.el.previousSibling;
        }
        
        const droppedIndex = [...obj.parentNode.children].indexOf(obj);
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
        isLast ? originPlace.after(obj) : originPlace.before(obj);
    }
    checkStatus();
})

startButton.addEventListener("click", () => {
    setGame();
    gameText.style.display = "none";
    container.style.display = "grid";
})
