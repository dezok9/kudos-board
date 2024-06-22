import React from 'react'
import { useNavigate, Link } from "react-router-dom";
import './Boards.css'

/***
 * Creating kudos board (collection of kudos cards) from the data provided about each post as provided by boardsData.
 */

function Boards(boards) {
    const navigate = useNavigate();

    function upvote() {
    }

    /***
     * Removing boards from our database using the id value.
     * Passed into the Boards component for use on individual boards.
     */
    async function deleteBoard(boardID) {
        try {
            const response = await fetch(`${boards.DATABASE}/boards/${boardID}`,
            {method: "DELETE",
                headers: {
                "Content-Type": "application/json"
                }
            });

            // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
            if (!response.ok) {
            throw new Error(`HTTP fetch error! Status of ${response.status}.`);
            }

            boards.fetchBoards();
        }
        catch (error) {
            console.log(`ERROR DELETING BOARD: ${error}.`);
        }
    }


    /***
     * Upvote board (change the upvote count to +1) given the cardID and currentUpvote that was previously retrieved.
     */
    async function upvoteBoard(id, currentUpvotes) {
        try {
            const response = await fetch(`${DATABASE}/boards/upvote/${id}`,
                {method: "PUT",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    "body": JSON.stringify({
                    upvotes: (currentUpvotes + 1)
                    })
                });

            // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
            if (!response.ok) {
                throw new Error(`HTTP fetch error! Status of ${response.status}.`);
            }

        fetchBoards();
        }
        catch (error) {
        console.log(`ERROR EDITING BOARD: ${error}.`);
        }
    }




    /***
     * Render a singular board using the data provided about that specific board as provided by boardData.
     */
    function createBoard(boardData) {
        const boardID = boardData.id;
        const boardUpvotes = boardData.upvotes;



        return (
            <div onClick={() => navigate(`/board/${boardData.id}`)} className='board-card' key={boardData.id}>
                <p className='board-id'>#{boardData.id}</p>
                <img className='img' src={boardData.imgURL}></img>
                <p>{boardData.title}</p>
                <p><em>{boardData.description === "" ? "No description." : boardData.description}</em></p>
                <p className='author'>{boardData.authorHandle}</p>
                <div>
                    {boardData.tags.map(boards.generateTag)}
                </div>
                <p>{boardData.date}</p>
                <i className="fa-solid fa-trash" onClick={() => deleteBoard(boardData.id)}></i>
            </div>

        )
    }


    return (
        <section className='boards'>
            {boards.boardsData.map(createBoard)}
        </section>
    )
}

export default Boards;
