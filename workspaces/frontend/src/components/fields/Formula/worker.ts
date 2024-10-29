import { transform } from "sucrase";

const defaultExportName = "formula";

const transpile = (code: string | undefined) => {
  if (code) {
    let transpiledCode = transform(code, {
      transforms: [ "typescript", "imports" ],
    }).code;
    const defaultExportRegex = /exports\s*?\.\s*?default\s*?=/;
    if (!defaultExportRegex.test(transpiledCode)) {
      transpiledCode += `\nexports.default = ${ defaultExportName };`;
    }

    return transpiledCode;
  } else {
    return `
    exports.default = async function ${ defaultExportName }({
      row,
      ref,
    }) {};`;
  }
};

onmessage = async ({ data }) => {
  try {
    const { formulaFn, row, ref } = JSON.parse(data);
    const codeToRun = transpile(formulaFn);
    // @ts-expect-error FIXME
    const exports = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line no-eval
    const formulaScript = eval(codeToRun);
    const result = await formulaScript({ row, ref });
    postMessage({ result });
  } catch (error: any) {
    console.error("Error: ", error);
    postMessage({
      error,
    });
  } finally {
    // eslint-disable-next-line no-restricted-globals
    self.close();
  }
};

export {};
