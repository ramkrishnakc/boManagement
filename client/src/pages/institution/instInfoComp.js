import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { SELECT_INST_MENU } from "../../constants";
import { Request } from "../../library";
import "../../resources/instLayout.css";

import About from "./instAboutInfoComp";
import Contact from "./instContactInfoComp";
import Department from "./instDeptInfoComp";
import Event from "./instEventInfoComp";
import Notice from "./instNoticeInfoComp";
import Team from "./instTeamInfoComp";

const getComponent = (key, refId) => {
  switch (key) {
    case "contact":
      return <Contact refId={refId} />;

    case "program":
      return <Department refId={refId} />;

    case "evt":
        return <Event refId={refId} />;
    
    case "notice":
      return <Notice refId={refId} />;
    
    case "team":
      return <Team refId={refId} />;

    default:
      return <About refId={refId} />;
  }
};

const InstitutionInfo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedMenu } = useSelector(state => state.institution);
  const [infoObj, setInfoObj] = useState({});

  const getById = async () => {
    try {
      if (!id) {
        return null;
      }
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
    <>
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
          {getComponent(selectedMenu, infoObj._id)}
        </div>
      </div>
    </>
  );
};

export default InstitutionInfo;
