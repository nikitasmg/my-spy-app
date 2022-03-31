import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {ApolloClient, InMemoryCache,ApolloProvider,split, HttpLink } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import {WebSocketLink} from "@apollo/client/link/ws";

const httpLink = new HttpLink({
    uri: 'http://192.168.2.16:4000/graphql'
});

const wsLink = new WebSocketLink({
    uri:'ws://192.168.2.16:4000/graphql',
    options: {
        reconnect:true
    }
})

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);


const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});
ReactDOM.render(
    <ApolloProvider client={client}>
                <App />
    </ApolloProvider>,

  document.getElementById('root')
);

