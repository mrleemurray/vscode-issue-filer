# Issue Filer

A streamlined VS Code extension to help users quickly file bug reports with screenshots.

## Features

- **Quick Issue Filing**: Bug icon appears in status bar on VS Code startup for easy access
- **Keyboard Shortcut**: Quick access with `Ctrl+Alt+'` (Windows/Linux) or `Cmd+Alt+'` (macOS)
- **Guided Workflow**: Step-by-step process to capture issue details
- **Optional Description**: Add additional context with an optional description field
- **UX Bug Detection**: Automatically adds "ux" label for design/UX related issues
- **Optional Self-Assignment**: Choose whether to assign the issue to yourself
- **Screenshot Integration**: Simple prompt for screenshot capture
- **Auto-populated Template**: Opens GitHub with pre-filled bug report template
- **Environment Detection**: Automatically includes VS Code version and OS info

## Usage

1. **Start the workflow** using any of these methods:
   - **Keyboard shortcut**: `Ctrl+Alt+'` (Windows/Linux) or `Cmd+Alt+'` (macOS)
   - **Status bar**: Click the "File Issue" button (right side)
   - **Editor toolbar**: Click the bug icon
   - **Command Palette**: Run "File VS Code Issue"
2. **Enter a descriptive title** for your bug report
3. **Add description (optional)**: Provide additional context about the issue
4. **Select target repository**: Choose which repository to file the issue to (if multiple configured)
5. **Identify bug type**: Choose whether this is a UX/Design bug or functional/technical bug
6. **Choose assignment**: Decide whether to assign the issue to yourself or leave unassigned
7. **Choose screenshot option**:
   - Take Screenshot: Simple prompt to take a screenshot
   - Skip Screenshot: Continue without visual evidence
8. **GitHub opens automatically** with a pre-populated bug report template

## Installation

### For VS Code Development Team

1. Navigate to the `issue-filer` directory
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` to launch a new Extension Development Host with the extension loaded
5. The "File Issue" button will appear in the status bar automatically

### For General Use

1. Package the extension: `npm install -g vsce && vsce package`
2. Install the generated `.vsix` file in VS Code
3. Restart VS Code - the status bar icon will appear automatically

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes during development
npm run watch

# Run tests
npm test
```

## Commands

- `vscode-issue-filer.fileIssue`: **File VS Code Issue** - Opens the guided issue filing workflow

## Menu Locations

The "File VS Code Issue" command can be accessed from:

- **Keyboard shortcut**: `Ctrl+Alt+'` (Windows/Linux) or `Cmd+Alt+'` (macOS)
- **Status bar** (File Issue - right side)
- Editor title bar (bug icon)
- View title bars (bug icon)
- Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)

## Generated Issue Template

The extension generates a comprehensive issue template including:

- Bug description and title
- Optional detailed description (if provided)
- Step-by-step reproduction instructions
- Expected vs actual behavior
- Environment information (VS Code version, OS, architecture)
- Workspace information
- Extension listing prompt
- Screenshot attachment area
- UX/Design context section (for UX bugs)

## UX Bug Labeling

When you identify an issue as UX/Design related:

- The GitHub issue will automatically include the "ux" label
- A special UX/Design context section is added to the issue template
- This helps the VS Code team properly triage design and user experience issues

## Configuration

You can customize the extension behavior through VS Code settings:

### Keyboard Shortcut

The default keyboard shortcut is `Ctrl+Alt+'` (Windows/Linux) or `Cmd+Option+'` (macOS). To customize it:

1. **Open Keyboard Shortcuts**: `Ctrl+K Ctrl+S` / `Cmd+K Cmd+S`
2. **Search**: Type "File Issue" or "vscode-issue-filer.fileIssue"
3. **Change**: Click the pencil icon and press your desired key combination

Or edit your `keybindings.json` directly:
```json
{
  "key": "ctrl+shift+i",
  "command": "vscode-issue-filer.fileIssue"
}
```

### `vscode-issue-filer.defaultAssignee`

- **Type**: `string`
- **Default**: `"mrleemurray"`
- **Description**: GitHub username to automatically assign new issues to

### `vscode-issue-filer.targetRepositories`

- **Type**: `string` (multiline)
- **Default**: `"microsoft/vscode\nmicrosoft/vscode-docs"`
- **Description**: GitHub repositories to choose from when filing issues (one per line, format: owner/repo)

To customize these settings, add them to your VS Code settings:

```json
{
  "vscode-issue-filer.defaultAssignee": "your-github-username",
  "vscode-issue-filer.targetRepositories": "microsoft/vscode\nmicrosoft/vscode-docs\nyour-org/your-repo"
}
```

**Repository Selection:**

- If only one repository is configured, it will be used automatically
- If multiple repositories are configured, you'll be prompted to choose during the workflow
- Each repository should be on a separate line in the format `owner/repo`

**Examples of repositories:**

- `microsoft/vscode` - VS Code main repository
- `microsoft/vscode-docs` - VS Code documentation
- `your-org/your-repo` - Your own repository

## Contributing

This extension is designed to streamline the VS Code bug reporting process for both users and the development team. Feel free to suggest improvements or additional features.

## Requirements

- VS Code 1.80.0 or higher
- TypeScript 5.1.6 or higher (for development)