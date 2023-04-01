const readlineSync = require('readline-sync');

process.stdin.setRawMode();

class Board {

    score;
    board;
    playerPositions;
    currentDirection;
    isFood; // tells if the food is present on the board
    gameOver;


    constructor(){
        this.score = -1;
        this.gameOver = false;
        this.isFood = false;
        this.board = []; 
        this.playerPositions = [] // positions occupied by the player
        this.currentDirection = "d"; // right is the default direction

        // basic 20x20 matrix
        for (let i = 0; i < 20; i++) {
            this.board[i] = [];
            for (let j = 0; j < 20; j++) {
                // edges
                if (i === 0 || i === 19){
                    this.board[i][j] = '-';
                } 
                else if (j === 0 || j === 19){
                    this.board[i][j] = '|';
                } 
                // snake
                else if (i === 10 && j === 10){
                    this.playerPositions.push([i, j]);
                } 
                else this.board[i][j] = ' ';
            }
        }
        this.genFood();
    }

    // renders the player in the matrix
    render(){
        switch (this.currentDirection){
            case "w":
                this.board[this.playerPositions[0][0]][this.playerPositions[0][1]] = "^";
                break;
            case "a":
                this.board[this.playerPositions[0][0]][this.playerPositions[0][1]] = "<";
                break;
            case "s":
                this.board[this.playerPositions[0][0]][this.playerPositions[0][1]] = "v";
                break;
            case "d":
                this.board[this.playerPositions[0][0]][this.playerPositions[0][1]] = ">";
                break;
        }
       
        for(let i = 1; i < this.playerPositions.length; i++){
            this.board[this.playerPositions[i][0]][this.playerPositions[i][1]] = "0";
        }
    }

    stringify(){
        // stringed matrix that is more readble for the user
        let output = "" 
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                output+=this.board[i][j];
            }
            output+="\n";
        }
        return output;
    }

    start(){
        // actual gameplay
        while(this.gameOver === false){
            console.clear();
            console.log('*** Snake.js ***\n');
            console.log("Score: "+this.score);
            this.render();
            console.log(this.stringify()); // prints current position
            this.userInput(); // takes the input and make the move
            this.checkGameOver();
            this.genFood(); // checks if the food is been eaten
        }
        console.log("Game over! Thanks for playing!");
        return;
    }

    genFood(){
        if(this.isFood === true) return;
        // corners are excluded
        let x = Math.floor(Math.random() * (18 - 2 + 1)) + 2;
        let y = Math.floor(Math.random() * (18 - 2 + 1)) + 2;
        // the food can't be in teh same position of the snake
        while ([x, y] in this.playerPositions){
            x = Math.floor(Math.random() * (18 - 2 + 1)) + 2;
            y = Math.floor(Math.random() * (18 - 2 + 1)) + 2;
        }
        this.board[x][y] = "@";
        this.score+= 1;
        this.isFood = true;
    }

    checkGameOver(){
        // corners check
        const head = [this.playerPositions[0][0], this.playerPositions[0][1]];
        if (head[0] === 0 || head[0] === 19) this.gameOver = true;
        else if (head[1] === 0 || head[1] === 19) this.gameOver = true;

        // body check
        for(let i = 1; i < this.playerPositions.length; i++){
            const body = this.playerPositions[i];
            // since arrays work by reference, to check if values are equal i check the values of the stringify values
            if (JSON.stringify(head) === JSON.stringify(body)) this.gameOver = true;
        }
    }

    move(direction){
        // is taken for granted that a player can't move in the opposite direction but only in the other three
        switch(direction){
            case "w":
                if(this.currentDirection === "s") break;

                //if the snake ate the food, a new entry in player positions is made and the head is pushed while before the head a new part of the body spawns (0)
                if(this.board[this.playerPositions[0][0]-1][this.playerPositions[0][1]] === "@"){
                    const head = this.playerPositions[0];
                    this.playerPositions.shift();
                    this.playerPositions.unshift([head[0], head[1]]); // adds new body
                    this.playerPositions.unshift([head[0]-1, head[1]]); // adds new head
                    this.currentDirection = "w";
                    this.isFood = false;
                    break;
                }

                // if there is a body attached, the head goes up by one, a new part of the body spawns, and the tail is popped by one
                if(this.playerPositions.length > 1){
                    const head = [this.playerPositions[0][0], this.playerPositions[0][1]];
                    const tail = [this.playerPositions[this.playerPositions.length-1][0], this.playerPositions[this.playerPositions.length-1][1]]
                    this.board[tail[0]][tail[1]] = " ";
                    this.playerPositions.shift();
                    this.playerPositions.unshift([head[0], head[1]]); // adds new body
                    this.playerPositions.unshift([head[0]-1, head[1]]); // adds new head 
                    // deletes latest piece of the tail
                    const tempArray = [];
                    for(let i = 0; i < this.playerPositions.length - 1; i++){
                        tempArray.push(this.playerPositions[i]);
                    }
                    this.playerPositions = tempArray;
                    this.currentDirection = "w"; 
                    break;
                }

                // if there is just the head
                if(this.playerPositions.length === 1){
                    const pos = this.playerPositions[0];
                    this.board[pos[0]][pos[1]] = " ";
                    this.playerPositions[0] = [pos[0]-1, pos[1]];
                    this.currentDirection = "w";
                    break;
                }

            case "a":
                if(this.currentDirection === "d") break;

                 //if the snake ate the food, a new entry in player positions is made and the head is pushed while before the head a new part of the body spawns (0)
                 if(this.board[this.playerPositions[0][0]][this.playerPositions[0][1]-1] === "@"){
                    this.board[this.playerPositions[0][0]][this.playerPositions[0][1]-1] = " ";
                    const head = this.playerPositions[0];
                    this.playerPositions.shift();
                    this.playerPositions.unshift([head[0], head[1]]); // adds new body
                    this.playerPositions.unshift([head[0], head[1]-1]); // adds new head
                    this.currentDirection = "a";
                    this.isFood = false;
                    break;
                }

                // if there is a body attached, the head goes up by one, a new part of the body spawns, and the tail is popped by one
                if(this.playerPositions.length > 1){
                    const head = [this.playerPositions[0][0], this.playerPositions[0][1]];
                    const tail = [this.playerPositions[this.playerPositions.length-1][0], this.playerPositions[this.playerPositions.length-1][1]]
                    this.board[tail[0]][tail[1]] = " ";
                    this.playerPositions.shift();
                    this.playerPositions.unshift([head[0], head[1]]); // adds new body
                    this.playerPositions.unshift([head[0], head[1]-1]); // adds new head 
                    // deletes latest piece of the tail
                    const tempArray = [];
                    for(let i = 0; i < this.playerPositions.length - 1; i++){
                        tempArray.push(this.playerPositions[i]);
                    }
                    this.playerPositions = tempArray;
                    this.currentDirection = "a"; 
                    break;
                }

                // if there is just the head
                if(this.playerPositions.length === 1){
                    let pos = this.playerPositions[0];
                    this.board[pos[0]][pos[1]] = " ";
                    this.playerPositions[0] = [pos[0], pos[1]-1];
                    this.currentDirection = "a";
                    break;
                }

                

            case "s":
                if(this.currentDirection === "w") break;

                 //if the snake ate the food, a new entry in player positions is made and the head is pushed while before the head a new part of the body spawns (0)
                 if(this.board[this.playerPositions[0][0]+1][this.playerPositions[0][1]] === "@"){
                    const head = this.playerPositions[0];
                    this.playerPositions.shift();
                    this.playerPositions.unshift([head[0], head[1]]); // adds new body
                    this.playerPositions.unshift([head[0]+1, head[1]]); // adds new head
                    this.currentDirection = "s";
                    this.isFood = false;
                    break;
                }

                // if there is a body attached, the head goes up by one, a new part of the body spawns, and the tail is popped by one
                if(this.playerPositions.length > 1){
                    const head = [this.playerPositions[0][0], this.playerPositions[0][1]];
                    const tail = [this.playerPositions[this.playerPositions.length-1][0], this.playerPositions[this.playerPositions.length-1][1]]
                    this.board[tail[0]][tail[1]] = " ";
                    this.playerPositions.shift();
                    this.playerPositions.unshift([head[0], head[1]]); // adds new body
                    this.playerPositions.unshift([head[0]+1, head[1]]); // adds new head 
                    // deletes latest piece of the tail
                    const tempArray = [];
                    for(let i = 0; i < this.playerPositions.length - 1; i++){
                        tempArray.push(this.playerPositions[i]);
                    }
                    this.playerPositions = tempArray;
                    this.currentDirection = "s"; 
                    break;
                }

                // if there is just the head
                if(this.playerPositions.length === 1){
                    let pos = this.playerPositions[0];
                    this.board[pos[0]][pos[1]] = " ";
                    this.playerPositions[0] = [pos[0]+1, pos[1]];
                    this.currentDirection = "s";
                    break;
                }

            case "d":
                if(this.currentDirection === "a") break;

                 //if the snake ate the food, a new entry in player positions is made and the head is pushed while before the head a new part of the body spawns (0)
                 if(this.board[this.playerPositions[0][0]][this.playerPositions[0][1]+1] === "@"){
                    const head = this.playerPositions[0];
                    this.playerPositions.shift();
                    this.playerPositions.unshift([head[0], head[1]]); // adds new body
                    this.playerPositions.unshift([head[0], head[1]+1]); // adds new head
                    this.currentDirection = "d";
                    this.isFood = false;
                    break;
                }

                // if there is a body attached, the head goes up by one, a new part of the body spawns, and the tail is popped by one
                if(this.playerPositions.length > 1){
                    const head = [this.playerPositions[0][0], this.playerPositions[0][1]];
                    const tail = [this.playerPositions[this.playerPositions.length-1][0], this.playerPositions[this.playerPositions.length-1][1]]
                    this.board[tail[0]][tail[1]] = " ";
                    this.playerPositions.shift();
                    this.playerPositions.unshift([head[0], head[1]]); // adds new body
                    this.playerPositions.unshift([head[0], head[1]+1]); // adds new head 
                    // deletes latest piece of the tail
                    const tempArray = [];
                    for(let i = 0; i < this.playerPositions.length - 1; i++){
                        tempArray.push(this.playerPositions[i]);
                    }
                    this.playerPositions = tempArray;
                    this.currentDirection = "d"; 
                    break;
                }

                // if there is just the head
                if(this.playerPositions.length === 1){
                    let pos = this.playerPositions[0];
                    this.board[pos[0]][pos[1]] = " ";
                    this.playerPositions[0] = [pos[0], pos[1]+1];
                    this.currentDirection = "d";
                    break;
                }
            
            case "x":
                this.gameOver = true;
            
            default:
                ""
            process.exit();
        }
    }

    userInput() {
        console.log('Use WASD to move and X to exit');
        // if the player hasn't made any move, it's automatically moved in the current direction
        const key = readlineSync.keyIn('', { hideEchoBack: true, mask: '' });
        this.move(key);
    }

}

module.exports = {
    Board: Board
  };
  