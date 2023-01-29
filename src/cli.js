#!/usr/bin/env node

import program from "commander";

import main from "./index";

console.info("[static-blog]");

import pkg from "../package.json";

program
    .version(pkg.version, "-v, --version")
    .option("-p, --posts-dir <dir>", "Set posts directory path")
    .option("-s, --static-dir [dir]", "Set static files directory path")
    .option("-t, --templates-dir [dir]", "Set templates directory path")
    .option("-o, --output-dir [dir=output]", "Set output directory path")

    .option("--blog-title [title]", "Set blog title (see docs for more info)")
    .option("--blog-title-tag [title]", "Set blog title (see docs for more info)")
    .option("--blog-lang [lang=en]", "Set blog language (see docs for more info)")
    .option("--site-url [url]", "Set site url (optional, required to generate rss)")
    .option("--verbose", "Set debug mode/more verbose errors");

const args = program.parse(process.argv);

main(args, {
    info(...fnArgs) {
        console.info(...fnArgs);
    },
    warn(...fnArgs) {
        console.warn(...fnArgs);
    },
});

