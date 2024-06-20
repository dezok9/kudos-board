import { useState, useEffect } from 'react';
import './App.css';
import Boards from './components/boards/Boards';

function App() {

  const sample = {
    id: 1,
    title: "Capstone Project",
    author: "@dezok",
    imgURL: "https://picsum.photos/id/237/200/300",
    tags: ["projects"],
    date: "June 18, 2024"
  }
  const [boardData, setBoardData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("@me");

  const DATABASE = import.meta.env.VITE_BACKEND_ADDRESS;
  const TAGS = {"all": "rgba(0, 0, 0, 0.4)",
              "birthdays": "rgba(0, 0, 0, 0.4)",
              "community": "rgba(0, 0, 0, 0.4)",
              "celebration": "rgba(0, 0, 0, 0.4)",
              "projects & work": "rgba(0, 0, 0, 0.4)",
              "thank you": "rgba(0, 0, 0, 0.4"};

  /***
   * Fetching the board information from our database.
   */
  async function fetchBoards() {
    try {
      const response = await fetch(`${DATABASE}/boards`);

      // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
      if (!response.ok) {
        throw new Error(`HTTP fetch error! Status of ${response.status}.`);
      }

      const boards = await response.json();
      setBoardData(boards);
    }
    catch (error) {
      console.log(`ERROR GETTING BOARDS: ${error}.`);
    }
  }

  /***
   * Adding new board information to our database.
   */
  async function postBoard(boardTitle, boardAuthor, boardImgURL, boardTags, boardDate) {
    try {
      const response = await fetch(`${DATABASE}/boards`,
          {method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            "body": JSON.stringify({
              title: boardTitle,
              author: boardAuthor,
              imgURL: boardImgURL,
              tags: boardTags,
              date: boardDate
            })
          });

      // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
      if (!response.ok) {
        throw new Error(`HTTP fetch error! Status of ${response.status}.`);
      }

      fetchBoards();
    }
    catch (error) {
      console.log(`ERROR GETTING BOARDS: ${error}.`);
    }
  }

  /***
   * Upvote cards (change the upvote count to +1) given the cardID and currentUpvote that was previously retrieved.
   * Passed to Cards for use.
   */
  async function upvoteCard(id, currentUpvotes) {
    try {
      const response = await fetch(`${DATABASE}/cards/upvote/${id}`,
          {method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            "body": JSON.stringify({
              upvote: (currentUpvotes + 1)
            })
          });

      // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
      if (!response.ok) {
        throw new Error(`HTTP fetch error! Status of ${response.status}.`);
      }

      fetchBoards();
    }
    catch (error) {
      console.log(`ERROR GETTING BOARDS: ${error}.`);
    }
  }


  /***
   * Removing boards from our database using the id value.
   * Passed into the Boards component for use on individual boards.
   */
  async function deleteBoard(boardID) {
    try {
      const response = await fetch(`${DATABASE}/boards/${boardID}`,
        {method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });

      // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
      if (!response.ok) {
        throw new Error(`HTTP fetch error! Status of ${response.status}.`);
      }

      fetchBoards();
    }
    catch (error) {
      console.log(`ERROR GETTING BOARD: ${error}.`);
    }
  }


  /***
   * Filters by the indicated tag.
   * Performed when one of the tags is clicked.
   */
  async function filterByTag(tag) {
    if (tag == "all") {
      fetchBoards();
    }
   else {
      try {
        const response = await fetch(`${DATABASE}/boards/filter/${tag}`);
        const boards = await response.json();
        console.log(boards)

        // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
        if (!response.ok) {
          throw new Error(`HTTP fetch error! Status of ${response.status}.`);
        }

        setBoardData(boards);
      }
      catch (error) {
        console.log(`ERROR GETTING BOARD: ${error}.`);
      }
    }
  }


  /***
   * Controls the opening of the modal for board creation.
   */
  function handleModalState() {
    if (isModalOpen) {
      setShowWarning(false);
    }

    setIsModalOpen(!isModalOpen);
  }


  /***
   * Handles submission of the board creation form.
   * Submits only if all of the fields are filled.
   */
  function handleSubmit() {
    if (author.replace(" ", "") == "" || title.replace(" ", "") == "") {
      setShowWarning(true);
      return;
    }
    else {
      const date = new Date();
      const today = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + date.getDate();

      handleModalState();

      postBoard(title, author, "", [], today);
    }
  }


  /***
   * Handles changes to the board creation form.
   */
  function handleFieldChange(event) {
    setTitle(event.target.value);
  }


  /***
   * Returns filter div for each tag.
   */
  function createTagFilters(tag) {
    const tagColor = TAGS[tag];
    return(
      <div className='tag' style={{backgroundColor: tagColor}} onClick={() => filterByTag(tag)} key={Math.random()*100000}>{tag}</div>
    )
  }


  useEffect(() => {
    fetchBoards();
  }, [isModalOpen]);

  useEffect(() => {}, [title]);

  useEffect(() => {}, [boardData]);

  // document.addEventListener("mousedown", (event) => {
  //   if (isModalOpen && event.target.id != "show") {
  //     setIsModalOpen(!isModalOpen);
  //   }
  // })


  return (
    <>
      <section className='page'>
        {/* <section>
          <i className='fa-solid fa-certificate fa-10x decor-one rotate'></i>
          <i className='fa-solid fa-certificate fa-6x decor-two rotate'></i>
          <i className='fa-solid fa-certificate rotate'></i>
        </section> */}

        <div className='navigation-bar'>
          <h2>Kudos</h2>
          <button className='button create-button' onClick={handleModalState}>Create</button>
          <button className='button profile-button'>Profile</button>
          <input className='search-bar' placeholder='Search for a kudos...'></input>
          <div>
            <i className="fa-solid fa-user"></i>
            <i className="fa-solid fa-door-closed"></i>
          </div>
        </div>

        <div className='tag-filters'>
          {Object.keys(TAGS).map(createTagFilters)}
        </div>

        <div className='cards'>
          <Boards
            boardsData = {boardData}
            deleteBoard = {deleteBoard}
            TAGS = {TAGS}
            key = {1}
          />
        </div>

        <section className={'create-modal ' + (isModalOpen ? 'show' : 'hide')}>
            <section className='title-section'>
              <p>Title</p>
              <input id='title' className='form-input' value={title} onChange={handleFieldChange}></input>
            </section>

            <section className='author-section'>
              <p>Author</p>
              <input id='author' className='form-input author-field' value={author} readOnly></input>
              <label className='switch'>
                <input type='checkbox'/>
                <span className='slider'></span>
              </label>
            </section>

            <section>
              <p>Tags</p>
              <div>
                <input className='tag-checkbox'type='checkbox'/>
              </div>
            </section>

            <button className='submit-button' onClick={handleSubmit}>Submit</button>

            <p className={'warning ' + (showWarning ? 'show' : 'hide')}><i className='fa-solid fa-certificate rotate'></i>  Please fill in all required fields.</p>
          </section>
      </section>
    </>
  )
}

export default App;
