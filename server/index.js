const { PubSub } = require('graphql-subscriptions')
const { makeExecutableSchema } = require('@graphql-tools/schema') ;
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core') ;
const { ApolloServer, gql } = require('apollo-server-express') ;
const express = require('express') ;
const { execute, subscribe } = require('graphql') ;
const { buildContext, createOnConnect } = require('graphql-passport') ;
const { createServer } = require('http') ;
const { SubscriptionServer } = require('subscriptions-transport-ws') ;

const rooms = [{
    id:'123',
    title:'Test Room',
    createdBy:'Nikita',
    players:[
        {
            id:'333',
            username:'Nikita'
        }
    ]
}]

const pubsub = new PubSub();

const typeDefs = gql`
    type Player {
        id:ID
        username:String!
    }
    type Room {
        id:ID
        title:String
        createdBy:String
        players:[Player]
    }
    input RoomInput {
        title: String
        createdBy: String
    }
    input PlayerInput {
        username:String
    }

    type Subscription {
        roomCreated:Room
        playerCreated:Player
    }

    type Query {
        rooms: [Room]
        oneRoom(id:ID): Room
    }

    type Mutation {
        createRoom(input:RoomInput!): Room!
        createPlayer(input:PlayerInput!):Player
    }
`;


// Resolver map
const resolvers = {
    Query: {
        rooms: () => rooms,
        oneRoom: (id) => rooms.find(room => room.id === id)
    },
    Mutation: {
            async createRoom(_, {input: {title,createdBy}}) {
                const room = {
                    id:Date.now().toString(),
                    title:title,
                    createdBy: createdBy,
                    players:[]
                }
                rooms.push(room)
                await pubsub.publish('ROOM_CREATED', {
                        roomCreated: {
                            ...room
                        }
                    }
                )
                return room
        },
    },
    Subscription: {
        roomCreated: {
            subscribe: () => pubsub.asyncIterator('ROOM_CREATED')
        }
    }
};


const startServer = async () => {
    const app = express();

    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground({ settings: { 'request.credentials': 'include' } })],
        context: ({ req, res }) => buildContext({ req, res }),
    });

    const httpServer = createServer(app);
    const subscriptionServer = SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
            onConnect: () => {
                console.log('connecting')
            },
        },
        {
            server: httpServer,
            path: server.graphqlPath,
        },
    );

    // Shut down in the case of interrupt and termination signals
    // We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, async () => {
            subscriptionServer.close();
            await server.stop();
            console.log('Server closed');
            process.exit(0);
        });
    });

    await server.start();

    server.applyMiddleware({ app });

    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
    });
};

startServer().then(r => console.log(r));