import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const PDFComponent = props => {
  const [options, setOptions] = useState({
    numPages: null,
    pageNumber: 1,
  });

  const width = Number.parseInt(96.5 * (window.innerWidth || 1000) / 100);

	const onLoadSuccess = ({ numPages }) => {
		setOptions({ ...options, numPages });
	};

	const goToPage = dir => {
    let pg;
    
    if (dir === "next" && options.pageNumber < options.numPages) {
      pg = options.pageNumber + 1; 
    }
    if (dir === "prev" && options.pageNumber > 1) {
      pg = options.pageNumber - 1; 
    }

    if (pg) {
      setOptions({ ...options, pageNumber: pg });
    }
  };

  return (
    <>
      <div className="pdf-page-no-wrapper">
        <button
          onClick={() => goToPage("prev")}
          className="pdf-page-nav-btn"
        >
          <CaretLeftOutlined />
        </button>
        <span>
          <span className="pdf-p-info-1">PDF: {" "}</span>
          <span className="pdf-p-info-2">{props.bookName}</span>
          {" "}
          <span className="pdf-p-info-3">|</span>
          {" "}
          <span className="pdf-p-info-1">Page: {" "}</span>
          <span className="pdf-p-info-2">{options.pageNumber} of {options.numPages}</span>
        </span>
        <button
          onClick={() => goToPage("next")}
          className="pdf-page-nav-btn"
        >
          <CaretRightOutlined />
        </button>
      </div>

      <div className="pdf-wrapper" style={{ width }}>
        <Document
          file={props.file}
          onLoadSuccess={onLoadSuccess}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Page
            width={width}
            pageNumber={options.pageNumber}
          />
        </Document>
      </div>
    </>
  );
};

export default PDFComponent;
