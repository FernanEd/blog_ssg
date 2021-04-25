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

const createDirectories = (directories: string[]): void => {
  for (let dir of directories) {
    if (fs.existsSync(dir) === false) {
      fs.mkdirSync(dir);
    }
  }
};

createDirectories([
  OUTPUT_INDEX_DIR_PATH,
  OUTPUT_ASSETS_DIR_PATH,
  OUTPUT_SCRIPTS_DIR_PATH,
  OUTPUT_STYLES_DIR_PATH,
]);

const createAllFiles = (directory1: string, directory2: string) => {
  const dir = fs.readdirSync(directory1);

  for (let elementName of dir) {
    const elementPath = path.join(directory1, elementName);
    const outputPath = path.join(directory2, elementName);
    const element = fs.lstatSync(elementPath);

    if (element.isDirectory()) {
      if (fs.existsSync(outputPath) === false) {
        fs.mkdirSync(outputPath);
      }
      createAllFiles(elementPath, outputPath);
    } else {
      fs.createReadStream(elementPath).pipe(fs.createWriteStream(outputPath));
    }
  }
};

createAllFiles(PUBLIC_DIR_PATH, OUTPUT_INDEX_DIR_PATH);
