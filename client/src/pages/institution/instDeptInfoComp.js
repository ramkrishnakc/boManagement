import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Markup } from 'interweave';
import { get } from "lodash";

import { Request } from "../../library";

const InstDepartmentDisplay = ({ refId }) => {
  const [items, setItems] = useState([]);
  const loading = useSelector(state => get(state, "common.loading"));

  useEffect(() => {
    const getItems = async () => {
      try {
        if (refId) {
          const {
            data: { success, data },
          } = await Request.get(`/api/institution/getByRefId-department/${refId}`);
  
          if (success && data) {
            setItems(data);
          }
        }
      } catch (err) {}
    };
    getItems();

  }, [refId]);

  return (
    <>
      {!loading && (
        items.map(item => {
          const links = get(item, "externalLinks", []);
 
          return (
            <div key={item.title} className="inst-notice">
              <div>
                <h3>{item.name}</h3>
                <p>{item.about}</p>
                {item.image && (
                  <img src={item.image} alt="" className="department-img" />
                )}
                <p>{item.course}</p>
                {
                  links.length > 0 && (
                    <p>
                      <ul className="ext-link-ul">
                        <li style={{padding: "5px 0px"}}>External Links:</li>
                        {links.map(link => (
                          <li><a href={link}>{link}</a></li>
                        ))}
                      </ul>
                    </p>
                  )
                }
              </div>
              {item.html && (
                <Markup content={item.html} />
              )}
            </div>
          );
        })
      )}
    </>
  );
}

export default InstDepartmentDisplay;
