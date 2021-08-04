# OPAT CLI

## Introduction

The OPAT command-line interface (CLI) is built in typescript. It takes an OPAT and WCAG/508 (and other) criteria as YAML files as input and validates them using the OPAT defined schemas and OPAT catalog.

## Install

Install the dependencies with the following NPM command:

```bash
npm install
```

## Source

Main application code is in the `src` directory.

## Commands and examples

The OPAT CLI can be executed without compiling using [`ts-node`](https://typestrong.org/ts-node/). Currently, the CLI can validate entered YAML and output it in markdown.

### Help

Use `--help` to reveal the CLI instructions.

```bash
> npx ts-node src/opat.ts --help
opat.ts <command>

Commands:
  opat.ts validate  Validate OPAT content

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]

> npx ts-node src/opat.ts validate --help
opat.ts validate

Validate OPAT content

Options:
      --help         Show help                                         [boolean]
      --version      Show version number                               [boolean]
  -f, --file         Content filename                        [string] [required]
  -c, --catalogFile  Catalog filename                                   [string]
> npx ts-node src/opat.ts output --help
opat.ts output

Output OPAT in markdown

Options:
      --help         Show help                                         [boolean]
      --version      Show version number                               [boolean]
  -f, --file         Content filename                        [string] [required]
  -c, --catalogFile  Catalog filename                                   [string]
  -o, --outputFile   Output filename                                    [string]
```

### Examples

You can test the CLI with the following example commands:

```bash
# Only validate
npx ts-node src/opat.ts validate -f tests/examples/valid.yaml # Output: Valid!
npx ts-node src/opat.ts validate -f tests/examples/invalid-basic.yaml # Output: Invalid: ...
npx ts-node src/opat.ts validate -f tests/examples/valid.yaml -c catalog/2.4-edition-508-wcag-2.0.yaml # Output: Valid!
npx ts-node src/opat.ts validate -f opat/drupal-9.yaml -c catalog/2.4-edition-508-wcag-2.0.yaml # Output: Valid!
npx ts-node src/opat.ts validate -f tests/examples/invalid-criteria.yaml -c catalog/2.4-edition-508-wcag-2.0.yaml # Output: Invalid: ...
npx ts-node src/opat.ts validate -f tests/examples/invalid-components.yaml -c catalog/2.4-edition-508-wcag-2.0.yaml # Output: Invalid: ...
npx ts-node src/opat.ts validate -f tests/examples/invalid-components-criteria.yaml -c catalog/2.4-edition-508-wcag-2.0.yaml # Output: Invalid: ...
npx ts-node src/opat.ts validate -f tests/examples/valid.yaml -c tests/examples/catalog-missing-components.yaml # Output: Valid!
npx ts-node src/opat.ts validate -f tests/examples/valid.yaml -c tests/examples/catalog-missing-chapters.yaml # Output: Valid!
npx ts-node src/opat.ts validate -f tests/examples/valid.yaml -c tests/examples/catalog-different-components.yaml # Output: Invalid: ...
# Validate and Output
npx ts-node src/opat.ts output -f tests/examples/valid.yaml -c catalog/2.4-edition-508-wcag-2.0.yaml -o tests/examples/valid.markdown # Output: Valid ...
npx ts-node src/opat.ts output -f opat/drupal-9.yaml -c catalog/2.4-edition-508-wcag-2.0.yaml -o output/drupal-9.markdown # Output: Valid ...
```

## Schemas

Located in the 'schema' folder:

- `opat-0.1.0.json` the OPAT schema.
- `opat-catalog-0.1.0.json` the OPAT catalog schema. Used to create catalogs defining the criteria and components for WCAG 2.0/2.1, 508, EU, and so on.

## Catalogs

The catalogs are in `catalog`. The catalog file will be also validated that it meets the defined schema (`opat-catalog-0.1.0.json`) when running the commands.

Catalogs:

- `2.4-edition-508-wcag-2.0.yaml` the 508/WCAG 2.0 hand-rolled catalog.

In the validate command, if the catalog file is missing the `validate` command will only check that the YAML file meets the schema defined.

## Output

The `output` command can take an optional file path (default is `output/opat.markdown`) and converts the validated YAML file to markdown.

The command uses [handlebars](https://handlebarsjs.com/) and the template `opat-0.1.0.handlebars` defined in `templates` to render the markdown.

We checked in an example of the markdown output in `tests/examples/valid.markdown`. To regenerate the example run the command below and commit the changes:

```bash
npx ts-node src/opat.ts output -f tests/examples/valid.yaml -c catalog/2.4-edition-508-wcag-2.0.yaml -o tests/examples/valid.markdown # Output: Valid ...
```

We also have a GitHub action called 'Drupal 9 OPAT output' that will generate the markdown version of the Drupal 9 OPAT. It is run on pull requests, and the output can be downloaded to double-check it is matching expectations.

The tests also generates output that is stored in the `output` directory but is not tracked by git.

## OPATs

Current example OPATs that are tracked in this repository are in the `opat` directory.

OPATs:

- drupal-9.yaml: Current Drupal 9 OPAT.

## Tests

Tests can be run by executing the command:

```bash
npm test
```

The following files located in `tests/examples` are different types of versions of an OPAT, catalog, markdown, and so on that are used for testing the application:

- catalog-different-components.yaml: Has different components to test how a previous valid OPAT is invalid and vice-versa.
- catalog-missing-chapters.yaml: No chapters.
- catalog-missing-components.yaml: No components.
- every-example-of-keywords.yaml: Every example of terms.
- invalid-basic.yaml: Very incorrect OPAT example. Used for sanity checks.
- invalid-components.yaml: Has incorrect components (E.g., includes 'none' in criteria '1.2.2').
- invalid-components-criteria.yaml: Has incorrect components and criteria.
- invalid-criteria.yaml: Has incorrect criteria (E.g., instead of '1.1.1' it has '100.100.100').
- invalid-terms.yaml: Has incorrect terms (E.g., includes level 'does not support' in criteria '1.2.2').
- valid.markdown: Is a custom output markdown file of the OPAT after it has been validated.
- valid.yaml: A valid OPAT example (few chapters).
- valid-missing-components.yaml: A valid OPAT example with no components in criteria '1.2.2'.

_Note_: If there are CLI errors, the `opat-validate-cli.test.ts` says tests have passed initially but after that you get the assertion error and error code 7.
