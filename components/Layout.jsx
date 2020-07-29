import React from "react";
import Head from "next/head";

class Layout extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <div className="layout">
        <Head>
          <title>zeevo | shaneoneill.io</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        {children}
      </div>
    );
  }
}

export default Layout;
