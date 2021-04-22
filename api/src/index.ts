import "reflect-metadata";
import * as mongoose from "mongoose";
import { ApolloServer, makeExecutableSchema } from "apollo-server";
import { buildSchema } from "type-graphql";
import { mergeResolvers, mergeTypeDefs, mergeSchemas } from "graphql-toolkit";
import UserResolver from "./modules/user/UserResolver";
import { authChecker } from "./modules/user/authChecker";
import { setUpAccounts } from "./modules/user/accounts";
import { TypegooseMiddleware } from "./middleware/typegoose";
(async () => {
  const connectionString = `mongodb://${process.env.MONGO_HOST}:27017/${process.env.DB_NAME}`;

  const mongooseConnection = await mongoose.connect(connectionString, {
    useNewUrlParser: true
  });
  const { accountsGraphQL, accountsServer } = setUpAccounts(
    mongooseConnection.connection
  );

  const typeGraphqlSchema = await buildSchema({
    resolvers: [UserResolver],
    globalMiddlewares: [TypegooseMiddleware],
    validate: false,
    emitSchemaFile: true,
    authChecker
  });

  const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([accountsGraphQL.typeDefs]),
    resolvers: mergeResolvers([accountsGraphQL.resolvers]),
    schemaDirectives: {
      ...accountsGraphQL.schemaDirectives
    }
  });

  const server = new ApolloServer({
    schema: mergeSchemas({
      schemas: [schema, typeGraphqlSchema]
    }),
    context: accountsGraphQL.context,
    formatError: error => {
      console.error(error);
      return error;
    },
    playground: true
  });

  await server.listen({ port: process.env.SERVER_PORT });
  console.log(`🚀 Server ready at localhost:${process.env.SERVER_PORT}`);
})();
