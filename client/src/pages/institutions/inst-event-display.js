import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { useSelector } from "react-redux";

import Request from "../../library/request";

const InstEventDisplay = ({ refId }) => {
  const [items, setItems] = useState([]);
  const { loading } = useSelector(state => state.common);

  useEffect(() => {
    const getItems = async () => {
      try {
        if (refId) {
          const {
            data: { success, data },
          } = await Request.get(`/api/institution/getByRefId-activity/${refId}`);
  
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
          const imgs = get(item, "images", []);
 
          return (
            <div key={item.title} className="inst-notice">
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
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
              {
                imgs.length > 0 && (
                  <div className="notice-img-wrapper">
                    {imgs.map(iPath => (
                      <div>
                        <img src={iPath} alt="" className="notice-img" />
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          );
        })
      )}
    </>
  );
}

export default InstEventDisplay;
