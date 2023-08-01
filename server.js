const { Server } = require("net");

const server = new Server();
const connections = [];

server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`New connection from ${remoteSocket}`);
    connections.push(socket);

    // socket.setEncoding("utf-8");
    socket.on("data", (message) => {
        console.log(`[${remoteSocket}]: ${message}`);

        connections.filter(((peer) => {
            const socketAddress = `${peer.remoteAddress}:${peer.remotePort}`;
            return socketAddress !== remoteSocket;
        })).forEach((peer) => peer.write(message));
    });

    socket.on("close", () => {
        console.log(`Connection with ${remoteSocket} closed.`);
    });
});

server.listen({ port: 8000, host: "0.0.0.0" }, () => {
    console.log("Listening on port 8000");
});
