import { Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";

const Item = data => {
  console.log(data);
  const dispatch = useDispatch();
  function addTocart() {
    dispatch({ type: "addToCart", payload: data.item });
  }
  return (
    <div className="item">
      <h4 className="name">{data.item.name}</h4>
      <img src={data.item.image} alt="" height="100" width="100" />
      <h4 className="price">
        <b>Price : </b>
        {data.item.price} $/-
      </h4>
      <div className="d-flex justify-content-end">
        <Button onClick={() => addTocart()}>Add To Cart</Button>
      </div>
    </div>
  );
};

export default Item;
