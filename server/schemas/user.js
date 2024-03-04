const { ObjectId } = require("mongodb");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { GraphQLError } = require("graphql");
const { signToken } = require("../helpers/jwt");

const COLLECTION_NAME = "users"

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String!
    username: String! 
    email: String! 
    password: String! 
  }

  type UserDetails {
    _id: ID
    name: String!
    username: String! 
    email: String! 
    password: String! 
    following: [User] 
    followers: [User]
  }

  input NewUser {
    name: String!
    username: String! 
    email: String! 
    password: String! 
  }

  type Token {
    accessToken: String
  }

  type Query {
    users: [User]
    userLogin(username: String, password: String): User
    searchUser(search: String): [User]
    getUserById: [UserDetails] 
    getUserByIdSearch(userId: ID): [UserDetails]

  }

  type Mutation {
    addUser(newUser: NewUser) : User
    userLogin(username: String!, password: String!) : Token
  }
`;

const resolvers = {
  Query: {
    getUserById: async (_, args, contextValue) => {
      try {
        const { db, authentication } = contextValue
        const { userId } = args

        const isLogin = await authentication()
        console.log(isLogin)
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
          })
        }

        const userById = await db.collection(COLLECTION_NAME).aggregate([
          {
            '$match': {
              '_id': new ObjectId(isLogin._id)
            }
          }, {
            '$lookup': {
              'from': 'follow',
              'localField': '_id',
              'foreignField': 'followerId',
              'as': 'following'
            }
          }, {
            '$lookup': {
              'from': 'users',
              'localField': 'following.followerId',
              'foreignField': '_id',
              'as': 'following'
            }
          }, {
            '$lookup': {
              'from': 'users',
              'localField': '_id',
              'foreignField': 'followingId',
              'as': 'followers'
            }
          }, {
            '$lookup': {
              'from': 'users',
              'localField': '_id',
              'foreignField': 'followers.followingId',
              'as': 'followers'
            }
          }
        ]).toArray()
        return userById
      } catch (error) {
        throw error
      }
    },

    getUserByIdSearch: async (_, args, contextValue) => {
      try {
        const { db, authentication } = contextValue
        const { userId } = args

        const isLogin = await authentication()
        console.log(isLogin)
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
          })
        }

        const userById = await db.collection(COLLECTION_NAME).aggregate([
          {
            '$match': {
              '_id': new ObjectId(userId)
            }
          }, {
            '$lookup': {
              'from': 'follow',
              'localField': '_id',
              'foreignField': 'followerId',
              'as': 'following'
            }
          }, {
            '$lookup': {
              'from': 'users',
              'localField': 'following.followerId',
              'foreignField': '_id',
              'as': 'following'
            }
          }, {
            '$lookup': {
              'from': 'users',
              'localField': '_id',
              'foreignField': 'followingId',
              'as': 'followers'
            }
          }, {
            '$lookup': {
              'from': 'users',
              'localField': '_id',
              'foreignField': 'followers.followingId',
              'as': 'followers'
            }
          }
        ]).toArray()
        return userById
      } catch (error) {
        throw error
      }
    },

    searchUser: async (_, args, contextValue) => {
      const { db, authentication } = contextValue
      const { search } = args
      const searchQuery = new RegExp(search, 'i')
      try {
        const isLogin = await authentication()
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
          })
        }

        let user;
        if (search) {
          user = await db.collection(COLLECTION_NAME).find({ username: { $regex: searchQuery } }).toArray()

          if (!user.length) {
            user = await db.collection(COLLECTION_NAME).find({ name: { $regex: searchQuery } }).toArray()
          }

          if (!user.length) {
            throw new GraphQLError("users not found", {
              extensions: { code: "Not found", http: { status: 404 } }
            })
          }
          return user
        }
      } catch (error) {
        throw error
      }
    },
  },

  Mutation: {
    addUser: async (_, args, contextValue) => {
      const { newUser } = args
      const { db } = contextValue

      try {
        if (newUser.username.length === 0 || newUser.email.length === 0 || newUser.password.length < 5) {
          throw new GraphQLError("Fields cannot be empty or Password must be at least 5 characters long!", {
            extensions: { code: "BAD_REQUEST" }
          })
        }

        const usersUsernameUniq = await db.collection(COLLECTION_NAME).findOne({ username: newUser.username })
        if (usersUsernameUniq) {
          throw new GraphQLError("Username already registered", {
            extensions: { code: "BAD_REQUEST" }
          })
        }

        const usersEmailUniq = await db.collection(COLLECTION_NAME).findOne({ email: newUser.email })
        if (usersEmailUniq) {
          throw new GraphQLError("Email already registered", {
            extensions: { code: "BAD_REQUEST" }
          })
        }

        const users = await db.collection(COLLECTION_NAME)
        const insertedUser = await users.insertOne({
          ...newUser,
          password: hashPassword(newUser.password),
        })

        return {
          ...newUser,
          _id: insertedUser.insertedId
        }
      } catch (error) {
        throw error
      }
    },

    userLogin: async (_, args, contextValue) => {
      const { username, password } = args
      const { db } = contextValue

      try {
        if (username.length === 0 || password.length === 0) {
          throw new GraphQLError("Fields is required", {
            extensions: { code: "BAD_REQUEST" }
          })
        }

        const user = await db.collection(COLLECTION_NAME).findOne({ username })
        if (!user) {
          throw new GraphQLError("Invalid username!", {
            extensions: { code: "UNAUTHENTICATED" }
          })
        }

        const isValidPassword = comparePassword(password, user.password)
        if (!isValidPassword) {
          throw new GraphQLError("Password salah!", {
            extensions: { code: "UNAUTHENTICATED" }
          })
        }

        const token = signToken({
          _id: user._id,
          username: username
        })

        return {
          accessToken: token
        }

      } catch (error) {
        throw error
      }
    },
  }
};

module.exports = {
  typeDefs,
  resolvers
}