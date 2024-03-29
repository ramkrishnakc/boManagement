import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Pagination, Input } from "antd";

import { Request } from "../../library";
import { Items } from "../../components";
import {
  BOOK_TYPE_MAPPER,
  SET_SEARCH_OPTIONS,
  LIMIT,
  RECENT_BOOKS,
  TOP_BOOKS,
  FREE_BOOKS,
} from "../../constants";

const SearchInput = Input.Search;

const Book = () => {
  const { bType } = useParams();
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const { loading } = useSelector(state => state.common);
  const { searchOpts } = useSelector(state => state.category);

  const getItems = async (offset = 0, keyword = "") => {
    try {
      const searchPayload = {
        offset,
        limit: LIMIT,
        keyword,
        keyFields: keyword ? ["name", "author"] : undefined,
      };

      if (bType === FREE_BOOKS) {
        searchPayload.matchCriteria = {
          isFree: true,
        };
      }

      if (bType === RECENT_BOOKS) {

      }

      if (bType === TOP_BOOKS) {

      }

      const {data: { success, data }} = await Request.post("/api/books/search", searchPayload);

      if (success) {
        const { results, totalCount } = data || {};
        setItemsData(results);
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => getItems(), []);

  /* Handle the search as per needed */
  const onSearch = (str = "") => {
    if (searchKeyword !== str) {
      setSearchKeyword(str);
      getItems(0, str);
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
          <span className="b-parent hide-pointer">
            Books / {BOOK_TYPE_MAPPER[bType]}
          </span>
        </div>
        <div className="search-wrapper">
          <SearchInput
            placeholder = "Search book by name & author"
            onSearch={onSearch}
            onChange={onChange}
            style={{ width: 350 }}
          />
        </div>
      </div>
      {!loading && (
        <Items
          showName
          showAuthor
          showPrice
          showBtn
          btnLabel="Add to cart"
          itemsData={itemsData}
          wrapperClass="item-div-wrapper"
          selectItem={() => {}}
        />
      )}
      {searchOpts.total > LIMIT && (
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
    </>
  );
}

export default Book;
