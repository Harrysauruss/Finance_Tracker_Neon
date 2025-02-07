# Neon Finance Tracker

A Next.js application to analyze and visualize your financial data from Neon Bank (Switzerland).

## Features

* [x] CSV file upload and parsing for Neon Bank statements
* [ ] Interactive financial dashboards
* [ ] Expense categorization
* [ ] Monthly spending analysis
* [ ] Transaction search and filtering
* [ ] Responsive design for all devices

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Recharts](https://recharts.org/) - Data visualization

## Installation

1. Clone the repository and move into the project directory:
```bash
git clone https://github.com/Harrysauruss/Finance_Tracker_Neon
cd neon-finance-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## Usage

- Log in to your Neon Bank account
- Navigate to Profile > Account Statements
- Download the yearly statement in CSV format (named "Year XXXX.csv")
- In the Neon Finance Tracker app, click on "Upload Statement"
- Select your downloaded CSV file
- The application will automatically process and display your financial data

## CSV File Format
The application expects the Neon Bank CSV format with the following columns:

- Date
- Amount
- Original amount	
- Original currency	
- Exchange rate	
- Description	
- Subject	
- Category	
- Tags	
- Wise	
- Spaces

### Example:
| Date       | Amount | Original amount | Original currency | Exchange rate | Description | Subject | Category  | Tags | Wise | Spaces |
|------------|--------|-----------------|------------------|---------------|-------------|---------|-----------|------|------|---------|
| 2024-12-31 | -36.25 | -36.25         | CHF              | 1.0          | BP Station  | Gas     | transport | no   | no   | General |
| 2024-12-30 | -89.90 | -89.90         | CHF              | 1.0          | Migros      | Food    | groceries | no   | no   | General |
| 2024-12-29 | -45.00 | -45.00         | CHF              | 1.0          | SBB         | Train   | transport | no   | no   | General |
| 2024-12-28 | -22.50 | -22.50         | EUR              | 0.95         | Amazon      | Books   | shopping  | no   | no   | General |
| 2024-12-27 | 3000.00| 3000.00        | CHF              | 1.0          | Salary      | Income  | salary    | no   | no   | General |


