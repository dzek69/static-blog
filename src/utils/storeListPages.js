import fs from "fs-extra";
import { join } from "path";
import { renderAllPosts } from "./rendering";

const storeListPages = async (targetDir, homeTemplate, listByDate, listByTags, titles) => {
    {
        const listGenerator = homeTemplate.clone();

        /* eslint-disable camelcase */
        const fileHtml = listGenerator.replace({
            all_posts: renderAllPosts(listByDate),
            blog_title_current: titles.title,
            rss: titles.rss,
        }).get();
        /* eslint-enable camelcase */

        const indexTarget = join(targetDir, "index.html");
        await fs.writeFile(indexTarget, fileHtml);
    }

    return Promise.all(listByTags.map(async (tagData) => {
        const listGenerator = homeTemplate.clone();

        /* eslint-disable camelcase */
        const fileHtml = listGenerator.replace({
            all_posts: renderAllPosts(tagData.list),
            blog_title_current: titles.titleTag.replace(/%tag%/g, "#" + tagData.tag),
        }).get();
        /* eslint-enable camelcase */

        const indexTarget = join(targetDir, "tag", tagData.tag + ".html");
        await fs.writeFile(indexTarget, fileHtml);
    }));
};

export default storeListPages;
