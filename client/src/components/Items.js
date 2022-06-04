import { Button } from "antd";

import noImage from "../resources/no-image.png";
import "../resources/books.css";

const Items = props => {
  if (!props.itemsData.length) {
    return (
      <div
        className={props.wrapperClass}
        style={{color: "red", padding: "20px 0px 0px 20px"}}
      >
        Data not available!!
      </div>
    );
  }

  return (
    <div className={props.wrapperClass}>
      {props.itemsData.map(item => {
        const dis = item.discount || false;

        return (
          <div
            key={item.name}
            className={`item-div ${props.showBtn ? "hide-pointer" : ""}`}
            onClick={() => props.selectItem(item)}
            title={props.showBtn ? item.name: `List books under ${item.name} category`}
          >
            <img
              src={item.image || noImage}
              alt=""
              className="item-img"
            />
            {props.showName && (<h6>{item.name}</h6>)}
            {props.showAuthor && (
              <h6><strong>Author: {" "}</strong>{item.author}</h6>
            )}
            {props.showPrice && (
              <h6 style={props.h6Style}>
                <strong>Price: {" "}</strong>Rs. {item.price}
                {dis && (<span className="discount-span">{" "}({dis}% off)</span>)}
              </h6>
            )}
            {props.showBtn && <Button block={true} onClick={props.btnClick}>{props.btnLabel}</Button>}
          </div>
        );
      })}
    </div>
  );
};

export default Items;