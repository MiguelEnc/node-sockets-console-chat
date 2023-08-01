const { Socket } = require("net");
const rl = require("readline");

const socket = new Socket();
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const END = 'END';

readline.question('Enter chat username: ', (username) => {
    socket.connect({ host: "localhost", port: 8000 });
    socket.setEncoding("utf-8");
    socket.write(username);

    readline.on("line", (message) => {
        socket.write(message);
        if (message === END) {
            socket.end();
        }
    });
    
});

// Ctrl + C exit handler.
readline.on('SIGINT', () => {
    readline.question('Are you sure you want to exit? ', (answer) => {
        if (answer.match(/^y(es)?$/i)) {
            readline.close();
            socket.end();
        }
    });
});

socket.on("data", (data) => console.log(data));
socket.on('close', () => process.exit(0));