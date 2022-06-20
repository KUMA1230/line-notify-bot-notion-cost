const { Client } = require('@notionhq/client');
const axios = require('axios');
const qs = require('qs');

exports.handler = async (callback) => {
  const API_KEY = process.env.API_KEY;
  const DATABASE_ID = process.env.DATABASE_ID;

  const notion = new Client({ auth: API_KEY });

  (async () => {
    // Notion データ取得
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: 'ステータス',
            select: {
              equals: 'Done'
            }
          },
          {
            property: '日付',
            date: {
              past_month: {}
            }
          }
        ]
      }
    });

    // メッセージ整形
    let message = '';
    if(response.results.length === 1) {
      const properties = response.results[0].properties;
      message = `
        今月の固定費のお知らせです❀
        家賃：￥${properties['家賃'].number.toLocaleString()}
        電気代：￥${properties['電気代'].number.toLocaleString()}
        ガス代：￥${properties['ガス代'].number.toLocaleString()}
        水道代：￥${properties['水道代'].number.toLocaleString()}
        通信費：￥${properties['通信費'].number.toLocaleString()}
        備考：${properties['備考'].rich_text}
        --------------------
        合計金額：￥${properties['合計金額'].formula.number.toLocaleString()}
        (1人あたり ￥${(properties['合計金額'].formula.number / 2).toLocaleString()})`;
    } else {
      message = '今月の固定費データが取得できませんでした。';
    }

    linePost(message);

    // LINEで通知する
    function linePost(messageText) {
      const LINE_TOKEN = process.env.LINE_TOKEN;

      axios({
        method: 'post',
        url: 'https://notify-api.line.me/api/notify',
        headers: {
          Authorization: `Bearer ${LINE_TOKEN}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          message: messageText.replace(/ /g, ''),
        }),
      })
      .then(res => {
        callback(null, res.data)
      }).catch(err => {
        callback(err);
        console.log('FIXED_COST_POST_ERROR:' + err);
      });
    }
  })();
};
