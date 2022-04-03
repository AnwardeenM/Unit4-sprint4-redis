const { createClient } = require("redis");

const Client = createClient({ url: "redis://localhost:6379" });


Client.on("error", function (err) {

  console.log(err.message);
});

module.exports = Client;

