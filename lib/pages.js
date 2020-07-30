import fs from "fs";
import path from "path";
import matter from "gray-matter";
import html from "remark-html";
import copy from "remark-asset-copy";
import frontmatter from "remark-frontmatter";
import vfile from "to-vfile";
import unified from "unified";
import markdown from "remark-parse";
import headings from "remark-autolink-headings";
import slug from "remark-slug";
import h from "hastscript";
import remark from "remark";
import gatsbyRemarkAutolink from "gatsby-remark-autolink-headers";

const pageDirectory = path.join(process.cwd(), "content", "pages");

const getAllPages = () => {
  const postDirs = fs
    .readdirSync(pageDirectory)
    .filter((dir) => dir !== ".DS_Store");

  return postDirs
    .map((dir) => {
      const post = path.join(pageDirectory, dir, "index.md");

      const fileContents = fs.readFileSync(post, "utf8");

      const matterResult = matter(fileContents);

      return { ...matterResult, filePath: post };
    })
    .filter((post) => post);
};

export const getAllPagePaths = () => {
  return getAllPages().map((post) => ({ params: { page: post.data.path } }));
};

// '<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>');
export const getPageData = async (path) => {
  const page = getAllPages().find((post) => post.data.path === path);

  const content = await unified()
    .use(markdown)
    .use(slug)

    .use(headings, {
      behavior: "prepend",
      linkProperties: {
        ariaHidden: true,
        tabIndex: -1,
        class: "anchor before",
        label: "permalink",
      },
      content: (node) => {
        node.data.hProperties = {
          ...node.data.hProperties,
          class: "description",
          style: "position:relative",
        };
        console.log(node);

        return [
          h(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewbox: "0 0 16 16",
              ["aria-hidden"]: true,
              height: "20",
              version: "1.1",
              viewBox: "0 0 16 16",
              width: "20",
            },
            [
              h("path", {
                ["fill-rule"]: "evenodd",
                focusable: false,
                d:
                  "M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z",
              }),
            ]
          ),
        ];
      },
    })
    .use(frontmatter)
    .use(copy, {
      destination: "public/assets",
    })
    .use(html)
    .process(vfile.readSync(page.filePath));

  return { page, content };
};
