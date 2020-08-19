const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const app = express();
const PORT = 5000;



mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false)
mongoose.connection.on("connected", () => {
  console.log("mongo db Connected");
});

mongoose.connection.on("error", (error) => {
  console.log("error in db connection", error);
});

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

app.listen(PORT, () => {
  console.log(`Server is running on, ${PORT}`);
});
