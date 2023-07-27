const { Socket } = require("net");
const rl = require("readline");

const socket = new Socket();
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question('Enter chat username: ', (username) => {
    socket.connect({ host: "localhost", port: 8000 });
    socket.setEncoding("utf-8");

    readline.on("line", (input) => {
        socket.write(`${username}> ${input}`);
    });
    
});

// Ctrl + C exit handler.
readline.on('SIGINT', () => {
    readline.question('Are you sure you want to exit? ', (answer) => {
        if (answer.match(/^y(es)?$/i)) {
            readline.close();
            socket.destroy();
        }
    });
});

socket.on("data", (data) => console.log(data));
