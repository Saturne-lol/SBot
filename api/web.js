const express = require('express');
const {client} = require("../index");
const cors = require('cors');

const app = express();
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/member/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).json({error: 'Missing id'})
    const m = await (await client.guilds.cache.get('1129015826410901556')?.members.fetch(req.params.id))
    if (!m) return res.status(404).json({error: 'Member not found'})
    
    const activity = m?.presence?.activities.find(a => a.type === 4)
    const resActivity = activity ? {
        text: activity.state,
        ...activity.emoji ? {
            emoji: activity.emoji.id ? `https://cdn.discordapp.com/emojis/${activity.emoji.id}.${activity.emoji.animated ? 'gif' : 'png'}` : activity.emoji.name
        } : {}
    } : null

    return res.json({
        id: m.id,
        username: m.user.username,
        displayName: m.displayName,
        avatar: m.user.displayAvatarURL({dynamic: true, extension: "png"}),
        roles: m.roles.cache.map(r => r.id),
        joinedAt: m.joinedAt,
        createdAt: m.user.createdAt,
        presence: m.presence?.status || 'offline',
        ...(resActivity ? {activity: resActivity} : {})
    })
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});