import React, { useState, useEffect } from "react"
import { useLocation, Link } from 'react-router-dom'
import Card from '../components/cards/Card'
import './BoardCards.css'

function BoardCards() {
    const [cardsData, setCardsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("@user");
    const [message, setMessage] = useState("");
    const [searchString, setSearchString] = useState("");
    const [GIFYoptions, setGIFYoptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [chosenGIF, setChosenGIF] = useState("");

    const location = useLocation();

    const pathname = location.pathname;
    const boardID = (pathname.split("/"))[pathname.split("/").length - 1];

    const GIFY_API_KEY = import.meta.env.VITE_GIFY_API_KEY;

    const user = location.state;


    const DATABASE = import.meta.env.VITE_BACKEND_ADDRESS;

    /***
     *
     */
    async function fetchCards() {
        try {
            const response = await fetch(`${DATABASE}/boards/${boardID}`);
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

    /***
     *
     */
    function createCard(cardData) {
        const cardID = cardData.id;
        const cardUpvotes = cardData.upvotes;


        return (
            <div className='card' key={cardData.id}>
                <img src={cardData.gifURL}></img>
                <div>
                    <p className='card-id'>#{cardData.id}</p>
                    <p>{cardData.title}</p>
                    <p className='author'>{cardData.authorHandle}</p>
                    <p className='author'>{cardData.message}</p>
                    {/* <p>{cardData.date}</p> */}
                    <div>
                        <p><i className="fa-regular fa-heart" onClick={() => upvoteCard(cardID, cardUpvotes)}></i>  {cardData.upvotes}</p>
                    </div>
                    <i className="fa-solid fa-trash" onClick={() => deleteCard(cardID)}></i>
                </div>
            </div>
        )
    }

    /***
     * Adding new card information to our database.
     */
    async function postCard(cardTitle, cardMessage, cardGIF) {
        console.log(user)
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
                    gifURL: cardGIF,
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

    function choose(event) {
        console.log("xd")
        event.stopPropogation()
        setGIFYoptions([]);
        setChosenGIF(gifInfo.url);
    }

    /***
     *
     */
    function renderGIFs(gifInfo) {
        return (
            <iframe key={gifInfo.id} className='gif' src={gifInfo.embed_url} onClick={choose}></iframe>
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

            postCard(title, message, "");
        }
    }

    /***
     * Controls the opening of the modal for board creation.
     */
    function handleModalState() {
        setIsModalOpen(!isModalOpen);
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
    function handleMessageChange(event) {
        setMessage(event.target.value);
    }

     /***
     * Handles changes to the board creation form.
     */
     function handleSearchChange(event) {
        setSearchString(event.target.value);
    }

    useEffect(() => {}, [cardsData]);

    useEffect(() => {fetchCards()}, [])

    useEffect(() => {fetchCards()}, [isModalOpen])

    useEffect(() => {setIsModalOpen(true)}, [GIFYoptions])

    return (
        <>
            <Link to="/" state={user}><button>Back</button></Link>
            <button onClick={handleModalState}>Add Card</button>

            <div id='cards'>
                {cardsData.map(createCard)}
            </div>

            <div className={'modal ' + (isModalOpen ? 'show' : 'hide')}>
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

                <section>
                <p>Tags</p>
                    <div>
                        <input className='tag-checkbox'type='checkbox'/>
                    </div>
                </section>

                <button className='submit-button' onClick={handleSubmit}>Submit</button>

                <p className={'warning ' + (showWarning ? 'show' : 'hide')}><i className='fa-solid fa-certificate rotate'></i>  Please fill in all required fields.</p>
            </div>
        </>
    )
}

export default BoardCards;
