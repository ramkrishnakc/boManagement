import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Row, Col } from "antd";

import {
  APP_NAME,
  STATIC_SLIDER_OPTIONS,
  SLIDER_OPTIONS,
  SET_CATEGORIES,
  RECENT_BOOKS,
  FREE_BOOKS,
} from "../../constants";
import { Request } from "../../library";
import { SliderComponent } from "../../components";
import "../../resources/home.css";

const HomeComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [homeData, setHomeData] = useState({
    recentBooks: [],
    freeBooks: [],
    topBooks: [],
    categories: [],
  });

  const getData = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/home/getData`);

      if (success) {
        setHomeData({
          ...homeData,
          ...data,
        });
        dispatch({ type: SET_CATEGORIES, payload: data.categories || [] });
      }
    } catch (err) {}
  };

  useEffect(() => {
    getData()
  }, []);

  return (
    <>
      <div className="back-image-div">
        <Row>
          <Col span={12}>
            <h1>
              Welcome to <br></br>{" "}
            </h1>
            <h2>{APP_NAME}</h2>
          </Col>
          <Col span={12}>
            <h3>
              Tell me and I forget, teach me and I may remember, involve me and I
              learn.<br></br>
              Never stop learng because life never stop teaching. The structure
              of your brain changes everytime you learn something new.
            </h3>
          </Col>
        </Row>
      </div>
      {/* 1st slider section */}
      {
        homeData.recentBooks.length === 0 ? "" : (
        <>
          <div
            className="slider-heading-div"
            onClick={() => navigate(`/book-store/${RECENT_BOOKS}`)}
            title="Go to book store"
          >
            Recently Added
          </div>
          <SliderComponent
            showBtn
            showPrice
            btnLabel="Add to cart"
            wrapperClass="myslider"
            settings={STATIC_SLIDER_OPTIONS}
            items={homeData.recentBooks}
          />
        </>
      )}
      {/* 2nd slider section */}
      <>
        <div className="back-image-div recent-slider">
          <Row>
            <Col span={4} />
            <Col span={12}>
              <h1>
                Top Rated Books<br></br>{" "}
              </h1>
              <h2>Available in our Store</h2>
            </Col>
            <Col span={4} />
          </Row>
          <SliderComponent
            showBtn
            showPrice
            btnLabel="Add to cart"
            h6Style={{ color: "white" }}
            wrapperClass="myslider"
            settings={SLIDER_OPTIONS}
            items={homeData.topBooks}
          />
        </div>
      </>
      {/* 3rd slider section */}
      {
        homeData.freeBooks.length === 0 ? "" : (
        <>
          <div
            className="slider-heading-div"
            onClick={() => navigate(`/book-store/${FREE_BOOKS}`)}
            title="Go to book store"
          >
            Available for Free
            <sub style={{ fontSize: "12px" }}>(Login and read for free)</sub>
          </div>
          <SliderComponent
            showName
            showFree
            wrapperClass="myslider"
            settings={STATIC_SLIDER_OPTIONS}
            items={homeData.freeBooks}
          />
        </>
      )}
      {/* 4th slider section */}
      <>
        <div
          className="slider-heading-div"
          onClick={() => navigate("/category-store")}
          title="Go to available categories page"
        >
          Available Categories
        </div>
        <SliderComponent
          showName
          wrapperClass="myslider category-slider"
          settings={STATIC_SLIDER_OPTIONS}
          items={homeData.categories}
        />
      </>
    </>
  );
}

export default HomeComponent;
