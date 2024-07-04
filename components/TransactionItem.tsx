"use client"
import { Transaction } from "@/types/Transaction"
import { addCommas } from "@/lib/utils"
import { toast } from "react-toastify"
import { deleteTransaction } from "@/app/actions/transaction.actions"

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const sign = transaction.amount < 0 ? "-" : "+" // determine if the transaction is a deposit or withdrawal dynamically

  const handleTransactionDelete = async (transactionId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    )

    if (!confirmed) return

    const { message, error } = await deleteTransaction(transactionId)

    if (error) {
      toast.error(error)
      return
    }
    toast.success(message)
    console.log(transactionId)
  }

  return (
    <li className={transaction.amount < 0 ? "minus" : "plus"}>
      {transaction.text}
      <span>
        {/* {transaction.amount < 0 ? "-" : "+"}$ */}
        {sign}
        {addCommas(Math.abs(transaction.amount))}
      </span>
      <button
        className="delete-btn"
        onClick={() => handleTransactionDelete(transaction.id)}
      >
        x
      </button>
    </li>
  )
}

export default TransactionItem
