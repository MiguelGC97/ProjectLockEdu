const express = require("express");
const app = express();
const cors = require("cors");

var corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./models");

db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop a re-sync db.");
});

app.get("/", (res) => {
    res.json({ message: "Welcome to locker app." });
});

// require("./routes/locker.routes")(app);
require("./routes/box.routes")(app);
// require("./routes/object.routes")(app);
// require("./routes/type.routes")(app);


const PORT = process.env.DB_PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

