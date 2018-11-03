import fetchPosts from "./utils/fetchPosts";
import prepareDirs from "./utils/prepareDirs";
import copyStatic from "./utils/copyStatic";
import prepareTemplates from "./utils/prepareTemplates";
import storePosts from "./utils/storePosts";
import storeListPages from "./utils/storeListPages";

import { sortByDate, groupByTags } from "./utils/sorters";

import { renderAllTags } from "./utils/rendering";

import validateConfig from "./validateConfig";

const noop = () => {}; // eslint-disable-line no-empty-function

const jobs = [
    async ({ postsDir }, { info, warn }) => {
        info("Fetching posts");
        const posts = await fetchPosts(postsDir);
        info(`Found ${posts.results.length} correct posts`);
        if (posts.errors.length) {
            warn(`Warning: These ${posts.errors.length} files will be skipped:`);
            posts.errors.forEach(error => {
                warn(error.message);
            });
        }
        return { posts };
    },
    async ({ outputDir }, { info }, { posts }) => {
        info("Preparing directory structure");
        await prepareDirs(outputDir, posts.results);
    },
    async ({ staticDir, outputDir }, { info }) => {
        info("Copying static files");
        await copyStatic(staticDir, outputDir);
    },
    async ({ templatesDir, lang, blogTitle }, { info }, { posts }) => {
        info("Parsing templates");
        const templates = await prepareTemplates(templatesDir);

        const listByDate = sortByDate(posts.results);
        const listByTags = groupByTags(posts.results);
        const allTags = renderAllTags(listByTags);

        /* eslint-disable camelcase */
        const post = templates.post.replace({
            all_tags: allTags,
            lang: lang,
            blog_title: blogTitle,
        });

        const home = templates.home.replace({
            all_tags: allTags,
            lang: lang,
            blog_title: blogTitle,
        });
        /* eslint-enable camelcase */

        return {
            listByDate,
            listByTags,
            home,
            post,
        };
    },
    async ({ outputDir }, { info }, { posts, post }) => {
        info("Storing posts");
        await storePosts(outputDir, post, posts.results);
    },
    async ({ outputDir, blogTitle, blogTitleTag }, { info }, { home, listByDate, listByTags }) => {
        info("Storing homepage and tags");
        await storeListPages(outputDir, home, listByDate, listByTags, {
            title: blogTitle,
            titleTag: blogTitleTag,
        });
    },
];

/**
 * @typedef {Object} Config
 * @property {string} postsDir
 * @property {string} templatesDir
 * @property {string} staticDir
 * @property {string} outputDir
 * @property {string} lang
 * @property {string} blogTitle
 * @property {string} blogTitleTag
 * @property {boolean} verbose
 */

/**
 * @param {Config} config
 * @param {Object} callbacks
 * @param {function} callbacks.info
 * @param {function} callbacks.warn
 * @returns {Promise}
 */
const main = async (config, callbacks) => { // eslint-disable-line max-statements
    let fixedConfig;

    try {
        fixedConfig = validateConfig(config);
        const fixedCallbacks = {
            info: callbacks.info || noop,
            warn: callbacks.warn || noop,
        };
        const jobsCount = jobs.length;

        const result = {};

        for (let i = 0; i < jobsCount; i++) {
            const data = await jobs[i](fixedConfig, fixedCallbacks, result);
            Object.assign(result, data);
        }

        callbacks.info("Done!");

        return result.posts;
    }
    catch (e) {
        console.error("Error: There was a problem during generating your blog:");
        console.error(e.message);
        if (fixedConfig && fixedConfig.verbose) {
            console.error(e.stack);
        }
    }
};

export default main;
