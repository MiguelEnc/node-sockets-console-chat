const END = 'END';

const error = (message) => {
  console.error(message);
  process.exit(1);
}

module.exports = {
  END,
  error,
}