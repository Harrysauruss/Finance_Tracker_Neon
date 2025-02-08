"use client"

import { useState } from "react"
import { parseCSV, type Transaction, type ParsedCSVResult } from "../utils/csvParser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { ThemeSwitcher } from "@/components/theme-switcher"
import OverviewTab from "@/components/tabs/OverviewTab"
import TransactionsTab from "@/components/tabs/TransactionsTab"
import GroupedByCategoryTab from "@/components/tabs/GroupedByCategoryTab"
import GroupedByDescriptionTab from "@/components/tabs/GroupedByDescriptionTab"

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isDropdownOpen] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const result: ParsedCSVResult = await parseCSV(file)
      setTransactions(result.transactions)
      setDateRange({
        from: result.earliestDate,
        to: result.latestDate,
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Banking Dashboard</h1>
        <ThemeSwitcher />
      </div>
      <div className="mb-4">
        <Label htmlFor="csv-upload">Upload CSV</Label>
        <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      <div className="mb-4">
        <Label>Select Date Range</Label>
        <DatePickerWithRange 
          date={dateRange} 
          setDate={setDateRange} 
        />
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full flex flex-wrap justify-start gap-1">
          <TabsTrigger value="overview" className="flex-grow basis-auto sm:flex-grow-0">
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex-grow basis-auto sm:flex-grow-0">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="groupedByCategory" className="flex-grow basis-auto sm:flex-grow-0">
            By Category
          </TabsTrigger>
          <TabsTrigger value="groupedByDescription" className="flex-grow basis-auto sm:flex-grow-0">
            By Description
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab transactions={transactions} dateRange={dateRange} isDropdownOpen={isDropdownOpen} />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionsTab transactions={transactions} dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="groupedByCategory">
          <GroupedByCategoryTab transactions={transactions} dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="groupedByDescription">
          <GroupedByDescriptionTab transactions={transactions} dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

