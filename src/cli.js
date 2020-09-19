
import { parseArgumentsIntoOptions, promptForMissingOptions, readAndGetContent, extractEntries, builNewObjectStructure, writeFileToDisc, removeFileFromDisc } from './helpers';

export async function cli(args) {
  try {
    const options = await promptForMissingOptions(parseArgumentsIntoOptions(args));
    const contentObject = await readAndGetContent(options.sourceFilePath);
    const entries = extractEntries(contentObject)
    const newFileContent = builNewObjectStructure(entries);
    await writeFileToDisc(options.targetFile, newFileContent);
    if (options.deleteSourceFile) {
      await removeFileFromDisc(options.sourceFilePath);
    }
    console.log('DONE!');
  } catch (err) {
    console.log(err)
  }
 }