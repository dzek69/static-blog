import escapeHtml from "escape-html";

const renderPostTags = tags => {
    const result = tags.reduce((previous, current) => {
        return previous + `<li><a href="/tag/${encodeURIComponent(current)}.html">#${escapeHtml(current)}</a>`;
    }, "");

    return result ? `<ul class="post-tags-links">${result}</ul>` : "";
};

const renderAllTags = (listByTags) => {
    const result = listByTags.reduce((previous, current) => {
        const tag = current.tag;
        const count = `<span>${current.list.length}</span>`;
        const link = `<a href="/tag/${encodeURIComponent(tag)}.html">#${escapeHtml(tag)}</a>`;
        return previous + `<li>${count}${link}`;
    }, "");

    return result ? `<ul class="all-tags">${result}</ul>` : "";
};

const renderAllPosts = (list) => {
    const result = list.reduce((previous, current) => {
        const title = escapeHtml(current.title);
        const url = "/" + current.date.replace(/-/g, "/") + "/" + encodeURIComponent(current.title) + ".html";

        const date = `<span class="all-posts__date">${escapeHtml(current.date)}</span>`;
        const tags = `<div class="all-posts__tags">${renderPostTags(current.tags)}</div>`;

        const link = `<span class="all-posts__link"><a href="${url}">${title}</a></span>`;
        return previous + `<li>${date}${link}${tags}`;
    }, "");

    return result ? `<ul class="all-posts">${result}</ul>` : "";
};

export {
    renderPostTags,
    renderAllTags,
    renderAllPosts,
};
