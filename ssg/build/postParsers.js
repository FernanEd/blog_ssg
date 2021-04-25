"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillMDTemplate = exports.parseMDFile = void 0;
var markdown_it_1 = __importDefault(require("markdown-it"));
var md = new markdown_it_1.default();
function parseMDFile(mdStr) {
    var MD_STRING = mdStr.trim().split("---");
    var _ = MD_STRING[0], metadataStr = MD_STRING[1], contentStr = MD_STRING[2];
    if (MD_STRING.length === 1) {
        return {
            content: md.render(_),
        };
    }
    if (MD_STRING.length !== 3) {
        return;
    }
    var metadataPairs = metadataStr
        .trim()
        .split("\n")
        .map(function (data) { return data.split(":"); });
    var metadata = {
        author: "",
        date: "",
        keywords: [""],
        title: "",
        description: "",
    };
    for (var _i = 0, metadataPairs_1 = metadataPairs; _i < metadataPairs_1.length; _i++) {
        var _a = metadataPairs_1[_i], prop = _a[0], val = _a[1];
        if (metadata.hasOwnProperty(prop)) {
            if (prop === "keywords") {
                metadata[prop] = val.trim().split(", ");
            }
            else {
                metadata[prop] = val.trim();
            }
        }
    }
    return {
        content: md.render(contentStr),
        meta: metadata,
    };
}
exports.parseMDFile = parseMDFile;
function fillMDTemplate(templateString, postMD) {
    var NEW_TEMPLATE = templateString;
    NEW_TEMPLATE = NEW_TEMPLATE.replace(new RegExp("{% content %}", "g"), postMD.content);
    if (postMD.meta) {
        NEW_TEMPLATE = NEW_TEMPLATE.replace(new RegExp("{% meta.author %}", "g"), postMD.meta.author || "Anonymous");
        NEW_TEMPLATE = NEW_TEMPLATE.replace(new RegExp("{% meta.date %}", "g"), postMD.meta.date || "Unkown");
        NEW_TEMPLATE = NEW_TEMPLATE.replace(new RegExp("{% meta.keywords %}", "g"), postMD.meta.keywords ? postMD.meta.keywords.join(",") : "");
        NEW_TEMPLATE = NEW_TEMPLATE.replace(new RegExp("{% meta.title %}", "g"), postMD.meta.title || "");
        NEW_TEMPLATE = NEW_TEMPLATE.replace(new RegExp("{% meta.description %}", "g"), postMD.meta.description || "");
    }
    return NEW_TEMPLATE;
}
exports.fillMDTemplate = fillMDTemplate;
