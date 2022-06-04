import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Input } from "antd";

import Request from "../../library/request";
import HomeLayout from "../../components/HomeLayout";
import Items from "../../components/Items";
import { SELECT_CATEGORY, SET_CATEGORIES, SET_SEARCH_OPTIONS, LIMIT } from "../../constants";

const SearchInput = Input.Search;

const Category = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [showBook, setShowBook] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const { loading } = useSelector(state => state.common);
  const {
    all: allCategories,
    selected,
    searchOpts,
  } = useSelector(state => state.category);

  const getItems = async (offset = 0, keyword = "") => {
    try {
      if (selected) {
        const searchPayload = {
          offset,
          limit: LIMIT,
          matchCriteria: { category: selected._id },
          keyword,
          keyFields: keyword ? ["name", "author"] : undefined,
        };

        const {data: { success, data }} = await Request.post("/api/books/search", searchPayload);
  
        if (success) {
          const { results, totalCount } = data || {};
          setItemsData(results);
          setShowBook(true);
          dispatch({
            type: SET_SEARCH_OPTIONS,
            payload: {
              keyword,
              offset: searchPayload.offset + LIMIT,
              total: (totalCount && totalCount[0] && totalCount[0].count) || 0,
            },
          });
        } else {
          setItemsData([]);
        }
      } else {
        let payload = allCategories;
  
        if (!payload.length) {
          const {data: { success, data }} = await Request.get(`/api/category/getAll`);
  
          if (success) {
            payload = data;
          }
        }
  
        setItemsData(payload);
        dispatch({ type: SET_CATEGORIES, payload });
        setShowBook(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => getItems(), [selected]);

  const selectCategory = (payload = null) => {
    setSearchKeyword("");
    dispatch({
      type: SET_SEARCH_OPTIONS,
      payload: { keyword: "", offset: 0, total: 0 },
    });
    dispatch({ type: SELECT_CATEGORY, payload });
  };

  /* Handle the search as per needed */
  const onSearch = (str = "") => {
    if (showBook) {
      if (searchKeyword !== str) {
        setSearchKeyword(str);
        // Handle search for the Books
        getItems(0, str);
      }
    } else {
      const keyword = str.replace(/\s/g, "").toLowerCase();

      // Handle filter for Categories
      if (searchKeyword !== keyword) {
        setSearchKeyword(keyword);
  
        if (!keyword) {
          return setItemsData(allCategories);
        }
  
        const reg = new RegExp(keyword);
        const filteredData = itemsData.filter(obj => {
          const text = ["name"].reduce((acc, key) => {
            acc += obj[key] || "";
            return acc;
          }, "");
  
          return reg.test(text.replace(/\s/g, "").toLowerCase());
        });
        setItemsData(filteredData);
      }
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
    <HomeLayout hideFooter>
      <div className="category-header">
        <div className="bread-crumb">
          <span
            className={`b-parent ${showBook ? "has-link" : "hide-pointer"}`}
            onClick={() => showBook ? selectCategory() : (() => {})}
          >
            Categories
          </span>
          {selected && <span className="b-child">{" "} / {" "}{selected.name}</span>}
        </div>
        <div className="search-wrapper">
          <SearchInput
            placeholder = {
              showBook
              ? "Search book by name & author"
              : "Search category by name"
            }
            onSearch={onSearch}
            onChange={onChange}
            style={{ width: 350 }}
          />
        </div>
      </div>
      {!loading && (
        <Items
          showName={true}
          showPrice={showBook}
          showAuthor={showBook}
          showBtn={showBook}
          btnLabel="Add to cart"
          itemsData={itemsData}
          wrapperClass="item-div-wrapper"
          selectItem={showBook ? (() => {}) : item => selectCategory(item)}
        />
      )}
      {showBook && searchOpts.total > LIMIT && (
        <div className="b-paginate">
          <Pagination
            onChange={
              (page = 1) => getItems((page - 1) * LIMIT, searchKeyword)
            }
            total={searchOpts.total}
            pageSize={LIMIT}
            showLessItems={true}
            page={(searchOpts.offset / LIMIT) || 1}
          />
        </div>
      )}
    </HomeLayout>
  );
}

export default Category;
