interface CliConfig {
    keyAttr?: string;
    textAttr?: string;
    selector?: string;
    includeExtensions?: string[];
    excludeDirs?: string[];
    [key: string]: any;
}

interface ExtractionResult {
    key: string;
    translation: string;
    filePath: string;
}