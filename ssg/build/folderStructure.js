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
exports.recursiveDeleteDirForce = exports.createPublicFiles = exports.createDirectories = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var createDirectories = function (directories) {
    for (var _i = 0, directories_1 = directories; _i < directories_1.length; _i++) {
        var dir = directories_1[_i];
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }
    }
};
exports.createDirectories = createDirectories;
var createPublicFiles = function (directory1, directory2) {
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
            exports.createPublicFiles(elementPath, outputPath);
        }
        else {
            fs.createReadStream(elementPath).pipe(fs.createWriteStream(outputPath));
        }
    }
};
exports.createPublicFiles = createPublicFiles;
var recursiveDeleteDirForce = function (directory) {
    var dirContents = fs.readdirSync(directory);
    for (var _i = 0, dirContents_2 = dirContents; _i < dirContents_2.length; _i++) {
        var elementName = dirContents_2[_i];
        var elementPath = path.join(directory, elementName);
        var element = fs.lstatSync(elementPath);
        if (element.isDirectory()) {
            exports.recursiveDeleteDirForce(elementPath);
        }
        else {
            fs.unlinkSync(elementPath);
        }
    }
    fs.rmdirSync(directory);
};
exports.recursiveDeleteDirForce = recursiveDeleteDirForce;
