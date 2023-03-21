const readlineSync = require('readline-sync');

class Board {

    board;
    corners;
    playerPositions;
    currentDirection;
    isFood; // tells if the food is present on the board

    constructor(){
        this.isFood = false;
        this.board = []; 
        this.corners = []; // this will be exported too to make easier the game controllers since we have established the edges
        this.playerPositions = [] // positions occupied by the player
        this.currentDirection = "d"; // right is the default direction

        // basic 20x20 matrix
        for (let i = 0; i < 20; i++) {
            this.board[i] = [];
            for (let j = 0; j < 20; j++) {
                // edges
                if (i === 0 || i === 19){
                    this.board[i][j] = '-';
                    this.corners.push([i, j]);
                } 
                else if (j === 0 || j === 19){
                    this.board[i][j] = '|';
                    this.corners.push([i, j]);
                } 
                // snake
                else if (i === 10 && j === 10){
                    this.board[i][j] = '>';
                    this.playerPositions.push([i, j]);
                } 
                else this.board[i][j] = ' ';
            }
        }
        this.genFood();
    }

    stringify(){
        // stringed matrix that is more readble for the user
        let output = "" 
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                output+=this.board[i][j]
            }
            output+="\n"
        }
        return output;
    }

    start(){
        // actual gameplay
        while(true){
            console.clear();
            console.log(this.stringify()); // prints current position
            this.userInput(); // take the input and make the move
            this.checkGameOver();
            this.genFood(); // check if the food is been eaten
        }
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
        this.isFood = true;
    }

    checkGameOver(){
        // to do
    }

    move(direction){
        // is taken for granted that a player can't move in the opposite direction but only in the other three
        switch(direction){
            case "w":
                if(this.currentDirection === "s") break;
                // if there is just the head
                if(this.playerPositions.length === 1){
                    let pos = this.playerPositions[0];
                    this.board[pos[0]][pos[1]] = " ";
                    pos = [--pos[0], pos[1]];
                    this.playerPositions[0] = [pos[0], pos[1]];
                    this.board[pos[0]][pos[1]] = "^";
                    this.currentDirection = "w";
                    break;
                }

            case "a":
                if(this.currentDirection === "d") break;
                //if the snake ate an apple 
                
                // if there is just the head
                if(this.playerPositions.length === 1){
                    let pos = this.playerPositions[0];
                    this.board[pos[0]][pos[1]] = " ";
                    pos = [pos[0], --pos[1]];
                    this.playerPositions[0] = [pos[0], pos[1]];
                    this.board[pos[0]][pos[1]] = "<";
                    this.currentDirection = "a";
                    break;
                }

            case "s":
                if(this.currentDirection === "w") break;
                // if there is just the head
                if(this.playerPositions.length === 1){
                    let pos = this.playerPositions[0];
                    this.board[pos[0]][pos[1]] = " ";
                    pos = [++pos[0], pos[1]];
                    this.playerPositions[0] = [pos[0], pos[1]];
                    this.board[pos[0]][pos[1]] = "v";
                    this.currentDirection = "s";
                    break;
                } 

            case "d":
                if(this.currentDirection === "a") break;
                // if there is just the head
                if(this.playerPositions.length === 1){
                    let pos = this.playerPositions[0];
                    this.board[pos[0]][pos[1]] = " ";
                    pos = [pos[0], ++pos[1]];
                    this.playerPositions[0] = [pos[0], pos[1]];
                    this.board[pos[0]][pos[1]] = ">";
                    this.currentDirection = "d";
                    break;
                }
                
        }
    }

    userInput() {
        let input;
        input = readlineSync.question('Make a move (WASD): ');
        if (input !== "w" &&  input !== "a" && input !== "s" && input !== "d") {
          console.log('Invalid input. Please enter a valid input.');
          this.userInput();
        }
        else this.move(input);
      }
}

module.exports = {
    Board: Board
  };
  