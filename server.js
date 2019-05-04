const { ApolloServer, AuthenticationError} = require('apollo-server');

const {initGlobalDataSync} = require('./data');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const config = require('./config');

const PORT = process.env.PORT || 4000;
/*
The ApolloServer is started by creating a schema that is
defined by the type definitions (typeDefs), the resolvers that
fetch the data for those types, and the subscriptions definition with
the behavior to execute upon the onConnect event. Authentication to the
API is handled by the function associated with the schema's
context field.
*/

const subscriptions = require('./graphql/subscriptions');

const schema = {
    typeDefs,
    resolvers,
    subscriptions,
    context: ({ req, res }) => {
        if(req){ // queries will come through as a request
            const token = req.headers.authorization || 'NO_TOKEN';
            if(token !== config.ACCESS_TOKEN){
                throw new AuthenticationError('Invalid Access Token');
            }
            console.log(token);
        }

    },};

/*
Initialize the data collections globally by calling initGlobalDataSync()
to load the data into the global environment variables
*/
initGlobalDataSync();

const server = new ApolloServer(schema);

// The server `listen` method launches a web-server and a
// subscription server
server.listen(PORT).then(({ url, subscriptionsUrl }) => {
    process.env.SERVER_CONFIG = JSON.stringify({serverUrl: url, subscriptionsUrl});
    console.log(`Starting servers at ${new Date()}`);
    console.log(`🚀  Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
});

//Export the server to make it available to unit and API tests
module.exports = {server};