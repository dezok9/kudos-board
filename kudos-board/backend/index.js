const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient
const cors = require('cors')
const express = require('express')

const app = express();
app.use(express.json());
app.use(cors());

// BOARD OPERAITONS:

app.get("/boards", async (req, res) => {
    const boards = await prisma.boards.findMany();
    res.status(200).json(boards);
})

app.get("/boards/filter/:tag", async (req, res) => {
    const tag = req.params.tag;
    const boards = await prisma.boards.findMany({
            where: {
                tags: {has: tag},
},
        }
    );
    res.status(200).json(boards);
})

app.get("/boards/search/:searchQuery", async (req, res) => {
    const searchQuery = req.params.searchQuery;
    console.log(searchQuery)
    const boards = await prisma.boards.findMany(
        {
            where: {
            OR: [
                {title: {contains: searchQuery, mode: "insensitive"}},
                {authorHandle: {contains: searchQuery, mode: "insensitive"}},
            ]
            },
        }
    );
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
    const newUpvote = req.body.upvots;
    const boardID = req.params.id;
    const board = await prisma.boards.update(
        {
            where: {
                id: boardID,
            },
            data: {
                upvotes: newUpvote,
            },
        }
    )


    res.status(200).json();
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







// CARD OPERATIONS:

app.get("/boards/:id", async (req, res) => {
    const boardID = req.params.id;
    const board = await prisma.cards.findMany(
        {
            where: {boardID: Number(boardID)},
        }
    );
    res.status(200).json(board);
})

app.delete("/cards/:cardID", async (req, res) => {
    const cardID = req.params.cardID;
    // const boardID = req.params.boardID;
    // const userID = req.
    // await prisma.

    await prisma.cards.delete(
        {
            where: {id: Number(cardID)},
        }
    );
    res.status(200).json();
})

app.put("/cards/upvote/:id", async (req, res) => {
    const newUpvote = req.body.upvotes;
    const cardID = req.params.id;
    const board = await prisma.cards.update(
        {
            where: {
                id: Number(cardID),
            },
            data: {
                upvotes: Number(newUpvote),
            },
        }
    )
    res.status(200).json();
})

app.post("/boards/:id/cards", async (req, res) => {
    const { title, author, message, gifURL, board } = req.body;

    await prisma.cards.create(
        {
            data: {
                title,
                author,
                message,
                gifURL,
                board
            }
        }
    );
    res.status(200).json();
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running.");
})
