# Wikipedia CLI App

A **simple** and interactive **Command-Line Interface (CLI) tool** that allows users to search Wikipedia, retrieve article summaries, and display them in a well-formatted way.

## 🚀 Features

- Search Wikipedia articles using a keyword.
- Select from multiple search results.
- Retrieve and display article summaries.
- Styled output using **Chalk** for better readability.
- Interactive prompts using **Inquirer.js**.

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wikipedia-cli-app.git
   cd wikipedia-cli-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Link the CLI tool globally:
   ```bash
   npm link
   ```
   This will allow you to run the command **`wiki`** globally.

## 🔥 Usage

### **Search Wikipedia Directly from CLI**

To search Wikipedia using a keyword, run:

```bash
wiki "your search term"
```

Example:

```bash
wiki "JavaScript"
```

### **Interactive Search Mode**

If no argument is provided, the CLI will prompt for input:

```bash
wiki
```

1. Select **Search Wikipedia**.
2. Enter a search term.
3. Choose an article from the list.
4. Read the extracted summary.

### **Exit the CLI**

- In interactive mode, select **Exit** when prompted.
- Press **Enter** on an empty input to exit immediately.

## 📦 Dependencies

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Inquirer.js](https://www.npmjs.com/package/inquirer) – Interactive prompts
- [Chalk](https://www.npmjs.com/package/chalk) – Styled terminal output
- [Cheerio](https://www.npmjs.com/package/cheerio) – HTML parsing
- [Commander.js](https://www.npmjs.com/package/commander) – CLI argument parsing

## 👨‍💻 Development

To compile TypeScript files:

```bash
npx tsc
```

To run the project locally:

```bash
node dist/main.js
```

To unlink the global command if needed:

```bash
npm unlink -g wikipedia-cli-app
```

## ⚠️ License

This project is licensed under the **MIT License**. Feel free to use and modify!

## 📌 Contributing

Pull requests and suggestions are welcome! If you encounter issues, feel free to open an [issue](https://github.com/yourusername/wikipedia-cli-app/issues).

## 📜 Disclaimer

This tool uses Wikipedia’s public API. It is **not affiliated** with or endorsed by Wikipedia or the Wikimedia Foundation.
