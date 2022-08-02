import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { ALL_BOOKS, RECENT_BOOKS, TOP_BOOKS, FREE_BOOKS } from "../constants";

const Footer = () => {
  return (
    <div className="footer">
      <Row>
        <Col span={12} className="foot-col">
          <h4>Quick Links</h4>
          <ul>
            <li>◾{" "}<Link to={`/book-store/${ALL_BOOKS}`}>All Available Books</Link></li>
            <li>◾{" "}<Link to={`/book-store/${RECENT_BOOKS}`}>Recently Added Books</Link></li>
            <li>◾{" "}<Link to={`/book-store/${TOP_BOOKS}`}>Top Rated Books</Link></li>
            <li>◾{" "}<Link to={`/book-store/${FREE_BOOKS}`}>Available for Free Books</Link></li>
            <li>◾{" "}<Link to="/category-store">Available Categories</Link></li>
            <li>◾{" "}<Link to="/institution-list">Associated Institutions</Link></li>
            <li>◾{" "}<Link to="/cart">My Cart Items</Link></li>
          </ul>
        </Col>
        <Col span={12} className="foot-col">
          <h4>Contact Us</h4>
          <p>SHINE EDUCATION PVT. LIMITED</p>
          <p>KATHMANDU, NEPAL</p>
          <span> P. (877)250-1978</span>
          <p>Sunday - Saturday (9AM-6PM, GMT+5:45)</p>
          <span>F. (877)250-1978</span>{" "}
          <strong>E. info@shineeducation.com</strong>
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
