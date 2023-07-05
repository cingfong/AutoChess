var liveServer = require("live-server");

var params = {
  port: 81,
  host: "0.0.0.0",
  open: false,
  file: "./index.html",
  middleware: [
    function (req, res, next) {
      next();
    },
  ],
};
liveServer.start(params);
