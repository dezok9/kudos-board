const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient
const cors = require('cors')
const express = require('express')

const app = express();
app.use(express.json());
app.use(cors());

// BOARD OPERAITONS:

app.get("/boards", async (req, res) => {
    const boards = await prisma.boards.findMany(
        {orderBy: {id : 'asc'}}
    );
    res.status(200).json(boards);
})

app.get("/boards/recents", async (req, res) => {
    const boards = await prisma.boards.findMany({
        take: 5,
        orderBy: {id : 'desc'}
    });
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
    const { title, author, imgURL, description, tags, date } = req.body;
    const newBoard = await prisma.boards.create({
        data: {
            title,
            author,
            imgURL,
            description,
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
    console.log(boardID)
    await prisma.boards.delete(
        {
            where: {id: Number(boardID)},
        }
    );
    res.status(200).json();
})







// CARD OPERATIONS:

app.get("/boards/:id/cards", async (req, res) => {
    const boardID = req.params.id;
    const board = await prisma.cards.findMany(
        {
            where: {board: {id: Number(boardID)}},
            orderBy: {id : 'asc'}
        }
    );
    res.status(200).json(board);
})

app.get("/cards/:cardID", async (req, res) => {
    const cardID = req.params.cardID;

    const card = await prisma.cards.findUnique(
        {
            where: {id: Number(cardID)},
        }
    );
    res.status(200).json(card);
})

app.delete("/cards/:cardID", async (req, res) => {
    const cardID = req.params.cardID;

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

app.put("/cards/:id/comment", async (req, res) => {
    const cardID = req.params.id;
    const { comments } = req.body;

    await prisma.cards.update(
        {
            data: {
                comments
            },
            where: {
                id: Number(cardID)
            }
        }
    );
    res.status(200).json();
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running.");
})
