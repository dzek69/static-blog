import fs from "fs-extra";
import { join, sep } from "path";

const prepareDirs = async (dir, posts) => {
    await fs.emptyDir(dir);
    const jobs = posts.map(post => fs.ensureDir(join(dir, post.date.replace(/-/g, sep))));
    jobs.push(fs.ensureDir(join(dir, "tag")));
    await Promise.all(jobs);
};

export default prepareDirs;
