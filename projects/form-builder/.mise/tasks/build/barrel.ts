import { readdir, readFile, writeFile } from "node:fs/promises";

process.chdir('./src');

const output: string[] = [];

async function scanDir(dir: string) {
  const items = await readdir(dir);

  for (const item of items) {
    // This is the generated file
    if (item === 'index.ts' && dir === '.') continue;

    // Recursively scan this directory
    if (!item.includes('.')) scanDir(dir + '/' + item);

    // Export the file’s contents
    if (!item.includes('.ts')) continue;

    // Get component/file name
    let component = item.split('.')[0];
    const path = component === 'index' ? dir : `${dir}/${component}`;
    if (component === 'index') component = dir.split('/').pop() ?? dir;

    // Check if file has default export
    const file = await readFile(dir + '/' + item);
    // Check if not field index file
    if (file.indexOf('export default') > -1 && item.split('.')[0] !== 'index')
      output.push(`export { default as ${component} } from '${path}';`);

    output.push(`export * from '${path}';\n`);
  }
}

await scanDir('.');
await writeFile('index.ts', output.join('\n'));
