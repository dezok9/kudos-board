import React, { useState, useEffect } from "react"
import { useLocation, Link } from 'react-router-dom'
import Header from "../components/Header"
import Card from '../components/cards/Card'
import './BoardCards.css'

function BoardCards() {
    const [cardsData, setCardsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [areCommentsOpen, setAreCommentsOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("@user");
    const [message, setMessage] = useState("");
    const [searchString, setSearchString] = useState("");
    const [GIFYoptions, setGIFYoptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [chosenGIF, setChosenGIF] = useState("");

    const [comment, setComment] = useState("");
    const [allComments, setAllComments] = useState([]);
    const [cardIDCommentModalOpen, setCardIDCommentModalOpen] = useState(-1);   // Holds the id of the last card clicked on to open the comment modal.
    const [currentCardComments, setCurrentCardComments] = useState([]);   // Holds the comments of the last card clicked on to open the comment modal.


    const location = useLocation();

    const pathname = location.pathname;
    const boardID = (pathname.split("/"))[pathname.split("/").length - 1];

    const GIFY_API_KEY = import.meta.env.VITE_GIFY_API_KEY;
    const DATABASE = import.meta.env.VITE_BACKEND_ADDRESS;


    const user = location.state;



    /***
     *
     */
    async function fetchCards() {
        try {
            const response = await fetch(`${DATABASE}/boards/${boardID}/cards`);
            const cards = await response.json();

            // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
            if (!response.ok) {
              throw new Error(`HTTP fetch error! Status of ${response.status}.`);
            }

            setCardsData(cards);
          }
          catch (error) {
            console.log(`ERROR GETTING CARDS: ${error}.`);
          }
    }


    /***
     * Deletes id from board's card collection and deletes card
     */
    async function deleteCard(cardID) {
        try {
            const response = await fetch(`${DATABASE}/cards/${cardID}`,
              {method: "DELETE",
                headers: {
                  "Content-Type": "application/json"
                }
              });

            // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
            if (!response.ok) {
              throw new Error(`HTTP fetch error! Status of ${response.status}.`);
            }

            fetchCards();
          }
          catch (error) {
            console.log(`ERROR GETTING CARD: ${error}.`);
          }
    }


    async function openComments(cardID) {
        handleCommentsModalState();
        setCardIDCommentModalOpen(cardID);

        const card = await fetchCard(cardID);
        console.log(card);

        setCurrentCardComments(card.comments);
        setAllComments(card.comments);
    }

    /***
     *
     */
    async function putComment() {
        try {
            const response = await fetch(`${DATABASE}/cards/${cardIDCommentModalOpen}/comment`,
                {method: "PUT",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    "body": JSON.stringify({
                        comments: currentCardComments.concat([comment])
                    })
                });

            // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
            if (!response.ok) {
                throw new Error(`HTTP fetch error! Status of ${response.status}.`);
            }

            handleCommentsChange("");
            setAreCommentsOpen(false);
            openComments(cardIDCommentModalOpen);
            }
            catch (error) {
                console.log(`ERROR EDITING BOARD: ${error}.`);
            }
    }

    /***
     *
     */
    async function fetchCard(cardID) {
        try {
            const response = await fetch(`${DATABASE}/cards/${cardID}`);
            console.log(response)
            const card = await response.json();
            console.log(card);

            // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
            if (!response.ok) {
              throw new Error(`HTTP fetch error! Status of ${response.status}.`);
            }

            return card;
          }
          catch (error) {
            console.log(`ERROR GETTING CARDS: ${error}.`);
          }
    }

    /***
     *
     */
    function createComment(commentInfo) {
        return (
            <div className='comment'>
                {commentInfo}
            </div>
        )
    }



    /***
     *
     */
    function createCard(cardData) {
        const cardID = cardData.id;
        const cardUpvotes = cardData.upvotes;


        return (
            <div className='card' key={cardData.id}>
                <img className="card-img" src={cardData.gifURL}></img>
                <div className="card-info">
                    <p className='card-id'>#{cardData.id}</p>
                    <p>{cardData.title}</p>
                    <p className='author'>{cardData.authorHandle}</p>
                    <p className='author'>{cardData.message}</p>
                    {/* <p>{cardData.date}</p> */}
                    <div>
                        <p><i className="fa-regular fa-heart" onClick={() => upvoteCard(cardID, cardUpvotes)}></i>  {cardData.upvotes}</p>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <i className="fa-solid fa-trash" onClick={() => deleteCard(cardID)}></i>
                        <i class="fa-solid fa-comment" onClick={() => openComments(cardID)}></i>
                    </div>
                </div>
            </div>
        )
    }

    /***
     * Adding new card information to our database.
     */
    async function postCard(cardTitle, cardMessage) {
        try {
        const response = await fetch(`${DATABASE}/boards/${boardID}/cards`,
            {method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    title: cardTitle,
                    author: {connect: {"handle": user}},
                    message: cardMessage,
                    gifURL: chosenGIF,
                    board: { connect: { "id": Number(boardID) } }
                })
            });

        // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
        if (!response.ok) {
            throw new Error(`HTTP fetch error! Status of ${response.status}.`);
        }

        fetchCards();
    }
    catch (error) {
        console.log(`ERROR CREATING CARD: ${error}.`);
    }
  }

    /***
     * Upvote card (change the upvote count to +1) given the cardID and currentUpvote that was previously retrieved.
     */
    async function upvoteCard(id, currentUpvotes) {
    try {
        const response = await fetch(`${DATABASE}/cards/upvote/${id}`,
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

        fetchCards();
        }
        catch (error) {
            console.log(`ERROR EDITING BOARD: ${error}.`);
        }
    }

    /***
     *
     */
    async function searchGIFY() {
        try {
            const queryURL = "https://api.giphy.com/v1/gifs/search?" + `q=${searchString}&limit=8&api_key=${GIFY_API_KEY}`

            const response = await fetch(queryURL);
            const res = await response.json();
            const gifOptions = await res.data;
            console.log(gifOptions);
            setGIFYoptions(gifOptions);
        }
        catch {

        }
    }

    function chooseGIF(gifInfo) {
        console.log("xd")
        setGIFYoptions([]);
        setChosenGIF(gifInfo.images.original.url);
    }

    /***
     *
     */
    function renderGIFs(gifInfo) {
        return (
            <img className='gif' src={gifInfo.images.original.url} onClick={() => chooseGIF(gifInfo)}></img>
        )
    }

    /***
     * Handles submission of the board creation form.
     * Submits only if all of the fields are filled.
     */
    function handleSubmit() {
        if (author.replace(" ", "") == "" || title.replace(" ", "") == "" || message.replace(" ", "") == "") {
            setShowWarning(true);
            return;
        }
        else {
            handleModalState();
            setTitle("");
            setAuthor("");
            setMessage("");
            setSearchString("");

            postCard(title, message, chosenGIF);
        }
    }

    /***
     * Controls the opening of the modal for board creation.
     */
    function handleModalState() {
        setIsModalOpen(!isModalOpen);
    }

    /***
     * Controls the opening of the modal for board creation.
     */
    function handleCommentsModalState() {
        setAreCommentsOpen(!areCommentsOpen);
    }

    /***
     * Handles changes to the board creation form.
     */
    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    /***
     * Handles changes to the board creation form.
     */
    function handleCommentsChange(value) {
        setComment(value);
    }

    /***
     * Handles changes to the board creation form.
     */
    function handleMessageChange(event) {
        setMessage(event.target.value);
    }

     /***
     * Handles changes to the board creation form.
     */
     function handleSearchChange(event) {
        setSearchString(event.target.value);
    }

    useEffect(() => {fetchCards()}, [])

    useEffect(() => {}, [allComments])

    useEffect(() => {}, [cardsData])

    useEffect(() => {fetchCards}, [isModalOpen])

    useEffect(() => {handleModalState}, [GIFYoptions])


    return (
        <section className="cards-page">
            <Header />

            <div className="buttons">
                <Link to="/" state={user} ><button className="button">Back</button></Link>
                <button className="button" onClick={handleModalState}>Add Card</button>
            </div>


            <div id='cards'>
                {cardsData.map(createCard)}
            </div>


            {/* Comments modal */}
            <div className={'modal ' + (areCommentsOpen ? 'show' : 'hide')}>
                <span className='exit' onClick={handleCommentsModalState}><i className="fa-solid fa-circle-xmark fa-xl"></i></span>
                <h1>Comments</h1>

                <div className="all-comments">
                    {allComments.map(createComment)}
                </div>

                <section style={{position: "absolute", bottom: "0", marginBottom: "5%", width: "100%", justifyItems: "center"}}>
                    <textarea id='title' className='form-input' style={{height: "15%", width: "60%"}}  rows="3" cols="25" value={comment} onChange={(event) => handleCommentsChange(event.target.value)} placeholder={"Add to the discussion..."}></textarea>
                    <button className="button" style={{height: "15%", width: "60%"}} onClick={() => putComment()}>Comment</button>
                </section>
            </div>



            {/* Creation modal */}
            <div className={'modal ' + (isModalOpen ? 'show' : 'hide')}>
                <span className='exit' onClick={handleModalState}><i className="fa-solid fa-circle-xmark fa-xl"></i></span>
                <section className='title-section'>
                    <p>Title</p>
                    <input id='title' className='form-input' value={title} onChange={handleTitleChange}></input>
                </section>

                <section className='author-section'>
                    <p>Author</p>
                    <input id='author' className='form-input author-field' value={author} readOnly></input>
                    <label className='switch'>
                        <input type='checkbox'/>
                        <span className='slider'></span>
                    </label>
                </section>

                <section className='author-section'>
                    <p>Message</p>
                    <input className='form-input' value={message} onChange={handleMessageChange}></input>
                </section>

                <section className='author-section'>
                    <p>Search for a GIF:</p>
                    <input className='form-input' value={searchString} onChange={handleSearchChange}></input>
                    <button onClick={searchGIFY}>SEARCH</button>
                    <div className='gifs'>
                        {GIFYoptions.map(renderGIFs)}
                    </div>
                    <input className='form-input author-field' value={chosenGIF} onChange={handleSearchChange} readOnly></input>
                </section>

                <button className='submit-button' onClick={handleSubmit}>Submit</button>

                <p className={'warning ' + (showWarning ? 'show' : 'hide')}><i className='fa-solid fa-certificate rotate'></i>  Please fill in all required fields.</p>
            </div>
        </section>
    )
}

export default BoardCards;
