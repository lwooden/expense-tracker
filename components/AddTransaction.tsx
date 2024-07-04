"use client"
import { addTransaction } from "@/app/actions/transaction.actions"
import { toast } from "react-toastify"
import { useRef } from "react"

const AddTransaction = () => {
  const formRef = useRef<HTMLFormElement>(null) // clear the form after submission
  const clientAction = async (formData: FormData) => {
    // console.log(formData.get("text"), formData.get("amount"))
    const { data, error } = await addTransaction(formData)

    if (error) {
      toast.error(error)
    } else {
      toast.success("Transaction added!")
      console.log(data)
      // clear the form after submission
      formRef.current?.reset()
    }
  }

  return (
    <>
      <h3>Add New Transaction</h3>
      <form ref={formRef} action={clientAction}>
        <div className="form-control">
          <label htmlFor="text">Text</label>
          <input
            type="text"
            id="text"
            name="text"
            placeholder="Enter text..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">
            Amount <br />
            (negative - expense, positive - income){" "}
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="Enter amount..."
            step="0.01" // allows for decimal numbers
          />
        </div>
        <div className="button">
          <button className="btn">Add transaction</button>
        </div>
      </form>
    </>
  )
}

export default AddTransaction
