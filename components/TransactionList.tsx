import { Transaction } from "@/types/Transaction"
import { getTransactions } from "@/app/actions/transaction.actions"
import TransactionItem from "@/components/TransactionItem"

const TransactionList = async () => {
  const { transactions, error } = await getTransactions()

  if (error) {
    return <p>{error}</p>
  }

  return (
    <>
      <h3>Transaction History</h3>
      <ul className="list">
        {transactions &&
          transactions.map((transaction: Transaction) => (
            // <p key={transaction.id}>{transaction.text}</p>
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
      </ul>
    </>
  )
}

export default TransactionList
