import express, {Response, Request} from "express";
import mysql, {Connection} from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT ?? "3000", 10);
app.use(express.json());

const connectionToDatabase = async (): Promise<Connection> => {
  try {
    const connection = mysql.createConnection({
      host: process.env.MYSQL_DB_HOST,
      user: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_NAME
    });
    console.log("Connected to database");
    return connection;
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

let dbConnection: mysql.Connection | null = null;
connectionToDatabase().then((connection) => {
  dbConnection = connection;
});

app.get("/", async (req: Request, res: Response): Promise<void> => {
  if (!dbConnection) {
    res.status(500).send("Hello World!");
    return;
  }
  try {
    const [rows] = await dbConnection.promise().query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error querying database: ", error);
    res.status(500).send("Error querying database");
  }
});
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});

