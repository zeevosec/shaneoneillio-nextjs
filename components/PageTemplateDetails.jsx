import React from "react";
import Sidebar from "./Sidebar";

function PageTemplateDetails(props) {
  const { siteMetadata, pageData } = props;

  return (
    <div>
      <Sidebar {...siteMetadata} />
      <div className="content">
        <div className="content__inner">
          <div className="page">
            <h1 className="page__title">{pageData.title}</h1>
            <div
              className="page__body"
              dangerouslySetInnerHTML={{ __html: pageData.html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageTemplateDetails;
