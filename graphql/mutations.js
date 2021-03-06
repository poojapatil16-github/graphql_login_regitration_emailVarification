const { } = require("./types")

const { User } = require("../models")
const { GraphQLString } = require("graphql")

// const { createJwtToken } = require("../util/auth")
const { sendMail } = require("../util/mail")

const register = {
  type: GraphQLString,
  description: "Register new user",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { username, email, password, displayName } = args
    const user = new User({ username, email, password, displayName })

    await user.save()
    sendMail(user)
    // const token = createJwtToken(user)
    const verificationToken = user.generateVerificationToken();

    console.log("token",verificationToken)
    return "Sent a verification email to " + user.email
  },
}

const login = {
  type: GraphQLString,
  description: "Login user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const user = await User.findOne({ email: args.email }).select("+password")
    console.log(user)
    if (!user || args.password !== user.password) {
      throw new Error("Invalid credentials")
    }
    const token = createJwtToken(user)
    return token
  },
}


module.exports = {
  register,
  login,
}
