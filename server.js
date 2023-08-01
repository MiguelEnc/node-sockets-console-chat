const { Server } = require("net");

const HOST = "0.0.0.0"
const END = 'END';

const error = (err) => {
    console.error(err);
    process.exit(1);
}

const listen = (port) => {
    const server = new Server();
    const connections = [];
    
    server.on("connection", (socket) => {
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
        console.log(`New connection from ${remoteSocket}`);
        socket.setEncoding("utf-8");
        connections.push(socket);
    
        socket.on("data", (message) => {
            console.log(`[${remoteSocket}]: ${message}`);

            if (message === END) {
                socket.end();
            }
    
            connections.filter(((peer) => {
                const socketAddress = `${peer.remoteAddress}:${peer.remotePort}`;
                return socketAddress !== remoteSocket;
            })).forEach((peer) => peer.write(message));
        });
    
        socket.on("close", () => {
            console.log(`Connection with ${remoteSocket} closed.`);
        });
    });

    server.listen({ port, host: HOST }, () => {
        console.log("Listening on port 8000");
    });
}

const main = () => {
    if (process.argv.length !== 3) {
        error(`Usage: node ${__filename} port`);
    }

    let port = process.argv[2];
    if (isNaN(port)) {
        error(`Invalid port ${port}`);
    }

    port = Number(port);
    listen(port);
};

main();