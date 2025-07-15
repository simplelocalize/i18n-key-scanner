# i18n-key-extract

A modular CLI tool to extract i18n keys and default translations from your codebase. Supports multiple strategies (i18next, react-intl, data-i18n-key, EJS, Apple, Android, and more) with per-strategy configuration.

## Installation

```
npm install -g i18n-key-extract
```

Or use locally:

```
npm install --save-dev i18n-key-extract
```

## Usage

### Basic CLI Usage

```
i18n-key-extract --strategy <strategy> --src <glob>
```

- `--strategy` (required): Extraction strategy to use. Supported: `i18next`, `react-intl`, `data-i18n-key`, `ejs`, `apple`, `android`.
- `--src` (required): Glob pattern for files to scan (e.g. `src/**/*.js`).
- `--config`: Path to a JSON config file for the strategy (optional).
- `--out`: Output file for extracted keys (optional).

### Example: Extract i18next keys from JS/TS files

```
i18n-key-extract --strategy i18next --src "src/**/*.{js,ts,jsx,tsx}"
```

### Example: Extract react-intl keys from React files

```
i18n-key-extract --strategy react-intl --src "src/**/*.{js,jsx,ts,tsx}"
```

### Example: Extract data-i18n-key from HTML

```
i18n-key-extract --strategy data-i18n-key --src "public/**/*.html"
```

### Example: Use a custom config file

```
i18n-key-extract --strategy i18next --src "src/**/*.{js,ts}" --config i18next.config.json
```

## Per-Strategy Configuration

Each strategy supports its own config options. You can provide a config file (JSON) via `--config` or rely on built-in defaults.

#### Example i18next config (`i18next.config.json`):

```json
{
  "includeExtensions": [".js", ".ts", ".jsx", ".tsx"],
  "excludeDirs": ["node_modules", "dist"]
}
```

#### Example data-i18n-key config (`data-i18n-key.config.json`):

```json
{
  "selector": "[data-i18n-key]",
  "keyAttr": "data-i18n-key",
  "textAttr": null
}
```

## Output

By default, results are printed to stdout as JSON. Use `--out` to write to a file:

```
i18n-key-extract --strategy i18next --src "src/**/*.js" --out keys.json
```

## Supported Strategies

- **i18next**: Extracts from `t('key', 'Default')`, `t('key', { defaultValue })`, `i18nKey` attributes.
- **react-intl**: Extracts from `<FormattedMessage>`, `<FormattedHTMLMessage>`, `intl.formatMessage`, `defineMessages`.
- **data-i18n-key**: Extracts from HTML elements with `data-i18n-key`.
- **ejs**: Extracts from EJS templates using `t('key')`.
- **apple**: Extracts from Apple `.strings` files.
- **android**: Extracts from Android `strings.xml` files.

## Example Output

```json
[
  { "key": "hello", "translation": "Hello world!", "filePath": "src/app.js" },
  { "key": "bye", "translation": "Goodbye!", "filePath": "src/app.js" }
]
```

## Contributing

PRs and issues welcome!

## License

MIT
