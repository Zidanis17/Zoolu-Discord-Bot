module.exports = {
  name: "gayrate",
  description: "Guess how much a person is gay",
  type: "fun",
  usage: ">gayrate <@mention>",
  execute(client, message, args, Discord) {
    let member = message.mentions.members.first() || message.member;
    let randomNum = Math.floor(Math.random() * 101);

    const embed = new Discord.EmbedBuilder()
      .setTitle(`🏳️‍🌈 Zoolu's Gayrate Counter 🏳️‍🌈`)
      .setDescription(`**${member.displayName}** is **${randomNum}%** gay`)
      .setColor("Random");

    return message.reply({ embeds: [embed] });
  }
};
