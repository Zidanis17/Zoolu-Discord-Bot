class Player{
    constructor(player, pieceType, emoji){
        this.name = player.displayName;
        this.id = player.id;
        this.piece = pieceType;
        this.emoji = emoji;
    }
}

module.exports = Player;