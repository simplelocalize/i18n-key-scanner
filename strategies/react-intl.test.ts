import { reactIntlStrategy } from './react-intl';
import * as fs from 'fs';
import * as path from 'path';

describe('reactIntlStrategy', () => {
    const testDir = path.join(__dirname, '__testdata__');
    const testFile = path.join(testDir, 'react-intl-test.js');

    beforeAll(() => {
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    });

    afterEach(() => {
        if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    });

    afterAll(() => {
        if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
    });

    it('extracts id and defaultMessage from <FormattedMessage>', () => {
        fs.writeFileSync(testFile, `<FormattedMessage id="greeting" defaultMessage="Hello!" />`);
        const results = reactIntlStrategy([testFile]);
        expect(results).toEqual([
            { key: 'greeting', translation: 'Hello!', filePath: testFile }
        ]);
    });

    it('extracts id and defaultMessage from <FormattedHTMLMessage>', () => {
        fs.writeFileSync(testFile, `<FormattedHTMLMessage id="htmlgreet" defaultMessage="<b>Hello!</b>" />`);
        const results = reactIntlStrategy([testFile]);
        expect(results).toEqual([
            { key: 'htmlgreet', translation: '<b>Hello!</b>', filePath: testFile }
        ]);
    });

    it('extracts id and defaultMessage from intl.formatMessage', () => {
        fs.writeFileSync(testFile, `intl.formatMessage({id: 'bye', defaultMessage: 'Goodbye!'})`);
        const results = reactIntlStrategy([testFile]);
        expect(results).toEqual([
            { key: 'bye', translation: 'Goodbye!', filePath: testFile }
        ]);
    });

    it('extracts id and defaultMessage from defineMessages', () => {
        fs.writeFileSync(testFile, `defineMessages({ farewell: { id: 'farewell', defaultMessage: 'Bye!' } })`);
        const results = reactIntlStrategy([testFile]);
        expect(results).toEqual([
            { key: 'farewell', translation: 'Bye!', filePath: testFile }
        ]);
    });

    it('does not duplicate keys', () => {
        fs.writeFileSync(testFile, `<FormattedMessage id="greeting" defaultMessage="Hello!" /><FormattedMessage id="greeting" defaultMessage="Hello!" />`);
        const results = reactIntlStrategy([testFile]);
        expect(results).toEqual([
            { key: 'greeting', translation: 'Hello!', filePath: testFile }
        ]);
    });
});
