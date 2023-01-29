import path from "path";

/**
 * @param {Config} config
 * @returns {Config}
 */
const validateConfig = config => {
    if (!config.postsDir) {
        throw new TypeError("You need to specify posts directory path");
    }

    if (config.staticDir && !config.templatesDir) {
        throw new TypeError(
            "You need to specify templates directory path if you are specifying own static files directory",
        );
    }

    if (!config.staticDir && config.templatesDir) {
        throw new TypeError(
            "You need to specify static files directory path if you are specifying own templates directory",
        );
    }

    const CWD = process.cwd();

    return {
        postsDir: config.postsDir,
        templatesDir: config.templatesDir || path.join(__dirname, "..", "example/templates"),
        staticDir: config.staticDir || path.join(__dirname, "..", "example/static"),
        outputDir: config.outputDir || path.join(CWD, "output"),
        lang: config.lang || "en",
        blogTitle: config.blogTitle || "",
        blogTitleTag: config.blogTitleTag || "",
        siteUrl: config.siteUrl,
        verbose: config.verbose || false,
    };
};

export default validateConfig;
