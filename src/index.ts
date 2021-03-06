import * as WebSocket from 'ws';
const PORT = Number(process.env.PORT) || 8081;

const players: any = {};


const wss = new WebSocket.Server({ port: PORT });
console.log(`Listening on port [${PORT}]`);

const connections: any[] = [];

wss.on('connection', function connection(ws) {
    connections.push(ws);
    ws.on('message', function incoming(message: string) {
        const player = JSON.parse(message);
        players[player.id] = player;
        (ws as any).playerId = player.id;
    });

    ws.on('close', () => {
        delete players[(ws as any).playerId];
    });

    ws.send(JSON.stringify(Object.values(players)));
});

setInterval(() => {
    const _players = JSON.stringify(Object.values(players));
    // console.log(`GameState:`, JSON.stringify(players, null, '\t'));
    connections.forEach((ws) => {
        ws.send(_players);
    });
}, 100);
