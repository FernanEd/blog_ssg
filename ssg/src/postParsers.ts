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

export function fillMDTemplate(templateString: string, postMD: IPost): string {
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
