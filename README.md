# line-notify-bot-notion-cost

Get Notion data and send a notification to LINE Notify.

Notionのデータを取得して、LINE Notifyに通知を送信します。

## Usage

Please zip `index.js` and `node_modules/` and upload to Lambda.

`index.js`と`node_moduls/`を圧縮して、Lambdaにアップロードしてください。

Set environment variables in Lambda.

Lambdaで環境変数を設定します。

- API_KEY
- DATABASE_ID
- LINE_TOKEN

Please set the periodic execution in Amazon Event Bridge.

Amazon Event Bridgeで定期実行を設定してください。