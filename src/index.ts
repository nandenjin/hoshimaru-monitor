declare let Cheerio: CheerioAPI

const SPREADSHEET_ID = ScriptProperties.getProperty('spreadsheetId')

export function main(): void {
  const src = UrlFetchApp.fetch(
    'https://www.museum.or.jp/museum-chara/2020/result'
  ).getContentText()

  const $ = Cheerio.load(src, { decodeEntities: false })
  $('.c-charaItem').each((i, elm) => {
    const e = $(elm)
    if (e.html().indexOf('コスモ星丸') > -1) {
      const text = e.find('.c-charaItem_body_count').text()
      console.log(text)
      if (text.match(/([0-9]+)/)) {
        const n = +RegExp.$1
        console.log(n)

        const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet()
        const row = sheet.getLastRow()
        sheet.getRange(row + 1, 1, 1, 3).setValues([[new Date(), n, i + 1]])
      }

      return false
    }
  })
}
