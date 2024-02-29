const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const DataBase = require("./DB");

const app = express();

const DB = new DataBase();

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.get("/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const userId = await DB.createUserAndGetId(name);
        res.json({ id: userId });
    } catch (err) {
        console.error("Ошибка при создании пользователя и получении id:", err);
        res.status(500).json({
            error: "Ошибка при создании пользователя и получении id",
        });
    }
});

app.get("/:userId/:questId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const questId = parseInt(req.params.questId);
    try {
        const user = await DB.getNameById(userId);
        if (user.length) {
            const question = await DB.getQuestionById(questId);
            return res.json(question[0]);
        } else {
            res.json(null);
        }
    } catch (err) {
        console.error("Ошибка при создании пользователя и получении id:", err);
        res.status(500).json({
            error: "Ошибка при создании пользователя и получении id",
        });
    }
});

app.get("/:userId/:questId/:answer", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const questId = parseInt(req.params.questId);
    const answer = parseInt(req.params.answer);
    try {
        const user = await DB.getNameById(userId);
        if (user.length === 1) {
            const existRecords = await DB.getAsnwerById(userId, questId);
            if (existRecords.length > 0) {
                res.json(await DB.updateUserAnswer(userId, questId, answer));
            } else {
                res.json(await DB.createUserAnswer(userId, questId, answer));
            }
        } else {
            res.json(null);
        }
    } catch (err) {
        console.log("Ошибка при создании пользователя и получении id:", err);
        res.status(500).json({
            error: "Ошибка при создании пользователя и получении id",
        });
    }
});

app.listen(3001);
