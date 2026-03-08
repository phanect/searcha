import { extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import lchPlugin from "colord/plugins/lch";
import mixPlugin from "colord/plugins/mix";
extend([ mixPlugin, lchPlugin, a11yPlugin ]);

export * from "./themes";
export { default } from "./themes";
