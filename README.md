# VCopy, From editor to AI and back — effortlessly.

VCopy is a clipboard bridge between code editors and AI assistants. It enables seamless transfer of code files to your preferred AI model for discussion, then lets you copy refined instructions back to tools like GitHub Copilot or Cursor, helping overcome development blockers.
 
## Features

- Seamlessly extract code from all active editor tabs.
- Auto-generate a navigable file tree of your project.
- Preserve syntax highlighting with language-specific markers.
- Customize header and footer messages to suit your workflow.
- Trigger the functionality instantly via dedicated keyboard shortcuts.

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
