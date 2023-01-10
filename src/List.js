import * as React from "react";
import { ReactComponent as Check } from "./check.svg";
import { sortBy } from "lodash";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENT: (list) => sortBy(list, "num_comments").reverse(),
  POINTS: (list) => sortBy(list, "points").reverse(),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState({
    sortKey: "NONE",
    isReverse: false,
  });
  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };
  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);
  return (
    <ul>
      <li style={{ display: "flex" }}>
        <span style={{ width: "40%" }}>
          <button
            className="button"
            type="button"
            onClick={() => handleSort("TITLE")}
          >
            <b>Title</b>
          </button>
        </span>
        <span style={{ width: "30%" }}>
          <button
            className="button"
            type="button"
            onClick={() => handleSort("AUTHOR")}
          >
            <b>Author</b>
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button
            className="button"
            type="button"
            onClick={() => handleSort("COMMENT")}
          >
            <b>Comments</b>
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button
            className="button"
            type="button"
            onClick={() => handleSort("POINTS")}
          >
            <b>Points</b>
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <b>Actions</b>
        </span>
      </li>
      <br />
      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
};

const Item = ({ item, onRemoveItem }) => (
  <li className="item">
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: "30%" }}>{item.author}</span>
    <span style={{ width: "10%" }}>{item.num_comments}</span>
    <span style={{ width: "10%" }}>{item.points}</span>
    <span style={{ width: "10%" }}>
      <button
        type="button"
        onClick={() => onRemoveItem(item)}
        className="button button_small"
      >
        <Check height="18px" width="18px" />
      </button>
    </span>
  </li>
);

export { List };
