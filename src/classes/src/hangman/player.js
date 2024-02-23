class Player {
    constructor(player){
        this.name = player.displayName;
        this.id = player.id;
        this.tries = 0;
        this.lettersGuessed = []
    }

    getTries(){
        return this.tries
    }

    changeTries(number){
        return this.tries -= number
    }

    addLetter(letter){
        return this.lettersGuessed.push(letter)
    }
}

module.exports = Player