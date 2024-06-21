import React from 'react'
import { useNavigate, Link } from "react-router-dom";
import './Boards.css'

/***
 * Creating kudos board (collection of kudos cards) from the data provided about each post as provided by boardsData.
 */

function Boards(boards) {
    const navigate = useNavigate();

    /***
     * Generates tags using the colors assigned to each tag as communicated by boards.tagColors.
     */
    function generateTag(tag) {
        const tagColor = boards.TAGS[tag]

        return (
            <p className='tag' style={{backgroundColor: tagColor}} key={Math.random()*1000}>{tag}</p>
        )
    }

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
            <Link to={`/board/${boardData.id}`} state={boards.routeState} className='board-card' key={boardData.id}>
                <img src={boards.imgURL}></img>
                <p className='board-id'>#{boardData.id}</p>
                <p>{boardData.title}</p>
                <p className='author'>{boardData.authorHandle}</p>
                <div>
                    {boardData.tags.map(generateTag)}
                </div>
                <p>{boardData.date}</p>
                <div>
                    <p><i id='heart' className="fa-regular fa-heart" onClick={(boardID, boardUpvotes) => {upvoteBoard}}></i>  {boardData.upvotes}</p>
                </div>
                <i className="fa-solid fa-trash" onClick={() => deleteBoard(boardData.id)}></i>
            </Link>

        )
    }


    return (
        <section className='boards'>
            {boards.boardsData.map(createBoard)}
        </section>
    )
}

export default Boards;