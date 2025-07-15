import * as fs from 'fs';

export function getDefaultConfig() {
    return {
        includeExtensions: ['.js', '.jsx', '.ts', '.tsx'],
        excludeDirs: ['node_modules']
    };
}

export function i18nextStrategy(files: string[], config?: any): ExtractionResult[] {
    const results: ExtractionResult[] = [];
    // t('key', 'Default translation')
    const tWithDefaultRegex = /t\(["']([^"']+)["']\s*,\s*["']([^"']+)["']\)/g;
    // t('key', { defaultValue: 'Default translation' })
    const tWithDefaultObjRegex = /t\(["']([^"']+)["']\s*,\s*\{[^}]*defaultValue:\s*["']([^"']+)["'][^}]*\}\)/g;
    // t('key') but not t('key', ...)
    const tRegex = /t\(["']([^"']+)["']\s*\)(?!\s*,)/g;
    // i18nKey="key"
    const i18nKeyRegex = /i18nKey=["']([^"']+)["']/g;
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        let match;
        const found = new Set<string>();
        // t('key', 'Default translation')
        while ((match = tWithDefaultRegex.exec(content))) {
            results.push({ key: match[1], translation: match[2], filePath: file });
            found.add(match[1]);
        }
        // t('key', { defaultValue: 'Default translation' })
        while ((match = tWithDefaultObjRegex.exec(content))) {
            results.push({ key: match[1], translation: match[2], filePath: file });
            found.add(match[1]);
        }
        // t('key') but not t('key', ...)
        while ((match = tRegex.exec(content))) {
            if (!found.has(match[1])) {
                results.push({ key: match[1], translation: '', filePath: file });
                found.add(match[1]);
            }
        }
        // i18nKey="key"
        while ((match = i18nKeyRegex.exec(content))) {
            if (!found.has(match[1])) {
                results.push({ key: match[1], translation: '', filePath: file });
                found.add(match[1]);
            }
        }
    }
    return results;
}
