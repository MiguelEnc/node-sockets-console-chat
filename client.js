const { Socket } = require("net");
const rl = require("readline");
const { error, END } = require("./utilities");

const socket = new Socket();
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const connect = (host, port) => {
    console.log(`Connecting to ${host}:${port}`);

    socket.connect({ host, port });
    socket.setEncoding("utf-8");
    socket.on("connect", () => {
        console.log("Connected");

        readline.question("Enter chat username: ", (username) => {
            socket.write(username);
            console.log(`Type any message to send it. Type ${END} to finish.`);
        });

        readline.on("line", (message) => {
            socket.write(message);
            if (message === END) {
                socket.end();
                console.log("Disconnected");
            }
        });

        socket.on("data", (data) => console.log(data));
    });

    // Ctrl + C exit handler.
    readline.on("SIGINT", () => {
        readline.question("Are you sure you want to exit? ", (answer) => {
            if (answer.match(/^y(es)?$/i)) {
                readline.close();
                socket.end();
            }
        });
    });

    socket.on("close", () => process.exit(0));
    socket.on("error", (err) => error(err.message));
};

const main = () => {
    if (process.argv.length !== 4) {
        error(`Usage: node ${__filename} host port`);
    }

    let [, , host, port] = process.argv;
    if (isNaN(port)) {
        error(`Invalid port ${port}`);
    }

    port = Number(port);
    connect(host, port);
};

main();
