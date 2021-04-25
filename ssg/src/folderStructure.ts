import * as fs from "fs";
import * as path from "path";

export const createDirectories = (directories: string[]): void => {
  for (let dir of directories) {
    if (fs.existsSync(dir) === false) {
      fs.mkdirSync(dir);
    }
  }
};

export const createPublicFiles = (directory1: string, directory2: string) => {
  const dirContents = fs.readdirSync(directory1);

  for (let elementName of dirContents) {
    const elementPath = path.join(directory1, elementName);
    const outputPath = path.join(directory2, elementName);
    const element = fs.lstatSync(elementPath);

    if (element.isDirectory()) {
      if (fs.existsSync(outputPath) === false) {
        fs.mkdirSync(outputPath);
      }
      createPublicFiles(elementPath, outputPath);
    } else {
      fs.createReadStream(elementPath).pipe(fs.createWriteStream(outputPath));
    }
  }
};

export const recursiveDeleteDirForce = (directory: string) => {
  const dirContents = fs.readdirSync(directory);

  for (let elementName of dirContents) {
    const elementPath = path.join(directory, elementName);
    const element = fs.lstatSync(elementPath);
    if (element.isDirectory()) {
      recursiveDeleteDirForce(elementPath);
    } else {
      fs.unlinkSync(elementPath);
    }
  }

  fs.rmdirSync(directory);
};
