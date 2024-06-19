import React from 'react'
import Card from './Card'
import './Boards.css'

/***
 * Creating kudos board (collection of kudos cards) from the data provided about each post as provided by boardsData.
 */

function Boards(boards) {

    /***
     * Render a singular board using the data provided about that specific board as provided by boardData.
     */
    function createBoard(boardData) {
        return (
            <div>
                <img src={boards.imgURL}></img>
                <p>{boardData.id}</p>
                <p>{boardData.title}</p>
                <p>{boardData.author}</p>
                <p>{boardData.tags}</p>
                <p>{boardData.date}</p>
            </div>
        )
    }

    return (
        <>
            {boards.boardsData.map(createBoard)}
        </>
    )
}

export default Boards;
