import Papa from 'papaparse';

export interface Transaction {
  Date: string
  Amount: number
  OriginalAmount: number | null
  OriginalCurrency: string | null
  ExchangeRate: number | null
  Description: string
  Subject: string
  Category: string
  Tags: string
  Wise: string
  Spaces: string
}

interface CSVRow {
  Date: string
  Amount: string
  "Original amount": string
  "Original currency": string
  "Exchange rate": string
  Description: string
  Subject: string
  Category: string
  Tags: string
  Wise: string
  Spaces: string
}

export interface ParsedCSVResult {
  transactions: Transaction[]
  earliestDate: Date | undefined
  latestDate: Date | undefined
}

export function parseCSV(file: File): Promise<ParsedCSVResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results: Papa.ParseResult<CSVRow>) => {
        const transactions: Transaction[] = results.data.map((row: CSVRow) => ({
          Date: row.Date,
          Amount: Number.parseFloat(row.Amount),
          OriginalAmount: row["Original amount"] ? Number.parseFloat(row["Original amount"]) : null,
          OriginalCurrency: row["Original currency"] || null,
          ExchangeRate: row["Exchange rate"] ? Number.parseFloat(row["Exchange rate"]) : null,
          Description: row.Description,
          Subject: row.Subject,
          Category: row.Category,
          Tags: row.Tags,
          Wise: row.Wise,
          Spaces: row.Spaces,
        }))

        const dates = transactions.map((t) => new Date(t.Date)).filter((d) => !isNaN(d.getTime()))

        const earliestDate = dates.length > 0 ? new Date(Math.min(...dates.map(Number))) : undefined
        const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map(Number))) : undefined

        resolve({ transactions, earliestDate, latestDate })
      },
      error: (error: Error) => {
        reject(error)
      },
    })
  })
}

