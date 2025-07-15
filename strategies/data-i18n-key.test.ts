import { dataI18nKeyStrategy } from './data-i18n-key';
import * as fs from 'fs';
import * as path from 'path';

describe('dataI18nKeyStrategy', () => {
  const testDir = path.join(__dirname, '__testdata__');
  const testFile = path.join(testDir, 'test.html');

  beforeAll(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
  });

  it('extracts key and text content from data-i18n-key attribute', () => {
    fs.writeFileSync(testFile, '<div data-i18n-key="greeting">Hello!</div>');
    const results = dataI18nKeyStrategy([testFile]);
    expect(results).toEqual([
      { key: 'greeting', translation: 'Hello!', filePath: testFile }
    ]);
  });

  it('extracts key and attribute value if textAttr is set', () => {
    fs.writeFileSync(testFile, '<div data-i18n-key="greeting" data-i18n-text="Hi!"></div>');
    const results = dataI18nKeyStrategy([testFile], { textAttr: 'data-i18n-text' });
    expect(results).toEqual([
      { key: 'greeting', translation: 'Hi!', filePath: testFile }
    ]);
  });

  it('extracts multiple keys from one file', () => {
    fs.writeFileSync(testFile, '<div data-i18n-key="a">A</div><span data-i18n-key="b">B</span>');
    const results = dataI18nKeyStrategy([testFile]);
    expect(results).toEqual([
      { key: 'a', translation: 'A', filePath: testFile },
      { key: 'b', translation: 'B', filePath: testFile }
    ]);
  });

  it('returns empty key if attribute is missing', () => {
    fs.writeFileSync(testFile, '<div>Hello!</div>');
    const results = dataI18nKeyStrategy([testFile]);
    expect(results).toEqual([]);
  });
});
