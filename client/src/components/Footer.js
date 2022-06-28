import React from "react";
import { Row, Col } from "antd";

const Footer = () => {
  return (
    <div className="footer">
      <Row>
        <Col span={12} className="foot-col">
          <h4>Quick Links</h4>
          <ul>
            <li>lexible solutions </li>
            <li> solution case studies</li>
            <li>material data sheets</li>
            <li>Marian brouchures </li>
            <li>roll length calculator </li>
            <li>durometer comparison chart </li>
            <li>technical ebooks ip rating </li>
            <li> nema rating charts</li>
          </ul>
        </Col>
        <Col span={12} className="foot-col">
          <h4>Contact Us</h4>
          <p>3561 HOMESTEAD RD.SANTA CLARA, CA 95051,UNITED STATES</p>
          <span> P. (877)250-1978</span>
          <p>monday-sunday 9AM-6PM Thursday closed</p>
          <span>F.(877)250-1978</span>
          <strong>info@findmysealant.com </strong>
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
