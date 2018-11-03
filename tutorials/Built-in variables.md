# static-blog

## Supported build-in variables

### Global

- `%lang%` - Page language (currently global only, hardcoded as `en`), used for `<html>` `lang` attribute
- `%all_tags%` - `<li>` elements with list of tags links collected from all posts, sorted by count decreasing wrapped
                 with `<ul class="all-tags">`
- `%blog_title%` - your blog title from config usually used as `<h1>` and meta title on homepage
- `%blog_title_current%` - Header for posts filtered by tag or global blog title if not on filter page

### Blog post

- `%title%` - post title
- `%date%` - post date
- `%tags%` - post tags (as a clear text, separated with `,`)
- `%tags_links%` - post tags (as links to filtering page), creates wrapping `<ul class="post-tags-links">` but only if
                   there is any tag used
- `%post%` - your actual blog post contents

### Posts list (all or filtered)

- `%all_posts%` - `<li>` elements with list of links for all posts, sorted by date decreasing, wrapped with
                  `<ul class="all-posts">`
