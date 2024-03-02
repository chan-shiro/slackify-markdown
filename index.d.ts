declare module "slackify-markdown" {
  export function slackify(markdown: string, parseOption?: any): string;
  export function chatworkify(markdown: string, parseOptions?: any): string;
  export = slackify;
  export = chatworkify;
}
