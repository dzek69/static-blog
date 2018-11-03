#!/usr/bin/env node

import program from "commander";
import path from "path";

import fetchPosts from "./utils/fetchPosts";
import prepareDirs from "./utils/prepareDirs";
import copyStatic from "./utils/copyStatic";
import prepareTemplates from "./utils/prepareTemplates";
import storePosts from "./utils/storePosts";
import storeListPages from "./utils/storeListPages";

import { sortByDate, groupByTags } from "./utils/sorters";

import { renderAllTags } from "./utils/rendering";

console.info("[static-blog]");

program
    .version("1.0.0", "-v, --version")
    .option("-p, --posts-dir <dir>", "Set posts directory path")
    .option("-s, --static-dir [dir]", "Set static files directory path")
    .option("-t, --templates-dir [dir]", "Set templates directory path")
    .option("-o, --output-dir [dir=output]", "Set output directory path");

const args = program.parse(process.argv);

const errors = [];

if (!args.postsDir) {
    errors.push("You need to specify posts directory path");
}
if (args.staticDir && !args.templatesDir) {
    errors.push("You need to specify templates directory path if you are specifying own static files directory");
}
if (!args.staticDir && args.templatesDir) {
    errors.push("You need to specify static files directory path if you are specifying own templates directory");
}
if (errors.length) {
    errors.forEach(e => console.error(e));
    process.exit(1); // eslint-disable-line no-process-exit
}

const CWD = process.cwd();

const POSTS_DIR = args.postsDir;
const STATIC_DIR = args.staticDir || path.join(__dirname, "..", "example/static");
const TEMPLATES_DIR = args.templatesDir || path.join(__dirname, "..", "example/templates");
const TARGET_DIR = args.outputDir || path.join(CWD, "output");

const LANG = "en";
const BLOG_TITLE = "My personal blog";
const BLOG_TITLE_TAG = "Posts tagged with %tag%";

(async () => { // eslint-disable-line max-statements
    try {
        console.info("Fetching posts");
        const posts = await fetchPosts(POSTS_DIR);
        console.info(`Found ${posts.results.length} correct posts`);
        if (posts.errors.length) {
            console.warn(`Warning: These ${posts.errors.length} files will be skipped:`);
            posts.errors.forEach(error => {
                console.warn(error.message);
            });
        }
        console.info("Preparing directory structure");
        await prepareDirs(TARGET_DIR, posts.results);
        console.info("Copying static files");
        await copyStatic(STATIC_DIR, TARGET_DIR);
        console.info("Parsing templates");
        const templates = await prepareTemplates(TEMPLATES_DIR);
        console.info("Generating posts");

        const listByDate = sortByDate(posts.results);
        const listByTags = groupByTags(posts.results);
        const allTags = renderAllTags(listByTags);

        /* eslint-disable camelcase */
        const post = templates.post.replace({
            all_tags: allTags,
            lang: LANG,
            blog_title: BLOG_TITLE,
        });

        const home = templates.home.replace({
            all_tags: allTags,
            lang: LANG,
            blog_title: BLOG_TITLE,
        });
        /* eslint-enable camelcase */

        console.info("Storing posts");
        await storePosts(TARGET_DIR, post, posts.results);
        console.info("Storing homepage and tags");
        await storeListPages(TARGET_DIR, home, listByDate, listByTags, {
            title: BLOG_TITLE,
            titleTag: BLOG_TITLE_TAG,
        });
        console.info("Done!");
    }
    catch (e) {
        console.error("Error: There was a problem during generating your blog:");
        console.error(e.message);
    }
})();
