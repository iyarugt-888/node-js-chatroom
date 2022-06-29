const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const testHash = "channel-name"
const testIdentifier = "channel-identifier"

const chatrooms = [
    {members: [], hash: testHash, data: [
        {type: 'text', nickname:"test", identifier: testIdentifier, message: 'breh', timestamp: Date.now()}
    ]}
]

app.get('/', (req, res) => {
res.send('Invalid Request');
});

app.get('/api/chatrooms', (req, res) => {
    //const chatrooms_valid = chatrooms.filter(chatroom => chatroom.members.length > 0);
    res.send(chatrooms);
})

app.get('/api/chatrooms/:hash/:identifier', (req, res) => {
    const chatroom = chatrooms.find(c => c.hash === req.params.hash);
    if (!chatroom) res.status(200).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
    if (chatroom) {
        const member = chatroom.members.find(c => c === req.params.identifier)
        if (!member) {
            for (chat_room in chatrooms) {
                const chat_member = chatrooms[chat_room].members.find(c => c === req.params.identifier)
                if (chat_member) {
                    var index = chatrooms[chat_room].members.indexOf(chat_member);
                    chatrooms[chat_room].members.splice(index);
                }
            }
            chatroom.members.push(req.params.identifier);
        }
        res.send(chatroom);
    }
})

app.put('/api/chatrooms/:hash/:identifier/:message/:nickname', (req, res) => {
    const chatroom = chatrooms.find(c => c.hash === req.params.hash);
    const identifier = req.params.identifier;
    const message = req.params.message;
    const nickname = req.params.nickname;
    if (!chatroom) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>');
    chatroom.data.push({type: 'text', identifier: identifier, message: message, timestamp: Date.now(), nickname: nickname})
    res.send(chatroom);
});

app.post('/api/chatrooms', (req, res)=> {
    console.log(req.body)
    const chatroom = {members: [], hash: req.body.hash, data: []};
    console.log(chatroom);
    chatrooms.push(chatroom);
    res.send(chatroom);
});


const port = 25565;
console.log(testHash);
app.listen(port, () => console.log(`Listening on port ${port}..`));