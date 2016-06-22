let fs = require('fs');
let path = require('path');
let _ = require('lodash');

class FileSystem {
    constructor(name) {}

    /**
     * Get the subdirectories of the directory found at srcpath
     * @param {string} srcpath - A string path to the directory you want to get subdirectories for
     * @return {array} An array of directory names under srcpath
     */
    getDirectories(srcpath) {
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }
    /**
     * Get the files found at srcpath
     * @param {string} srcpath - A string path to the directory you want to get files for
     * @return {array} An array of filenames under srcpath
     */
    getFiles(srcpath) {
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isFile();
        });
    }
    /**
     * Get the files found at srcpath starting with startsWith filter
     * @param {string} srcpath - A string path to the directory you want to get files for
     * @param {string} startsWith - A string that must be at the start of a filename
     * @return {array} An array of filenames under srcpath matching startsWith
     */
    getFilesStartingWith(srcpath, startsWith){
        return this.getFiles(srcpath).filter(function(file){
            return _.startsWith(file, startsWith)
        })
    }
    /**
     * Get the files found at srcpath starting with like filter
     * @param {string} srcpath - A string path to the directory you want to get files for
     * @param {string} endsWith - A string that must be somewhere in the filename
     * @return {array} An array of filenames under srcpath matching like
     */
    getFilesLike(srcpath, like){
        return this.getFiles(srcpath).filter(function(file){
            return file.indexOf(like) > -1
        })
    }

    /**
     * Get the files found at srcpath starting with endsWith filter
     * @param {string} srcpath - A string path to the directory you want to get files for
     * @param {string} endsWith - A string that must be at the start of a filename
     * @return {array} An array of filenames under srcpath matching endsWith
     */
    getFilesEndingWith(srcpath, endsWith){
        return this.getFiles(srcpath).filter(function(file){
            return _.endsWith(file, endsWith)
        })
    }

    /**
     * Get files using a formatObj object
     * @param {object} formatObj - An object of root, filename, extension, encoding, mode
     * @return {array} An array of filenames
     */
    getFilesFormattedLike(formatObj){
        let allFiles = this.getFiles(formatObj.root)
        return allFiles.filter(function(file){
            return _.startsWith(file, formatObj.filename) && _.endsWith(file, formatObj.extension)
        })
    }

    /**
     * Get files using a formatObj object
     * @param {object} formatObj - An object of root, filename, extension, encoding, mode
     * @return {array} An array of filenames
     */
    getNextFileNumber(fileName, formatObj){
        let startRegex = new RegExp(`^${formatObj.filename}`);
        let endRegex = new RegExp(`\.${formatObj.extension}$`);
        return fileName.replace(startRegex,"").replace(endRegex,"");
    }

    getNextDirectoryNumber(path){
        let allFiles = this.getDirectories(path)
        let regex = new RegExp(`[0-9]+`)
        let filteredFiles = allFiles.filter(function(directory){
            return regex.test(directory)
        })
        return filteredFiles
    }

    makeNextDirectory(path){
        fs.mkdirSync(`${path}/${this.getNextDirectoryNumber(path)}`)
    }

    writeFileIncrementer(data, formatObj){
        let writeOpts = {};
        if(formatObj.encoding) writeOpts['encoding'] = formatObj.encoding;
        if(formatObj.mode) writeOpts['mode'] = formatObj.mode;
        let filesLike = this.getFilesFormattedLike(formatObj)
        let nextNum = this.getNextFileNumber(_.max(filesLike), formatObj);
        fs.writeFileSync(`${formatObj.root}/${formatObj.filename}${parseInt(nextNum)+1}.${formatObj.extension}`, data, writeOpts)
    }
}

module.exports = FileSystem