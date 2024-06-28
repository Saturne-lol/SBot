const {ChatInputCommandInteraction, Client, EmbedBuilder} = require("discord.js");
module.exports = {
    name: "search",
    options: [
        {
            name: "user",
            description: "L'utilisateur à rechercher.",
            type: 6,
            required: true,
        },
    ],
    description: "Une commande d'aide, avec la liste des commandes et leurs spécificités.",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const user = interaction.options.getUser("user");
        const profile = await client.prisma.setting.findUnique({
            where: {account_id: user.id},
        })

        if (!profile) return interaction.reply("Cet utilisateur n'a pas de profil.");

        const embed = new EmbedBuilder()
            .addFields([
                {name: "<:ADstarss:1202910471141720064> - ID :", value: "`"+profile.account_id+"`", inline: true},
                {name: "<:ADauth:1202910465894653953> - Username :", value: "`"+profile.username+"`", inline: true},
                {name: "<:links:1256187129500012586> - URL : ", value: `https://saturne.lol/${profile.url}`, inline: true},
            ])
			.setThumbnail(`https://cdn.saturne.lol/file/profile/${profile.account_id}`)
            .setColor("#2c2f33")

		interaction.reply({embeds: [embed]});
    },
};