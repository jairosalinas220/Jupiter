const i18 = require('i18next')
const back = require('i18next-node-fs-backend')
const path = require('path')
const fs = require('fs').promises

async function walk(dir, nameSpaces = [], folder = '') {
    const files = await fs.readdir(dir)
    const languages = []
    for(const file of files) {
        const directory = await fs.stat(path.join(dir, file))
        if(directory.isDirectory()) {
            const is = file.includes('-')
            if(is) {
                languages.push(file)
            }
            const fd = await walk(path.join(dir, file), nameSpaces, is ? '' : `${file}/`)
            nameSpaces = fd.nameSpaces
        } else {
            nameSpaces.push(`${folder}${file.substr(0, file.length - 5)}`)
        }
    }
    return {
        nameSpaces: [...new Set(nameSpaces)],
        languages
    }
}
module.exports = async () => {
    const options = {
        jsonIndent: 2,
        loadPath: path.resolve(__dirname, './Lang/{{lng}}/{{ns}}.json')
    };
    const { nameSpaces, languages } = await walk(path.resolve(__dirname, './Lang/'));
    i18.use(back);
    await i18.init({
        backend: options,
        debug: false,
        fallbackLng: 'en-US',
        initImmediate: false,
        interpolation: { escapeValue: false },
        load: 'all',
        ns: nameSpaces,
        preload: languages
    });
    return new Map(languages.map((item) => [item, i18.getFixedT(item)]));
}