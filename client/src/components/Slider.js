import Slider from "react-slick";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { addToCart } from "../pages/cart/cart-module";
import noImage from "../resources/no-image.png";

const SliderComponent = (props) => {
  const dispatch = useDispatch();

  return (
    <div className={props.wrapperClass}>
      <Slider {...props.settings}>
        {props.items.map(item => {
          const dis = item.discount || false;

          return (
            <div key={item.name} className="slide-img-wrapper">
              <img src={item.image || noImage} alt= {item.name} />
              {props.showName && (<h6>{item.name}</h6>)}
              {props.showPrice && (
                <h6 style={props.h6Style}>
                  <strong>Price: {" "}</strong>Rs. {item.price}
                  {dis && (<span className="discount-span">{" "}({dis}% off)</span>)}
                </h6>
              )}
              {
                props.showBtn && (
                  <Button onClick={() => dispatch(addToCart(item))}>
                    {props.btnLabel}
                  </Button>
                )}
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default SliderComponent;
