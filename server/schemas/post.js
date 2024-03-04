const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");
const redis = require("../config/redis");

const COLLECTION_NAME = "posts";

const typeDefs = `#graphql
  type Post {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String!
    authorId: ID!
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  type PostIncludeUser {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String!
    authorId: ID!
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    user: [User]
  }

  type Like {
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    content: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  input NewPost {
    content: String!
    tags: [String]
    imgUrl: String!
  }

  type Query {
    posts: [Post]
    postsById(postId: ID) : Post
    postIncludeUser: [PostIncludeUser]
    postByIdIncludeUser(postId: ID): PostIncludeUser
  }

  type Mutation {
    addPost(newPost: NewPost): Post
    addComments(postId: ID, newComments: String): Comment
    addLikes(postId: ID) : Like
  }
`;

const resolvers = {
  Query: {
    posts: async (_, __, contextValue) => {
      try {
        const { db, authentication, redis } = contextValue
        const dataFromRedis = await redis.get(COLLECTION_NAME)

        if (dataFromRedis) {
          console.log('Data dari Redis Cache')
          return JSON.parse(dataFromRedis)
        }

        const isLogin = await authentication()
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
          })
        }

        const posts = await db.collection(COLLECTION_NAME).find().sort({ createdAt: -1, }).toArray()
        await redis.set(COLLECTION_NAME, JSON.stringify(posts))

        return posts
      } catch (error) {
        throw error
      }
    },

    postsById: async (_, args, contextValue) => {
      try {
        const { db, authentication, redis } = contextValue
        const {postId} = args

        const isLogin = await authentication()
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
          })
        }

        const posts = await db.collection(COLLECTION_NAME).findOne({_id : new ObjectId(postId)})

        return posts
      } catch (error) {
        throw error
      }
    },

    postIncludeUser: async (_, __, contextValue) => {
      try {
        const { db, authentication, redis } = contextValue
        const dataFromRedis = await redis.get(COLLECTION_NAME)

        if (dataFromRedis) {
          // console.log('Data dari Redis Cache')
          return JSON.parse(dataFromRedis)
        }

        const isLogin = await authentication()
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
          })
        }

        const posts = await db.collection(COLLECTION_NAME).aggregate([
          {
              '$lookup': {
                'from': 'users', 
                'localField': 'authorId', 
                'foreignField': '_id', 
                'as': 'user'
              },
          }
      ]).sort({ createdAt: -1, }).toArray()
        await redis.set(COLLECTION_NAME, JSON.stringify(posts))
        // console.log('Data dari MongoDB')

        return posts
      } catch (error) {
        throw error
      }
    },

    postByIdIncludeUser: async (_, args, contextValue) => {
      try {
        const { db, authentication, redis } = contextValue
        const {postId} = args

        const isLogin = await authentication()
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
          })
        }

        const posts = await db.collection(COLLECTION_NAME).aggregate([
          {
            $match: {
              _id: new ObjectId(postId),
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'authorId',
              foreignField: '_id',
              as: 'user',
            },
          },
        ])
        return posts
      } catch (error) {
        throw error
      }
    },
  },

  Mutation: {
    addPost: async (_, args, contextValue) => {
      try {
        const { newPost } = args;
        const { db, authentication } = contextValue;

        const isLogin = await authentication()
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
          })
        }

        if(newPost.content.length === 0) {
          throw new GraphQLError("Content is required", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
          })
        }

        const userId = isLogin._id

        const post = await db.collection(COLLECTION_NAME)
        const insertedPost = await post.insertOne({
          ...newPost,
          authorId: new ObjectId(userId),
          comments: [],
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date()
        })

        await redis.del(COLLECTION_NAME)

        return {
          ...newPost,
          _id: insertedPost.insertedId,
          authorId: new ObjectId(userId),
          comments: [],
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      } catch (error) {
        throw (error)
      }
    },


    addComments: async (_, args, contextValue) => {
      try {
        const { postId, newComments } = args
        const { db } = contextValue

        const isLogin = await contextValue.authentication()
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
          })
        }

        if(newComments.length === 0) {
          throw new GraphQLError("Content is required", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
          })
        }

        await db.collection(COLLECTION_NAME).updateOne(
          { _id: new ObjectId(postId) },
          {
            $push: {
              comments: {
                content: newComments,
                username: isLogin.username,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            }
          }
        );
          
        return {
          _id: new ObjectId(postId),
          content: newComments,
          username: isLogin.username,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      } catch (error) {
        throw error
      }
    },

    addLikes: async(_, args, contextValue) => {
      try {
        const {postId} = args
        const {db} = contextValue

        const isLogin = await contextValue.authentication()
        // console.log(isLogin.username)
        if (!isLogin) {
          throw new GraphQLError("Invalid token!", {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
          })
        }

        const post = await db.collection(COLLECTION_NAME).findOne({_id: new ObjectId(postId), 'likes.username' : isLogin.username });
        
        if (!post) {
          await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(postId) },
            {
              $push: {
                likes: {
                  username: isLogin.username,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              }
            }
          );
            
          return {
            _id: new ObjectId(postId),
            username: isLogin.username,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
        
      } catch (error) {
        throw error
      }
    }
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
