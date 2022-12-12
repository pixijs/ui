const fs = require('fs');
const path = require('path');
const tsconfig = require('../tsconfig.json');
const micromatch = require('micromatch');

// Read exclude list from tsconfig
const excludeList = tsconfig.exclude || [];

const args = {};

process.argv.forEach((val) =>
{
    args[val] = true;
});

// loop through a directory and every time a folder is found
function traverseDir(dir)
{
    fs.readdirSync(dir).forEach((file) =>
    {
        const fullPath = path.join(dir, file);

        // Ignore files and folders listed in tsconfig exclude list
        if (micromatch.isMatch(fullPath, excludeList)) return;

        if (fullPath.match)
        {
            if (fs.lstatSync(fullPath).isDirectory() && !fullPath.includes('__tests__'))
            {
                // if its a directory then we should check if there is an index file
                // if there is we should remove it and replace it with a new one
                const directoryList = getDirectoryList(fullPath);

                if (directoryList.length)
                {
                    const indexLocation = path.join(fullPath, './index.ts');

                    // deleting the old file
                    fs.existsSync(indexLocation) && fs.unlinkSync(indexLocation);

                    writeIndexFile(indexLocation, directoryList);

                    traverseDir(fullPath);
                }
            }
        }
    });
}

function getDirectoryList(dir)
{
    const fileNames = [];

    fs.readdirSync(dir).forEach((file) =>
    {
        if (file === 'index.ts' || file.includes('__tests__')) return;

        const fullPath = path.join(dir, file);

        // lets ignore any folder that is empty..
        if (fs.lstatSync(fullPath).isDirectory() && !fs.readdirSync(fullPath).length) return;

        // also ignore files listed in tsconfig exclude files
        if (micromatch.isMatch(fullPath, excludeList)) return;

        const splitName = file.split('.');

        if (splitName.length > 2)
        {
            // eslint-disable-next-line no-console
            console.log(`[generateIndex] Skipping file: ${file} please manually check if this is needed`);

            return;
        }

        if (splitName[0].length)
        {
            fileNames.push(splitName[0]);
        }
    });

    return fileNames;
}

function writeIndexFile(dir, dirList)
{
    let contents = '';

    dirList.sort((a, b) =>
    {
        // weirdly - the normal sort will put uppercase before lowercase chars.
        if (a.toLowerCase() < b.toLowerCase()) return -1;
        if (a.toLowerCase() > b.toLowerCase()) return 1;

        return 0;
    }).forEach((item) =>
    {
        contents += `export * from './${item}';\n`;
    });

    fs.writeFile(dir, contents, { flag: 'w' }, (err) =>
    {
        // eslint-disable-next-line no-console
        if (err) console.log(err);
    });
}

traverseDir(path.join(__dirname, '../src'));

const watch = !!args['-w'];

if (watch)
{
    // eslint-disable-next-line no-console
    console.log('[generateIndex] watching for file changes, don\'t rewrite the index files... we will do it for you!');

    fs.watch('./src', { recursive: true }, (action, filename) =>
    {
        if (path.basename(filename) === 'index.ts') return;

        if (action === 'rename')
        {
            traverseDir(path.join(__dirname, '../src'));
        }
    });
}

