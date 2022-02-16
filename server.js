const express = require("express")
const dotenv = require("dotenv")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./graphql/schema")
const {connectDB} =  require("./db/config")
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const app = express()
dotenv.config() 
connectDB()

app.get('/', (req,res) => {
    res.json({msg: "Welcome! Go to /graphql"})
})


app.get('/api/verify/:id',  async (req,res) => {
  const  token  = req.params.id;
  // Check we have an id
  console.log("token details",token);
  if (!token) {
      return res.status(422).send({ 
           message: "Missing Token" 
      });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null
  try {
      payload = jwt.verify(
         token,
         process.env.USER_VERIFICATION_TOKEN_SECRET
      );
  } catch (err) {
    console.log(err);
      return res.status(500).send(err);
  }
  try{
      // Step 2 - Find user with matching ID
      const user = await User.findOne({ _id: payload.ID }).exec();
      console.log("user=",user)
      if (!user) {
         return res.status(404).send({ 
            message: "User does not  exists" 
         });
      }
      // Step 3 - Update user verification status to true
      user.verified = true;
      await user.save();
      return res.status(200).send({
            message: "Account Verified"
      });
   } catch (err) {
      return res.status(500).send(err);
   }
})

app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  )

app.listen(process.env.PORT , ()=>{
    console.log(`App running on PORT ${process.env.PORT}`)
})