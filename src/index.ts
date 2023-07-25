declare let Cheerio: CheerioAPI

const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty(
  'spreadsheetId'
)

export function main(): void {
  const src = UrlFetchApp.fetch(
    'https://www.museum.or.jp/museum-chara/2023/result'
  ).getContentText()

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet()
  const column = sheet.getLastColumn()

  const headers: string[] = sheet.getRange(1, 1, 1, 1 + column).getValues()[0]

  if (headers.every((h) => h === '' || !h)) {
    headers.length = 0
    headers.push('date')
  }

  const values: (Date | number)[] = [new Date()]

  const $ = Cheerio.load(src, { decodeEntities: false })
  $('.c-charaItem').each((_, elm) => {
    const e = $(elm)
    const title = e.find('.c-charaItem_body_title').text().replace(/\s/g, '')
    const text = e.find('.c-charaItem_body_count').text()

    if (text.replace(/,/g, '').match(/([0-9]+)/)) {
      const n = +RegExp.$1
      console.log(title, n)

      let column = headers.indexOf(title) + 1
      if (column === 0) {
        console.warn('Inserting new column for: ' + title)
        headers.push(title)
        column = headers.length
      }

      values[column - 1] = n
    }
  })

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  sheet.appendRow(values)
}
