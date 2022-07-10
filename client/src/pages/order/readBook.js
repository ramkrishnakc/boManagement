import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { LocalStore } from "../../library";
import { PDFComponent } from "../../components";

const pLen = 90;

const ReadComponent = () => {
  const { pid, pname } = useParams();
  const { id } = useSelector(state => state.login);
  const token = LocalStore.get();
  const auth = token ? `Bearer ${token}` : '';

  if (!pid || !pname || !auth) {
    return "";
  }

  return (
    <>
      <div className="bread-crumb">
        <PDFComponent
          bookName={pname.length < pLen ? pname : `${pname.slice(0, pLen)}...`}
          file={{
            url: `/api/books/getPdf/${id}/${pid}`,
            httpHeaders: {
              Authorization: auth,
            }
          }}
        />
      </div>
    </>
  );
};

export default ReadComponent;
