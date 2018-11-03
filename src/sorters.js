const byDate = (a, b) => {
    if (a.date === b.date) {
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
        }
        return -1; // eslint-disable-line no-magic-numbers
    }
    if (a.date < b.date) {
        return 1;
    }
    return -1; // eslint-disable-line no-magic-numbers
};

const byCount = (a, b) => {
    if (a.list.length === b.list.length) {
        if (a.tag.toLowerCase() > b.tag.toLowerCase()) {
            return 1;
        }
        return -1; // eslint-disable-line no-magic-numbers
    }
    if (a.list.length < b.list.length) {
        return 1;
    }
    return -1; // eslint-disable-line no-magic-numbers
};

const sortByDate = (posts) => {
    return posts.sort(byDate);
};

const groupByTags = (posts) => {
    const results = [];
    const findByTag = (tag) => {
        const array = results.find(item => item.tag === tag);
        if (array) {
            return array;
        }
        const newItem = {
            tag: tag,
            list: [],
        };
        results.push(newItem);
        return newItem;
    };

    posts.forEach((post) => {
        post.tags.forEach(tag => {
            findByTag(tag).list.push(post);
        });
    });

    return results.sort(byCount);
};

export {
    sortByDate,
    groupByTags,
};
