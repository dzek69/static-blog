import fs from "fs-extra";
import Markdown from "markdown-it";
import highlight from "highlight.js";
import { join, sep } from "path";

const storePosts = (targetDir, lang, generateHtml, posts) => {
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

        const fileHtml = generateHtml({
            lang: lang,
            post: postHtml,
        });

        const targetPath = join(targetDir, post.date.replace(/-/g, sep), post.title + ".html");
        await fs.writeFile(targetPath, fileHtml);
    });
};

export default storePosts;
