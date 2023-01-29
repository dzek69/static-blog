import fs from "fs-extra";
import Markdown from "markdown-it";
import highlight from "highlight.js";
import { join, sep } from "path";

import { renderPostTags } from "./rendering";

const storePosts = (targetDir, postTemplate, posts) => {
    return Promise.all(posts.map(async (post) => {
        const mdContents = String(await fs.readFile(post.path));
        const md = new Markdown({
            html: false,
            xhtmlOut: true,
            breaks: false,
            langPrefix: "language-",
            linkify: true,
            typographer: true,
            quotes: "“”‘’",
            highlight: function hl(str, language) {
                if (language && highlight.getLanguage(language)) {
                    try {
                        return highlight.highlight(language, str).value;
                    }
                    catch (e) {} // eslint-disable-line no-unused-vars
                }

                return ""; // use external default escaping
            },
        });
        const postHtml = md.render(mdContents);

        const postGenerator = postTemplate.clone();
        /* eslint-disable camelcase */
        const fileHtml = postGenerator.replace({
            post: postHtml,
            title: post.title,
            date: post.date,
            tags: post.tags.map(s => "#" + s).join(", "),
            tags_links: renderPostTags(post.tags),
            blog_title_current: post.title,
        }).get();
        /* eslint-enable camelcase */

        const filePath = join(post.date.replace(/-/g, sep), post.title + ".html");
        const targetPath = join(targetDir, filePath);
        await fs.writeFile(targetPath, fileHtml);

        return {
            ...post,
            url: filePath.split("/").map(v => encodeURIComponent(v)).join("/"),
        };
    }));
};

export default storePosts;
