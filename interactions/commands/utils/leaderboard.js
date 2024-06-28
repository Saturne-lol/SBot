const {ChatInputCommandInteraction, Client, EmbedBuilder} = require("discord.js");
module.exports = {
    name: "leaderboard",
    description: "Envoie le leaderboard",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const leaderView = await client.prisma.view.groupBy({
            by: ["profile_id"],
            _count: { id: true },
            orderBy: {
                _count: {
                    id: "desc"
                }
            },
            take: 10,
        })

        const urls = (await client.prisma.setting.findMany({
            where: {
                account_id: {
                    in: leaderView.map(l => l.profile_id)
                }
            }
        })).sort((a, b) => leaderView.findIndex(l => l.profile_id === a.account_id) - leaderView.findIndex(l => l.profile_id === b.account_id))

        const leader = leaderView.map((l, i) => {
            return `${i+1}. **[/${urls[i].url}](https://saturne.lol/${urls[i].url})** - ${l._count.id} vues`
        }).join("\n")

        const embed = new EmbedBuilder()
            .setTitle("Leaderboard")
            .setDescription(leader)
            .setColor("#2C2F33")
            .setThumbnail("https://cdn.saturne.lol/file/profile/0")

        interaction.reply({embeds: [embed]})
    },
};