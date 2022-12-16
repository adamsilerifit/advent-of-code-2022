const fs = require('fs');
const path = require('path');

export {};

const getInput = (): string => {
  return fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
};

class File {
  constructor(public name: string, public size: number) {}
}

class Directory {
  get size(): number {
    let calculatedSize = 0;

    traverseDirectoryTree(this, (node) => {
      if (node instanceof File) {
        calculatedSize += node.size;
      }
    });

    return calculatedSize;
  }

  constructor(public name: string, public contents: (File | Directory)[] = []) {}
}

const traverseDirectoryTree = (directory: Directory, forEachNode: (node: File | Directory) => void) => {
  for (const node of directory.contents) {
    forEachNode(node);

    if (node instanceof Directory) {
      traverseDirectoryTree(node, forEachNode);
    }
  }
};

class FilesystemTreeBuilder {
  rootDirectory: Directory;
  currentDirectoryPath: Directory[];

  constructor() {
    this.rootDirectory = new Directory('/');
    this.currentDirectoryPath = [this.rootDirectory];
  }

  get currentDirectory(): Directory {
    return this.currentDirectoryPath[this.currentDirectoryPath.length - 1];
  }

  changeDirectory(directoryName: string) {
    if (directoryName === '/') {
      this.currentDirectoryPath = [this.rootDirectory];
    } else if (directoryName === '..') {
      this.currentDirectoryPath.pop();
    } else {
      const node = this.currentDirectory.contents.find(node => node.name === directoryName);
      this.currentDirectoryPath.push(node as Directory);
    }
  }

  addFile(name: string, size: number) {
    this.currentDirectory.contents.push(new File(name, size));
  }

  addDirectory(name: string) {
    this.currentDirectory.contents.push(new Directory(name));
  }
}

const createDirectoryTreeFromTerminalOutput = (): Directory => {
  const builder = new FilesystemTreeBuilder();

  const terminalOutputPatterns = {
    changeDirectory: /^\$ cd (.+)/,
    listContents: /^\$ ls/,
    file: /^(\d+) (.+)/,
    directory: /^dir (.+)/,
  };

  getInput()
    .split('\n')
    .forEach((line: string) => {
      let matches: RegExpExecArray | null;

      if (matches = terminalOutputPatterns.changeDirectory.exec(line)) {
        builder.changeDirectory(matches[1]);
        return;
      }

      if (matches = terminalOutputPatterns.listContents.exec(line)) {
        // do nothing
        return;
      }

      if (matches = terminalOutputPatterns.file.exec(line)) {
        builder.addFile(matches[2], Number(matches[1]));
        return;
      }

      if (matches = terminalOutputPatterns.directory.exec(line)) {
        builder.addDirectory(matches[1]);
      }
    });

  return builder.rootDirectory;
};

const doPart1 = () => {
  const directoryTree = createDirectoryTreeFromTerminalOutput();

  const maxSmallDirectorySize = 100000;
  let totalSizeOfSmallDirectories = 0;

  traverseDirectoryTree(directoryTree, (node) => {
    if (!(node instanceof Directory)) {
      return;
    }

    const directorySize = node.size;

    if (directorySize > maxSmallDirectorySize) {
      return;
    }

    totalSizeOfSmallDirectories += directorySize;
  });

  console.log(totalSizeOfSmallDirectories);
};

doPart1();

const doPart2 = () => {
  const directoryTree = createDirectoryTreeFromTerminalOutput();

  const filesystemCapacity = 70000000;
  const spaceRequired = 30000000;
  const spaceAvailable = filesystemCapacity - directoryTree.size;

  const directorySizes: number[] = [];
  traverseDirectoryTree(directoryTree, (node) => {
    if (node instanceof Directory) {
      directorySizes.push(node.size);
    }
  });
  directorySizes.sort((a, b) => a - b);

  for (let i = 0; i < directorySizes.length; i++) {
    if (directorySizes[i] >= spaceRequired - spaceAvailable) {
      console.log(directorySizes[i]);
      break;
    }
  }
};

doPart2();
