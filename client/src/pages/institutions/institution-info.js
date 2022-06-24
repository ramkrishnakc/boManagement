import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import HomeLayout from "../../components/HomeLayout";
import Request from "../../library/request";

import About from "./inst-about";
import Contact from "./inst-contact";
import Department from "./inst-department";
import Event from "./inst-event";
import Notice from "./inst-notice";
import Team from "./inst-team";

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
  const [selected, setSelected] = useState("about");
  const [infoObj, setInfoObj] = useState({});

  const getById = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/institution/getById/${id}`);

      if (success) {
        setInfoObj(data);
      }
    } catch(err) {}
  };

  const getClass = key => selected === key ? "l-10 l-10-selected" : "l-10";

  const handleMenuClick = key => {
    setSelected(key);
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
          {getComponent(selected, infoObj)}
        </div>
      </div>
    </HomeLayout>
  );
};

export default InstitutionInfo;