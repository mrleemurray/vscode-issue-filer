import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('vscode-team.vscode-issue-filer'));
	});

	test('Should register file issue command', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('vscode-issue-filer.fileIssue'));
	});
});