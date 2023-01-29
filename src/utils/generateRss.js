import fs from "fs-extra";
import RSS from "rss";
import path from "path";
import urlJoin from "url-join";

const generateRss = async ({ outputDir, blogTitle, siteUrl }, { info }, { storedPosts }) => {
    if (!storedPosts) {
        info("Skipping - no posts");
        return;
    }
    if (!siteUrl) {
        info("Skipping - no site URL");
        return;
    }
    const byDate = [...storedPosts];
    byDate.length = 10;

    const rssPosts = byDate.map(post => ({
        title: post.title,
        description: post.title,
        url: urlJoin(siteUrl, post.url),
        guid: urlJoin(siteUrl, post.url),
        date: post.date,
    }));

    const rssUrl = urlJoin(siteUrl, "rss.xml");

    const feed = new RSS({
        title: blogTitle,
        // description,
        generator: "https://www.npmjs.com/package/rss",
        // eslint-disable-next-line camelcase
        site_url: siteUrl,
        // eslint-disable-next-line camelcase
        feed_url: rssUrl,
        ttl: 60,
    });
    rssPosts.forEach(post => {
        feed.item(post);
    });
    const xml = feed.xml({ indent: true });
    await fs.writeFile(path.join(outputDir, "rss.xml"), xml);

    return rssUrl;
};

export {
    generateRss,
};
