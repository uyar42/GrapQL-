import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { events, locations, users, participants } from "./data.js";

const typeDefs = `#graphql

type Event {
id:ID!
title:String!
desc:String!
date:String!
from:String!
to:String!
location:Location!
location_id:Int!
user:User!
user_id:ID!
participants:[Participants!]!
}

type Location{
id:ID!
name:String!
desc:String!
lat:Float!
lng:Float!
}

type User{
id:ID!
username:String!
email:String!
events:[Event!]!
}

type Participants{
  id:ID!
  user_id:ID!
  event_id:ID!
}

type Query {
    event(id:ID!) : Event!
    events : [Event!]!
    locations : [Location!]!
    location(id:ID!) : Location!
    users : [User!]!
    user(id:ID!) : User!
    participants : [Participants!]!
    participant(id:ID!) : Participants!

  }
`;

const resolvers = {
  Query: {
    event: (parent, args) => {
      let _id = Number(args.id);
      return events.find((event) => event.id === _id);
    },
    events: () => events,
    locations: () => locations,
    location: (parent, args) => {
      let _id = Number(args.id);
      return locations.find((location) => location.id === _id);
    },
    users: () => users,
    user: (parent, args) => {
      let _id = Number(args.id);
      return users.find((user) => user.id === _id);
    },
    participants: () => participants,
    participant: (parent, args) => {
      let _id = Number(args.id);
      return participants.find((participant) => participant.id === _id);
    },
  },
  User: {
    events: (parent, args) => {
      return events.filter((event) => event.user_id === parent.id);
    },
  },
  Event: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    location: (parent) =>
      locations.find((location) => location.id === parent.user_id),
    participants: (parent) =>
      participants.filter((participant) => participant.event_id === parent.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
