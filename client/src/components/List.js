import React, { useState } from "react";
import { Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "../resources/list.css"; 

const ListComponent = ({ list, setList, placeholder }) => {
  const [val, setValue] = useState("");

  const onPressEnter = e => {
    e.preventDefault();

    if (!val) {
      return null;
    }
    
    const match = list.find(d => d === val);
    if (!match) {
      setList([...list, val]);
      setValue("");
    }
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const removeItem = item => {
    setList(list.filter(d => d !== item));
  };

  return (
    <>
      <div className="list-items">
        {list.map(item => (
          <div className="list-item">
            <div className="list-value">{item}</div>
            <div className="list-btn" onClick={() => removeItem(item)}><CloseOutlined /></div>
          </div>
        ))}
      </div>
      <Input
        value={val}
        onChange={onChange}
        onPressEnter={onPressEnter}
        placeholder={placeholder}
      />
    </>
  )
};

export default ListComponent;
