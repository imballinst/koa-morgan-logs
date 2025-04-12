const axios = require("axios");

async function run() {
  const response = await axios("http://localhost:3000", {
    method: "post",
    data: {
      userId: "123",
    },
  });

  console.info(response.data);
}

run();
