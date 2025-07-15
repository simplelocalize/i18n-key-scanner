import * as fs from 'fs';

export function getDefaultConfig() {
    return {
        includeExtensions: ['.js', '.jsx', '.ts', '.tsx'],
        excludeDirs: ['node_modules']
    };
}

export function reactIntlStrategy(files: string[], config?: CliConfig): ExtractionResult[] {
    const results: ExtractionResult[] = [];
    const formattedMessageRegex = /<FormattedMessage[^>]*id=["'](.*?)["'][^>]*defaultMessage=["'](.*?)["']/g;
    const formattedHTMLMessageRegex = /<FormattedHTMLMessage[^>]*id=["'](.*?)["'][^>]*defaultMessage=["'](.*?)["']/g;
    // Support both single and double quotes, allow whitespace, and allow property order to vary
    const intlFormatMessageRegex = /intl\.formatMessage\(\{[^}]*id\s*:\s*['"](.*?)['"][^}]*defaultMessage\s*:\s*['"](.*?)['"][^}]*\}\)/gs;
    const defineMessagesRegex = /id\s*:\s*['"](.*?)['"][^}]*defaultMessage\s*:\s*['"](.*?)['"]/gs;
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        let match;
        const keys = new Map<string, string>();
        while ((match = formattedMessageRegex.exec(content))) {
            keys.set(match[1], match[2]);
        }
        while ((match = formattedHTMLMessageRegex.exec(content))) {
            keys.set(match[1], match[2]);
        }
        while ((match = intlFormatMessageRegex.exec(content))) {
            keys.set(match[1], match[2]);
        }
        while ((match = defineMessagesRegex.exec(content))) {
            keys.set(match[1], match[2]);
        }
        for (const [key, translation] of keys.entries()) {
            results.push({ key, translation, filePath: file });
        }
    }
    return results;
}
