#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const cheerio = __importStar(require("cheerio"));
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const program = new commander_1.Command();
program.argument("[query]", "Search term for Wikipedia").parse();
if (program.args.length > 1) {
    console.error(chalk_1.default.red(" Error: Only one argument is allowed!"));
    process.exit(1);
}
function getQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            if (program.args.length === 0) {
                const action = yield inquirer_1.default.prompt([
                    {
                        type: "list",
                        name: "action",
                        message: "What do you want to do?",
                        choices: ["Search Wikipedia", "Exit"], // Explicit exit
                    },
                ]);
                if (action.action === "Exit") {
                    console.log(chalk_1.default.yellow(" Exiting Wikipedia CLI..."));
                    process.exit(0); // Clean exit
                }
                const answer = yield inquirer_1.default.prompt([
                    {
                        type: "input",
                        name: "searchTerm",
                        message: "Enter a search term for Wikipedia (press Enter to exit):",
                    },
                ]);
                let str = answer.searchTerm.trim();
                if (!str) {
                    console.log(chalk_1.default.yellow(" Exiting Wikipedia CLI..."));
                    process.exit(0); // Clean exit when pressing Enter
                }
                else {
                    return str; //
                }
            }
            else {
                return program.args[0];
            }
        }
    });
}
let pages = [];
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
function fetchWiki(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${query}`);
            const data = yield response.json();
            pages = data.query.search.map((result) => ({
                title: result.title,
                pageid: result.pageid,
            }));
        }
        catch (error) {
            console.error("Error fetching Wikipedia data:", error);
        }
    });
}
function fetchWikiSummary(pageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://en.wikipedia.org/?curid=${pageId}`);
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            const html = yield response.text(); // Get raw HTML
            const $ = cheerio.load(html);
            const contentDiv = $(".mw-content-ltr.mw-parser-output");
            const firstParagraph = contentDiv
                .find("p")
                .filter((_, el) => {
                return !$(el).attr("class") && !$(el).attr("id");
            })
                .first();
            const summaryText = firstParagraph.text().trim();
            if (!summaryText) {
                console.log(chalk_1.default.yellow(" No summary found."));
            }
            else {
                console.log("\n" + chalk_1.default.bgBlue.white.bold(" Wikipedia Summary ") + "\n");
                console.log(chalk_1.default.bgBlue.white.bold("-------------------"));
                console.log(chalk_1.default.bgWhite.black(summaryText));
                console.log("\n" +
                    chalk_1.default.bgBlack.white.bold(" Source: ") +
                    chalk_1.default.blue(`https://en.wikipedia.org/?curid=${pageId}`));
                console.log(chalk_1.default.bgBlue.white.bold("-------------------"));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(" Error fetching Wikipedia page:"), error);
        }
    });
}
function selector() {
    return __awaiter(this, void 0, void 0, function* () {
        if (pages.length === 0) {
            console.log("No pages available. Try fetching first!");
            return;
        }
        const answers = yield inquirer_1.default.prompt([
            {
                type: "list",
                name: "selectedTitle",
                message: "Select a Wikipedia page to read",
                choices: pages.map((page) => page.title),
            },
        ]);
        const selectedPage = pages.find((page) => page.title === answers.selectedTitle);
        if (selectedPage) {
            const wikiUrl = `https://en.wikipedia.org/?curid=${selectedPage.pageid}`;
            console.log(`Opening Wikipedia page: ${wikiUrl}`);
            if (selectedPage) {
                console.log(`Fetching HTML content for: ${selectedPage.title}`);
                yield fetchWikiSummary(selectedPage.pageid);
            }
            else {
                console.log("Page not found.");
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = yield getQuery();
        yield fetchWiki(query);
        //for (let i = 0; i < pages.length; i++) {
        //  console.log(
        //    "Page Title: ",
        //    pages[i].title,
        //    `\n`,
        //    "Page ID: ",
        //    pages[i].pageid
        //  );
        //}
        yield selector();
    });
}
main();
