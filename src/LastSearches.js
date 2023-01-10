import * as React from 'react' ;
const LastSearches = ({ lastSearches, onLastSearch }) => {
    return (
      <>
        {lastSearches.map((searchTerm, index) => (
          <button
          className='button'
            key={searchTerm + index}
            type="button"
            onClick={() => onLastSearch(searchTerm)}
            style={{border: "1px"}}
          >
            &nbsp;{searchTerm} &nbsp;
          </button>
          
        ))}
      </>
    );
  };

export {LastSearches} ;