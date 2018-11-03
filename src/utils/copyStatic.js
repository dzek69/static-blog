import fs from "fs-extra";
import { join } from "path";

const copyStatic = (source, target) => {
    return fs.copy(source, join(target, "static"));
};

export default copyStatic;
