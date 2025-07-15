import { ejsStrategy } from './ejs';
import * as fs from 'fs';
import * as path from 'path';

describe('ejsStrategy', () => {
  const testDir = path.join(__dirname, '__testdata__');
  const testFile = path.join(testDir, 'test.ejs');

  beforeAll(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
  });

  it('extracts keys from t() calls', () => {
    fs.writeFileSync(testFile, `<%= t('hello') %> <%= t("bye") %>`);
    const results = ejsStrategy([testFile]);
    expect(results).toEqual([
      { key: 'hello', translation: '', filePath: testFile },
      { key: 'bye', translation: '', filePath: testFile }
    ]);
  });

  it('does not duplicate keys', () => {
    fs.writeFileSync(testFile, `<%= t('hello') %> <%= t('hello') %>`);
    const results = ejsStrategy([testFile]);
    expect(results).toEqual([
      { key: 'hello', translation: '', filePath: testFile }
    ]);
  });

  it('returns empty array if no t() calls', () => {
    fs.writeFileSync(testFile, `<div>No keys here</div>`);
    const results = ejsStrategy([testFile]);
    expect(results).toEqual([]);
  });
});
