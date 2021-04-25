import MarkdownIt from "markdown-it";
import * as fs from "fs";
import * as path from "path";

const md = new MarkdownIt();

// const templatePath = path.join(__dirname, "../../layout/template.html");
// const htmlTemplate = fs.readFileSync(templatePath, "utf8");

// const postsPath = path.join(__dirname, "../../posts");
// const postFolder = fs.readdirSync(postsPath);

// const output = path.join(__dirname, "../../site");

// const getTemplateHtml = (content: string) =>
//   htmlTemplate.replace("{% content %}", content);

// postFolder.forEach((postFileName) => {
//   const file = fs.readFileSync(path.join(postsPath, postFileName), "utf8");
//   const htmlContent = md.render(file);
//   const htmlFile = getTemplateHtml(htmlContent);
//   fs.writeFileSync(
//     path.join(output, postFileName.replace(".md", ".html")),
//     htmlFile
//   );
// });

const LAYOUT_DIR_PATH = path.join(__dirname, "../../layout");
const POSTS_DIR_PATH = path.join(__dirname, "../../posts");
const PUBLIC_DIR_PATH = path.join(__dirname, "../../public");
const TEMPLATE_DIR_PATH = path.join(__dirname, "../../templates");

const TEMPLATE_FILENAME = fs.readdirSync(TEMPLATE_DIR_PATH)[0];
const INDEX_FILENAME = fs.readdirSync(TEMPLATE_DIR_PATH)[0];

const TEMPLATE_HTML_STRING = fs.readFileSync(
  path.join(TEMPLATE_DIR_PATH, TEMPLATE_FILENAME),
  "utf8"
);

const INDEX_HTML_STRING = fs.readFileSync(
  path.join(TEMPLATE_DIR_PATH, TEMPLATE_FILENAME),
  "utf8"
);

const OUTPUT_DIR_PATH = path.join(__dirname, "../../site");

interface IPost extends Object {
  content: string;
  meta?: {
    author?: string;
    date?: string;
    keywords?: string[];
    title?: string;
    description?: string;
  };
}

function extractMetadata(mdStr: string): IPost | undefined {
  const MD_STRING = mdStr.trim().split("---");
  const [_, metadataStr, contentStr] = MD_STRING;

  if (MD_STRING.length === 1) {
    return {
      content: _,
    };
  }

  if (MD_STRING.length !== 3) {
    return;
  }

  const metadataPairs = metadataStr
    .trim()
    .split("\n")
    .map((data) => data.split(":"));

  type a = {
    [key: string]: string | string[];
  };

  const metadata: a = {
    author: "",
    date: "",
    keywords: [""],
    title: "",
    description: "",
  };

  for (let [prop, val] of metadataPairs) {
    if (metadata.hasOwnProperty(prop)) {
      if (prop === "keywords") {
        metadata[prop] = val.trim().split(", ");
      } else {
        metadata[prop] = val.trim();
      }
    }
  }

  return {
    content: contentStr,
    meta: metadata,
  };
}

console.log(
  extractMetadata(`
---
date: 23/04/2021
author: Fernando Ed
keywords: joder, como estas, eo
title: First post
description: My firstpost
---

# Hello

This is a sample post 😳

## lmao

- o

`)
);

function fillTemplate(templateString: string, postMD: IPost): string {
  const NEW_TEMPLATE = templateString;
  NEW_TEMPLATE.replace("{% content %}", postMD.content);

  if (postMD.meta) {
    NEW_TEMPLATE.replace(
      "{% meta.author %}",
      postMD.meta.author || "Anonymous"
    );
    NEW_TEMPLATE.replace("{% meta.date %}", postMD.meta.date || "Unkown");
    NEW_TEMPLATE.replace(
      "{% meta.keywords %}",
      postMD.meta.keywords ? postMD.meta.keywords.join(",") : ""
    );
    NEW_TEMPLATE.replace("{% meta.title %}", postMD.meta.title || "");
    NEW_TEMPLATE.replace(
      "{% meta.description %}",
      postMD.meta.description || ""
    );
  }

  return NEW_TEMPLATE;
}

// console.log(parseTemplates())
