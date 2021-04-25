import * as fs from "fs";
import * as path from "path";
import {
  createPublicFiles,
  createDirectories,
  recursiveDeleteDirForce,
} from "./folderStructure";
import { fillMDTemplate, parseMDFile } from "./postParsers";

console.time("Build ended in");
console.log("Making build...");

const LAYOUT_DIR_PATH = path.join(__dirname, "../../layout");
const POSTS_DIR_PATH = path.join(__dirname, "../../posts");
const TEMPLATE_DIR_PATH = path.join(__dirname, "../../templates");

const PUBLIC_DIR_PATH = path.join(__dirname, "../../public");
const ASSETS_DIR_PATH = path.join(PUBLIC_DIR_PATH, "assets");
const SCRIPTS_DIR_PATH = path.join(PUBLIC_DIR_PATH, "stylesheets");
const STYLES_DIR_PATH = path.join(PUBLIC_DIR_PATH, "scripts");

const TEMPLATE_FILENAME = fs.readdirSync(TEMPLATE_DIR_PATH)[0];
const INDEX_FILENAME = fs.readdirSync(TEMPLATE_DIR_PATH)[0];
const POSTS_FILENAMES = fs.readdirSync(POSTS_DIR_PATH);

const TEMPLATE_HTML_STRING = fs.readFileSync(
  path.join(TEMPLATE_DIR_PATH, TEMPLATE_FILENAME),
  "utf8"
);

const INDEX_HTML_STRING = fs.readFileSync(
  path.join(TEMPLATE_DIR_PATH, TEMPLATE_FILENAME),
  "utf8"
);

const OUTPUT_INDEX_DIR_PATH = path.join(__dirname, "../../site");
const OUTPUT_ASSETS_DIR_PATH = path.join(OUTPUT_INDEX_DIR_PATH, "assets");
const OUTPUT_SCRIPTS_DIR_PATH = path.join(OUTPUT_INDEX_DIR_PATH, "stylesheets");
const OUTPUT_STYLES_DIR_PATH = path.join(OUTPUT_INDEX_DIR_PATH, "scripts");
const OUTPUT_POSTS_DIR_PATH = path.join(OUTPUT_INDEX_DIR_PATH, "posts");

const parseHTML = (htmlStr: string, htmlPath: string) => {
  htmlStr = htmlStr.replace(
    new RegExp("%__PUBLIC__%", "g"),
    path.relative(htmlPath, OUTPUT_INDEX_DIR_PATH) || "."
  );

  htmlStr = htmlStr.replace(
    new RegExp("%__POSTS__%", "g"),
    path.relative(htmlPath, OUTPUT_POSTS_DIR_PATH)
  );

  return htmlStr;
};

const createLayoutFiles = (directory1: string, directory2: string) => {
  const dirContents = fs.readdirSync(directory1);

  for (let elementName of dirContents) {
    const elementPath = path.join(directory1, elementName);
    const outputPath = path.join(directory2, elementName);
    const element = fs.lstatSync(elementPath);

    if (element.isDirectory()) {
      if (fs.existsSync(outputPath) === false) {
        fs.mkdirSync(outputPath);
      }
      createLayoutFiles(elementPath, outputPath);
    } else {
      if (/\.html$/.test(elementName)) {
        const htmlStr = fs.readFileSync(elementPath, "utf8");
        const newHTMLStr = parseHTML(htmlStr, directory2);
        fs.writeFileSync(outputPath, newHTMLStr);
      }
    }
  }
};

const createPostsFiles = (directory1: string, directory2: string) => {
  const dirContents = fs.readdirSync(directory1);

  for (let elementName of dirContents) {
    const elementPath = path.join(directory1, elementName);
    const outputPath = path.join(directory2, elementName);
    const element = fs.lstatSync(elementPath);

    if (element.isDirectory()) {
      if (fs.existsSync(outputPath) === false) {
        fs.mkdirSync(outputPath);
      }
      createPostsFiles(elementPath, outputPath);
    } else {
      if (/\.md$/.test(elementName)) {
        const mdStr = fs.readFileSync(elementPath, "utf8");
        const mdObj = parseMDFile(mdStr);
        if (mdObj) {
          const postStr = fillMDTemplate(TEMPLATE_HTML_STRING, mdObj);
          fs.writeFileSync(outputPath.replace(".md", ".html"), postStr);
        }
      }
    }
  }
};

if (fs.existsSync(OUTPUT_INDEX_DIR_PATH)) {
  recursiveDeleteDirForce(OUTPUT_INDEX_DIR_PATH);
}

createDirectories([OUTPUT_INDEX_DIR_PATH, OUTPUT_POSTS_DIR_PATH]);
createPublicFiles(PUBLIC_DIR_PATH, OUTPUT_INDEX_DIR_PATH);
createLayoutFiles(LAYOUT_DIR_PATH, OUTPUT_INDEX_DIR_PATH);
createPostsFiles(POSTS_DIR_PATH, path.join(OUTPUT_INDEX_DIR_PATH, "posts"));

console.timeEnd("Build ended in");
