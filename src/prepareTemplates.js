import fs from "fs-extra";
import { join } from "path";

const cache = {};

const prepareTemplate = async (dir, file) => {
    const contents = String(await fs.readFile(join(dir, file)));
    const includeRegexp = /%include ([.a-zA-Z_-]+)%/g;

    const files = [];

    let match;
    while (match = includeRegexp.exec(contents)) { // eslint-disable-line no-cond-assign
        files.push(match[1]);
    }

    if (files) {
        const jobs = files.map(async (fileName) => {
            cache[fileName] = String(await fs.readFile(join(dir, fileName)));
        });
        await Promise.all(jobs);
    }

    const newIncludeRegexp = /%include ([.a-zA-Z_-]+)%/g;
    return contents.replace(newIncludeRegexp, (_match, fileName) => {
        return cache[fileName];
    });
};

const createReplacer = (contents) => (replaceData) => {
    const regexp = /%[a-zA-Z]+%/g;
    return contents.replace(regexp, (key) => {
        const fixedKey = key.substr(1, key.length - 2); // eslint-disable-line no-magic-numbers
        return replaceData[fixedKey] || "";
    });
};

const prepareTemplates = async (dir) => {
    const home = createReplacer(await prepareTemplate(dir, "home.html"));
    const post = createReplacer(await prepareTemplate(dir, "post.html"));

    return {
        home, post,
    };
};

export default prepareTemplates;
