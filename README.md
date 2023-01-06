# Little experiment using neo4j to power a twitter like backend database

author: Dalton Oliveira

## Install dependencies

```bash
yarn
```

## Development

```bash
yarn start
```

[nodemon](https://www.npmjs.com/package/nodemon) restarts the application upon any file change in `.env` or `src/*` files. This is useful as it can speed up development process.

## Linting

```bash
yarn lint
```

## Test

```bash
yarn test
```

## Setup

Go to https://neo4j.com/cloud/platform/aura-graph-database/?ref=get-started-dropdown-cta and create a free databse to you. It will be given an url with user and password. Copy `.env.local` to `.env` and fill those fields with corresponding values. Then run the script `npx ts-node src/scripts/loadUsers.ts`

## Planning

A feature reply-to-post is a relation that would looks like this:
`(author:User)-[:REPLIES]->(p:Post)` and thus won't show on the existing list/listAll/listFollowing endpoints. No much change is required besides mapping this new endpoint and code the query:

```cypher
MATCH (author:User)-[reply:REPLIES]->(p:Post)
OPTIONAL MATCH (p)-[:QUOTES]->(quoted:Post)<-[:POSTS]-(quotedUser:User)
RETURN author, p, reply, quoted, quotedUser
ORDER BY p.createdAt DESC SKIP $skip LIMIT 10
```

This is how it will be crested

```cypher
MATCH (author:User { username: $username }), (p:Post { id: $postId })
CREATE author-[:REPLIES {text: $text, createdAt: datetime()}]->(p)
```

## Critique

There's some important missing tests and `express-validator` is not so easy to test with jest. I'd need more time to elaborate better this validation chain pattern. It's also lacking a full integration test with a working database to be queried. These tests could acelerate further development.

I'm not completely sure that all indexes to have performant database were created. Having more time I would create a stress scenario to validate the response times.

The project is missing logs and on a real product I'd integrate it with a log analysis tool such as datadog or sentry.

I'm unsure what needs to be done to make it more scalable. Neo4j sells itself as a high performant database that can handle a petabyte scale. It was my first attempt do build somethis with it and I really enjoyed it.

I hadn't used a proper pattern for authorization and I did it just for sake of brevity to manually test. On a real application I'd do some research to check if jwt is still the best to use or if there are better ways of doing it.

On a production backend I'd also start it with pm2 for process monitoring.
