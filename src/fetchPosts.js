import klaw from "klaw";
import { parse } from "path";

const allowedExts = [
    ".md",
];

class Files {
    constructor() {
        this.results = [];
        this.errors = [];

        this.push = this.push.bind(this);
    }

    push(data) {
        if (data instanceof Error) {
            this.errors.push(data);
            return;
        }

        if (data.stats.isDirectory()) {
            return;
        }

        let info;
        try {
            info = Files.getInfo(data);
            this.checkDupes(info);
        }
        catch (error) {
            return this.push(error);
        }

        this.results.push(info);
    }

    checkDupes({ date, title, path }) {
        const dupe = this.results.find(item => {
            return item.date === date && item.title === title;
        });
        if (dupe) {
            throw new Error(`File ${path} has the same date and title as this ${dupe.path}`);
        }
    }

    static normalizeForDate(file) {
        return file.path.replace(/[\\/ ]+/g, "-").replace(/--+/g, "-");
    }

    static removeDate(file) {
        return file.path.replace(/\d{4}[\\/ -]+\d{2}[\\/ -]+\d{2}/g, "");
    }

    static checkExtension(file) {
        const { ext } = parse(file.path);

        if (!allowedExts.includes(ext)) {
            throw new Error(`File ${file.path} is not one of allowed file types ${allowedExts.join(", ")}`);
        }
    }

    static removeExtension(path) {
        const count = allowedExts.length;
        for (let i = 0; i < count; i++) {
            const ext = allowedExts[i];
            const hasThisExt = path.endsWith(ext);
            if (hasThisExt) {
                return path.substr(0, path.length - ext.length);
            }
        }
        return path;
    }

    static removeTags(name) {
        return name.replace(/#[^# ]+/g, "");
    }

    static getTitle(file) {
        const noDate = Files.removeDate(file);
        const parsed = parse(noDate);

        if (parsed.name === parsed.base) {
            throw new Error(`File ${file.path} doesn't contain post title`);
        }

        const name = parsed.name.trim();
        const noTagsName = Files.removeTags(name).trim();

        if (!noTagsName) {
            throw new Error(`File ${file.path} doesn't contain post title`);
        }
        return noTagsName;
    }

    static getTags(file) {
        const noDate = Files.removeExtension(Files.removeDate(file));

        const match = noDate.match(/#([^# \\/]+)/g);
        if (!match) {
            return [];
        }
        return [...new Set(match.map(s => s.toLowerCase().substr(1)))];
    }

    static getDate(file) {
        const normalizedNameForDate = Files.normalizeForDate(file);
        const date = normalizedNameForDate.match(/(\d{4}-\d{2}-\d{2})/g);
        // @todo date range validity
        if (!date) {
            throw new Error(`File ${file.path} doesn't contain expected date within path`);
        }
        if (date.length > 1) {
            throw new Error(`File ${file.path} contains multiple dates within path`);
        }
        return date[0];
    }

    static getInfo(file) {
        Files.checkExtension(file);
        const date = Files.getDate(file);
        const title = Files.getTitle(file);
        const tags = Files.getTags(file);

        return {
            date: date,
            title: title,
            tags: tags,
            path: file.path,
        };
    }
}

const fetchPosts = (dir) => new Promise((resolve, reject) => {
    const result = new Files();

    klaw(dir)
        .on("data", result.push)
        .on("error", (e) => {
            if (e.code === "ENOENT") {
                reject(new Error(
                    "Cannot read specified posts directory. Verify if path is correct and read permissions are set",
                ));
                return;
            }
            reject(e);
        })
        .on("end", () => resolve(result));
});

export default fetchPosts;
