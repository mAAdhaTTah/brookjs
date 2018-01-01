let count = 0;

function getId() {
    count += 1;
    return count;
}

const data = {};
let revision = 0;

export const getRevision = () => {
    return revision;
};

export const incrementRevision = () => {
    revision++;
};

export const addStory = (kind, name, fn, fileName) => {
    if (!data[kind]) {
        data[kind] = {
            kind,
            fileName,
            index: getId(),
            stories: {},
        };
    }

    data[kind].stories[name] = {
        name,
        index: getId(),
        fn,
    };
};

export const getStoryKinds = () => {
    return Object.keys(data)
        .map(key => data[key])
        .filter(kind => Object.keys(kind.stories).length > 0)
        .sort((info1, info2) => info1.index - info2.index)
        .map(info => info.kind);
};

export const getStories = (kind) => {
    if (!data[kind]) {
        return [];
    }

    return Object.keys(data[kind].stories)
        .map(name => data[kind].stories[name])
        .sort((info1, info2) => info1.index - info2.index)
        .map(info => info.name);
};

export const getStoryFileName = (kind) => {
    const storiesKind = data[kind];
    if (!storiesKind) {
        return null;
    }

    return storiesKind.fileName;
};

export const getStory = (kind, name) => {
    const storiesKind = data[kind];
    if (!storiesKind) {
        return null;
    }

    const storyInfo = storiesKind.stories[name];
    if (!storyInfo) {
        return null;
    }

    return storyInfo.fn;
};

export const removeStoryKind = (kind) => {
    data[kind].stories = {};
};

export const hasStoryKind = (kind) => {
    return Boolean(data[kind]);
};

export const hasStory = (kind, name) => {
    return Boolean(getStory(kind, name));
};

export const dumpStoryBook = () => {
    return getStoryKinds().map(kind => ({ kind, stories: getStories(kind) }));
};

export const size = () => {
    return Object.keys(data).length;
};

export const clean = () => {
    getStoryKinds().forEach(kind => delete data[kind]);
};
