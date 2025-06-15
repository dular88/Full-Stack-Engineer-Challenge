import express, {NextFunction, Request, Response} from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const app = express();
const PORT = 4000;
const apiRouter = express.Router();

app.use(express.json());

let currentToken: string | null = null;
const USERS_DATA = path.join(__dirname, "utils", "users.json");

interface User{
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    authenticated: boolean,
    token: string | null
}


// To login 
apiRouter.post("/login",  async (req: Request, res: Response)=>{
    const {username, password} = req.body;

    if((!username || !password)){
        return res.status(400).json({"message": "Invalid credentials"});
    }

    try{
        const userData = await fetchUsersFromFile();

        const userIndex = userData.findIndex((user: User)=> user.email === username);

        if(userIndex === -1){
            return res.status(404).json({"message": "User not found"});
        }

        // Token generation 
        currentToken = crypto.randomBytes(16).toString("hex");

        userData[userIndex].authenticated = true;
        userData[userIndex].token = currentToken;

        await fs.promises.writeFile(USERS_DATA, JSON.stringify(userData, null, 4));

        res.status(200).json({"userInfo": userData[userIndex]});

    }catch(error: any){
       return res.status(404).json({"message": error});
    }
});


// Token Validation Middleware
const tokenValidation = async (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({"message":"Missing authorization token"});
    }

    const token = authHeader.split(" ")[1];
    if(currentToken != token){
       return res.status(403).json({"message":"Invalid token"});
    }

    next();
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

// To refresh users.json file data
const refreshUsersJsonFile =async ()=>{
    try {
        if(USERS_DATA){
            const users = await fetchUsersFromFile();

            const refreshedUsers = users.map((user: User)=>({
                ...user,
                authenticated:false,
                token:null
            }));

            fs.promises.writeFile(USERS_DATA, JSON.stringify(refreshedUsers, null, 4));
            console.log("user data refreshed");
        }
    } catch (error: any) {
        console.log("Error in refreshing",error);
    }
}

app.use("/api", apiRouter);

app.listen(PORT, async ()=>{
   await refreshUsersJsonFile(); 
    console.log("Server is running on "+PORT);
})