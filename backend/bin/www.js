const { app, server } = require("../app");

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  `listening to ${PORT}`;
});
