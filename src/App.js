import * as React from "react";
import axios from "axios";

import "./App.css";
import { LastSearches } from "./LastSearches";
import { SearchForm } from "./SearchForm";
import { List } from "./List";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  const isMounted = React.useRef(false); 

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
      console.log("A");
    }
  }, [value, key]);

  return [value, setValue];
};
const getUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`;
const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);
  const extractSearchTerm = (url) => url.replace(API_ENDPOINT, "");
  const getLastSearches = (urls) =>
    urls
      .reduce((result, url, index) => {
        const searchTerm = extractSearchTerm(url);
        if (index === 0) {
          return result.concat(searchTerm);
        }
        const previousSearchTerm = result[result.length - 1];
        if (searchTerm === previousSearchTerm) {
          return result;
        } else {
          return result.concat(searchTerm);
        }
      }, [])
      .slice(-6, -1)
      .map((url) => extractSearchTerm(url));
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };
  const lastSearches = getLastSearches(urls);
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  const handleSearch = (searchTerm) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm);
    event.preventDefault();
  };

  console.log("B:App");

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      Recent Searches : &nbsp;
      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      ></LastSearches>
      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};
 
export default App;
