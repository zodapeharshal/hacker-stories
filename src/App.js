import "./App.css";
import { useEffect, useState } from "react";
const title = "React js";

function App() {
  const stories = [
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
  const [searchTerm, setSearchTerm] = useSemiPersistentState('React') ;
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(()=> {
    localStorage.setItem('srh',searchTerm) ;
  },[searchTerm]);

  const searchedStories = stories.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div className="App">
      <h1> Hello World from {title} </h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <ListComp list={searchedStories} />
    </div>
  );
}

function ListComp({list}) {
  return (
    <ul>
      {list.map(function (item) {
        return <Item key={item.objectID} item= {item} />;
      })}
    </ul>
  );
}

const Item = ({ item }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
);

function Search(props) {
  const updateSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const { search } = props;
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        value={search}
        type="text"
        onChange={(e) => {
          props.onSearch(e);
          updateSearchTerm(e);
        }}
      />
      <p>
        Searching for <strong> {searchTerm}</strong>
      </p>
    </div>
  );
}

const useSemiPersistentState = (initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem('value') || initialState
  );
  useEffect(()=>{
    localStorage.setItem(
      'value', value
    )
  },[value]);
  return [value, setValue] ;
}

export default App;
