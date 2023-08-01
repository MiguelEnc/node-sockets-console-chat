const { Server } = require("net");
const Publisher = require("./publisher");
const { error, END } = require("./utilities");

const HOST = "0.0.0.0";

const connections = new Map();

const listen = (port) => {
    const server = new Server();

    server.on("connection", (socket) => {
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
        console.log(`New connection from ${remoteSocket}`);
        socket.setEncoding("utf-8");

        socket.on("data", (message) => {
            if (!connections.has(socket)) {
                const participant = new Publisher(message);
                connections.forEach((val, key) => {
                    val.addSubscriber(socket);
                    participant.addSubscriber(key);
                });
                connections.set(socket, participant);
            } else if (message === END) {
                // remove socket from connections and from subscribers
                socket.end();
            } else {
                const participant = connections.get(socket);
                participant.notifySubscribers(message);
                console.log(participant.logMessage(message));
            }
        });

        socket.on("close", () => {
            console.log(`Connection with ${remoteSocket} closed.`);
        });

        socket.on("error", (err) => error(err.message));
    });

    server.listen({ port, host: HOST }, () => {
        console.log("Listening on port 8000");
    });

    server.on("error", (err) => error(err.message));
};

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
