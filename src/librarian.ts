// src/librarian.ts

/*
 * Install dependencies command:
 *   npm install
 *
 * Help commands:
 *   npx ts-node src/librarian.ts --help
 *
 * Example commands:
 *   See docs/Librarian.md
 */

import yargs from "yargs";
import readline from "readline";
import yaml from "js-yaml";
import { validateCatalog } from "./validateCatalog";
import fs from "fs";

const argv = yargs
  .options({
    catalog: {
      type: "string",
      description:
        "Select which VPAT 2.4 catalog to rebuild: WCAG, 508, EU, INT",
      demandOption: true,
      alias: "c",
    },
  })
  .parseSync();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
if (argv.catalog) {
  try {
    const catalog = argv.catalog;

    // Load data files.
    const wcag20 = yaml.load(
      fs.readFileSync("./catalog/data/wcag-2.0.yaml").toString()
    );
    const section508 = yaml.load(
      fs.readFileSync("./catalog/data/508.yaml").toString()
    );
    const components = yaml.load(
      fs.readFileSync("./catalog/data/components.yaml").toString()
    );
    const terms = yaml.load(
      fs.readFileSync("./catalog/data/terms.yaml").toString()
    );

    switch (catalog) {
      case "WCAG":
      case "EU":
      case "INT":
        console.warn(`${catalog} is currently not supported.`);
        break;

      case "508":
        console.log(
          `Warning: This will rebuild the following catalog: ${catalog}.`
        );
        rl.question(
          "Confirm rebuild of " + catalog + " catalog (y): ",
          (answer) => {
            answer = answer || "y";

            if (answer === "y") {
              console.log("Rebuilding...");

              const combined = {
                title: getTitle(section508),
                standards: getStandards(wcag20, section508),
                chapters: getChapters(wcag20, section508),
                components: getComponents(components),
                terms: getTerms(terms),
              };

              const outputFile = `./catalog/2.4-edition-${combined.standards[0].id}-${combined.standards[1].id}.yaml`;
              fs.writeFile(
                outputFile,
                yaml.dump(combined, { quotingType: '"' }),
                function (error) {
                  if (error) {
                    console.error(`Failed to create catalog ${outputFile}.`);
                  } else {
                    console.log(`Successfully created catalog ${outputFile}.`);
                  }
                }
              );
            } else {
              console.log("Aborting...");
            }
            rl.close();
          }
        );
        break;

      default:
        console.error(`Invalid: ${catalog} is not an available option.`);
        break;
    }
  } catch (e) {
    console.error(`Invalid: data files cannot be read. Error: ${e.message}`);
    rl.close();
  }
}

function getTerms(terms: any): any {
  const valid = validateCatalogDataFiles(terms);
  if (valid) {
    return terms.terms;
  }
  return "Invalid terms.";
}

function getComponents(components: any): any {
  const valid = validateCatalogDataFiles(components);
  if (valid) {
    return components.components;
  }
  return "Invalid components.";
}

function getChapters(first: any, second: any): any {
  if (validateCatalogDataFiles(first) && validateCatalogDataFiles(second)) {
    return first.chapters.concat(second.chapters);
  }
  return "Invalid chapters.";
}

function getStandards(first: any, second: any): any {
  if (validateCatalogDataFiles(first) && validateCatalogDataFiles(second)) {
    return first.standard.concat(second.standard);
  }
  return "Invalid standards.";
}

function getTitle(data: any): string {
  return `VPAT® 2.4 edition ${data.title}`;
}

function validateCatalogDataFiles(catalog: any): boolean {
  const catalogSchema = "opat-catalog-0.1.0.json";
  const validCatalogResult = validateCatalog(catalog, catalogSchema);

  return validCatalogResult.result;
}
