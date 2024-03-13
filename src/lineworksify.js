const defaultHandlers = require("mdast-util-to-markdown/lib/handle");
const phrasing = require("mdast-util-to-markdown/lib/util/container-phrasing");

const { wrap, isURL, isPotentiallyEncoded } = require("./utils");

/**
 * Creates custom `mdast-util-to-markdown` handlers that tailor the output for
 * Slack Markdown.
 *
 * @param {Readonly<Record<string, { title: null | string, url: string }>>} definitions
 * Record of `Definition`s in the Markdown document, keyed by identifier.
 *
 * @returns {import('mdast-util-to-markdown').Handlers}
 */
const createHandlers = (definitions) => ({
  heading: (node, _parent, context) => {
    // make headers to be just *strong*
    const marker = "*";

    const exit = context.enter("heading");
    const value = phrasing(node, context, { before: marker, after: marker });
    exit();

    return `📍 ${value} 📍`;
  },

  strong: (node, _parent, context) => {
    const marker = "*";

    const exit = context.enter("strong");
    const value = phrasing(node, context, { before: marker, after: marker });
    exit();

    return value;
  },

  delete(node, _parent, context) {
    const marker = "~";

    const exit = context.enter("delete");
    const value = phrasing(node, context, { before: marker, after: marker });
    exit();

    return " ❌" + value + "❌ ";
  },

  emphasis: (node, _parent, context) => {
    const marker = "_";

    const exit = context.enter("emphasis");
    const value = phrasing(node, context, { before: marker, after: marker });
    exit();

    return value;
  },

  inlineCode(node, _parent, context) {
    const exit = context.enter("inlineCode");
    const value = node.value;
    exit();

    return `${value}`;
  },

  listItem: (...args) => defaultHandlers.listItem(...args).replace(/^\*/, "✔️"),

  code(node, _parent, context) {
    const exit = context.enter("code");
    // delete language prefix for deprecated markdown formatters (old Bitbucket Editor)
    const content = node.value.replace(/^#![a-z]+\n/, ""); // ```\n#!javascript\ncode block\n```
    exit();

    return `\n\n${content}\n`;
  },

  link: (node, _parent, context) => {
    const exit = context.enter("link");
    const text =
      phrasing(node, context, { before: "|", after: ">" }) || node.title;
    const url = isPotentiallyEncoded(node.url) ? node.url : encodeURI(node.url);
    exit();

    if (!isURL(url)) return text || url;

    return text ? `\n${text} (${url})\n` : `\n${url}\n`;
  },

  linkReference: (node, _parent, context) => {
    const exit = context.enter("linkReference");
    const definition = definitions[node.identifier];
    const text =
      phrasing(node, context, { before: "|", after: ">" }) ||
      (definition ? definition.title : null);
    exit();

    if (!definition || !isURL(definition.url)) return text;

    return text ? `\n${text} (${definition.url})\n` : `\n${definition.url}\n`;
  },

  image: (node, _parent, context) => {
    const exit = context.enter("image");
    const text = node.alt || node.title;
    const url = encodeURI(node.url);
    exit();

    if (!isURL(url)) return text || url;

    return text ? `\n${text} (${url})\n` : `\n${url}\n`;
  },

  imageReference: (node, _parent, context) => {
    const exit = context.enter("imageReference");
    const definition = definitions[node.identifier];
    const text = node.alt || (definition ? definition.title : null);
    exit();

    if (!definition || !isURL(definition.url)) return text;

    return text ? `\n${text} (${definition.url})\n` : `\n${definition.url}\n`;
  },

  text: (node, _parent, context) => {
    const exit = context.enter("text");
    // https://api.slack.com/reference/surfaces/formatting#escaping
    const text = node.value;
    exit();

    // Do we need more escaping like the default handler uses?
    // https://github.com/syntax-tree/mdast-util-to-markdown/blob/main/lib/handle/text.js
    // https://github.com/syntax-tree/mdast-util-to-markdown/blob/main/lib/unsafe.js
    return text;
  },
});

/**
 * Creates options to be passed into a `remark-stringify` processor that tailor
 * the output for Slack Markdown.
 *
 * @param {Readonly<Record<string, { title: null | string, url: string }>>} definitions
 * Record of `Definition`s in the Markdown document, keyed by identifier.
 *
 * @returns {import('remark-stringify').RemarkStringifyOptions}
 */
const createOptions = (definitions) => ({
  bullet: "*",
  handlers: createHandlers(definitions),
});

module.exports = createOptions;
