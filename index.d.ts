declare module "slackify-markdown" {
  function slackify(markdown: string, parseOption?: any): string;
  function chatworkify(markdown: string, parseOptions?: any): string;
  export = { slackify, chatworkify };
}
