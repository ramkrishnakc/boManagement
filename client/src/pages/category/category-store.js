import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Button } from "antd";

import Request from "../../library/request";
import HomeLayout from "../../components/HomeLayout";
import noImage from "../../resources/no-image.png";
import "../../resources/books.css";
import { SELECT_CATEGORY, SET_CATEGORIES, SET_SEARCH_OPTIONS, LIMIT } from "../../constants";

const Items = props => {
  if (!props.itemsData.length) {
    return (
      <div
        className={props.wrapperClass}
        style={{color: "red", padding: "20px 0px 0px 20px"}}
      >
        Data not available!!
      </div>
    );
  }

  return (
    <div className={props.wrapperClass}>
      {props.itemsData.map(item => {
        const dis = item.discount || false;

        return (
          <div
            key={item.name}
            className={`item-div ${props.showBtn ? "hide-pointer" : ""}`}
            onClick={() => props.selectItem(item)}
            title={props.showBtn ? item.name: `List books under ${item.name} category`}
          >
            <img src={item.image || noImage} alt="" className="item-img" />
            {props.showName && (<h6>{item.name}</h6>)}
            {props.showAuthor && (
              <h6><strong>Author: {" "}</strong>{item.author}</h6>
            )}
            {props.showPrice && (
              <h6 style={props.h6Style}>
                <strong>Price: {" "}</strong>Rs. {item.price}
                {dis && (<span className="discount-span">{" "}({dis}% off)</span>)}
              </h6>
            )}
            {props.showBtn && <Button block={true} onClick={props.btnClick}>{props.btnLabel}</Button>}
          </div>
        );
      })}
    </div>
  );
};

const Category = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [showBook, setShowBook] = useState(false);
  const { loading } = useSelector(state => state.common);
  const {
    all: allCategories,
    selected,
    searchOpts,
  } = useSelector(state => state.category);

  const getItems = async (myOffset) => {
    try {
      if (selected) {
        const searchPayload = {
          offset: myOffset || 0,
          limit: LIMIT,
          matchCriteria: { category: selected._id },
        };

        const {data: { success, data }} = await Request.post("/api/books/search", searchPayload);
  
        if (success) {
          const { results, totalCount } = data || {};
          setItemsData(results);
          setShowBook(true);
          dispatch({
            type: SET_SEARCH_OPTIONS,
            payload: {
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
    dispatch({ type: SET_SEARCH_OPTIONS, payload: { offset: 0, total: 0 }});
    dispatch({ type: SELECT_CATEGORY, payload });
  };

  /* Add to cart should be implemented */
  const addToCart = () => {};

  return (
    <HomeLayout hideFooter>
      <div className="bread-crumb">
        <span className="b-parent" onClick={() => selectCategory()}>Categories</span>
        {selected && <span className="b-child">{" "} / {" "}{selected.name}</span>}
      </div>
      {!loading && (
        <Items
          showName={true}
          showPrice={showBook}
          showAuthor={showBook}
          showBtn={showBook}
          btnLabel="Add to cart"
          btnClick={addToCart}
          itemsData={itemsData}
          wrapperClass="item-div-wrapper"
          selectItem={!showBook ? item => selectCategory(item) : () => {}}
        />
      )}
      {!loading && showBook && searchOpts.total > LIMIT && (
        <div className="b-paginate">
          <Pagination
            onChange={(page = 1) => getItems((page - 1) * LIMIT)}
            total={searchOpts.total}
            pageSize={LIMIT}
            showLessItems={true}
          />
        </div>
      )}
    </HomeLayout>
  );
}

export default Category;
