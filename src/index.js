import fetchPosts from "./fetchPosts";
import prepareDirs from "./prepareDirs";
import copyStatic from "./copyStatic";

const POSTS_DIR = "example/posts";
const STATIC_DIR = "example/static";
const TEMPLATES_DIR = "example/templates";
const TARGET_DIR = "output";

(async () => {
    try {
        const posts = await fetchPosts(POSTS_DIR);
        await prepareDirs(TARGET_DIR, posts.results);
        await copyStatic(STATIC_DIR, TARGET_DIR);
    }
    catch (e) {
        console.error("There was a problem during generating your blog.");
        console.error(e);
    }
})();
