import React from "react";
import { Row, Col } from "antd";

import SliderComponent from "../../components/Slider";
import HomeLayout from "../../components/HomeLayout";
import {recentBooks} from "./helper";
import "../../resources/home.css";

const STATIC_SLIDER_OPTIONS = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const SLIDER_OPTIONS = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
};

export default function newhome() {
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
              Tell me and i forget,teach me and I may remember,involve me and i
              learn.<br></br>
              Never stop learng because life never stop teaching.The structure
              of your brain changes everytime you learn something new.
            </h3>
          </Col>
        </Row>
      </div>
      {/* 1st slider section */}
      <>
        <div className="slider-heading-div">
          <h2>Recently Added</h2>
        </div>
        <SliderComponent
          showBtn
          showPrice
          showDiscount
          wrapperClass="myslider"
          btnLabel="Add to cart"
          settings={STATIC_SLIDER_OPTIONS}
          items={recentBooks}
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
            wrapperClass="myslider"
            settings={SLIDER_OPTIONS}
            items={recentBooks}
          />
        </div>
      </>
      {/* 3rd slider section */}
      <>
        <div className="slider-heading-div">
          <h2>Available Categories</h2>
        </div>
        <SliderComponent
          showName
          wrapperClass="myslider category-slider"
          settings={STATIC_SLIDER_OPTIONS}
          items={recentBooks}
        />
      </>
    </HomeLayout>
  );
}
