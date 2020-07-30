import Head from "next/head";

import Layout from "../components/Layout";
import PageTemplateDetails from "../components/PageTemplateDetails";
import { getAllPagePaths, getPageData } from "../lib/pages";
import { getSiteMetadata } from "../lib/site";

function Page(props) {
  const { pageData, siteMetadata } = props;

  return (
    <Layout>
      <div>
        <Head>
          <title>{`${pageData.title} - ${siteMetadata.title}`}</title>
          <meta name="description" content={pageData.description} />
        </Head>
        <PageTemplateDetails siteMetadata={siteMetadata} pageData={pageData} />
      </div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const paths = getAllPagePaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const pageData = await getPageData(params.page);
  const siteMetadata = getSiteMetadata();

  return {
    props: {
      siteMetadata,
      pageData: {
        path: pageData.page.data.path,
        title: pageData.page.data.title,
        layout: pageData.page.data.layout,
        description: pageData.page.data.description,
        html: pageData.content.contents,
      },
    },
  };
};

export default Page;
