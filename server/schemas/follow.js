const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");

const COLLECTION_NAME = "follow"

const typeDefs = `#graphql
    type Follow {
        _id: ID!
        followingId: ID!
        followerId: ID!
        createdAt: String!
        updatedAt: String!
    }
    
    type Query {
        follows: [Follow]
    }

    type Mutation {
        addFollow(followingId: ID): Follow
    }
`;

const resolvers = {
    Query: {
        follows: () => follows,
    },

    Mutation: {
        addFollow: async (_, args, contextValue) => {
            try {
                const { followingId } = args
                const { db, authentication } = contextValue
                

                const isLogin = await authentication()
                if (!isLogin) {
                    throw new GraphQLError("Invalid token!", {
                        extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }
                    })
                }

                const follows = await db.collection(COLLECTION_NAME)
                const insertedFollow = await follows.insertOne({
                    followingId: new ObjectId(followingId),
                    followerId: new ObjectId(isLogin._id),
                    createdAt: new Date(),
                    updatedAt: new Date() 
                })

                return {
                    _id: insertedFollow.insertedId,
                    followingId: new ObjectId(followingId),
                    followerId: new ObjectId(isLogin._id),
                    createdAt: new Date(),
                    updatedAt: new Date() 
                }
            } catch (error) {
                throw (error)
            }
        }
    }

};

module.exports = {
    typeDefs,
    resolvers,
};
