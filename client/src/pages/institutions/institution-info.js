import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { SELECT_INST_MENU } from "../../constants";
import HomeLayout from "../../components/HomeLayout";
import Request from "../../library/request";

import About from "./inst-about-display";
import Contact from "./inst-contact-display";
import Department from "./inst-department-display";
import Event from "./inst-event-display";
import Notice from "./inst-notice-display";
import Team from "./inst-team-display";

const getComponent = (key, infoObj) => {
  switch (key) {
    case "contact":
      return <Contact infoObj={infoObj} />;

    case "program":
      return <Department infoObj={infoObj} />;

    case "evt":
        return <Event infoObj={infoObj} />;
    
    case "notice":
      return <Notice infoObj={infoObj} />;
    
    case "team":
      return <Team infoObj={infoObj} />;

    default:
      return <About infoObj={infoObj} />;
  }
};

const InstitutionInfo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedMenu } = useSelector(state => state.institution);
  const [infoObj, setInfoObj] = useState({});

  const getById = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/institution/getById/${id}`);

      if (success) {
        setInfoObj(data);
      }
    } catch(err) {}
  };

  const getClass = key => selectedMenu === key ? "l-10 l-10-selected" : "l-10";

  const handleMenuClick = key => {
    dispatch({ type: SELECT_INST_MENU, payload: key });
  };

  useEffect(() => getById(), []);

  return (
    <HomeLayout hideFooter>
      <div className="content-wrapper">
        <div className="l-header">{infoObj.name}</div>
        <div className="d-flex align-items-center">
          <div className={getClass("about")} onClick={() => handleMenuClick("about")}>
            About Us
          </div>
          <div className={getClass("team")} onClick={() => handleMenuClick("team")}>
            Our Team
          </div>
          <div className={getClass("program")} onClick={() => handleMenuClick("program")}>
            Departments & Programs
          </div>
          <div className={getClass("evt")} onClick={() => handleMenuClick("evt")}>
            Activities & Events
          </div>
          <div className={getClass("notice")} onClick={() => handleMenuClick("notice")}>
            Informations & Notices
          </div>
          <div className={getClass("contact")} onClick={() => handleMenuClick("contact")}>
            Contact Us
          </div>
        </div>
        <div className="l-child">
          {getComponent(selectedMenu, infoObj)}
        </div>
      </div>
    </HomeLayout>
  );
};

export default InstitutionInfo;
