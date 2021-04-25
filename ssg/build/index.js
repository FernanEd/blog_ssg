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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var folderStructure_1 = require("./folderStructure");
var postParsers_1 = require("./postParsers");
console.time("Build ended in");
console.log("Making build...");
var LAYOUT_DIR_PATH = path.join(__dirname, "../../layout");
var POSTS_DIR_PATH = path.join(__dirname, "../../posts");
var TEMPLATE_DIR_PATH = path.join(__dirname, "../../templates");
var PUBLIC_DIR_PATH = path.join(__dirname, "../../public");
var ASSETS_DIR_PATH = path.join(PUBLIC_DIR_PATH, "assets");
var SCRIPTS_DIR_PATH = path.join(PUBLIC_DIR_PATH, "stylesheets");
var STYLES_DIR_PATH = path.join(PUBLIC_DIR_PATH, "scripts");
var TEMPLATE_FILENAME = fs.readdirSync(TEMPLATE_DIR_PATH)[0];
var INDEX_FILENAME = fs.readdirSync(TEMPLATE_DIR_PATH)[0];
var POSTS_FILENAMES = fs.readdirSync(POSTS_DIR_PATH);
var TEMPLATE_HTML_STRING = fs.readFileSync(path.join(TEMPLATE_DIR_PATH, TEMPLATE_FILENAME), "utf8");
var INDEX_HTML_STRING = fs.readFileSync(path.join(TEMPLATE_DIR_PATH, TEMPLATE_FILENAME), "utf8");
var OUTPUT_INDEX_DIR_PATH = path.join(__dirname, "../../site");
var OUTPUT_ASSETS_DIR_PATH = path.join(OUTPUT_INDEX_DIR_PATH, "assets");
var OUTPUT_SCRIPTS_DIR_PATH = path.join(OUTPUT_INDEX_DIR_PATH, "stylesheets");
var OUTPUT_STYLES_DIR_PATH = path.join(OUTPUT_INDEX_DIR_PATH, "scripts");
var OUTPUT_POSTS_DIR_PATH = path.join(OUTPUT_INDEX_DIR_PATH, "posts");
var parseHTML = function (htmlStr, htmlPath) {
    htmlStr = htmlStr.replace(new RegExp("%__PUBLIC__%", "g"), path.relative(htmlPath, OUTPUT_INDEX_DIR_PATH) || ".");
    htmlStr = htmlStr.replace(new RegExp("%__POSTS__%", "g"), path.relative(htmlPath, OUTPUT_POSTS_DIR_PATH));
    return htmlStr;
};
var createLayoutFiles = function (directory1, directory2) {
    var dirContents = fs.readdirSync(directory1);
    for (var _i = 0, dirContents_1 = dirContents; _i < dirContents_1.length; _i++) {
        var elementName = dirContents_1[_i];
        var elementPath = path.join(directory1, elementName);
        var outputPath = path.join(directory2, elementName);
        var element = fs.lstatSync(elementPath);
        if (element.isDirectory()) {
            if (fs.existsSync(outputPath) === false) {
                fs.mkdirSync(outputPath);
            }
            createLayoutFiles(elementPath, outputPath);
        }
        else {
            if (/\.html$/.test(elementName)) {
                var htmlStr = fs.readFileSync(elementPath, "utf8");
                var newHTMLStr = parseHTML(htmlStr, directory2);
                fs.writeFileSync(outputPath, newHTMLStr);
            }
        }
    }
};
var createPostsFiles = function (directory1, directory2) {
    var dirContents = fs.readdirSync(directory1);
    for (var _i = 0, dirContents_2 = dirContents; _i < dirContents_2.length; _i++) {
        var elementName = dirContents_2[_i];
        var elementPath = path.join(directory1, elementName);
        var outputPath = path.join(directory2, elementName);
        var element = fs.lstatSync(elementPath);
        if (element.isDirectory()) {
            if (fs.existsSync(outputPath) === false) {
                fs.mkdirSync(outputPath);
            }
            createPostsFiles(elementPath, outputPath);
        }
        else {
            if (/\.md$/.test(elementName)) {
                var mdStr = fs.readFileSync(elementPath, "utf8");
                var mdObj = postParsers_1.parseMDFile(mdStr);
                if (mdObj) {
                    var postStr = postParsers_1.fillMDTemplate(TEMPLATE_HTML_STRING, mdObj);
                    fs.writeFileSync(outputPath.replace(".md", ".html"), postStr);
                }
            }
        }
    }
};
if (fs.existsSync(OUTPUT_INDEX_DIR_PATH)) {
    folderStructure_1.recursiveDeleteDirForce(OUTPUT_INDEX_DIR_PATH);
}
folderStructure_1.createDirectories([OUTPUT_INDEX_DIR_PATH, OUTPUT_POSTS_DIR_PATH]);
folderStructure_1.createPublicFiles(PUBLIC_DIR_PATH, OUTPUT_INDEX_DIR_PATH);
createLayoutFiles(LAYOUT_DIR_PATH, OUTPUT_INDEX_DIR_PATH);
createPostsFiles(POSTS_DIR_PATH, path.join(OUTPUT_INDEX_DIR_PATH, "posts"));
console.timeEnd("Build ended in");
