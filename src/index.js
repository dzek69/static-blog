import fetchPosts from "./fetchPosts";

const POSTS_DIR = "example/posts";
const STATIC_DIR = "static";
const TEMPLATES_DIR = "templates";

(async () => {
    const posts = await fetchPosts(POSTS_DIR);
    console.log(posts.results);
    console.log(posts.errors);
})();
