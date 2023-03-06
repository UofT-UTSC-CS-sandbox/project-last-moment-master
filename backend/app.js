import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cors from 'cors'
import expressSession from 'express-session';
import { usersRouter } from './routes/users.js';

const PORT = 5000;
const connection = "mongodb+srv://wengzhang0708:SHETOUweng0708@cluster0.m4hzbmi.mongodb.net/?retryWrites=true&w=majority";
const sessionName = "SkillvitrineUser";
const app = express();


try{
    mongoose.connect(connection, { ssl: true }).catch(error => console.log(error));
    console.log("Connected to MongoDB");
} catch (error) {
    console.log("Could not connect to MongoDB");
}

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(expressSession({
    name: sessionName,
    secret: 'Skillvitrine',
    resave: false,
    saveUninitialized: false,
}));
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/users", usersRouter);

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});

