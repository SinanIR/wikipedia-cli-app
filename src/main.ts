#!/usr/bin/env node

import inquirer from "inquirer";
import * as cheerio from "cheerio";
import chalk from "chalk";
import { Command } from "commander";

const program = new Command();
program.argument("[query]", "Search term for Wikipedia").parse();

if (program.args.length > 1) {
  console.error(chalk.red(" Error: Only one argument is allowed!"));
  process.exit(1);
}

async function getQuery(): Promise<string> {
  while (true) {
    if (program.args.length === 0) {
      const action = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "What do you want to do?",
          choices: ["Search Wikipedia", "Exit"], // Explicit exit
        },
      ]);

      if (action.action === "Exit") {
        console.log(chalk.yellow(" Exiting Wikipedia CLI..."));
        process.exit(0); // Clean exit
      }

      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "searchTerm",
          message: "Enter a search term for Wikipedia (press Enter to exit):",
        },
      ]);

      let str = answer.searchTerm.trim();

      if (!str) {
        console.log(chalk.yellow(" Exiting Wikipedia CLI..."));
        process.exit(0); // Clean exit when pressing Enter
      } else {
        return str; //
      }
    } else {
      return program.args[0];
    }
  }
}

type Page = {
  title: string;
  pageid: number;
};

let pages: Page[] = [];

//async function fetchPageHTML(pageid: number) {
//  try {
//    const response = await fetch(`https://en.wikipedia.org/?curid=${pageid}`);
//
//    const pageContent = await response.text(); // Get HTML as text
//
//    console.log(" Wikipedia Page HTML:\n", pageContent);
//  } catch (error) {
//    console.error("Error fetching Wikipedia page:", error);
//  }
//}

async function fetchWiki(query: string) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${query}`
    );
    const data = await response.json();

    pages = data.query.search.map(
      (result: { title: string; pageid: number }) => ({
        title: result.title,
        pageid: result.pageid,
      })
    );
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
  }
}

async function fetchWikiSummary(pageId: number): Promise<void> {
  try {
    const response = await fetch(`https://en.wikipedia.org/?curid=${pageId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const html: string = await response.text(); // Get raw HTML

    const $ = cheerio.load(html);

    const contentDiv = $(".mw-content-ltr.mw-parser-output");

    const firstParagraph = contentDiv
      .find("p")
      .filter((_, el) => {
        return !$(el).attr("class") && !$(el).attr("id");
      })
      .first();

    const summaryText: string = firstParagraph.text().trim();

    if (!summaryText) {
      console.log(chalk.yellow(" No summary found."));
    } else {
      console.log("\n" + chalk.bgBlue.white.bold(" Wikipedia Summary ") + "\n");
      console.log(chalk.bgBlue.white.bold("-------------------"));
      console.log(chalk.bgWhite.black(summaryText));
      console.log(
        "\n" +
          chalk.bgBlack.white.bold(" Source: ") +
          chalk.blue(`https://en.wikipedia.org/?curid=${pageId}`)
      );
      console.log(chalk.bgBlue.white.bold("-------------------"));
    }
  } catch (error) {
    console.error(chalk.red(" Error fetching Wikipedia page:"), error);
  }
}

async function selector() {
  if (pages.length === 0) {
    console.log("No pages available. Try fetching first!");
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTitle",
      message: "Select a Wikipedia page to read",
      choices: pages.map((page) => page.title),
    },
  ]);

  const selectedPage = pages.find(
    (page) => page.title === answers.selectedTitle
  );

  if (selectedPage) {
    const wikiUrl = `https://en.wikipedia.org/?curid=${selectedPage.pageid}`;
    console.log(`Opening Wikipedia page: ${wikiUrl}`);
    if (selectedPage) {
      console.log(`Fetching HTML content for: ${selectedPage.title}`);
      await fetchWikiSummary(selectedPage.pageid);
    } else {
      console.log("Page not found.");
    }
  }
}

async function main() {
  const query = await getQuery();
  await fetchWiki(query);
  //for (let i = 0; i < pages.length; i++) {
  //  console.log(
  //    "Page Title: ",
  //    pages[i].title,
  //    `\n`,
  //    "Page ID: ",
  //    pages[i].pageid
  //  );
  //}
  await selector();
}

main();
