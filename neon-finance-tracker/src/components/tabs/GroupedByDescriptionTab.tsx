"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/utils/csvParser"
import { isWithinInterval, parse } from "date-fns"

interface GroupedByDescriptionTabProps {
  transactions: Transaction[]
  dateRange: { from: Date | undefined; to: Date | undefined }
}

export default function GroupedByDescriptionTab({ transactions, dateRange }: GroupedByDescriptionTabProps) {
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null)

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parse(transaction.Date, "yyyy-MM-dd", new Date())
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to })
      }
      return true
    })
  }, [transactions, dateRange.from, dateRange.to])

  const groupedByDescription = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const description = transaction.Description
        if (!acc[description]) {
          acc[description] = []
        }
        acc[description].push(transaction)
        return acc
      },
      {} as Record<string, Transaction[]>,
    )
  }, [filteredTransactions])

  const descriptionOptions = useMemo(() => {
    return Object.keys(groupedByDescription).sort()
  }, [groupedByDescription])

  const selectedTransactions = selectedDescription ? groupedByDescription[selectedDescription] : []
  const selectedTotal = selectedTransactions.reduce((sum, t) => sum + t.Amount, 0)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Transactions by Description</CardTitle>
          <CardDescription>Select a description to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Select value={selectedDescription || ""} onValueChange={(value) => setSelectedDescription(value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a description" />
              </SelectTrigger>
              <SelectContent>
                {descriptionOptions.map((option) => {
                  const transactions = groupedByDescription[option]
                  const total = transactions.reduce((sum, t) => sum + t.Amount, 0)
                  return (
                    <SelectItem key={option} value={option}>
                      <div className="flex justify-between items-center w-full">
                        <span className="truncate mr-2">{option}</span>
                        <span
                          className={`font-semibold ${total >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {total.toFixed(2)}.-
                        </span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSelectedDescription(null)}>
              Clear Selection
            </Button>
          </div>
          {selectedDescription ? (
            <div>
              <h3 className="text-xl font-bold mb-2">{selectedDescription}</h3>
              <p className="font-semibold mb-2">Total: {selectedTotal.toFixed(2)}.-</p>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTransactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.Date}</TableCell>
                        <TableCell
                          className={
                            transaction.Amount >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {transaction.Amount.toFixed(2)}.-
                        </TableCell>
                        <TableCell>{transaction.Category || "Uncategorized"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          ) : (
            <p>Please select a description to view details.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Description Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(groupedByDescription).map(([description, transactions]) => {
                const total = transactions.reduce((sum, t) => sum + t.Amount, 0)
                return (
                  <div key={description} className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <span className="font-medium truncate mr-2">{description}</span>
                    <span
                      className={`font-semibold ${total >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {total.toFixed(2)}.-
                    </span>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

