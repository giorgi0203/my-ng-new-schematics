import path = require("path");
import fs = require('fs');
const {
    InputData,
    JSONSchemaInput,
    // JSONSchemaStore,
    TypeScriptTargetLanguage,
    parseJSON,
    quicktype,
} = require('quicktype-core');
/**
 * Create the TS file from the schema, and overwrite the outPath (or log).
 * @param {string} inPath
 * @param {string} outPath
 */
async function main(inPath: string, outPath: string) {
    // const fileName = 'src/new-project/schema.josn';
    const content = await generate(inPath);

    if (outPath === '-') {
        console.log(content);
        process.exit(0);
    }

    const buildWorkspaceDirectory = process.env['BUILD_WORKSPACE_DIRECTORY'] || '.';
    outPath = path.resolve(buildWorkspaceDirectory, outPath);
    fs.writeFileSync(outPath, content, 'utf-8');
}

async function generate(inPath: string) {
    // Best description of how to use the API was found at
    //   https://blog.quicktype.io/customizing-quicktype/
    const inputData = new InputData();
    const content = fs.readFileSync(inPath, 'utf-8');
    const source = { name: 'Schema', schema: content };

    await inputData.addSource('schema', source, () => {
        return new JSONSchemaInput(parseJSON(content, 'Schema'));
    });

    const lang = new TypeScriptTargetLanguage();

    const { lines } = await quicktype({
        lang,
        inputData,
        alphabetizeProperties: true,
        rendererOptions: {
            'just-types': 'true',
            'explicit-unions': 'true',
            'acronym-style': 'camel',
        },
    });

    return lines.join('\n');
}



// if (require.main === module) {
// Parse arguments and run main().
// const argv = process.argv.slice(2);
// if (argv.length < 2 || argv.length > 3) {
//     console.error('Must include 2 or 3 arguments.');
//     process.exit(1);
// }

main('src/new-project/schema.json', 'src/new-project/IMyScematicOptions.ts')
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('An error happened:');
        console.error(err);
        process.exit(127);
    });
// }

exports.generate = generate;