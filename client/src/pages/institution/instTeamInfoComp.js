import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { useSelector } from "react-redux";
import { Input } from "antd";

import { Request } from "../../library";
import noImage from "../../resources/no-image.png";

const SearchInput = Input.Search;
const SEARCH_FIELDS = ["name", "position", "department"];

const InstTeamDisplay = ({ refId }) => {
  const [items, setItems] = useState([]);
  const [itemsDisplay, setItemsDisplay] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const { loading } = useSelector(state => state.common);

  useEffect(() => {
    const getItems = async () => {
      try {
        if (refId) {
          const {
            data: { success, data },
          } = await Request.get(`/api/institution/getByRefId-team/${refId}`);
  
          if (success && data) {
            setItems(data);
            setItemsDisplay(data);
          }
        }
      } catch (err) {}
    };
    getItems();

  }, [refId]);

  /* Handle search */
  const onSearch = (str = "") => {
    const keyword = str.replace(/\s/g, "").toLowerCase();

    if (searchKeyword !== keyword) {
      setSearchKeyword(keyword);

      if (!keyword) {
        return setItemsDisplay(items);
      }

      const reg = new RegExp(keyword);
      const filteredData = items.filter(obj => {
        const text = SEARCH_FIELDS.reduce((acc, key) => {
          acc += obj[key] || "";
          return acc;
        }, "");

        return reg.test(text.replace(/\s/g, "").toLowerCase());
      });
      setItemsDisplay(filteredData);
    }
  };
  
  /* Handle change in search input */
  const onChange = e => {
    if (!get(e, "target.value")) {
      onSearch("");
    }
  };

  return (
    <>
      <div className="search-wrapper">
        <SearchInput
          placeholder = "Search by name, designation and department"
          onSearch={onSearch}
          onChange={onChange}
          style={{ width: 450 }}
        />
      </div>
      {!loading && (
        itemsDisplay.map(item => {
          return (
            <div key={item.name} className="team-div">
              <img src={item.image || noImage} alt="" className="team-img" />
              <p className="member-name">{item.name}</p>
              <p className="member-department">{item.position} | {item.department}</p>
              {
                item.about && (
                  <p className="member-about">{item.about}</p>
                )
              }
              {item.website && (
                <p>
                  Website: <a href={item.website} className="ext-link">{item.website}</a>
                </p>
              )}
              {item.linkedIn && (
                <p>
                  LinkedIn: <a href={item.linkedIn} className="ext-link">{item.linkedIn}</a>
                </p>
              )}
            </div>
          );
        })
      )}
    </>
  );
}

export default InstTeamDisplay;
