import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content", "posts");

export function getIndexData({ includeDrafts = false } = {}) {
  // Get file names under /posts
  const postDirs = fs
    .readdirSync(articlesDirectory)
    .filter((dir) => dir !== ".DS_Store");

  const allPostsData = postDirs
    .map((dir) => {
      // Read markdown file as string

      const post = path.join(articlesDirectory, dir, "index.md");

      const fileContents = fs.readFileSync(post, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      if (!includeDrafts && matterResult.draft) {
        return;
      }

      // Combine the data with the id
      return matterResult.data;
    })
    .filter((post) => post);

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(articlesDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(articlesDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
