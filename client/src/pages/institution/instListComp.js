import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";

import { Request } from "../../library";
import { Items } from "../../components";
import { SET_INSTITUTIONS } from "../../constants";

const SearchInput = Input.Search;

const InstitutionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [itemsData, setItemsData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const { loading } = useSelector(state => state.common);
  const { all: allItems } = useSelector(state => state.institution);

  const getAllItems = async () => {
    const {data: { success, data }} = await Request.get("/api/institution/getAll");

    if (success) {
      dispatch({ type: SET_INSTITUTIONS, payload: data });
      setItemsData(data);
    }
  };

  useEffect(() => getAllItems(), []);

  /* Handle the search as per needed */
  const onSearch = (str = "") => {
    const keyword = str.replace(/\s/g, "").toLowerCase();

    // Handle filter for institutions
    if (searchKeyword !== keyword) {
      setSearchKeyword(keyword);

      if (!keyword) {
        return setItemsData(allItems);
      }

      const reg = new RegExp(keyword);
      const filteredItems = itemsData.filter(obj => {
        const text = ["name"].reduce((acc, key) => {
          acc += obj[key] || "";
          return acc;
        }, "");

        return reg.test(text.replace(/\s/g, "").toLowerCase());
      });
      setItemsData(filteredItems);
    }
  };

  /* Handle the change in the search box */
  const onChange = e => {
    const keyword = e && e.target && e.target.value;

    if (!keyword) {
      onSearch("");
    }
  };

  return (
    <>
      <div className="category-header">
        <div className="bread-crumb">
          <span className="b-parent hide-pointer">Institutions</span>
        </div>
        <div className="search-wrapper">
          <SearchInput
            placeholder="Search institution by name"
            onSearch={onSearch}
            onChange={onChange}
            style={{ width: 350 }}
          />
        </div>
      </div>
      {!loading && (
        <Items
          showName
          itemsData={itemsData}
          wrapperClass="item-div-wrapper"
          selectItem={({ _id: id }) => navigate(`/institution-info/${id}`)}
        />
      )}
    </>
  );
}

export default InstitutionList;
