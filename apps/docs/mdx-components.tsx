import defaultMdxComponents from "fumadocs-ui/mdx";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/callout";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Step,
    Steps,
    File,
    Files,
    Folder,
    Callout,
    ...components,
  };
}
