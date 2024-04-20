import { existsSync, readFileSync, writeFileSync } from 'fs';

const replacementsFileName = process.argv[process.argv.length - 1];
const replacementsAnalyticsFilename = 'replacements.analytics.json';
if (!existsSync(replacementsAnalyticsFilename)) {
    process.exit(0);
}
const replacements = JSON.parse((readFileSync(replacementsFileName)).toString());
const analytics_replacements = JSON.parse(readFileSync(replacementsAnalyticsFilename).toString());
Object.assign(replacements, analytics_replacements);
writeFileSync(replacementsFileName, JSON.stringify(replacements, null, 1));
