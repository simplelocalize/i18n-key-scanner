#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { i18nextStrategy } from './strategies/i18next';
import { reactIntlStrategy } from './strategies/react-intl';
import { dataI18nKeyStrategy } from './strategies/data-i18n-key';
import { ejsStrategy } from './strategies/ejs';
import { appleStrategy } from './strategies/apple';
import { androidStrategy } from './strategies/android';
import glob from 'glob';

const STRATEGY_MAP: Record<string, any> = {
    'i18next': i18nextStrategy,
    'react-intl': reactIntlStrategy,
    'data-i18n-key': dataI18nKeyStrategy,
    'ejs': ejsStrategy,
    'apple': appleStrategy,
    'android': androidStrategy
};

const program = new Command();

program
    .option('--config <file>', 'Path to strategy config JSON file')
    .option('--strategy <name>', '(Optional) Extraction strategy to use (overrides config file)')
    .option('--src <pattern>', '(Optional) Glob pattern for files to search. Default: ./', './')
    .option('--out <file>', '(Optional) Choose where to save results. Default: ./extraction.json', './extraction.json')
    .action((options) => {
        const { config, strategy: cliStrategy, src, out } = options;
        if (!config) {
            console.error('Config file is required.');
            process.exit(1);
        }

        let userConfig: CliConfig = {};
        if (config && require('fs').existsSync(config)) {
            userConfig = JSON.parse(require('fs').readFileSync(config, 'utf-8')) as CliConfig;
        }
        // Prefer CLI --strategy over config file
        const strategyName = cliStrategy || userConfig?.strategy || "";
        if (!strategyName || !STRATEGY_MAP[strategyName]) {
            console.error('Unknown or missing strategy. Given strategy:', strategyName);
            console.error('Available strategies:', Object.keys(STRATEGY_MAP).join(', '));
            process.exit(1);
        }
        const strategy = STRATEGY_MAP[strategyName];
        if (typeof strategy.getDefaultConfig !== 'function') {
            console.error(`Strategy '${strategyName}' does not export getDefaultConfig()`);
            process.exit(1);
        }
        const defaultConfig = strategy.getDefaultConfig();
        const effectiveConfig = { ...defaultConfig, ...userConfig, strategy: strategyName };

        // Use glob to find files
        const files = glob.sync(src, { ignore: effectiveConfig.excludeDirs || [] });
        const results = strategy(files, effectiveConfig);
        fs.writeFileSync(path.resolve(out), JSON.stringify(results, null, 2));
        console.log('Extraction complete. Output saved to', out);
    });

program.parse(process.argv);
