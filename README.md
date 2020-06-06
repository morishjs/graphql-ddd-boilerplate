# graphql-ddd-boilerplate

A web application with `express.js`, `Typescript` and `GraphQL` using Domain-Driven Design.

inspired by

- [articles](https://khalilstemmler.com/articles/)
- [my experiences](https://jspark.me/why-do-we-need-a-layered-architecture)

### Features

- **Beautiful Code** thanks to the awesome annotations of the libraries from [pleerock](https://github.com/pleerock).
- **Dependency Injection** done with the nice framework from [TypeDI](https://github.com/pleerock/typedi).
- **Simplified Database Query** with the ORM [TypeORM](https://github.com/typeorm/typeorm).
- **Clear Structure** with domain design driven inspired by [stemmlerjs](https://github.com/stemmlerjs/white-label)
- **Integrated Testing Tool** thanks to [Jest](https://facebook.github.io/jest).
- **Basic Security Features** thanks to [Helmet](https://helmetjs.github.io/).
- **Easy event dispatching** thanks to [ts-events](https://github.com/rogierschouten/ts-events).
- **Fast Database Building** with simple migration from [TypeORM+](https://github.com/iWinston/typeorm-plus).
- **GraphQL** provides as a awesome query language for our api [GraphQL](http://graphql.org/).
- **TypeGraphQL** thanks to [TypeGraphQL](https://19majkel94.github.io/type-graphql/) we have a some cool decorators to simplify the usage of GraphQL.
- **DataLoaders** helps with performance thanks to caching and batching [DataLoaders](https://github.com/facebook/dataloader).

## ❯ Table of Contents

- [Getting Started](#-getting-started)
- [Scripts and Tasks](#-scripts-and-tasks)
- [Project Structure](#-project-structure)
- [Logging](#-logging)
- [Event Dispatching](#-event-dispatching)
- [GraphQL](#-graph-q-l)
- [Docker](#-docker)
- [Related Projects](#-related-projects)
- [License](#-license)

![divider](./w3tec-divider.png)

## ❯ Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

Install yarn globally

```bash
yarn install yarn -g
```

Install a PostgreSQL/MySQL database.

> If you work with a mac, we recommend to use homebrew for the installation.

### Step 2: Create new Project

Fork or download this project. Configure your package.json for your new project.

Then copy the `env/.env` file to root directory. In this file you have to add your database connection information.

Then setup your application environment.

```bash
yarn run setup
```

> This installs all dependencies with yarn. After that it migrates the database and seeds some test data into it. So after that your development environment is ready to use.

### Step 3: Serve your App

Go to the project dir and start your app with this yarn script.

```bash
yarn serve
```

> This starts a local server using `nodemon`, which will watch for any file changes and will restart the sever according to these changes.

## ❯ Scripts and Tasks

All scripts are defined in the `package-scripts.js` file.

### Install

- Install all dependencies with `yarn install`

### Linting

- Run code quality analysis using `yarn lint`. This runs tslint.

### Tests

- Run the unit tests using `yarn test`.

### Running in dev mode

- Run `yarn serve` to start nodemon with ts-node, to serve the app.
- The server address will be displayed to you as `http://0.0.0.0:58080`

### Building the project and run it

- Run `yarn build` to generate all JavaScript files from the TypeScript sources.
- To start the built app located in `dist` use `yarn start`.

### Database Migration

- Run `typeorm migration:create -n <migration-file-name>` to create a new migration file.
- Try `typeorm -h` to see more useful cli commands like generating migration out of your models.
- To migrate your database run `yarn migrate`.
- To revert your latest migration run `yarn revert`.

## ❯ Logging

Our logger is [winston](https://github.com/winstonjs/winston). To log http request we use the express middleware [morgan](https://github.com/expressjs/morgan).
We created a simple annotation to inject the logger in your service (see example below).

```typescript
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class UserService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    ...
```

## ❯ Event Dispatching

We use this awesome repository [ts-events](https://github.com/rogierschouten/ts-events) for event dispatching.

```typescript
public async removeOne(user: User): Promise<void> {
    ...
    user.addDomainEvent(
      UserWithdrawn(),
      {
        userId: user.id.toString(),
      },
      'UserWithdrawn',
    );
...
}

// At a handler (users/events/index.ts)
export const UserWithdrawn: IO<AsyncEvent<IUserWithdrawn>> = () => {
...
  event.once((data: IUserWithdrawn) => {
    console.log(`User (${data.userId}) withdrawn`);
  });
...
}

```

## ❯ GraphQL

For the GraphQL part, we used the library [TypeGraphQL](https://github.com/MichalLytek/type-graphql) to build awesome GraphQL API's.

The context(shown below) of the GraphQL is built in the **graphqlLoader.ts** file. Inside of this loader we create a scoped container for each incoming request.

```typescript
export interface Context {
  requestId: number;
  request: express.Request;
  response: express.Response;
  container: ContainerInstance;
}
```

## ❯ Docker

### Build Docker image

```shell
docker build -t <your-image-name> .
```

#### project .env file

You can use `.env` file in project `env` folder which will be copied inside Docker image.

#### environment file

Last but not least you can pass a config file to `docker run`.

```shell
docker run --env-file ./env/.env
```

## ❯ Further Documentations

| Name & Link                                                         | Description                                                                                                                                                                                                    |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Express](https://expressjs.com/)                                   | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.                                                                    |
| [Microframework](https://github.com/pleerock/microframework)        | Microframework is a simple tool that allows you to execute your modules in a proper order, helping you to organize bootstrap code in your application.                                                         |
| [TypeDI](https://github.com/pleerock/typedi)                        | Dependency Injection for TypeScript.                                                                                                                                                                           |
| [TypeORM](http://typeorm.io/#/)                                     | TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework.                                                                                                                  |
|  [ts-events](https://github.com/rogierschouten/ts-events)           | Dispatching and listening for application events in Typescript                                                                                                                                                 |
|  [Helmet](https://helmetjs.github.io/)                              | Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help!                                                                                          |
|  [Jest](http://facebook.github.io/jest/)                            | Delightful JavaScript Testing Library for unit and e2e tests                                                                                                                                                   |
| [GraphQL Documentation](http://graphql.org/graphql-js/)             | A query language for your API.                                                                                                                                                                                 |
| [DataLoader Documentation](https://github.com/facebook/dataloader)  | DataLoader is a generic utility to be used as part of your application's data fetching layer to provide a consistent API over various backends and reduce requests to those backends via batching and caching. |

## ❯ Related Projects

- [Microsoft/TypeScript-Node-Starter](https://github.com/Microsoft/TypeScript-Node-Starter) - A starter template for TypeScript and Node with a detailed README describing how to use the two together.
- [express-graphql-typescript-boilerplate](https://github.com/w3tecch/express-graphql-typescript-boilerplate) - A starter kit for building amazing GraphQL API's with TypeScript and express by @w3tecch
- [white-label](https://github.com/stemmlerjs/white-label)
