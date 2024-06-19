const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient
const cors = require('cors')
const express = require('express')

const app = express();
app.use(express.json());
app.use(cors());

app.get("/boards", async (req, res) => {
    const boards = await prisma.boards.findMany();
    res.status(200).json(boards);
})

app.post("/boards", async (req, res) => {
    const { title, author, imgURL, tags, date } = req.body;
    const newBoard = await prisma.boards.create({
        data: {
            title,
            author,
            imgURL,
            tags,
            date
        }
    });
    res.status(201).json(newBoard);
})

app.delete("/boards/:id", async (req, res) => {
    const { boardID } = req.params;
    await prisma.boards.delete(
        {
            where: { id: parseInt(boardID)}
        }
    );
    res.status(200);
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running.");
})
