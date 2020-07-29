import React from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";

import { getSiteMetadata } from "../lib/site";
import { getIndexData } from "../lib/posts";

class IndexRoute extends React.Component {
  render() {
    const { title, subtitle } = this.props.siteMetadata;
    // const posts = this.props.data.allMarkdownRemark.edges;

    return (
      <Layout>
        <div>
          <Head>
            <title>{title}</title>
            <meta name="description" content={subtitle} />
          </Head>
          <div />
          <Sidebar {...this.props.siteMetadata} />
          <div className="content">{/* <Feed posts={posts} /> */}</div>
        </div>
      </Layout>
    );
  }
}

const query = `
  query IndexQuery {
    site {
      siteMetadata {
        title
        subtitle
        copyright
        profilePic
        menu {
          label
          path
        }
        author {
          name
          twitter
          github
          rss
        }
      }
    }
    allMarkdownRemark(
      limit: 1000
      filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          timeToRead
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`;

export async function getStaticProps() {
  const postData = getIndexData();
  const siteMetadata = getSiteMetadata();

  return {
    props: {
      postData,
      siteMetadata,
    },
  };
}

export default IndexRoute;
