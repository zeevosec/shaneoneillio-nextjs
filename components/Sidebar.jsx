import React from "react";
import get from "lodash/get";
import Link from "next/link";
import Menu from "./Menu";

class Sidebar extends React.Component {
  render() {
    const { location } = this.props;
    const { author, subtitle, copyright, menu } = this.props;
    const isHomePage = get(location, "pathname", "/") === "/";

    /* eslint-disable jsx-a11y/img-redundant-alt */
    const authorBlock = (
      <div>
        <Link href="/">
          <a>
            <img
              src="/photo.png"
              className="sidebar__author-photo"
              width="140"
              height="140"
              alt={author.name}
            />
          </a>
        </Link>
        {isHomePage ? (
          <h1 className="sidebar__author-title">
            <Link href="/">
              <a className="sidebar__author-title-link">{author.name}</a>
            </Link>
          </h1>
        ) : (
          <h2 className="sidebar__author-title">
            <Link href="/">
              <a className="sidebar__author-title-link">{author.name}</a>
            </Link>
          </h2>
        )}
        <p className="sidebar__author-subtitle">{subtitle}</p>
      </div>
    );
    /* eslint-enable jsx-a11y/img-redundant-alt */

    return (
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__author">{authorBlock}</div>
          <div>
            <Menu data={menu} />
            {/* <Links data={author} /> */}
            <p className="sidebar__copyright">{copyright}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
