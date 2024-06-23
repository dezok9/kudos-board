import { useState, useEffect } from 'react';
import Boards from '../components/boards/Boards';
import Header from '../components/Header'
import './Home.css';
import Footer from '../components/Footer';

function Home() {
  const [boardData, setBoardData] = useState([]);

  // Modal use states.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("@user");
  const [searchQuery, setSearchQuery] = useState("");
  const [description, setDescription] = useState("");
  // Use states for tags for modals.
  const [birthdaysSelected, setBirthdaysSelected] = useState(false);
  const [communitySelected, setCommunitySelected] = useState(false);
  const [celebrationSelected, setCelebrationSelected] = useState(false);
  const [projectsSelected, setProjectsSelected] = useState(false);
  const [thanksSelected, setThanksSelected] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [guest, setGuest] = useState(false);

  // States for buttons collected into a single dictionary. States in this dictionary are defined above.
  const buttonStates = {"birthdays": birthdaysSelected, "community": communitySelected,
      "celebration": celebrationSelected, "projects & work": projectsSelected, "thank you": thanksSelected};

  const DATABASE = import.meta.env.VITE_BACKEND_ADDRESS;
  const GIFY_API_KEY = import.meta.env.VITE_GIFY_API_KEY;
  const TAGS = {"all": "rgba(0, 0, 0, 0.4)",
              "recent": "rgba(207, 159, 255, 0.6)",
              "birthdays": "rgba(129, 210, 224, 0.6)",
              "community": "rgba(73, 196, 161, 0.6)",
              "celebration": "rgba(237, 182, 37, 0.6)",
              "projects & work": "rgba(230, 24, 109, 0.6)",
              "thank you": "rgba(255, 87, 51, 0.6"};



  /////////// API & CRUD CALLS /////////////

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
   * Function for fetching and filtering the recent board posts.
   */
  async function fetchRecents() {
    try {
      const response = await fetch(`${DATABASE}/boards/recents`);

      // Checks if res.ok, a boolean value checking if the fetch was successful (200-299).
      if (!response.ok) {
        throw new Error(`HTTP fetch error! Status of ${response.status}.`);
      }

      const boards = await response.json();
      setBoardData(boards);
    }
    catch (error) {
      console.log(`ERROR GETTING RECENT BOARDS: ${error}.`);
    }
  }

  /***
   * Gets a sticker that matches the theme of the board.
   * Either searches by the first tag or by the title of the board.
   */
  async function getImgURL(title, tags) {
    try {
      let apiQuery = "https://api.giphy.com/v1/stickers/search?rating=g?q="

      if (tags.length == 0) {
        apiQuery = apiQuery.concat(title);
      }
      else {
        apiQuery += tags[0];
      }

      apiQuery = apiQuery.concat(`&limit=1&api_key=${GIFY_API_KEY}`);
      const response = await fetch(apiQuery);
      const gifyData = await response.json();

      if (gifyData.meta.status != 200) {
        throw new Error(`HTTP fetch error! Status of ${response.status}.`);
      }

      if (gifyData.data[0] != undefined) {
        return gifyData.data[0].images.fixed_height_downsampled.url;
      }
      else {
        apiQuery = `https://api.giphy.com/v1/stickers/random?tag=happy&rating=g&api_key=${GIFY_API_KEY}`

        const response = await fetch(apiQuery);
        const resData = await response.json();


        return resData.data.images.fixed_height_downsampled.url;
      }
    }
    catch {
      console.log(`ERROR GETTING IMAGE URL: ${error}.`);
    }
  }

  /***
   * Adding new board information to our database.
   * Determines which tags are selected prior to adding board information.
   */
  async function postBoard(boardTitle, boardAuthor, description, boardDate) {
    let tags = []
      switch (true) {
        case birthdaysSelected:
          tags.push("birthdays");
        case communitySelected:
          tags.push("community");
        case celebrationSelected:
          tags.push("celebration");
        case projectsSelected:
          tags.push("projects & work")
        case thanksSelected:
          tags.push("thank you");
      }

    try {
      const gifURL = await getImgURL(boardTitle, tags);

      const response = await fetch(`${DATABASE}/boards`,
          {method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            "body": JSON.stringify({
              title: boardTitle,
              author: {connect: {handle: author}},
              description: description,
              imgURL: gifURL,
              tags: tags,
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
    if (tag == "recent") {
      fetchRecents();
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
   * Search by search query.
   * Performed when the search button is clicked.
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
     * Generates filled tags using the colors assigned to each tag as communicated by boards.tagColors.
     * Called by a mapping function.
     */
    function generateTag(tag, toggle) {
      const tagColor = TAGS[tag]

      if (!toggle) {
        return (
            <p className='tag' style={{backgroundColor: tagColor, border: `2px solid ${tagColor}`}} onClick={() => filterByTag(tag)} key={Math.random()*1000}>{tag}</p>
        )
      }
      else {
        return (
          <p className='tag' onClick={() => toggleFilter(tag)} style={{backgroundColor: tagColor, border: `2px solid ${tagColor}`}} key={Math.random()*1000}>{tag}</p>
        )
      }
  }

  /***
   * Changes the filter from outlined to filled and vice versa.
   */
  function toggleFilter(tag) {
    switch(tag) {
      case "birthdays":
        setBirthdaysSelected(!birthdaysSelected)
        break;
      case "community":
        setCommunitySelected(!communitySelected)
        break;
      case "celebration":
        setCelebrationSelected(!celebrationSelected)
        break;
      case "projects & work":
        setProjectsSelected(!projectsSelected)
        break;
      case "thank you":
        setThanksSelected(!thanksSelected)
        break;
    }
  }

  /***
   * Generates tags using the colors assigned to each tag as communicated by boards.tagColors.
   */
  function generateSelectorOutlinedTag(tag) {
    const tagColor = TAGS[tag]

    return (
        <p className='tag' onClick={() => toggleFilter(tag)}  style={{border: `2px solid ${tagColor}`}} key={Math.random()*1000}>{tag}</p>
    )
  }


  /***
   * Controls the opening of the modal for board creation.
   */
  function handleModalState() {
    if (isModalOpen) {
      setShowWarning(false);
      setBirthdaysSelected(false);
      setCommunitySelected(false);
      setCelebrationSelected(false);
      setProjectsSelected(false);
      setThanksSelected(false);
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

      postBoard(title, author, description, today);
    }
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
   * Handles changes to the board creation form.
   */
  function handleFieldChange(event) {
    setTitle(event.target.value);
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

  /***
   * Handle search button being clicked.
   */
  function handleSearch(event) {
    setSearchQuery(event.target.value);
  }

   /***
   * Handles changes to the board creation form.
   */
   function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }


  useEffect(() => {fetchBoards()}, [isModalOpen]);

  useEffect(() => {}, [title]);

  useEffect(() => {}, [boardData]);

  useEffect(() => {}, [buttonStates]);


  return (
    <>
      <div className='sidebar'>
        <h2 className='greeting'>Welcome back to your desk, <strong className='user'>{author}!</strong></h2>
        <h3>Let's catch you up:</h3>
        {generateTag("recent")}
      </div>

      <section className='page'>
        <Header />

        <div className='bar'>
          <h2 className='greeting'>Kudos</h2>
          <button className='button create-button' onClick={handleModalState}>CREATE</button>
          <section className=''>
            <input className='search-bar' placeholder='Search for a kudos...' value={searchQuery} onChange={handleSearch}></input>
            <button className='button' onClick={search}>SEARCH</button>
          </section>
          <div>
          </div>
        </div>

        <div className='tag-filters'>
          {Object.keys(TAGS).map(generateTag)}
        </div>

        <div className='cards'>
          <Boards
            DATABASE = {DATABASE}
            fetchBoards = {fetchBoards}
            boardsData = {boardData}
            TAGS = {TAGS}
            generateTag = {generateTag}
            key = {1}
          />
        </div>

        <section className={'create-modal ' + (isModalOpen ? 'show' : 'hide')}>
            <span className='exit' onClick={handleModalState}><i className="fa-solid fa-circle-xmark fa-xl"></i></span>


            <section className='title-section'>
              <p>Title</p>
              <input id='title' className='form-input' value={title} onChange={handleFieldChange}></input>
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

            <section className='title-section'>
              <p>Description</p>
              <input id='title' className='form-input' value={description} onChange={handleDescriptionChange}></input>
            </section>

            <section>
              <p>Tags</p>
              <div className='tag-filters'>
                {Object.keys(TAGS).splice(2).map(tag => buttonStates[tag] ? generateTag(tag) : generateSelectorOutlinedTag(tag))}
              </div>
            </section>

            <button className='submit-button' onClick={handleSubmit}>SUBMIT</button>

            <p className={'warning ' + (showWarning ? 'show' : 'hide')}><i className='fa-solid fa-certificate rotate'></i>&nbsp; Please fill in all required fields.</p>
          </section>
          <Footer/>
      </section>
    </>
  )
}

export default Home;
