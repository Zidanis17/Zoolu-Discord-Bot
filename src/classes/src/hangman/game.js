class hangmanGame{
    constructor(message ,players, words){
        this.message = message;
        this.players = players;
        this.words = words;
        this.lettersGuessed = [];
        this.wrongGuesses = 0
        this.wrongGuesses = 6
        this.hiddenWord = ''
        this.wordGuessed = false
    }


    getWord(){
        return this.words.join(' ') 
    }

    getWrongGuesses(){
        return this.wrongGuesses
    }

    getMessage(){
        return this.message
    }

    getPlayers(){
        return this.players
    }

    getLettersGuessed(){
        return this.lettersGuessed
    }

    
    UpdateHiddenWords(){
        this.wordGuessed = true
        let hiddenWordsArr = []
        let newhiddenWord = ''
        for(const word of this.words){
            for(const letter of word){
                let letterFound = false
                for(const guessedLetter of this.lettersGuessed){
                    if(guessedLetter.toLowerCase() === letter.toLowerCase()){
                        letterFound = true
                    }
                }
                if(letterFound === true){
                    newhiddenWord += letter
                }else{
                    newhiddenWord += '_'
                    this.wordGuessed = false
                }
            }
            hiddenWordsArr.push(newhiddenWord)
            newhiddenWord = ''
        }

        this.hiddenWord = hiddenWordsArr.join(' ')
    }
}

module.exports = hangmanGame