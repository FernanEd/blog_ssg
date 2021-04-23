"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var markdown_it_1 = __importDefault(require("markdown-it"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var md = new markdown_it_1.default();
var templatePath = path.join(__dirname, "../../layout/template.html");
var htmlTemplate = fs.readFileSync(templatePath, "utf8");
var postsPath = path.join(__dirname, "../../posts");
var postFolder = fs.readdirSync(postsPath);
var output = path.join(__dirname, "../../site");
var getTemplateHtml = function (content) {
    return htmlTemplate.replace("{% content %}", content);
};
postFolder.forEach(function (postFileName) {
    var file = fs.readFileSync(path.join(postsPath, postFileName), "utf8");
    var htmlContent = md.render(file);
    var htmlFile = getTemplateHtml(htmlContent);
    fs.writeFileSync(path.join(output, postFileName.replace(".md", ".html")), htmlFile);
});
