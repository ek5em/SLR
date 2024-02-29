const mysql = require("mysql");

class DataBase {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "test",
        });
        this.connect();
    }

    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error("Ошибка подключения к базе данных:", err);
                return;
            }
            console.log("Подключено к базе данных MySQL");
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        }).catch((err) => {
            console.error("Ошибка при выполнении запроса:", err);
            throw err;
        });
    }

    async getQuestionById(id) {
        try {
            return await this.query(
                "SELECT question, isReverse FROM questions WHERE id = ?",
                [id]
            );
        } catch (e) {
            console.log(e);
        }
    }

    async getNameById(id) {
        try {
            return await this.query("SELECT name FROM users WHERE id = ?", [
                id,
            ]);
        } catch (e) {
            console.log(e);
        }
    }

    async getAsnwerById(userId, questionId) {
        try {
            return await this.query(
                "SELECT * FROM usersAnswers WHERE user_id = ? AND question_id = ?",
                [userId, questionId]
            );
        } catch (e) {
            console.log(e);
        }
    }

    async updateUserAnswer(userId, questionId, answer) {
        try {
            await this.query(
                "UPDATE usersAnswers SET answer = ? WHERE user_id = ? AND question_id = ?",
                [answer, userId, questionId]
            );
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async createUserAnswer(userId, questionId, answer) {
        try {
            await this.query(
                "INSERT INTO usersAnswers (user_id, question_id,answer) VALUES (?,?,?)",
                [userId, questionId, answer]
            );
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async createUserAndGetId(name) {
        try {
            await this.query("INSERT INTO users (name) VALUES (?)", [name]);

            const result = await this.query("SELECT LAST_INSERT_ID() AS id");

            const insertedId = result[0].id;

            return insertedId;
        } catch (err) {
            console.error(
                "Ошибка при создании пользователя и получении id:",
                err
            );
            throw err;
        }
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err) return reject(err);
                console.log("Соединение с базой данных закрыто");
                resolve();
            });
        });
    }
}

module.exports = DataBase;
