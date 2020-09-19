# create-rules-json

CLI tool for parse JSON file (based on predefined rules) and write a formatted new file to disc.

## Prerequisites

Download and install Node.js and npm. Follow the [docs](https://nodejs.org/en/download/) on Node.js site.

Tests if node.js and npm were installed properly:
```bash
npm --version
node --version
```

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the package.

```bash
npm install -g create-rules-json
```

## CLI options
```
-s, --source    String    path to the source JSON file.
-t, --target    String    the name of the new generated file.
-r, --replace   Boolean   weather to delete the source file, or not. 
```

## Usage
Open your terminal and run
```bash
create-rules-json
```
and than just follow the instructions.


or:
```bash
create-rules-json -s /path/to/source/file.json -t new_file -r
```

## License
[MIT](https://choosealicense.com/licenses/mit/)