const THREADS = 2;
const BROWSER_RESTART = 8;
const CHECKPOINT_FILE = 'checkpoint';
const COURSE_NUMBER_LIMIT = 499;
let session = 0;
const browsers = [];
const courseNumbers = [...new Array(500).keys()].map(number => {
    let numStr = number.toString();
    while (numStr.length < 3) {
        numStr = '0' + numStr;
    }
    return numStr;
}).slice(1);
console.log(courseNumbers);
export {};
//# sourceMappingURL=index.js.map