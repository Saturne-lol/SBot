const {ChatInputCommandInteraction, Client, EmbedBuilder} = require("discord.js");
const axios = require("axios")

const emojisBadge = [
    {id: "owner.png", emoji:"<:owner:1255929912272093316>"},
    {id: "premium.png", emoji:"<:premium1:1255929916667596810>"},
    {id: "premium2.png", emoji:"<:premium2:1255929917745528947>"},
    {id: "member.png", emoji:"<:member:1255929910833188984>"},
    {id: "beta.png", emoji:"<:beta:1255929909184823307>"},
    {id: "dev.png", emoji:"<:dev:1255929907477872660>"},
    {id: "booster.png", emoji:"<:booster:1255929904206446602>"},
]

module.exports = {
    name: "me",
    description: "Envoie mon profile",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        await interaction.deferReply()
        const profile = await client.prisma.setting.findUnique({
            where: {account_id: interaction.user.id}
        })

        if (!profile) return interaction.editReply({content: "Vous n'avez pas de profile."})

        const views = await client.prisma.view.count({
            where: {profile_id: profile.account_id}
        })

        const badgesList = await axios.get(`https://saturne.lol/api/profile/get-badges?username=${profile.url}`,{timeout: 5000}).then(r => r.data).catch((e) => {
            console.log(e)
            return []
        })
        const badges = badgesList.filter(b => emojisBadge.find(e => e.id === b.image)).map(b => emojisBadge.find(e => e.id === b.image).emoji).join(" • ")


        console.log("ok 3")

        const embed = new EmbedBuilder()
            .setTitle(`${profile.username} - Saturne.lol`)
            .setURL(`https://saturne.lol/`)
            .setDescription(`<:links:1256187129500012586> : https://saturne.lol/${profile.url}\n<:view:1256187128119824457> : vues - ${views}\n\n${badges}`)
            .setThumbnail(`https://cdn.saturne.lol/file/profile/${profile.account_id}`)
            .setColor("#2C2F33")

        return interaction.editReply({embeds: [embed]})
    },
};