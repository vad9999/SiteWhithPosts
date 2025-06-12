const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./models");
const applyAssociations = require("./models/associations");
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiRoutes = require("./routes");
const seed = require("./seed");
app.use("/api", apiRoutes);

applyAssociations(db);
//alter: true force: true {alter: true}
db.sequelize
  .sync()
  .then(async () => {
    console.log("Таблицы синхронизированы");
    await seed();
    app.listen(port, () => {
      console.log(`Сервер запущен на http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Ошибка при запуске:", err);
  });
