import ReactMarkdown, { type Components, type Options as ReactMarkdownProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Typography, Link } from "@mui/material";
import type { Pluggable } from "unified";

const remarkPlugins = [remarkGfm as Pluggable];
const components: Components = {
  // @ts-expect-error Material UI's bug: https://github.com/mui/material-ui/issues/41906
  a: (props) => <Link color="inherit" {...props} />,
  // @ts-expect-error FIXME
  p: Typography,
  // eslint-disable-next-line jsx-a11y/alt-text
  img: (props) => (
    <img style={{ maxWidth: "100%", borderRadius: 4 }} alt="" {...props} />
  ),
};

const restrictionPresets = {
  singleLine: ["p", "em", "strong", "a", "code", "del"],
};

export interface IRenderedMarkdownProps extends ReactMarkdownProps {
  restrictionPreset?: keyof typeof restrictionPresets;
}

export default function RenderedMarkdown({
  restrictionPreset,
  ...props
}: IRenderedMarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      allowedElements={
        restrictionPreset ? restrictionPresets[restrictionPreset] : undefined
      }
      unwrapDisallowed
      remarkPlugins={remarkPlugins}
      components={{ ...components, ...props.components }}
    />
  );
}
