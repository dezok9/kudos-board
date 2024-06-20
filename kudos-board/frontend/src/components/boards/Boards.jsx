import React from 'react'
import './Boards.css'

/***
 * Creating kudos board (collection of kudos cards) from the data provided about each post as provided by boardsData.
 */

function Boards(boards) {
    /***
     * Generates tags using the colors assigned to each tag as communicated by boards.tagColors.
     */
    function generateTag(tag) {
        const tagColor = boards.TAGS[tag]

        return (
            <p className='tag' style={{backgroundColor: tagColor}} key={Math.random()*100000}>{tag}</p>
        )
    }

    /***
     * Render a singular board using the data provided about that specific board as provided by boardData.
     */
    function createBoard(boardData) {
        return (
            <div className='board-card'  key={Math.random()*100000}>
                <img src={boards.imgURL}></img>
                <p className='board-id'>#{boardData.id}</p>
                <p>{boardData.title}</p>
                <p className='author'>{boardData.authorHandle}</p>
                <div>
                    {boardData.tags.map(generateTag)}
                </div>
                <p>{boardData.date}</p>
                <i className="fa-solid fa-trash" onClick={() => boards.deleteBoard(boardData.id)}></i>
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
