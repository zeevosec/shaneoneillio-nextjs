import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const pageDirectory = path.join(process.cwd(), "content", "pages");

export const getAllPagePaths = () => {
  const postDirs = fs
    .readdirSync(pageDirectory)
    .filter((dir) => dir !== ".DS_Store");

  const allPostsId = postDirs
    .map((dir) => {
      // Read markdown file as string

      const post = path.join(pageDirectory, dir, "index.md");

      const fileContents = fs.readFileSync(post, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return matterResult.data;
    })
    .filter((post) => post)
    .map((post) => ({ params: { page: post.path } }));

  return allPostsId;
};

const getPageData = (id) => {
  const postDirs = fs
    .readdirSync(pageDirectory)
    .filter((dir) => dir !== ".DS_Store");
};
