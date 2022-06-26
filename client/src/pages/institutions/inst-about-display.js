import { useEffect, useState } from "react";
import { Markup } from 'interweave';

import Request from "../../library/request";
import SliderComponent from "../../components/Slider";
import { SLIDER_OPTIONS } from "../../constants";

/* Get Items to display in the SLIDER */
const getSliderItems = (arr = []) => {
  if (arr.length) {
    const items = arr.map((d, idx) => ({ name: `${idx}`, image: d }));
    return items;
  }
  return null;
};

/* Component to display 'About' institution information */
const InstAboutDisplay = ({ refId }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        if (refId) {
          const {
            data: { success, data },
          } = await Request.get(`/api/institution/getByRefId-about/${refId}`);
  
          if (success && data) {
            setInfo(data);
          }
        }
      } catch (err) {}
    };

    getData();
  }, [refId]);

  const sliderItems = getSliderItems(info.images);

  return (
    <>
      {/* Display the text */}
      {info.text && (
        <p style={{fontStyle: "italic", fontSize: "16px"}}>
          {info.text}
        </p>
      )}
      {/* Images are displayed as Slider */}
      {sliderItems && (
        <div className="back-image-div recent-slider">
          <SliderComponent
            h6Style={{ color: "white" }}
            wrapperClass="myslider"
            settings={SLIDER_OPTIONS}
            items={sliderItems}
          />
        </div>
      )}
      {/* Display HTML as it is written by the User */}
      {info.html && (
        <Markup content={info.html} />
      )}
    </>
  );
};

export default InstAboutDisplay;
