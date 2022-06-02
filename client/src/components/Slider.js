import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderComponent = (props) => {
  return (
    <div className={props.wrapperClass}>
      <Slider {...props.settings}>
        {props.items.map(item => {
          const dis = item.discount || false;

          return (
            <div key={item.name} className="slide-img-wrapper">
              {props.showDiscount && dis && (<div className="discount-abs-div">({dis}% off)</div>)}
              <img src={item.image} alt= {item.name} />
              {props.showName && (<h6>{item.name}</h6>)}
              {props.showPrice && (<h6><strong>Price: {" "}</strong>Rs. {item.price}</h6>)}
              {props.showBtn && <button onClick={props.btnClick}>{props.btnLabel}</button>}
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default SliderComponent;
