import "./App.css";
import React, { useEffect, useState } from "react";
const title = "React js";

function App() {
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
    {
      title: "Redux2",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 2,
    },
    {
      title: "Redux3",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 3,
    },
    {
      title: "Redux4",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 4,
    },
    {
      title: "Redux5",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 5,
    },
  ];
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false) ;

 

  React.useEffect(() => {
    getAsynchronousStories().then((result) => {
      setStories(result.data.stories);
      setIsLoading(false);
    }).catch(()=> setIsError(true)) ;
  });

  const getAsynchronousStories = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
    );

  useEffect(() => {
    getAsynchronousStories().then((result) => {
      setStories(result.data.stories);
    });
  });

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    localStorage.setItem("srh", searchTerm);
  }, [searchTerm]);

  const searchedStories = stories.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="App">
      <h1> Hello World from {title} </h1>
      {/* <Search search={searchTerm} onSearch={handleSearch} /> */}
      <InputWithLabel
        id="search"
        value={searchTerm}
        type="text"
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search : </strong>
      </InputWithLabel>
      <hr />
      {isError && <p>Something went wrong ...</p>}
      {isLoading ? (
        <p> Loading... </p>
      ) : (
        <ListComp list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

function ListComp({ list, onRemoveItem }) {
  return (
    <ul>
      {list.map(function (item) {
        return (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        );
      })}
    </ul>
  );
}

const Item = ({ item, onRemoveItem }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

// function Search(props) {
//   const updateSearchTerm = (event) => {
//     setSearchTerm(event.target.value);
//   };
//   const [searchTerm, setSearchTerm] = useState("");
//   const { search } = props;
//   return (
//     <>
//       <label htmlFor="search">Search: </label>
//       <input
//         id="search"
//         value={search}
//         type="text"
//         onChange={(e) => {
//           props.onSearch(e);
//           updateSearchTerm(e);
//         }}
//       />
//       <p>
//         Searching for <strong> {searchTerm}</strong>
//       </p>
//     </>
//   );
// }

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

const InputWithLabel = ({
  id,
  value,
  type,
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        ref={inputRef}
      />
    </>
  );
};

export default App;
