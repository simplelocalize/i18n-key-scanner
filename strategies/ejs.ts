import * as fs from 'fs';

export function getDefaultConfig() {
    return {
        includeExtensions: ['.ejs'],
        excludeDirs: ['node_modules']
    };
}

export function ejsStrategy(files: string[], config?: CliConfig): ExtractionResult[] {
    const tRegex = /t\(["'](.*?)["']\)/g;
    const results: ExtractionResult[] = [];
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        let match;
        const keys = new Set<string>();
        while ((match = tRegex.exec(content))) {
            keys.add(match[1]);
        }
        for (const key of keys) {
            results.push({ key, translation: '', filePath: file });
        }
    }
    return results;
}
