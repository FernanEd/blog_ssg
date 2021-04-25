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
  meta: {
    author?: string;
    date: Date;
    keywords: string[];
    title: string;
    description: string;
  };
}

function extractMetadata(mdString: string): any {
  const MD_STRING = mdString.trim();
  let startMetadata =
    MD_STRING[0] === "-" && MD_STRING[1] === "-" && MD_STRING[2] === "-";

  if (startMetadata) {
    let i = 3; //i starts after the --- metadata start
    let endMetadata = 0;
    let metadataStr = "";

    while (endMetadata < 3 && i < MD_STRING.length - 1) {
      if (MD_STRING[i] === "-") {
        endMetadata += 1;
        continue;
      }
      metadataStr += MD_STRING[i];
      i += 1;
    }

    const metadata = metadataStr
      .trim()
      .split("\n")
      .map((data) => data.split(":"));

    console.log(metadata);
  } else {
    return new Error("Invalid metadata format, use YAML");
  }
}

const TESTMD = `
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

`;

extractMetadata(TESTMD);

function fillTemplate(templateString: string, templateMD: IPost): string {
  const NEW_TEMPLATE = templateString;
  NEW_TEMPLATE.replace(
    "{% meta.author %}",
    templateMD.meta.author || "Anonymous"
  );
  NEW_TEMPLATE.replace(
    "{% meta.date %}",
    templateMD.meta.date.toLocaleDateString()
  );
  NEW_TEMPLATE.replace(
    "{% meta.keywords %}",
    templateMD.meta.keywords.join(",")
  );
  NEW_TEMPLATE.replace("{% meta.title %}", templateMD.meta.title);
  NEW_TEMPLATE.replace("{% meta.description %}", templateMD.meta.description);
  NEW_TEMPLATE.replace("{% content %}", templateMD.content);
  return NEW_TEMPLATE;
}

// console.log(parseTemplates())
