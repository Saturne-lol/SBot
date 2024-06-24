const express = require('express');
const {client} = require("../index");

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/member/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).json({error: 'Missing id'})
    return await client.guilds.cache.get('1129015826410901556')?.members.fetch(req.params.id).then(m => {
            return res.json({
                id: m.id,
                username: m.user.username,
                displayName: m.displayName,
                avatar: m.user.displayAvatarURL({dynamic: true, extension: "png"}),
                roles: m.roles.cache.map(r => r.id),
                joinedAt: m.joinedAt,
                createdAt: m.user.createdAt,
                presence: m.presence.status,
                voice: m.voice.channel ? m.voice.channel.id : null
            })
        }
    ).catch(() => {
        return res.status(404).json({error: 'Member not found'})
    })

})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});