import fs from "fs-extra";
import Markdown from "markdown-it";
import highlight from "highlight.js";
import escapeHtml from "escape-html";
import { join, sep } from "path";

const generateLinkedTags = tags => {
    const result = tags.reduce((previous, current) => {
        return previous + `<li><a href="/tag/${encodeURIComponent(current)}.html">#${escapeHtml(current)}</a></li>`;
    }, "");

    return result ? `<ul class="post-tags-links">${result}</ul>` : "";
};

const storePosts = (targetDir, postTemplate, posts) => {
    return posts.map(async (post) => {
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
            tags_links: generateLinkedTags(post.tags),
            document_title: post.title,
        }).get(); // @todo verify why it's not caught if something breaks here
        /* eslint-enable camelcase */

        const targetPath = join(targetDir, post.date.replace(/-/g, sep), post.title + ".html");
        await fs.writeFile(targetPath, fileHtml);
    });
};

export default storePosts;
