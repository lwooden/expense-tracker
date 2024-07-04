import { getUserBalance } from "@/app/actions/balance.actions"
import { addCommas } from "@/lib/utils"

const Balance = async () => {
  const { balance } = await getUserBalance()
  return (
    <>
      <br />
      <h4>Your Balance</h4>
      <h2>${addCommas(Number(balance?.toFixed(2) ?? 0))}</h2>
      {/* nullish caolescing operator - if the balance returns null, it will return 0 by default */}
    </>
  )
}

export default Balance
