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
    res.status(201).json();
})

app.put("/boards/upvote/:id", async (req, res) => {
    const upvoteData = req.body.upvote;
    const boardID = req.params.id;
    const board = await prisma.boards.findUnique(
        {
            where: {
                id: boardID,
            },
        }
    )

    await

    res.status(200).json();
})

app.get("/boards/:id", async (req, res) => {
    const boardID = req.params.id;
    const board = await prisma.boards.findUnique(
        {
            where: {id: Number(boardID)},
        }
    );
    res.status(200).json(board);
})

app.get("/boards/filter/:tag", async (req, res) => {
    const tag = req.params.tag;
    const boards = await prisma.boards.findMany(
        {
            where: {
                tags: {
                    has: tag,
                },
            },
        }
    );
    res.status(200).json(boards);
})

app.get("/boards/search/:query", async (req, res) => {
    const query = req.params.query;
    const boards = await prisma.boards.findMany(
        {
            where: {
                title: {
                    has: query,
                },
            },
        }
    );
    res.status(200).json(boards);
})

app.delete("/boards/:id", async (req, res) => {
    const boardID = req.params.id;
    await prisma.boards.delete(
        {
            where: {id: Number(boardID)},
        }
    );
    res.status(200).json();
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running.");
})
