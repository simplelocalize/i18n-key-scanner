import * as fs from 'fs';

export function getDefaultConfig() {
    return {
        includeExtensions: ['.java', '.kt', '.xml'],
        excludeDirs: ['node_modules']
    };
}

export function androidStrategy(files: string[], config?: CliConfig): ExtractionResult[] {
    const rStringRegex = /R\.string\.(\w+)/g;
    const xmlStringRegex = /android:text="@string\/(.*?)"/g;
    const results: ExtractionResult[] = [];
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        let match;
        const keys = new Set<string>();
        while ((match = rStringRegex.exec(content))) {
            keys.add(match[1]);
        }
        while ((match = xmlStringRegex.exec(content))) {
            keys.add(match[1]);
        }
        for (const key of keys) {
            results.push({ key, translation: '', filePath: file });
        }
    }
    return results;
}
