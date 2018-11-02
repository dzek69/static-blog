import fetchPosts from "./fetchPosts";
import prepareDirs from "./prepareDirs";
import copyStatic from "./copyStatic";
import prepareTemplates from "./prepareTemplates";

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

        console.log(templates.home({
            lang: LANG,
        }));
    }
    catch (e) {
        console.error("There was a problem during generating your blog.");
        console.error(e);
    }
})();
