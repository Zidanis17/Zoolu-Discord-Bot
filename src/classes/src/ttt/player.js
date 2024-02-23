class Player{
    constructor(member, pieceType, emoji){
        this.name = member.displayName;
        this.id = member.user.id;
        this.piece = pieceType;
        this.emoji = emoji
    }
}

module.exports = Player