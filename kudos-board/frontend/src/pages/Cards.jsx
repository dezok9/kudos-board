import React, { useState, useEffect } from "react"
import { useLocation, Link } from 'react-router-dom'
import Header from "../components/Header"
import './Cards.css'
import Footer from "../components/Footer"

/***
 * Creates cards for each board.
 */

function Cards() {
    const [cardsData, setCardsData] = useState([]);

    // useStates for modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [areCommentsOpen, setAreCommentsOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    // Values for updating the create card modal as fields are updated
    // Used in the posting of new cards.
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [searchString, setSearchString] = useState("");
    const [GIFYoptions, setGIFYoptions] = useState([]);
    const [chosenGIF, setChosenGIF] = useState("");

    // useStates for updating the comments modal.
    const [comment, setComment] = useState("");
    const [allComments, setAllComments] = useState([]);
    const [cardIDCommentModalOpen, setCardIDCommentModalOpen] = useState(-1);   // Holds the id of the last card clicked on to open the comment modal.
    const [currentCardComments, setCurrentCardComments] = useState([]);   // Holds the comments of the last card clicked on to open the comment modal.

    // useStates for updating the author of the card as determined by the user.
    const [author, setAuthor] = useState("@user");          // Sets the author of the card post. Updated through functions and interactions with the user.
    const [anonymous, setAnonymous] = useState(false);
    const [guest, setGuest] = useState(false);

    const location = useLocation();
    const pathname = location.pathname;
    const boardID = (pathname.split("/"))[pathname.split("/").length - 1];

    const GIFY_API_KEY = import.meta.env.VITE_GIFY_API_KEY;
    const DATABASE = import.meta.env.VITE_BACKEND_ADDRESS;


    /////////// API & CRUD CALLS /////////////

    /***
     *  Function to fetch card data from the database.
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
     * Function to delete card.
     * Cascades (deletes in) related objects as well.
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

    /***
     *  Updates database with new comment using PUT method.
     *  Handles rendering of comments after updating database.
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
            console.log(`ERROR UPDATING COMMENTS: ${error}.`);
        }
    }

    /***
     *  Fetches card data from the database.
     */
    async function fetchCard(cardID) {
        try {
            const response = await fetch(`${DATABASE}/cards/${cardID}`);
            const card = await response.json();

            // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
            if (!response.ok) {
              throw new Error(`HTTP fetch error! Status of ${response.status}.`);
            }

            return card;
        }
        catch (error) {
            console.log(`ERROR GETTING CARD: ${error}.`);
        }
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
                    author: {connect: {"handle": author}},
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
            console.log(`ERROR UPDATING CARD: ${error}.`);
        }
    }

    /***
     *  Searches for a GIF using an API call before updating the gifOptions state, triggering a function that will render them on-screen.
     */
    async function searchGIFY() {
        try {
            const queryURL = "https://api.giphy.com/v1/gifs/search?" + `q=${searchString}&limit=8&api_key=${GIFY_API_KEY}`

            const response = await fetch(queryURL);
            const res = await response.json();
            const gifOptions = await res.data;
            setGIFYoptions(gifOptions);
        }
        catch {
            console.log(`ERROR RETRIEVING GIFS: ${error}.`);
        }
    }




    /////////// GENERAL FUNCTIONS /////////////

    /***
     *  Creates a card from the card data mapped to the function.
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
                    <div>
                        <p><i className="fa-regular fa-heart" onClick={() => upvoteCard(cardID, cardUpvotes)}></i>  {cardData.upvotes}</p>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <i className="fa-solid fa-trash" onClick={() => deleteCard(cardID)}></i>
                        <i className="fa-solid fa-comment" onClick={() => openComments(cardID)}></i>
                    </div>
                </div>
            </div>
        )
    }

    /***
     * Function controlling the opening and closing of the comments modal.
     */
    async function openComments(cardID) {
        handleCommentsModalState();
        setCardIDCommentModalOpen(cardID);

        const card = await fetchCard(cardID);

        setCurrentCardComments(card.comments);
        setAllComments(card.comments);
    }

    /***
     *  Creates comment divs for each comment.
     */
        function createComment(commentInfo) {
            return (
                <div className='comment'>
                    {commentInfo}
                </div>
            )
        }

    /***
     * Handles a user making a choice of a GIF by clicking on a GIF option.
     */
    function chooseGIF(gifInfo) {
        setGIFYoptions([]);
        setChosenGIF(gifInfo.images.original.url);
    }

    /***
     *  Renders the GIFs on-screen for user to choose one.
     */
    function renderGIFs(gifInfo) {
        return (
            <img className='gif' key = {Math.random() * 100000} src={gifInfo.images.original.url} onClick={() => chooseGIF(gifInfo)}></img>
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
     * Controls the opening of the create modal for card creation.
     */
    function handleModalState() {
        setIsModalOpen(!isModalOpen);
    }

    /***
     * Controls the opening of the comments modal.
     */
    function handleCommentsModalState() {
        setAreCommentsOpen(!areCommentsOpen);
    }

    /***
     * Handles changes to the title for a card.
     */
    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    /***
     * Handles changes to a new comment.
     */
    function handleCommentsChange(value) {
        setComment(value);
    }

    /***
     * Handles changes to the message for a card.
     */
    function handleMessageChange(event) {
        setMessage(event.target.value);
    }

     /***
     * Handles changes to the search value for a card.
     */
     function handleSearchChange(event) {
        setSearchString(event.target.value);
    }

    /***
     *  Handles clicking the anonymous checkbox for a card.
     */
    function clickAnonymous() {
        setAnonymous(!anonymous);

        if (!anonymous) {
          setAuthor("@anonymous");
        }
        else if (anonymous && guest) {
          setAuthor("@guest");
        }
        else {
          setAuthor("@user")
        }
      }

    /***
     *  Handles clicking the guest checkbox for a card.
     */
    function clickGuest() {
        setGuest(!guest);

        if (guest && !anonymous) {
            setAuthor("@user");
        }
        else if (!guest && !anonymous) {
            setAuthor("@guest")
        }
    }

    /***
     * Handles changes to the anonymous checkbox.
     */
    function handleAnonymousChange(event) {
        setAnonymous(event.target.value);
    }

    /***
     * Handles changes to the guest checkbox.
     */
    function handleGuestChange(event) {
        setGuest(event.target.value);
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
                <Link to="/"><button className="button">Back</button></Link>
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

            {/* Card creation modal */}
            <div className={'modal ' + (isModalOpen ? 'show' : 'hide')}>
                <span className='exit' onClick={handleModalState}><i className="fa-solid fa-circle-xmark fa-xl"></i></span>
                <section className='title-section'>
                    <p>Title</p>
                    <input id='title' className='form-input' value={title} onChange={handleTitleChange}></input>
                </section>

                <section className='author-section'>
                    <p>Author</p>
                    <input id='author' className='form-input author-field' value={author} readOnly></input>
                    <div style={{display: "flex"}}>
                    <label>
                        Anonymous?
                        <input className='checkbox' type='checkbox' checked={anonymous} onChange={handleAnonymousChange} onClickCapture={clickAnonymous}/>
                    </label>
                    <label>
                        Guest?
                        <input className='checkbox' type='checkbox' checked={guest} onChange={handleGuestChange} onClickCapture={clickGuest} />
                        </label>
                    </div>
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
            <Footer />
        </section>
    )
}

export default Cards;
