import fs from "fs-extra";
import { join } from "path";

import Replacer from "./replacer";

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

const prepareTemplates = async (dir) => {
    const home = new Replacer(await prepareTemplate(dir, "home.html"));
    const post = new Replacer(await prepareTemplate(dir, "post.html"));

    return {
        home, post,
    };
};

export default prepareTemplates;
