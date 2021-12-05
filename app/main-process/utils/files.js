const fs = require("fs");
const path = require("path");

const _notFilterFile = file => {
  const fileName = path.basename(file.path);
  const filterFiles = ["__tags", ".git", "__cards", "__timecard"];
  return !filterFiles.includes(fileName);
};

const listFilesDeep = (filePath, result) => {
  fs.readdirSync(filePath).forEach(item => {
    const _path = filePath + "/" + item;
    const file = fs.statSync(_path);
    let temp = {
      mtime: file.mtime,
      ctime: file.birthtime,
      path: _path,
      type: file.isFile() ? Files.resolveFileType(_path) : "dir"
    };
    if (_notFilterFile(temp)) {
      result.push(temp);
    }
    if (file.isDirectory()) {
      temp.sub = [];
      listFilesDeep(_path, temp.sub);
    }
  });
};

const listFiles = filePath => {
  return fs
    .readdirSync(filePath)
    .map(item => {
      const _path = filePath + "/" + item;
      const file = fs.statSync(_path);
      return {
        mtime: file.mtime,
        ctime: file.birthtime,
        path: _path,
        type: file.isFile() ? Files.resolveFileType(_path) : "dir",
        sub: []
      };
    })
    .filter(_notFilterFile);
};
const deleteDir = url => {
  let files = fs.readdirSync(url);
  files.forEach(function(file) {
    const curPath = path.join(url, file);

    if (fs.statSync(curPath).isDirectory()) {
      deleteDir(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(url);
};

const Files = {
  listFilesDeep: _path => {
    const file = fs.statSync(_path);
    const dirs = {
      path: _path,
      ctime: file.birthtime,
      sub: [],
      type: file.isFile() ? Files.resolveFileType(_path) : "dir"
    };
    listFilesDeep(_path, dirs.sub);
    return dirs;
  },
  listFiles: _path => {
    const file = fs.statSync(_path);
    return {
      path: _path,
      ctime: file.birthtime,
      sub: listFiles(_path),
      type: file.isFile() ? Files.resolveFileType(_path) : "dir"
    };
  },
  readFile: _path => {
    const isExist = fs.existsSync(_path);
    if (!isExist) {
      fs.writeFileSync(_path, "");
    }
    const file = fs.statSync(_path);
    return {
      path: _path,
      mtime: file.mtime,
      ctime: file.birthtime,
      type: Files.resolveFileType(_path),
      content: fs.readFileSync(_path, "utf-8")
    };
  },
  modifyFileName: (oldPath, newFileName) => {
    const newFilePath = path.dirname(oldPath) + "/" + newFileName;
    fs.renameSync(oldPath, newFilePath);
    return newFilePath;
  },
  modifyFileContent: (_path, content) => {
    fs.writeFileSync(_path, content, "utf-8");
    return Files.readFile(_path);
  },
  createFileOrDir: (_path, type) => {
    if (type === "dir") {
      fs.mkdirSync(_path);
    }
    fs.writeFileSync(_path, "");
  },
  createFileWithContent: (_path, data = "") => {
    fs.writeFileSync(_path, data);
    return Files.readFile(_path);
  },
  deleteFileOrDir: (_path, type) => {
    if (type === "dir") {
      deleteDir(_path);
    } else {
      fs.unlinkSync(_path);
    }
    return _path;
  },
  createDirIfNotExist: dir => {
    let isExist = fs.existsSync(dir);
    if (!isExist) {
      fs.mkdirSync(dir);
    }
  },
  parentPath: _path => {
    return path.dirname(_path);
  },
  isExist: _path => {
    return fs.existsSync(_path);
  },
  resolveFileType: _path => {
    let extname = path.extname(_path);
    return extname.length > 0 ? extname.slice(1) : "";
  }
};

module.exports = Files;
