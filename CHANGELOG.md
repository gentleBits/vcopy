# Changelog

All notable changes to the VCopy extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2025-05-29

### Added
- New `vcopy.copyPaths` command that copies only the relative file paths to clipboard
- Keyboard shortcut for copyPaths: Cmd+Shift+A (macOS) / Ctrl+Shift+A (Windows/Linux)
- Token counting for copyPaths command to show the total tokens in the referenced files
- Progress notification showing number of paths copied and total token count

## [0.7.8] - 2024-02-23

### Added
- Token counting functionality using tiktoken library
- Display token count in the progress notification
- Format token count with k/m suffixes for readability

### Changed
- Improved progress notification with more detailed status messages
- Enhanced user feedback during clipboard operations

## [0.7.7] - 2024-02-23

### Added
- Added support for showing complete workspace file tree via `useEntireTree` setting
- Git repository file listing support when `useEntireTree` is enabled
- Progress notification during file generation

### Changed
- Improved file tree visualization with ASCII art
- Enhanced error handling and messages
- Updated header/footer default text

## [0.6.0] - 2024-02-21

### Added
- Initial release
- Custom header and footer text support
- File tree visualization
- Syntax highlighting in output
- Keyboard shortcuts for all platforms