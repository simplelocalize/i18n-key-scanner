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
import { StrategyConfig } from './strategies/strategy-config';

function findFiles(dir: string, exts: string[], excludeDirs: string[]): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (excludeDirs.includes(file)) continue;
            results = results.concat(findFiles(filePath, exts, excludeDirs));
        } else {
            if (exts.some(ext => filePath.endsWith(ext))) {
                results.push(filePath);
            }
        }
    }
    return results;
}

const STRATEGY_MAP: Record<string, any> = {
    'i18next': i18nextStrategy,
    'react-intl': reactIntlStrategy,
    'html-data-attributes': dataI18nKeyStrategy,
    'ejs': ejsStrategy,
    'apple': appleStrategy,
    'android': androidStrategy
};

const program = new Command();

program
    .option('--config <file>', 'Path to strategy config JSON file')
    .option('--searchDir <dir>', '(Optional) Choose where to search. Default: ./', './')
    .option('--output <file>', '(Optional) Choose where to save results. Default: ./extraction.json', './extraction.json')
    .action((options) => {
        const { config, searchDir, output } = options;
        if (!config) {
            console.error('Config file is required.');
            process.exit(1);
        }

        let userConfig: StrategyConfig = {};
        if (config && require('fs').existsSync(config)) {
            userConfig = JSON.parse(require('fs').readFileSync(config, 'utf-8')) as StrategyConfig;
        }
        const strategyName = userConfig?.strategy || "";
        if (!strategyName || !STRATEGY_MAP[strategyName]) {
            console.error('Unknown or missing strategy in config file. Given strategy:', strategyName);
            console.error('Available strategies:', Object.keys(STRATEGY_MAP).join(', '));
            process.exit(1);
        }
        const strategy = STRATEGY_MAP[strategyName];
        if (typeof strategy.getDefaultConfig !== 'function') {
            console.error(`Strategy '${strategyName}' does not export getDefaultConfig()`);
            process.exit(1);
        }
        const defaultConfig = strategy.getDefaultConfig();
        const effectiveConfig = { ...defaultConfig, ...userConfig };

        const includeExtensions = effectiveConfig.includeExtensions || [];
        const excludeDirs = effectiveConfig.excludeDirs || [];
        const files = findFiles(searchDir, includeExtensions, excludeDirs);
        const results = strategy(files, effectiveConfig);
        fs.writeFileSync(path.resolve(output), JSON.stringify(results, null, 2));
        console.log('Extraction complete. Output saved to', output);
    });

program.parse(process.argv);
