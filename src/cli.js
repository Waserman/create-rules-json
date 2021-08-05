
import { parseArgumentsIntoOptions, promptForMissingOptions, readAndGetContent, extractEntries, builNewObjectStructure, writeFileToDisc, removeFileFromDisc } from './helpers';
import fs from 'fs';
import { promisify } from 'util';
import csv from 'csvtojson';

const read = promisify(fs.readFile);

class JsonFileReader {
  async readContent(filepath) {
    try {
      const contents = await read(filepath, 'utf8');
      return JSON.parse(contents);
    } catch (ex) {
      throw new Error('Could not read the source file.')
    }
  }
}

class CsvFileReader {
  async readContent(filepath) {
    try {
      const jsonArray = await csv().fromFile(filepath);
      return jsonArray;
    } catch (ex) {
      throw new Error('Could not read the source file.')
    }
  }
}
const readersStrategy = {
  strategies: { csv: CsvFileReader, json: JsonFileReader },
  create(type) {
    return new readersStrategy.strategies[type]();
  }
}

export async function cli(args) {
  try {
    const options = await promptForMissingOptions(parseArgumentsIntoOptions(args));
    const contentObject = await readAndGetContent(options.sourceFilePath, readersStrategy.create(options.sourceType));
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
