# static-blog

## Supported build-in variables

### Global

- `%lang%` - Page language (currently global only, hardcoded as `en`), used for `<html>` `lang` attribute
- `%document_title%` - Webpage meta title, automatically taken from `%title%` on posts and `%blog_title%` on home page

### Blog-post

- `%title%` - post title
- `%date%` - post date
- `%tags%` - post tags (as a clear text, separated with `,`)
- `%tags_links%` - post tags (as links to filtering page), creates wrapping `<ul class="post-tags-links">` but only if
                   there is any tag used
- `%post%` - your actual blog post contents

### Blog-list

- `%index_tags%` - `<li>` elements with list of tags links collected from all posts, wrapped with
                   `<ul class="index-tags">`
- `%index_all%` - `<li>` elements with list of links for all posts, sorted by date decreasing, wrapped with
                   `<ul class="index-list">`
- `%blog_title%` - your blog title used on homepage, ie: `My personal blog`
- `%blog_tags%` - title used on filter by tags list, should contain sub-variable: %tag%, ie:
                  `Posts tagged with %tag% - My personal blog` 
