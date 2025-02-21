# VCopy, From editor to AI and back — effortlessly.

VCopy is a clipboard bridge between code editors and AI assistants. It enables seamless transfer of code files to your preferred AI model for discussion, then lets you copy refined instructions back to tools like GitHub Copilot or Cursor, helping overcome development blockers.
 

## Features

- Copy content from all open tabs in the current tab group
- Generate a tree structure of the copied files
- Files are copied with proper syntax highlighting markers
- Customizable footer text
- Easy-to-use keyboard shortcuts

## Usage

1. Open the files you want to copy in VS Code tabs
2. Use one of these keyboard shortcuts:
   - `Cmd+Alt+C` (macOS) / `Ctrl+Alt+C` (Windows/Linux)
   - `Cmd+Shift+C` (macOS)
3. The extension will:
   - Generate a tree structure of your files
   - Copy the file contents with proper syntax highlighting
   - Add the configured footer text (if any)
   - Copy everything to your clipboard

## Extension Settings

This extension contributes the following settings:

* `vcopy.footerText`: Text to append at the end of the copied output. Supports multiline text.

## Default Footer

By default, VCopy adds a footer that helps AI assistants understand how to process the copied content. You can customize this in the settings.

## Requirements

- VS Code 1.70.0 or higher

## Known Issues

None at this time.

## Release Notes

### 0.0.1

- Initial release
- Basic file copying functionality
- Tree structure generation
- Configurable footer text
- Keyboard shortcuts

## Contributing

Found a bug or have a feature request? Please open an issue on the repository.

## License

This extension is available under the MIT License.
