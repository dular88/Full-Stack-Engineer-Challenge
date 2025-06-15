import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 4000;
const apiRouter = express.Router();

app.use(express.json());


const USERS_DATA = path.join(__dirname, "utils", "users.json");

interface User{
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    authenticated: boolean,
    token: string | null
}

// To get users list
async function fetchUsersFromFile(): Promise<User[]>{
    try {
        const data = await fs.promises.readFile(USERS_DATA, "utf-8");
        return JSON.parse(data);
    } catch (error: any) {
        console.log(error);
        throw new Error("Failed to fetch users data");
    }
}



app.use("/api", apiRouter);

app.listen(PORT, ()=>{
    console.log("Server is running on "+PORT);
})