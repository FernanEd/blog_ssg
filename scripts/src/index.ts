import MarkdownIt from "markdown-it";
import * as fs from "fs";
import * as path from "path";

const md = new MarkdownIt();

const templatePath = path.join(__dirname, "../../layout/template.html");
const htmlTemplate = fs.readFileSync(templatePath, "utf8");

const postsPath = path.join(__dirname, "../../posts");
const postFolder = fs.readdirSync(postsPath);

const output = path.join(__dirname, "../../site");

const getTemplateHtml = (content: string) =>
  htmlTemplate.replace("{% content %}", content);

postFolder.forEach((postFileName) => {
  const file = fs.readFileSync(path.join(postsPath, postFileName), "utf8");
  const htmlContent = md.render(file);
  const htmlFile = getTemplateHtml(htmlContent);
  fs.writeFileSync(
    path.join(output, postFileName.replace(".md", ".html")),
    htmlFile
  );
});
