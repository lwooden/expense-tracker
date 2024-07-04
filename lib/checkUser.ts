import { currentUser } from "@clerk/nextjs/server"
import { db } from "./database"

export const checkUser = async () => {
  const user = await currentUser()

  if (!user) {
    return null
  }

  // check if user exists in the database
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  // if user does not exist, create a new user
  if (!loggedInUser) {
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
      },
    })
    console.log("User created!")

    return newUser
  } else {
    console.log("User already exists in the database")
  }

  //   console.log(user)
}
