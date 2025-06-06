import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { encoding_for_model } from 'tiktoken';
import { configureTiktokenWasmPath } from './wasm-path';

// Configure tiktoken to use the correct WASM file path
configureTiktokenWasmPath();

function buildTreeFromPaths(paths: string[]): string {
    // Build a nested object representing the folder structure
    const tree: Record<string, any> = {};
    
    for (const p of paths) {
        const parts = p.split(/[\\/]/);
        let current = tree;
        
        for (const part of parts) {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        }
    }
    
    // Recursively turn that object into ASCII lines
    function buildLines(obj: Record<string, any>, prefix = '', isTail = true): string[] {
        const entries = Object.keys(obj);
        const lines: string[] = [];
        entries.forEach((k, i) => {
            const isLast = i === entries.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            lines.push(prefix + connector + k);
            const subLines = buildLines(obj[k], prefix + (isLast ? '    ' : '│   '));
            lines.push(...subLines);
        });
        return lines;
    }

    return buildLines(tree).join('\n');
}

// Format token count with k/m suffix for readability (e.g., 10700 -> "10.7k")
function formatTokenCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}m`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('vcopy.generate', async () => {
        try {
            const activeGroup = vscode.window.tabGroups.activeTabGroup;
            if (!activeGroup || !activeGroup.tabs.length) {
                vscode.window.showErrorMessage('No active tab group with tabs found.');
                return;
            }

            const relativePaths: string[] = [];

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "VCopy",
                cancellable: false
            }, async (progress) => {
                // Start with initial message
                progress.report({ message: 'Generating text for clipboard...' });

                let result = '';
                for (const tab of activeGroup.tabs) {
                    if (tab.input && (tab.input as vscode.TabInputText).uri) {
                        const uri = (tab.input as vscode.TabInputText).uri;
                        let doc;
                        try {
                            doc = await vscode.workspace.openTextDocument(uri);
                        } catch (error) {
                            // For binary files (e.g. images), add to file tree and skip content.
                            relativePaths.push(vscode.workspace.asRelativePath(uri));
                            result += `\n// Skipped ${uri.fsPath}: Cannot open file as text.\n`;
                            continue;
                        }
                        
                        const filePath = doc.uri.fsPath;
                        const relPath = vscode.workspace.asRelativePath(doc.uri);
                        relativePaths.push(relPath);
                        const ext = path.extname(filePath).slice(1) || 'txt';
                        const content = doc.getText();
                        result += `\n\`\`\`${ext}\n// filepath: ${filePath}\n${content}\n\`\`\`\n`;
                    }
                }
                
                const config = vscode.workspace.getConfiguration('vcopy');
                const headerText = config.get<string>('headerText', '');
                const footerText = config.get<string>('footerText', '');
                const useEntireTree = config.get<boolean>('useEntireTree', false);
                
                let treePaths: string[];
                if (useEntireTree) {
                    const workspaceFolders = vscode.workspace.workspaceFolders;
                    if (workspaceFolders && workspaceFolders.length > 0) {
                        const rootPath = workspaceFolders[0].uri.fsPath;
                        const gitFolderPath = path.join(rootPath, '.git');
                        let isGitRepo = false;
                        try {
                            await fs.promises.access(gitFolderPath);
                            isGitRepo = true;
                        } catch (err) {
                            isGitRepo = false;
                        }
                        if (isGitRepo) {
                            treePaths = await new Promise<string[]>((resolve, reject) => {
                                exec('git ls-files', { cwd: rootPath }, (error, stdout) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        const files = stdout.split('\n').filter(line => line.trim() !== '');
                                        resolve(files);
                                    }
                                });
                            });
                        } else {
                            const allFiles = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
                            treePaths = allFiles.map(uri => vscode.workspace.asRelativePath(uri));
                        }
                    } else {
                        treePaths = [];
                    }
                } else {
                    treePaths = relativePaths;
                }
                
                const tree = buildTreeFromPaths(treePaths);
                const combinedOutput = `<file_map>\n${tree}\n</file_map>\n\n` + result;
                const finalOutput = (headerText ? headerText + '\n' : '') + combinedOutput + (footerText ? '\n' + footerText : '');
                
                // Count tokens using tiktoken
                const model = "gpt-3.5-turbo";
                const encoder = encoding_for_model(model);
                const tokens = encoder.encode(finalOutput);
                const tokenCount = tokens.length;
                encoder.free();
                
                await vscode.env.clipboard.writeText(finalOutput);
                
                // Update progress notification with completion message
                progress.report({ 
                    message: `Copied ${formatTokenCount(tokenCount)} tokens to clipboard`,
                    increment: 100 
                });
                
                // Keep the notification visible for exactly 2 seconds
                await new Promise(resolve => setTimeout(resolve, 2000));
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    const copyPathsDisposable = vscode.commands.registerCommand('vcopy.copyPaths', async () => {
        try {
            const activeGroup = vscode.window.tabGroups.activeTabGroup;
            if (!activeGroup || !activeGroup.tabs.length) {
                vscode.window.showErrorMessage('No active tab group with tabs found.');
                return;
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "VCopy",
                cancellable: false
            }, async (progress) => {
                // Start with initial message
                progress.report({ message: 'Copying file paths...' });

                const relativePaths: string[] = [];
                let allFileContents = '';

                // Collect relative paths and file contents for token counting
                for (const tab of activeGroup.tabs) {
                    if (tab.input && (tab.input as vscode.TabInputText).uri) {
                        const uri = (tab.input as vscode.TabInputText).uri;
                        const relPath = vscode.workspace.asRelativePath(uri);
                        relativePaths.push(relPath);
                        
                        // Read file content for token counting (but don't include in clipboard)
                        try {
                            const doc = await vscode.workspace.openTextDocument(uri);
                            allFileContents += doc.getText() + '\n';
                        } catch (error) {
                            // For binary files or read errors, just continue
                            continue;
                        }
                    }
                }

                // Prepare clipboard content: just the paths, one per line
                const pathsOutput = relativePaths.join('\n');
                
                // Count tokens for the file contents (to give user info about what they're working with)
                const model = "gpt-3.5-turbo";
                const encoder = encoding_for_model(model);
                const tokens = encoder.encode(allFileContents);
                const tokenCount = tokens.length;
                encoder.free();
                
                // Copy only the paths to clipboard
                await vscode.env.clipboard.writeText(pathsOutput);
                
                // Update progress notification with completion message
                progress.report({ 
                    message: `Copied ${relativePaths.length} file paths (${formatTokenCount(tokenCount)} tokens) to clipboard`,
                    increment: 100 
                });
                
                // Keep the notification visible for exactly 2 seconds
                await new Promise(resolve => setTimeout(resolve, 2000));
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(copyPathsDisposable);
}

export function deactivate() {}
