"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/database"

export async function getUserBalance(): Promise<{
  balance?: number
  error?: string
}> {
  const { userId } = auth()

  if (!userId) {
    return { error: "User not found" }
  }

  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId,
      },
    })

    const balance = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    )

    return { balance }
  } catch (error) {
    return { error: "Error fetching balance" }
  }
}

export async function getIncomeAndExpenses(): Promise<{
  income?: number
  expense?: number
  error?: string
}> {
  const { userId } = auth()

  if (!userId) {
    return { error: "User not found" }
  }

  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId,
      },
    })

    const amount = transactions.map((transaction) => transaction.amount)

    const income = amount
      .filter((item) => item > 0)
      .reduce((sum, item) => (sum += item), 0)

    const expense = amount
      .filter((item) => item < 0)
      .reduce((sum, item) => (sum += item), 0)

    return { income, expense: Math.abs(expense) }
  } catch (error) {
    return { error: "Error income and expenses" }
  }
}
