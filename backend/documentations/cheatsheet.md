# get all modules

```bash
npm init -y
npm i express jsonwebtoken bcrypt dotenv imagekit multer pg sequelize cors socket.io
npm i -D nodemon sequelize-cli just supertest
```

# setup sequelize

```bash
npx sequelize init
```

# change setting before creating db

```json
{
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "tindog_development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "postgres",
    "database": "tindog_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL"
  }
}
```

# make db

```bash
npx sequelize db:create
npx sequelize db:create --env test
```

# helper

```js
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = class Helper {
  static error(message, status) {
    throw { name: "Error", message, status };
  }
  static async hash(value) {
    try {
      return await bycrypt.hash(value, 10);
    } catch (error) {
      throw error;
    }
  }
  static async compare(typedPassword, databasePassword) {
    try {
      return await bycrypt.compare(typedPassword, databasePassword);
    } catch (error) {
      throw error;
    }
  }
  static sign(value) {
    // payload -> token
    return jwt.sign(value, process.env.JWT_SECRET);
  }
  static verify(value) {
    // token -> payload
    return jwt.verify(value, process.env.JWT_SECRET);
  }
  static pagination(
    limit,
    page,
    sort,
    sortBy,
    search,
    searchBy,
    validSortFields,
    validSearchFields
  ) {
    limit = Math.max(parseInt(limit, 10), 1) || 10; // default 10
    page = Math.max(parseInt(page, 10), 1) || 1; // default 1
    sort = ["asc", "desc"].includes(sort) ? sort : "asc"; // default 'asc'
    sortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt"; // default 'createdAt'
    // limit offset order -> options
    const options = {
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, sort]],
    };
    // search & search field? -> options
    if (search && searchBy) {
      searchBy = validSearchFields.includes(searchBy) ? searchBy : null;
      if (searchBy) {
        options.where = { [searchBy]: { [Op.like]: `%${search}%` } };
      }
    }
    return options;
  }
};
```

# utils

```js
const multer = require("multer");
const ImageKit = require("imagekit");

const storage = multer.memoryStorage();

module.exports = class Utils {
  static imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  static upload = multer({ storage });
};
```

# table

```bash
npx sequelize model:create --name User --attributes name:string,password:string
```

# migration

```js
      col: {
        type: Sequelize.STRING,
        references:{model:"Users",key:"id"}, // fk
        onUpdate:"cascade", // fk
        onDelete:"cascade", // fk
        allowNull: false, // required
        unique: true, // unique
        defaultValue: 'value', // default value
        validate: {
          isEmail:true, // isEmail
          validate: {len:[5,Infinity]}, // char len min 5
          isUrl:true, // isUrl
          min:100 // min number 100
        }
      },
```

# model

```js
    col: {
      type:DataTypes.STRING,
      allowNull:false, // required
      unique: { msg: "Col is already in use." }, // unique
      defaultValue:"value", // default value
      validate:{
        isUrl:{msg:"Invalid URL format."}, // isUrl
        len:{args:[5,Infinity],msg:"Col must have a minimum length of 5 characters."}, // char len min 5
        min:{args:[100],msg:'Col value must be a minimum of 100.'}, // min number 100
        isEmail:{msg:"Invalid email format."}, //isEmail
        notNull:{msg:"Col is required."}, // required
        notEmpty:{msg:"Col cannot be empty."} // required
      }
    },

    static associate(models) {
      this.hasMany(models.Post)
      this.belongsTo(models.User)
    }

    User.beforeCreate(async (user) => {
        user.password = await Helper.hash(user.password)
    });
```

# migrate

```bash
npx sequelize db:migrate
npx sequelize db:migrate --env test
```

# seed

```bash
npx sequelize seed:create --name seedUser
```

# up down

```js
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'username',
        email: 'email@email.com',
        password: await Helper.passwordHasher("password"),
        role: 'role',
        phoneNumber: '+1 123-456-7890',
        address: '1 Love Lane, Anime City',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'username2',
        email: 'email2@email.com',
        password: await Helper.passwordHasher("password2"),
        role: 'role',
        phoneNumber: '+1 123-456-7890',
        address: '1 Love Lane, Anime City',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
```

```bash
npx sequelize db:seed:all
```

# middleware

```js
const Helper = require("./helper.js");
const { User } = require("./models/index.js");

module.exports = class Middleware {
  static error(err, req, res, next) {
    if (process.env.NODE_ENV !== "production") {
      console.log(err);
    }
    switch (err.name) {
      case "SequelizeValidationError":
      case "SequelizeUniqueConstraintError":
        return res.status(400).json({ message: err.errors[0].message });
      case "JsonWebTokenError":
        return res.status(401).json({ message: err.message });
      case "Error":
        return res.status(err.status).json({ message: err.message });
      default:
        return res.status(500).json({ message: "Internal Server Error." });
    }
  }
  static async tokenGuard(req, res, next) {
    try {
      // no token? throw
      if (!req.headers.authorization) {
        Helper.error("Unauthorized.", 401);
      }
      // get token
      const token = req.headers.authorization.split(" ")[1];
      // token -> payload
      const payload = Helper.verify(token);
      // no owner? throw
      const user = await User.findByPk(+payload);
      if (!user) {
        Helper.error("Unauthorized.", 401);
      }
      // save owner
      req.loggedInUser = { ...user };
      // move down
      next();
    } catch (error) {
      next(error);
    }
  }
};
```

# user controller

```js
const Helper = require("../helper.js");
const { User } = require("../models/index.js");
const Utils = require("../utils.js");

module.exports = class UserController {
  static async post(req, res, next) {
    try {
      // get body
      const { name, password } = req.body;
      // POST
      const obj = await User.create({
        name,
        password,
      });
      // res
      res.status(201).json({
        message: "User successfully created.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      // get body
      let { name, password } = req.body;
      // null? ""
      name = name ?? "";
      password = password ?? "";
      // no user? throw
      const obj = await User.findOne({ where: { name } });
      if (!obj) {
        Helper.error(
          "User not found. Please check your name or register.",
          401
        );
      }
      // wrong password? throw
      if (!(await Helper.compare(password, obj.password))) {
        Helper.error("Wrong password. Please try again.", 401);
      }
      // payload (user ID) -> token
      const token = await Helper.sign(obj.id);
      // res
      res.status(200).json({
        message: "User successfully logged in.",
        token,
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async get(req, res, next) {
    try {
      // get query
      let { limit, page, sort, sortBy, search, searchBy } = req.query; // .../?limit=10&page=1&
      const options = Helper.pagination(
        limit,
        page,
        sort,
        sortBy,
        search,
        searchBy,
        ["id", "name", "password", "image_url", "createdAt", "updatedAt"], // validSortFields (all cols)
        ["name", "password"] // validSearchFields (strings only)
      );
      // GET
      const total = await User.count();
      // GET
      const obj = await User.findAll(options);
      // res
      res.status(200).json({
        message: "Users successfully retrieved.",
        obj,
        total,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getId(req, res, next) {
    try {
      // get params
      const { id } = req.params;
      // GET
      const obj = await User.findByPk(id); // .../:id
      // res
      res.status(200).json({
        message: "User successfully retrieved.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async put(req, res, next) {
    try {
      // get loggedIn
      const { id } = req.loggedInUser.dataValues;
      // get body
      let { name, password } = req.body;
      // not nulls -> updateFields
      const updateFields = {};
      if (name) updateFields.name = name;
      if (password) updateFields.password = await Helper.hash(password);
      // PUT
      const [_, [obj]] = await User.update(updateFields, {
        where: { id },
        returning: true,
      });
      // res
      res.status(200).json({
        message: "User successfully updated.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async patch(req, res, next) {
    try {
      // get loggedIn
      const { id } = req.loggedInUser.dataValues;
      // no file? throw - need middleware
      if (!req.file) {
        Helper.error("File is required.", 400);
      }
      // file -> 64
      const base64 = req.file.buffer.toString("base64");
      // 64 -> image_url & upload
      const result = await Utils.imagekit.upload({
        file: base64,
        fileName: req.file.originalname,
        tags: [`${req.file.originalname}`],
      });
      const image_url = result.url;
      // PATCH
      const [_, [obj]] = await User.update(
        { image_url },
        { where: { id }, returning: true }
      );
      // res
      res.status(200).json({
        message: "User image url successfully updated.",
        image_url,
      });
    } catch (error) {
      next(error);
    }
  }
  static async delete(req, res, next) {
    try {
      // get loggedIn
      const { id } = req.loggedInUser.dataValues;
      // DELETE
      await User.destroy({ where: { id } });
      // res
      res.status(200).json({
        message: "User successfully deleted.",
      });
    } catch (error) {
      next(error);
    }
  }
};
```

# owned controller

```js
const Helper = require("../helper.js");
const { Chat_Room } = require("../models/index.js");
const Utils = require("../utils.js");

module.exports = class ChatRoomController {
  static async post(req, res, next) {
    try {
      // get loggedIn
      const user_id = req.loggedInUser.dataValues.id;
      // get body
      const { name } = req.body;
      // POST
      const obj = await Chat_Room.create({
        name,
        user_id,
      });
      // res
      res.status(201).json({
        message: "Chat Room successfully created.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async get(req, res, next) {
    try {
      // get query
      let { limit, page, sort, sortBy, search, searchBy } = req.query; // .../?limit=10&page=1&
      const options = Helper.pagination(
        limit,
        page,
        sort,
        sortBy,
        search,
        searchBy
      );
      // GET
      const obj = await Chat_Room.findAll(options);
      // res
      res.status(200).json({
        message: "Chat Rooms successfully retrieved.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getId(req, res, next) {
    try {
      // get params
      const { id } = req.params; // .../:id
      // GET
      const obj = await Chat_Room.findByPk(id);
      // res
      res.status(200).json({
        message: "Chat Room successfully retrieved.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async put(req, res, next) {
    try {
      // get loggedIn
      const user_id = req.logloggedInUser.dataValues.id;
      // get body
      let { name } = req.body;
      // not nulls -> updateFields
      const updateFields = {};
      if (name) updateFields.name = name;
      // PUT
      const [_, [obj]] = await Chat_Room.update(updateFields, {
        where: { user_id },
        returning: true,
      });
      // res
      res.status(200).json({
        message: "Chat Room successfully updated.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async delete(req, res, next) {
    try {
      // get loggedIn
      const user_id = req.loggedInUser.dataValues.id;
      // DELETE
      await Chat_Room.destroy({ where: { user_id } });
      // res
      res.status(200).json({
        message: "Chat Room successfully deleted.",
      });
    } catch (error) {
      next(error);
    }
  }
};
```

# user router

```js
// router maker
const express = require("express");
// my controller
const UserController = require("../controllers/userController.js");
// guard
const Middleware = require("../middleware.js");
// 3rd party api
const Utils = require("../utils.js");
// my router
const userRouter = express.Router();

// endpoints
userRouter.get("/", UserController.get);
userRouter.put("/", UserController.put);
userRouter.patch("/", Utils.upload.single("image_url"), UserController.patch); // req.file need middleware
userRouter.delete("/", UserController.delete);
userRouter.get("/:id", UserController.getId);

// export
module.exports = userRouter;
```

# owned router

```js
// router maker
const express = require("express");
// my controller
const ChatController = require("../controllers/chatController.js");
// guard
const Middleware = require("../middleware.js");
// 3rd party api
const Utils = require("../utils.js");
// my router
const chatRouter = express.Router();

// endpoints
chatRouter.post("/", ChatController.post);
chatRouter.get("/", ChatController.get);
chatRouter.put("/", ChatController.put);
chatRouter.delete("/", ChatController.delete);
chatRouter.get("/:id", ChatController.getId);

// export
module.exports = chatRouter;
```

# home router

```js
// router maker
const express = require("express");
// guard
const Middleware = require("../middleware.js");
// bypass branch controller
const UserController = require("../controllers/userController");
// my router
const homeRouter = express.Router();
// child
const userRouter = require("./userRouter.js");

// free
homeRouter.post("/user", UserController.post);
homeRouter.post("/user/login", UserController.login);
// token
homeRouter.use(Middleware.tokenGuard);
homeRouter.use("/user", userRouter);

// export
module.exports = homeRouter;
```

# app

```js
// production? no dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// app maker
const express = require("express");
// home router
const homeRouter = require("./routers/homeRouter.js");
// error
const Middleware = require("./middleware.js");
// allow all access
const cors = require("cors");

// create app
const app = express();
app.use(cors());

// socket.io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
// handle signals
io.on("connection", (socket) => {
  // log connected user
  if (process.env.NODE_ENV !== "production") {
    console.log(`user connected: ${socket.id}.`);
  }

  // join room
  socket.on("join_room", (room) => {
    // log
    if (process.env.NODE_ENV !== "production") {
      console.log(`"join_room" received in backend: ${room}.`);
    }
    socket.join(room);
  });

  // send message (can make more of this)
  socket.on("send_message", (data) => {
    // log
    if (process.env.NODE_ENV !== "production") {
      console.log(`"send_message" received in backend: ${data}.`);
    }
    const { room, chats } = data;
    // log
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `backend emit "send_message" to room: ${room}. sending data: ${data}.`
      );
    }
    socket.to(room).emit("send_message", chats);
  });
});

// middlewares
app.use(express.urlencoded({ extended: true })); // req.body
app.use(express.json()); // for reading jest req
app.use(homeRouter); // enter home router
app.use(Middleware.error); // dump all err here

// export
module.exports = { app, server };
```

# www

```js
const { app, server } = require("../app");

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  `listening to ${PORT}`;
});
```

# shortcut

```bash
npx sequelize db:migrate:undo:all ^
& npx sequelize db:migrate ^
& npx sequelize db:seed:all ^
nodemon .\bin\www.js
```

# sending mail (Google OAuth)

https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
