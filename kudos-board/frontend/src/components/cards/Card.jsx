import React from "react"
import './Card.css'

function Card() {
    function createCard(cardData) {
        return (
            <div>
                <p>{boardData.upvotes}</p>
                <i className="fa-regular fa-circle-up" onClick={() => boards.upvoteBoard(boardData.id, boardData.upvotes)}></i>
            </div>
        )
    }

    return (
        <>
            <div className='kudos-card'>
                <h2>Kudos Title</h2>
                <p>Author</p>
                <p>Message</p>
                <p>Date</p>
            </div>
        </>
    )
}

export default Card;
