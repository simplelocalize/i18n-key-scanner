import { i18nextStrategy } from './i18next';
import * as fs from 'fs';
import * as path from 'path';

describe('i18nextStrategy', () => {
    const testDir = path.join(__dirname, '__testdata__');
    const testFile = path.join(testDir, 'i18next-test.js');

    beforeAll(() => {
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    });

    afterEach(() => {
        if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    });

    afterAll(() => {
        if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
    });

    it('extracts key and default translation from t(key, default)', () => {
        fs.writeFileSync(testFile, `t('hello', 'Hello world!')`);
        const results = i18nextStrategy([testFile]);
        expect(results).toEqual([
            { key: 'hello', translation: 'Hello world!', filePath: testFile }
        ]);
    });

    it('extracts key and defaultValue from t(key, { defaultValue })', () => {
        fs.writeFileSync(testFile, `t('bye', { defaultValue: 'Goodbye!' })`);
        const results = i18nextStrategy([testFile]);
        expect(results).toEqual([
            { key: 'bye', translation: 'Goodbye!', filePath: testFile }
        ]);
    });

    it('extracts key with empty translation from t(key)', () => {
        fs.writeFileSync(testFile, `t('simple')`);
        const results = i18nextStrategy([testFile]);
        expect(results).toEqual([
            { key: 'simple', translation: '', filePath: testFile }
        ]);
    });

    it('extracts key from i18nKey attribute', () => {
        fs.writeFileSync(testFile, `<div i18nKey="attr-key"></div>`);
        const results = i18nextStrategy([testFile]);
        expect(results).toEqual([
            { key: 'attr-key', translation: '', filePath: testFile }
        ]);
    });
});
