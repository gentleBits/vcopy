import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Determines the appropriate path for the tiktoken WASM file
 * This handles both development and production environments
 */
export function getWasmFilePath(): string {
    // Try to get the extension's installation directory
    const extensionId = 'GentleBits.vcopy';
    const extension = vscode.extensions.getExtension(extensionId);
    
    if (extension) {
        // Production: extension is installed
        const wasmPath = path.join(extension.extensionUri.fsPath, 'dist', 'tiktoken_bg.wasm');
        if (fs.existsSync(wasmPath)) {
            return wasmPath;
        }
    }
    
    // Development: running from source
    const localWasmPath = path.join(__dirname, 'tiktoken_bg.wasm');
    if (fs.existsSync(localWasmPath)) {
        return localWasmPath;
    }
    
    // Fallback to default locations
    const fallbackPaths = [
        path.join(__dirname, '..', 'dist', 'tiktoken_bg.wasm'),
        path.join(__dirname, '..', 'node_modules', 'tiktoken', 'dist', 'wasm', 'tiktoken_bg.wasm')
    ];
    
    for (const potentialPath of fallbackPaths) {
        if (fs.existsSync(potentialPath)) {
            return potentialPath;
        }
    }
    
    // If no valid path is found, return a default that will likely fail
    // but at least provides a meaningful error message
    return path.join(__dirname, 'tiktoken_bg.wasm');
}

/**
 * Configures the tiktoken library to use the correct WASM file path
 */
export function configureTiktokenWasmPath(): void {
    process.env.TIKTOKEN_WASM_PATH = getWasmFilePath();
}
