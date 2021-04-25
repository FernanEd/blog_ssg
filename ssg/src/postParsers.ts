import MarkdownIt from "markdown-it";
const md = new MarkdownIt();

export interface IPost {
  content: string;
  meta?: {
    author?: string;
    date?: string;
    keywords?: string[];
    title?: string;
    description?: string;
  };
}

export function parseMDFile(mdStr: string): IPost | undefined {
  const MD_STRING = mdStr.trim().split("---");
  const [_, metadataStr, contentStr] = MD_STRING;

  if (MD_STRING.length === 1) {
    return {
      content: md.render(_),
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
    content: md.render(contentStr),
    meta: metadata,
  };
}

export function fillMDTemplate(templateString: string, postMD: IPost): string {
  let NEW_TEMPLATE = templateString;
  NEW_TEMPLATE = NEW_TEMPLATE.replace(
    new RegExp("{% content %}", "g"),
    postMD.content
  );

  if (postMD.meta) {
    NEW_TEMPLATE = NEW_TEMPLATE.replace(
      new RegExp("{% meta.author %}", "g"),
      postMD.meta.author || "Anonymous"
    );
    NEW_TEMPLATE = NEW_TEMPLATE.replace(
      new RegExp("{% meta.date %}", "g"),
      postMD.meta.date || "Unkown"
    );
    NEW_TEMPLATE = NEW_TEMPLATE.replace(
      new RegExp("{% meta.keywords %}", "g"),
      postMD.meta.keywords ? postMD.meta.keywords.join(",") : ""
    );
    NEW_TEMPLATE = NEW_TEMPLATE.replace(
      new RegExp("{% meta.title %}", "g"),
      postMD.meta.title || ""
    );
    NEW_TEMPLATE = NEW_TEMPLATE.replace(
      new RegExp("{% meta.description %}", "g"),
      postMD.meta.description || ""
    );
  }

  return NEW_TEMPLATE;
}
