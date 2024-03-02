const { chatworkify } = require("..");

const zws = String.fromCharCode(0x200b); // zero-width-space

test("Simple text", () => {
  expect(chatworkify("hello world")).toBe("hello world\n");
});

test("Escaped text", () => {
  expect(chatworkify("*h&ello>world<")).toBe("*h&ello>world<\n");
});

test("Headings", () => {
  const mrkdown = "# heading 1\n## heading 2\n### heading 3";
  const chatwork =
    "[info]heading 1[/info][hr]\n\n[info]heading 2[/info][hr]\n\n[info]heading 3[/info][hr]\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Bold", () => {
  const mrkdown = "**bold text**";
  const chatwork = `bold text\n`;
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Italic", () => {
  const mrkdown = "*italic text*";
  const chatwork = `italic text\n`;
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Strike", () => {
  const mrkdown = "~~strike text~~";
  const chatwork = `~strike text~\n`;
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Unordered list", () => {
  const mrkdown = "* list\n* list\n* list";
  const chatwork = "•   list\n•   list\n•   list\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Ordered list", () => {
  const mrkdown = "1. list\n2. list\n3. list";
  const slack = "1.  list\n2.  list\n3.  list\n";
  expect(chatworkify(mrkdown)).toBe(slack);
});

test("Link with title", () => {
  const mrkdown = '[](http://atlassian.com "Atlassian")';
  const chatwork = "\nAtlassian (http://atlassian.com)\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Link with alt", () => {
  const mrkdown = "[test](http://atlassian.com)";
  const chatwork = "\ntest (http://atlassian.com)\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Link with alt and title", () => {
  const mrkdown = '[test](http://atlassian.com "Atlassian")';
  const slack = "\ntest (http://atlassian.com)\n";
  expect(chatworkify(mrkdown)).toBe(slack);
});

test("Link with angle bracket syntax", () => {
  const mrkdown = "<http://atlassian.com>";
  const slack = "\nhttp://atlassian.com (http://atlassian.com)\n";
  expect(chatworkify(mrkdown)).toBe(slack);
});

test("Link with no alt nor title", () => {
  const mrkdown = "[](http://atlassian.com)";
  const chatwork = "\nhttp://atlassian.com\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Link with invalid URL", () => {
  const mrkdown = "[test](/atlassian)";
  const chatwork = "test\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Link in reference style with alt", () => {
  const mrkdown = "[Atlassian]\n\n[atlassian]: http://atlassian.com";
  const chatwork = "\nAtlassian (http://atlassian.com)\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Link in reference style with custom label", () => {
  const mrkdown = "[][test]\n\n[test]: http://atlassian.com";
  const chatwork = "\nhttp://atlassian.com\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Image with title", () => {
  const mrkdown = '![](https://bitbucket.org/repo/123/images/logo.png "test")';
  const slack = "\ntest (https://bitbucket.org/repo/123/images/logo.png)\n";
  expect(chatworkify(mrkdown)).toBe(slack);
});

test("Inline code", () => {
  const mrkdown = "hello `world`";
  const chatwork = "hello [code]world[/code]\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Code block", () => {
  const mrkdown = "```\ncode block\n```";
  const chatwork = "[code]code block[/code]\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Code block with language", () => {
  const mrkdown = "```javascript\ncode block\n```";
  const chatwork = "[code]code block[/code]\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("Code block with deprecated language declaration", () => {
  const mrkdown = "```\n#!javascript\ncode block\n```";
  const chatwork = "[code]code block[/code]\n";
  expect(chatworkify(mrkdown)).toBe(chatwork);
});

test("inline code block", () => {
  const mrkdown = "hello`world`";
  const slack = `hello[code]world[/code]\n`;
  expect(chatworkify(mrkdown)).toBe(slack);
});
