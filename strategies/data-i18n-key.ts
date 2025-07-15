import * as fs from 'fs';
import * as cheerio from 'cheerio';

export function getDefaultConfig() {
  return {
    includeExtensions: ['.html'],
    excludeDirs: ['node_modules'],
    selector: '[data-i18n-key]',
    keyAttr: 'data-i18n-key',
    textAttr: null
  };
}

export function dataI18nKeyStrategy(files: string[], config?: CliConfig): ExtractionResult[] {
  const selector = config?.selector || '[data-i18n-key]';
  const keyAttr = config?.keyAttr || 'data-i18n-key';
  const textAttr = config?.textAttr || null;
  const results: ExtractionResult[] = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const $ = cheerio.load(content);
    $(selector).each((_: any, el: any) => {
      const key = $(el).attr(keyAttr) || '';
      const translation = textAttr ? $(el).attr(textAttr) || '' : $(el).text();
      results.push({ key, translation, filePath: file });
    });
  }
  return results;
}
