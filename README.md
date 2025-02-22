# VCopy, From editor to AI and back — effortlessly.

VCopy, inspired by [aider](https://github.com/Aider-AI/aider)  /copy-context command, is a clipboard bridge between code editors and AI assistants. It enables seamless transfer of code files to advanced AI models such as o1 pro, R1, Grok, Qwen, and others for discussion, then lets you copy refined instructions back to tools like GitHub Copilot or Cursor, helping overcome development blockers.

![usage](img/vcopy_usage.gif)

## Usage

1. Open the desired files in your VS Code tabs.
2. Activate the extension using your keyboard shortcut:
   - `Cmd+Shift+C` (macOS)
   - `Ctrl+Shift+C` (Windows/Linux)
3. The extension will then:
   - Build a visual file tree of your workspace.
   - Capture and format each file's content with accurate syntax highlighting.
   - Append any preset header and footer texts.
   - Copy the complete output to your clipboard
4. Paste the text in your favorite AI model chat textbox. Explain the task and continue the session until a solution is reached.
5. Copy the entire AI model output and use with AI tools (github copilot, cursor)

## Extension Settings
You can customize VCopy’s behavior using the following settings:
 
* `vcopy.headerText`: Prepended to the snippet. Useful for adding context or instructions for the AI.
* `vcopy.footerText`: Appended to the snippet. Ideal for providing reminders or disclaimers.
* `vcopy.useEntireTree`: When true, VCopy includes a complete workspace file map instead of just open files.

## Requirements

- VS Code 1.70.0 or higher

## Contributing

Found a bug or have a feature request? Please open an issue on the repository.

## License

This extension is available under the GNU GENERAL PUBLIC LICENSE.
