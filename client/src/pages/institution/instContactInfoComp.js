import { useEffect, useState } from "react";
import { get } from "lodash";

import { Request } from "../../library";

/* Component to display 'About' institution information */
const InstContactDisplay = ({ refId }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        if (refId) {
          const {
            data: { success, data },
          } = await Request.get(`/api/institution/getByRefId-contact/${refId}`);
  
          if (success && data) {
            setInfo(data);
          }
        }
      } catch (err) {}
    };

    getData();
  }, [refId]);

  const links = get(info, "externalLinks", []);
  const numbers = get(info, "phone", []);

  return (
    <div className="inst-notice">
      <p><b>Address:</b> {info.address}</p>
      {numbers.length > 0 && (
        <p>
          <b>Phone:</b> {numbers.join(", ")}
        </p>
      )}
      <p><b>Email:</b> {info.email}</p>
      {info.website && (
        <p>
          <b>Website:</b>{" "}
          <a
            href={info.website}
            style={{
              color: "#009688",
              textDecoration: "underline",
            }}
          >
            {info.website}
          </a>
        </p>
      )}
      {
        links.length > 0 && (
          <p>
            <ul className="ext-link-ul">
              <li style={{padding: "5px 0px"}}><b>External Links:</b></li>
              {links.map(link => (
                <li><a href={link}>{link}</a></li>
              ))}
            </ul>
          </p>
        )
      }
    </div>
  );
};

export default InstContactDisplay;
