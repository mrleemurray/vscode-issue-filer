import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Issue Filer is now active!');

	// Create status bar item (high priority to appear leftmost on right side)
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
	statusBarItem.text = "$(bug) File Issue";
	statusBarItem.tooltip = "File Bug Report";
	statusBarItem.command = 'vscode-issue-filer.fileIssue';
	statusBarItem.show();

	const disposable = vscode.commands.registerCommand('vscode-issue-filer.fileIssue', async () => {
		try {
			await fileIssueWorkflow();
		} catch (error) {
			vscode.window.showErrorMessage(`Error filing issue: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(statusBarItem);
}

async function fileIssueWorkflow() {
	// Step 1: Get issue title from user
	const title = await vscode.window.showInputBox({
		prompt: 'Enter the title for your bug report',
		placeHolder: 'e.g., Terminal cursor disappears after switching themes',
		validateInput: (value: string) => {
			if (!value || value.trim().length === 0) {
				return 'Please enter a title for the issue';
			}
			if (value.length > 100) {
				return 'Title should be under 100 characters';
			}
			return null;
		}
	});

	if (!title) {
		return; // User cancelled
	}

	// Step 2: Get optional description from user
	const description = await vscode.window.showInputBox({
		prompt: 'Enter a brief description (optional)',
		placeHolder: 'e.g., This happens when I switch from dark to light theme...',
		validateInput: (value: string) => {
			if (value && value.length > 500) {
				return 'Description should be under 500 characters';
			}
			return null;
		}
	});

	// Note: description can be undefined if user cancels, or empty string if they skip
	if (description === undefined) {
		return; // User cancelled
	}

	// Step 3: Select target repository
	const repoConfig = vscode.workspace.getConfiguration('vscode-issue-filer');
	const repositoriesString = repoConfig.get('targetRepositories', 'microsoft/vscode\nmicrosoft/vscode-docs');
	const repositories = repositoriesString.split('\n')
		.map(repo => repo.trim())
		.filter(repo => repo.length > 0);

	let selectedRepo: string;
	if (repositories.length === 1) {
		selectedRepo = repositories[0];
	} else {
		const repoChoice = await vscode.window.showQuickPick(
			repositories.map(repo => ({
				label: repo,
				description: `File issue to ${repo}`,
				detail: `https://github.com/${repo}`
			})),
			{
				placeHolder: 'Select the repository to file the issue to',
				canPickMany: false
			}
		);

		if (!repoChoice) {
			return; // User cancelled
		}

		selectedRepo = repoChoice.label;
	}

	// Step 4: Ask if this is a UX bug
	const isUXBug = await vscode.window.showQuickPick(
		[
			{
				label: 'Yes, this is a UX/Design bug',
				description: 'Issues related to user interface, design, or user experience',
				detail: 'Will add "ux" label to help with issue triage'
			},
			{
				label: 'No, this is a functional/technical bug',
				description: 'Issues related to functionality, performance, or technical problems',
				detail: 'Standard bug report without UX-specific labeling'
			}
		],
		{
			placeHolder: 'Is this a UX/Design related issue?',
			canPickMany: false
		}
	);

	if (!isUXBug) {
		return; // User cancelled
	}

	const isUX = isUXBug.label.includes('UX/Design');

	// Step 5: Ask about self-assignment
	const shouldAssignSelf = await vscode.window.showQuickPick(
		[
			{
				label: 'Yes, assign to me',
				description: 'Assign this issue to your GitHub account',
				detail: 'Uses the configured GitHub username from settings'
			},
			{
				label: 'No, leave unassigned',
				description: 'Let someone else assign as needed',
				detail: 'Issue will be triaged by maintainers'
			}
		],
		{
			placeHolder: 'Would you like to assign this issue to yourself?',
			canPickMany: false
		}
	);

	if (!shouldAssignSelf) {
		return; // User cancelled
	}

	const shouldAssign = shouldAssignSelf.label.includes('assign to me');

	// Step 6: Prompt for screenshot
	const shouldTakeScreenshot = await vscode.window.showQuickPick(
		[
			{
				label: 'Take Screenshot',
				description: 'Capture a screenshot of the UI bug',
				detail: 'This will help maintainers understand the issue visually'
			},
			{
				label: 'Skip Screenshot',
				description: 'Continue without a screenshot',
				detail: 'You can add images manually to the issue later'
			}
		],
		{
			placeHolder: 'Would you like to take a screenshot of the bug?',
			canPickMany: false
		}
	);

	if (!shouldTakeScreenshot) {
		return; // User cancelled
	}

	let screenshotInstructions = '';
	if (shouldTakeScreenshot.label.includes('Take Screenshot')) {
		// Simple confirmation that user will take a screenshot
		const proceed = await vscode.window.showInformationMessage(
			'Take your screenshot now, then click Continue to open the GitHub issue.',
			'Continue',
			'Cancel'
		);

		if (proceed !== 'Continue') {
			return;
		}

		screenshotInstructions = `

Screenshot:
Please attach your screenshot by dragging and dropping it into the issue description area below.

`;
	}

	// Step 7: Generate GitHub issue URL with populated template
	const issueBody = generateIssueBody(title, description, screenshotInstructions, isUX);
	
	let githubUrl = `https://github.com/${selectedRepo}/issues/new?template=bug_report.md&title=${encodeURIComponent(title)}&body=${encodeURIComponent(issueBody)}`;
	
	// Add assignee if user chose to assign themselves
	if (shouldAssign) {
		const config = vscode.workspace.getConfiguration('vscode-issue-filer');
		const defaultAssignee = config.get('defaultAssignee', 'your_github_username');
		githubUrl += `&assignees=${defaultAssignee}`;
	}
	
	// Add UX label if this is a UX bug
	if (isUX) {
		githubUrl += '&labels=ux';
	}

	// Step 6: Open the GitHub issue page
	await vscode.env.openExternal(vscode.Uri.parse(githubUrl));

	// Show success message
	vscode.window.showInformationMessage(
		'GitHub issue page opened! Please review and submit your bug report.',
		'View All Issues'
	).then((selection: string | undefined) => {
		if (selection === 'View All Issues') {
			vscode.env.openExternal(vscode.Uri.parse(`https://github.com/${selectedRepo}/issues`));
		}
	});
}

function generateIssueBody(title: string, description: string, screenshotInstructions: string, isUXBug: boolean): string {
	// Get VS Code version and OS information
	const vscodeVersion = vscode.version;
	const platform = process.platform;
	const arch = process.arch;
	
	// Get workspace information
	const workspaceFolders = vscode.workspace.workspaceFolders;
	const workspaceInfo = workspaceFolders ? 
		`${workspaceFolders.length} folder(s) open` : 
		'No workspace open';

	// Add UX bug context if applicable
	const uxContext = isUXBug ? `

UX/Design Issue:
This issue is related to user interface, design, or user experience.

` : '';

	// Add description section if provided
	const descriptionSection = description && description.trim() ? `

Description:
${description}

` : '';

	return `Bug Description:
${title}
${descriptionSection}Steps to Reproduce:
1. 
2. 
3. 

Expected Behavior:
What did you expect to happen


Actual Behavior:
What actually happened

${screenshotInstructions}${uxContext}Environment Information:
- VS Code Version: ${vscodeVersion}
- OS: ${getOSDisplayName(platform)} (${arch})
- Workspace: ${workspaceInfo}

Extensions:
Please list any relevant extensions that might be related to this issue
- 

Additional Context:
Add any other context about the problem here
Include error messages, console output, or other relevant information


Reproduction Steps (Detailed):
If the basic steps above are not sufficient, provide more detailed reproduction steps


---
This issue was filed using the VS Code Issue Filer extension`;
}

function getOSDisplayName(platform: string): string {
	switch (platform) {
		case 'darwin': return 'macOS';
		case 'win32': return 'Windows';
		case 'linux': return 'Linux';
		default: return platform;
	}
}

export function deactivate() {}