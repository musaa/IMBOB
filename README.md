# IMBOB
A simple GraphQL API for movie information.

## Installation and Start Up

To start the application:

`npm install`

then

`npm start`

or

`node server.js`

If you want to install only dependencies required for a production run, type:

`npm install --production`

## Purpose of Project
This project is a GraphQL API service that's intended to demonstrate the basic concepts and techniques required to publish an API using Apollo Server.

The scenario illustrated by the project is based on an object graph the contains Movies, Actors, Persons. The graph also describes the connections between Persons. 

## Basic Data Types

There are data structures used to create various GraphQL object types. These data structures are
`Movie`, `Person` and `Triple`. As the name implies, `Movie` describes a movie, `Person` describes a person and
`Tripe` describes a connection between two people.

An `Person` and `Actor` are GraphQl types that implements the GrpahQL interface, `Personable`. However, the GraphQL type,
`Actor` has no datastore of its own. A collection of `Actor` types are attached to the data structure, `Movie`. An
`Actor` can be retrieved independent of a `Movie`. Logic internal to the API will extract an `Actor` from a `Movie`
and present one or many accordingly.

## An `Actor` Must Have a `Person` ID

In order to add an `Actor` to a movie, the base data repesenting that actor must exist already as a `Person`.
In other words, in order for an `Actor` to be added to a `Movie`, you must provide the unique identifier, `id` of
 the corresponding `Person` as it exists in the `Persons` collection of the API. Adding an an `Actor` without
 a `Person.id` will throw an error.

![Project Graph](docs/images/basic-graph.png "Project Graph")

The project code shows readers how to implement a GraphQL schema that includes typedefs, resolvers and subscriptions. The API published by this projects supports [Queries and Mutations](https://graphql.org/learn/queries/). Also, the project supports event messaging by way of a subscription server that gets invoked as part of the overall server startup.




## Cheat Sheet

The following queries and mutations are examples that can be executed against this project's API using 

### Introspection

introspection on the API
```graphql
{  __schema {
    types {
      name
      fields {
        name
      }
    }
  }
}
```

### Subscriptions and events

subscription registered at http://localhost:4000/graphql

```graphql
subscription eventAdded{
  eventAdded{
    id
    name
    payload
    createdAt
    storedAt
  }
}
```

mutation executed at http://localhost:4000/ that will create a message that can be intercepted by clients listening at the registered subscription, `eventAdded`.

The mutation, `ping` is a utility mutation that publishes an `Event` message the can be consumed by subscribing to the 
subscription, `eventAdded`
```graphql
mutation{
  ping(payload: "Hi There"){
    createdAt
    payload
    name
    id
  }
}
```

mutation response
```json
{
  "data": {
    "ping": {
      "createdAt": "Wed Feb 13 2019 19:54:00 GMT-0800 (Pacific Standard Time)",
      "payload": "Hi There",
      "name": "PING",
      "id": "0316cd51-abcc-4e1a-94a7-e81a1e0010d6"
    }
  }
}
```

event generated to the subscription and available to listening clients
```json
{
  "data": {
    "eventAdded": {
      "id": "0316cd51-abcc-4e1a-94a7-e81a1e0010d6",
      "name": "PING",
      "payload": "Hi There",
      "createdAt": "Wed Feb 13 2019 19:54:00 GMT-0800 (Pacific Standard Time)",
      "storedAt": "Wed Feb 13 2019 19:54:00 GMT-0800 (Pacific Standard Time)"
    }
  }
}
```
### Simple Mutations

```graphql
mutation{
  addPerson(person: {firstName: "A_FIRST_NAME", lastName: "A_LAST_NAME", dob: "YYYY-MM_DD"}){
    id
    firstName
    lastName
    dob
  }
}
```

```graphql
mutation{
  addMovie({movie: {title: "NOVIE_TITLE", releaseDate: "YYYY-MM-DD"}}){
    id
    title
    releaseDate
  }
}
```

### Queries with Pagination

Paginated Person:
```graphql

{
  person(id:"fee6bad2-7fd2-4bf6-beab-82603062a1ab"){
    firstName
    lastName
    likesConnection(paginationSpec:{first:5}){
      pageInfo{
        endCursor
        hasNextPage
      }
      edges{
        node{
          firstName
          lastName
        }
      }
    }
  }
}
```
Paginated LikesConnection on Persons
```graphql

{persons{
  firstName
  lastName
  likesConnection(paginationSpec:{first:5}){
    pageInfo{
      hasNextPage
      endCursor
    }
    edges{
      node{
        firstName
        lastName
      }
    }
  }
 }
}
```