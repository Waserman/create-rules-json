import arg from 'arg';
import inquirer from 'inquirer';
import { promisify } from 'util';
import downloadsFolder from 'downloads-folder';
import fs from 'fs';

const access = promisify(fs.access);
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);

export function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
     '--source': String,
     '--source-type': String,
     '--target': String,
     '--target-type': String,
     '--replace': Boolean,
     '-s': '--source',
     '-t': '--target',
     '-r': '--replace',
   },
   {
     argv: rawArgs.slice(2),
   }
 );
 return {
   source: args['--source'] || null,
   sourceType: args['--source-type'] || 'csv',
   target: args['--target'] || null,
   targetType: args['--target-type'] || 'json',
   replace: args['--replace'] || false,
 };
}

function validateUserInput (input) {
  const done = this.async();
  access(input, fs.constants.R_OK)
    .then(() => {
      done(null, true);
    })
    .catch(() => {
      done('File not found in provided path. Try again.');
    });
};

export async function promptForMissingOptions(options) {
  const questions = [];
  if (!options.source) {
    questions.push({
      type: 'input',
      name: 'source',
      message: 'Please insert a path (relative / absolute) to the source json file (do not forget the .json extenstion) \n (i.e /Users/myname/Desktop/my_file.json) \n',
      validate: validateUserInput,
    });
  }

  if (!options.sourceType) {
    questions.push({
      type: 'input',
      name: 'sourceType',
      message: 'Please select type type of the source file (json/csv)',
      validate: validateUserInput,
    });
  }

  if (!options.target) {
    questions.push({
      type: 'input',
      name: 'target',
      message: 'Please insert a name for the generated file. Don\'t include file extension. (default is "rules-json.json") \n',
    });
  }

  if (!options.replace) {
    questions.push({
      type: 'confirm',
      name: 'replace',
      message: 'Delete the source file from disc?',
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    sourceFilePath: options.source || answers.source,
    sourceType: options.sourceType || answers.sourceType,
    targetFile: options.target || answers.target,
    deleteSourceFile: options.replace || answers.replace,
  };
}


export async function readAndGetContent(filepath, reader) {
  try {
    return reader.readContent(filepath);
  } catch (ex) {
    throw new Error('Could not read the source file.')
  }
}

export function extractEntries(contentObject) {
  try {
    return contentObject.feed.entry;
  } catch (ex) {
    throw new Error('could not exctract data entries. File might have incompatible sturcture');
  }
}

export function builNewObjectStructure(entries = []) {
  try {
    return entries.reduce((content, rule) => {
      return {
        ...content,
        [rule.gsx$section.$t]: {
          rule_name: rule.gsx$rulename.$t,
          category: rule.gsx$rulecategory.$t,
          description: rule.gsx$description.$t,
          remediation: rule.gsx$remediation.$t,
          cis: rule.gsx$ciscontrols.$t,
        }
      };
    }, {})
  } catch (ex) {
    throw new Error('could not procude the new file content')
  }
}

export async function writeFileToDisc(filename, fileContent) {
  try {
    const downloadsDir = downloadsFolder();
    const filepath = `${downloadsDir}/${filename.endsWith('.json') ? filename : `${filename}.json`}`;
    await write(filepath, JSON.stringify(fileContent), 'utf8');
  } catch (ex) {
    throw new Error('Unable to write file to disc.');
  }
}

export async function removeFileFromDisc(filepath) {
  try {
    await deleteFile(filepath);
  } catch (ex) {
    throw new Error('unable to remove file from disc');
  }
}
