if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const client = require('./config/mongoConfig')
const { GraphQLError } = require('graphql')
const { verifyToken } = require('./helpers/jwt')
const redis = require('./config/redis')

const {
    typeDefs: userTypeDefs,
    resolvers: userResolvers,
} = require('./schemas/user')

const {
    typeDefs: postTypeDefs,
    resolvers: postResolvers,
} = require('./schemas/post')

const {
    typeDefs: followTypeDefs,
    resolvers: followResolvers,
} = require('./schemas/follow')


const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolvers],
    introspection: true
});

(async () => {
    try {
        const db = client.db("youtube")

        const { url } = await startStandaloneServer(server, {
            listen: { port: 3000},
            context: async ({req, res}) => {
                return {
                    authentication: async () => {
                        const accessToken = req.headers.authorization

                        if(!accessToken) {
                            throw new GraphQLError("Invalid token!", {
                                extensions : {code : "UNAUTHENTICATED"}
                            })
                        }

                        if(accessToken.slice(0, 7) !== "Bearer ") {
                            throw new GraphQLError("Invalid token!", {
                                extensions : {code : "UNAUTHENTICATED"}
                            })
                        }

                        const token = accessToken.slice(7)

                        const payload = verifyToken(token)
                        const user = await db.collection("users").findOne({username : payload.username})
                        if(!user) {
                            throw new GraphQLError("Please Login!", {
                                extensions : {code : "UNAUTHENTICATED"}
                            })
                        }

                        return {
                            _id : payload._id,
                            username : payload.username
                            // authentication
                            // authorization
                        };
                    },
                    db,
                    redis
                };
            },
        });
        console.log(`🚀  Server ready at: ${url}`);
    } catch (error) {
        console.log(error)
    }
})()



