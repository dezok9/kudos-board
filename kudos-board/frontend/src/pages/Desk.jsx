import { useState, useEffect } from 'react';
import Boards from '../components/boards/Boards';
import Header from '../components/Header'
import './Desk.css';


function Desk() {
  const sample = {
    id: 1,
    title: "Capstone Project",
    author: "@dezok",
    imgURL: "https://picsum.photos/id/237/200/300",
    tags: ["projects"],
    date: "June 18, 2024"
  }
  // User ID stored and passed to other pages.
  const [user, setUser] = useState("@dezok");

  const routeState = user;

  const [boardData, setBoardData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("@user");
  const [searchQuery, setSearchQuery] = useState("");

  const DATABASE = import.meta.env.VITE_BACKEND_ADDRESS;
  const GIFY_API_KEY = import.meta.env.GIFY_API_KEY;
  const TAGS = {"all": "rgba(0, 0, 0, 0.4)",
              "birthdays": "rgba(117, 185, 190, 0.6)",
              "community": "rgba(249, 181, 172, 0.6)",
              "celebration": "rgba(170, 125, 206, 0.6)",
              "projects & work": "rgba(0, 0, 0, 0.6)",
              "thank you": "rgba(0, 0, 0, 0.6"};

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
              author: {connect: {handle: boardAuthor}},
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
      console.log(`ERROR CREATING BOARD: ${error}.`);
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
   * Filters by the indicated tag.
   * Performed when one of the tags is clicked.
   */
    async function search() {
        try {
        const response = await fetch(`${DATABASE}/boards/search/${searchQuery}`);
        const boards = await response.json();

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
   * Handle search button being hit.
   */
  function handleSearch(event) {
    setSearchQuery(event.target.value);
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
      <div className='sidebar'>
        <h2 className='greeting'>Welcome back, <strong className='user'>{user}!</strong></h2>
      </div>

      <div className='navigation'>
        <p><i class="fa-solid fa-user fa-xl navigation-item"></i>Profile</p>
        <i class="fa-solid fa-house fa-xl"></i>
        <i class="fa-solid fa-magnifying-glass fa-xl navigation-icon"></i>
      </div>

      <section className='page'>
        {/* <section>
          <i className='fa-solid fa-certificate fa-10x decor-one rotate'></i>
          <i className='fa-solid fa-certificate fa-6x decor-two rotate'></i>
          <i className='fa-solid fa-certificate rotate'></i>
        </section> */}

        <Header />

        <div className='bar'>
          <h2>Kudos</h2>
          <button className='button create-button' onClick={handleModalState}>CREATE</button>
          <section className=''>
            <input className='search-bar' placeholder='Search for a kudos...' value={searchQuery} onChange={handleSearch}></input>
            <button className='button' onClick={search}>SEARCH</button>
          </section>
          <div>
          </div>
        </div>

        <div className='tag-filters'>
          {Object.keys(TAGS).map(createTagFilters)}
        </div>

        <div className='cards'>
          <Boards
            DATABASE = {DATABASE}
            boardsData = {boardData}
            routeState = {routeState}
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

            <button className='submit-button' onClick={handleSubmit}>SUBMIT</button>

            <p className={'warning ' + (showWarning ? 'show' : 'hide')}><i className='fa-solid fa-certificate rotate'></i>  Please fill in all required fields.</p>
          </section>
      </section>
    </>
  )
}

export default Desk;
