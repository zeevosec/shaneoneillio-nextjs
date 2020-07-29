import React from "react";
import Sidebar from "./Sidebar";

class PageTemplateDetails extends React.Component {
  render() {
    const siteMetadata = this.props.siteMetadata;

    return (
      <div>
        <Sidebar {...siteMetadata} />
        {/* <div className="content">
          <div className="content__inner">
            <div className="page">
              <h1 className="page__title">{page.frontmatter.title}</h1>
              <div
                className="page__body"
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default PageTemplateDetails;
