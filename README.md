# medium-react-typescript-mongo-example

A project skeleton consisting of a React front-end, Node/TypeScript back-end, and MongoDB database. The point of this exercise is to illustrate how docker and docker-compose can orchestrate all of these pieces of the tech stack (services) together.

## Starting the Front-end

Open a terminal and follow these steps:

```
cd client
yarn install
yarn start
```

This will install all the necessary dependencies for the `client` front-end project and start it up. The app will load up using `parcel`.

## Starting the API

In a separate tab in your terminal, execute the following commands:

```
cd api
yarn install
yarn watch
```

This will install all the necessary dependencies and start the node application using `ts-node` and `nodemon`.
