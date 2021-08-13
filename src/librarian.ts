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
import yaml from "js-yaml";
import fs from "fs";
import { createCatalog } from "./createCatalog";

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

if (argv.catalog) {
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

  let combined;
  let outputFile = "";
  switch (catalog) {
    case "WCAG":
    case "EU":
    case "INT":
    default:
      console.warn(`${catalog} is currently not supported.`);
      break;

    case "508":
      console.log(
        `Warning: This will rebuild the following catalog: ${catalog}.`
      );

      combined = createCatalog(wcag20, section508, components, terms);

      outputFile = `./catalog/2.4-edition-${combined.standards[0].id}-${combined.standards[1].id}-${combined.lang}.yaml`;
      break;
  }

  if (outputFile) {
    fs.writeFile(
      outputFile,
      yaml.dump(combined, { quotingType: '"' }),
      function () {
        console.log(`Successfully created catalog ${outputFile}.`);
      }
    );
  }
} else {
  console.error("Invalid: no catalog entered.");
}
