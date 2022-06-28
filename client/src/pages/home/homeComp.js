import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Row, Col } from "antd";

import { STATIC_SLIDER_OPTIONS, SLIDER_OPTIONS, SET_CATEGORIES } from "../../constants";
import { Request } from "../../library";
import { HomeLayout, SliderComponent } from "../../components";
import "../../resources/home.css";

const HomeComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [homeData, setHomeData] = useState({
    recentBooks: [],
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
    <HomeLayout>
      <div className="back-image-div">
        <Row>
          <Col span={12}>
            <h1>
              Welcome to <br></br>{" "}
            </h1>
            <h2>Learn Nepal</h2>
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
      <>
        <div
          className="slider-heading-div"
          onClick={() => navigate("/book-store")}
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
    </HomeLayout>
  );
}

export default HomeComponent;
