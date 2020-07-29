import Head from "next/head";

import Layout from "../components/Layout";
import PageTemplateDetails from "../components/PageTemplateDetails";
import { getAllPagePaths } from "../lib/pages";
import { getSiteMetadata } from "../lib/site";

function Page(props) {
  const pageTitle = "replace me";
  const description = "replace me";
  const { title } = props.siteMetadata;

  return (
    <Layout>
      <div>
        <Head>
          <title>{`${pageTitle} - ${title}`}</title>
          <meta name="description" content={description} />
        </Head>
        <PageTemplateDetails {...props} />
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPagePaths();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  //   const pageData = getPageData(params.id);
  const siteMetadata = getSiteMetadata();

  return {
    props: {
      siteMetadata,
    },
  };
}

export default Page;
