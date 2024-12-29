//lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT || '',
  headers: {
    'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET || ''
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tours: {
            merge(existing, incoming) {
              return incoming;
            },
            keyArgs: ["where", "order_by"]
          },
          tours_aggregate: {
            merge(existing, incoming) {
              return incoming;
            },
            keyArgs: ["where"]
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});