let FileBuddy = require('./index.js');

let formatObj = {
    root: "test/1",
    filename: "some-",
    extension: "jpg"
}

let fb = new FileBuddy()
console.log(fb.getDirectories('.'))
console.log(fb.getFiles('.'))
console.log(fb.getFilesStartingWith('.', 'tall'))
console.log(fb.getFilesLike('.', 'age'))
console.log(fb.getFilesFormattedLike(formatObj))
console.log(fb.getFilesEndingWith('.', '.js'))
console.log(fb.writeFileIncrementer('test/1',formatObj))
fb.getNextDirectoryNumber('test')