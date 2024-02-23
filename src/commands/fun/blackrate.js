module.exports = {
    name: "blackrate",
    description: "Guess how much a person is black",
    type: "fun",
    usage: ">blackrate <@mention>",
    execute(client, message, args, Discord) {
      let member = message.mentions.members.first() || message.member;
      let randomNum = Math.floor(Math.random() * 101);

      if(member.user.id === "436120705122172928"){
        randomNum = 100
      }
  
      const embed = new Discord.EmbedBuilder()
        .setTitle(`💀 Zoolu's blackrate Counter 💀`)
        .setDescription(`**${member.displayName}** is **${randomNum}%** black`)
        .setColor("Black");
  
      return message.reply({ embeds: [embed] });
    }
  };
  