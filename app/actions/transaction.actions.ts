"use server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { Transaction } from "@/types/Transaction"

interface TransactionData {
  text: string
  amount: number
}

interface TransactionResult {
  data?: TransactionData
  error?: string
}

export async function getTransactions(): Promise<{
  transactions?: Transaction[]
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
      orderBy: {
        createdAt: "desc",
      },
    })

    return { transactions }
  } catch (error) {
    return { error: "Error fetching transactions" }
  }
}

export async function deleteTransaction(transactionId: string): Promise<{
  message?: string
  error?: string
}> {
  const { userId } = auth()

  if (!userId) {
    return { error: "User not found" }
  }

  try {
    await db.transaction.delete({
      where: {
        id: transactionId,
        userId,
      },
    })

    revalidatePath("/")
    return { message: "Transaction successfully deleted!" }
  } catch (error) {
    return { error: "Error deleting transaction" }
  }
}

// we will use async await to call this function from the component; it will return a promise of type TransactionResult
export async function addTransaction(
  formData: FormData
): Promise<TransactionResult> {
  const text = formData.get("text") as string
  const amount = Number(formData.get("amount"))

  if (!text || !amount) {
    return { error: "Please provide a text and amount" }
  }

  // get logged in user using clerk's auth() function
  const { userId } = auth()
  console.log("User saving transaction => ", userId)

  // check for a user
  if (!userId) {
    return { error: "User not found" }
  }

  try {
    const transactionData: TransactionData = await db.transaction.create({
      data: {
        text,
        amount,
        userId,
      },
    })

    revalidatePath("/")
    return { data: transactionData }
  } catch (error) {
    return { error: "Transaction not added. Something went wrong!" }
  }
}
