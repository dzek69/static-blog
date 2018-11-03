class Replacer {
    constructor(text) {
        this.text = text;
    }

    clone() {
        return new Replacer(this.text);
    }

    replace(replaceData) {
        const regexp = /%[a-zA-Z_]+%/g;
        this.text = this.text.replace(regexp, (key) => {
            const fixedKey = key.substr(1, key.length - 2); // eslint-disable-line no-magic-numbers
            return fixedKey in replaceData ? (replaceData[fixedKey] || "") : key;
        });
        return this;
    }

    get() {
        return this.text;
    }
}

export default Replacer;
