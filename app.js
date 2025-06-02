const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const router = require("./router/router");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('./swagger-output.json');
const cors = require("cors")
require("dotenv").config();
require("./DB/db");

const birthdayNotificationJob = require("./utills/birthdayNotifier");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

io.on("connection", (socket) => {
  console.log("New user joined:", socket.id);
  socket.on("disconnect", () => {
    console.log("User left:", socket.id);
  });
});

birthdayNotificationJob(io);

app.set("io", io);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/", router);

app.use(cors({
  origin: "*", // Burada da frontend URL ola bilər (məsələn, "http://localhost:3000")
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*const express = require("express");
const app = express();
const port = 3000;
const router = require("./router/router");

require("dotenv").config();
require("./DB/db");

app.use(express.json());
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});*/