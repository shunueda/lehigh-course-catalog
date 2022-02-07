import puppeteer, { Browser } from "puppeteer";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { setTimeout } from "timers/promises";
import _ from "lodash";

const THREADS = 2;
const COURSE_NUMBER_LIMIT = 499;

const browsers: Browser[] = [];
const courseNumbers = [...new Array(COURSE_NUMBER_LIMIT + 1).keys()]
  .map((number) => {
    let numStr = number.toString();
    while (numStr.length < 3) {
      numStr = "0" + numStr;
    }
    return numStr;
  })
  .slice(1);
const chunks = _.chunk(courseNumbers, courseNumbers.length / THREADS + 1);
const status = new Array(THREADS).fill(false);
for (let i = 0; i < THREADS; i++) {
  browsers.push(
    await puppeteer.launch({
      headless: true,
    })
  );
}

mkdirSync("assets/chunks", { recursive: true });
browsers.forEach(async (browser, i) => {
  let chunkIndex = 0;
  for (const courseNumber of chunks[i]) {
    const page = await browser.newPage();
    await page.goto(
      "https://reg-prod.ec.lehigh.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=search",
      {
        waitUntil: "networkidle2",
      }
    );
    await (await page.$x('//*[@id="s2id_txt_term"]/a/span[2]/b'))[0].click();
    await setTimeout(2500);
    await (await page.$x('//*[@id="202210"]'))[0].click();
    await setTimeout(100);
    await (await page.$x('//*[@id="term-go"]'))[0].click();
    await setTimeout(5000);
    const input = (await page.$x('//*[@id="txt_courseNumber"]'))[0];
    await input.click({ clickCount: 3 });
    await input.type(courseNumber.toString());
    await setTimeout(100);
    await (await page.$x('//*[@id="search-go"]'))[0].click();
    await setTimeout(5000);
    const subPage = await browser.newPage();
    await subPage.goto(
      "https://reg-prod.ec.lehigh.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?pageMaxSize=999",
      {
        waitUntil: "networkidle2",
      }
    );
    const extracted = await subPage.$eval("*", (el: any) => el.innerText);
    await subPage.close();
    await page.close();
    writeFileSync(
      `./assets/chunks/${i}_${++chunkIndex}.json`,
      JSON.stringify(JSON.parse(extracted).data)
    );
  }
  status[i] = true;
  if (status.every(Boolean)) {
    console.log("Fetch done!");
    console.log("Bundling into courses.json...");
    const courses: any[] = [];
    for (const chunk of readdirSync("assets/chunks")) {
      courses.push(
        ...JSON.parse(readFileSync(`assets/chunks/${chunk}`).toString())
      );
    }
    writeFileSync(
      "assets/courses.json",
      JSON.stringify(_.uniqWith(courses, _.isEqual))
    );
    console.log(`Total ${courses.length} courses - Bundle done!`);
    process.exit(0);
  }
});
