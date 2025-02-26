const fs = require('fs-extra');
const path = require('path');

async function ensureWasmFiles() {
    try {
        // Ensure dist directory exists
        await fs.ensureDir(path.join(__dirname, '../dist'));
        
        // Possible locations for the WASM file
        const possibleSourcePaths = [
            path.join(__dirname, '../node_modules/tiktoken/dist/wasm/tiktoken_bg.wasm'),
            path.join(__dirname, '../node_modules/tiktoken/tiktoken_bg.wasm'),
            path.join(__dirname, '../node_modules/@dqbd/tiktoken/tiktoken_bg.wasm'),
            path.join(__dirname, '../node_modules/@dqbd/tiktoken/dist/tiktoken_bg.wasm')
        ];
        
        const targetPath = path.join(__dirname, '../dist/tiktoken_bg.wasm');
        
        // Try each possible path
        for (const sourcePath of possibleSourcePaths) {
            if (await fs.pathExists(sourcePath)) {
                await fs.copy(sourcePath, targetPath, { overwrite: true });
                console.log('WASM file copied successfully from:', sourcePath);
                console.log('WASM file copied successfully to:', targetPath);
                return;
            }
        }
        
        // If we reach here, none of the paths worked
        console.error('ERROR: Tiktoken WASM file not found in any of the expected locations');
        
        // Try to find it with a more extensive search
        const nodeModulesPath = path.join(__dirname, '../node_modules');
        if (await fs.pathExists(nodeModulesPath)) {
            console.log('Searching for tiktoken_bg.wasm in node_modules...');
            
            // Function to recursively search for the file
            async function findFile(dir, filename, maxDepth = 5) {
                if (maxDepth <= 0) return null;
                
                try {
                    const files = await fs.readdir(dir);
                    
                    for (const file of files) {
                        const filePath = path.join(dir, file);
                        const stat = await fs.stat(filePath);
                        
                        if (stat.isDirectory()) {
                            // Skip node_modules within packages
                            if (file === 'node_modules') continue;
                            
                            const found = await findFile(filePath, filename, maxDepth - 1);
                            if (found) return found;
                        } else if (file === filename) {
                            return filePath;
                        }
                    }
                } catch (err) {
                    // Ignore permission errors
                    return null;
                }
                
                return null;
            }
            
            const foundPath = await findFile(nodeModulesPath, 'tiktoken_bg.wasm');
            if (foundPath) {
                console.log('Found WASM file at:', foundPath);
                await fs.copy(foundPath, targetPath, { overwrite: true });
                console.log('WASM file copied successfully to:', targetPath);
                return;
            }
        }
        
        console.error('Failed to find tiktoken_bg.wasm anywhere in node_modules');
        process.exit(1);
    } catch (error) {
        console.error('Failed to copy WASM file:', error);
        process.exit(1);
    }
}

ensureWasmFiles();
