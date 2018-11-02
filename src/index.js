import fetchPosts from "./fetchPosts";
import prepareDirs from "./prepareDirs";
import copyStatic from "./copyStatic";
import prepareTemplates from "./prepareTemplates";
import storePosts from "./storePosts";

const POSTS_DIR = "example/posts";
const STATIC_DIR = "example/static";
const TEMPLATES_DIR = "example/templates";
const TARGET_DIR = "output";
const LANG = "pl";

(async () => {
    try {
        const posts = await fetchPosts(POSTS_DIR);
        await prepareDirs(TARGET_DIR, posts.results);
        await copyStatic(STATIC_DIR, TARGET_DIR);
        const templates = await prepareTemplates(TEMPLATES_DIR);
        await storePosts(TARGET_DIR, LANG, templates.post, posts.results);
    }
    catch (e) {
        console.error("There was a problem during generating your blog.");
        console.error(e);
    }
})();
