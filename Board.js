class Board {

    board;
    corners;
    playerPositions;
    currentDirection;
    isFood = false; // tells if the food is present on the board

    constructor(){
        this.board = []; 
        this.corners = []; // this will be exported too to make easier the game controllers since we have established the edges
        this.playerPositions = [] // positions occupied by the player
        this.currentDirection = "R"; // right is the default direction

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
        this.isFood = true; 
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
        setInterval(() => {
            console.clear();
            console.log(this.stringify()); // prints current position
            // user input
            this.checkGameOver();
            this.genFood(); // check if the food is been eaten
        }, 500)
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
        this.board[x][y] = "@"
    }

    checkGameOver(){
        // to do
    }

    move(direction){
        // is taken for granted that a player can't move in the opposite direction but only in the other three
        switch(direction){
            // to do
            case "R":
                break;
            case "L":
                break;
            case "U":
                break;
            case "D":
                break;  
        }
    }
}

module.exports = {
    Board: Board
  };
  