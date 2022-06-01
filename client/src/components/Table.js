import { Table } from "antd";
import React from "react";
import { Input, Button } from "antd";

const Search = Input.Search;

const TableComponent = props => {
  return (
    <>
      <div className="d-flex justify-content-end" style={{marginBottom: "15px"}}>
        {props.showSearch && (
          <Search
            placeholder={props.searchPlaceholder}
            onSearch={props.onSearch}
            onChange={props.onChange}
            style={{ width: 350, marginRight: 20, ...props.searchInlineStyle }}
          />
        )}

        {props.showAddButton && (
          <Button type="primary" onClick={props.buttonOnClick}>
            {props.addButtonLabel}
          </Button>
        )}
      </div>

      <Table
        columns={props.columns}
        dataSource={props.dataSource}
        bordered={props.bordered}
      />
    </>
  );
};

export default TableComponent;
