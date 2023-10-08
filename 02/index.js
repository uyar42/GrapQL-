import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v4 as uuidv4 } from "uuid";
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

input CreateEventInput {
  title:String!,desc:String!,date:String!,from:String!,to:String!,   location_id: ID!,
        user_id: ID!,
}

input UpdateEventInput {
  title:String!,desc:String!
}

type DeleteAllOutput{
  count:Int!
}

type Location{
id:ID!
name:String!
desc:String!
lat:Float!
lng:Float!
}

input CreateLocationInput{
  name:String!,desc:String!,lat:Float!,lng:Float!
}

input UpdateLocationInput{
  name:String!,desc:String!
}


type User{
id:ID!
username:String!
email:String!
events:[Event!]!
}

input CreateUserInput {
  username:String!,email:String!
}

input UpdateUserInput{
  username:String!,email:String!
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



type Mutation {
  createUser(data:CreateUserInput!):User!
  updateUser(id:ID!,data:UpdateUserInput!):User!
  deleteUser(id:ID!):User!
  deleteAllUsers:DeleteAllOutput!

  createEvent(data:CreateEventInput!):Event!
  updateEvent(id:ID!,data:UpdateEventInput!):Event!
  deleteEvent(id:ID!):Event!
  deleteAllEvents:DeleteAllOutput!


  createLocation(data:CreateLocationInput!):Location!
  updateLocation(id:ID!,data:UpdateLocationInput!):Location!
  deleteLocation(id:ID!):Location!
  deleteAllLocations:DeleteAllOutput!

}



`;

const resolvers = {
  Mutation: {
    //User
    createUser: (parent, { data }) => {
      const user = { id: uuidv4(), ...data };
      users.push(user);
      return user;
    },
    updateUser: (parent, { id, data }) => {
      const user_index = users.findIndex((user) => user.id == id);

      if (user_index === -1) throw new Error("User not found");

      const updated_user = (users[user_index] = {
        ...users[user_index],
        ...data,
      });

      return updated_user;
    },
    deleteUser: (parent, { id }) => {
      const user_index = users.findIndex((user) => user.id == id);

      if (user_index === -1) throw new Error("User not found");

      const deleted_user = users[user_index];
      users.splice(user_index, 1);
      return deleted_user;
    },
    deleteAllUsers: () => {
      const length = users.length;

      users.splice(0, length);

      return {
        count: length,
      };
    },
    //Event
    createEvent: (parent, { data }) => {
      const event = {
        id: uuidv4(),
        ...data,
      };
      events.push(event);
      return event;
    },
    updateEvent: (parent, { id, data }) => {
      const event_index = events.findIndex((event) => event.id == id);

      // console.log(event_index);
      if (event_index === -1) throw new Error("Event not found");

      const updated_event = (events[event_index] = {
        ...events[event_index],
        ...data,
      });

      return updated_event;
    },
    deleteEvent: (parent, { id }) => {
      const event_index = events.findIndex((event) => event.id == id);
      console.log(event_index);
      if (event_index === -1) throw new Error("Event not found");

      const deleted_event = events[event_index];
      events.splice(event_index, 1);
      return deleted_event;
    },
    deleteAllEvents: () => {
      const length = events.length;
      events.splice(0, length);

      return {
        count: length,
      };
    },
    //Location
    createLocation: (parent, { data }) => {
      const location = { id: uuidv4(), ...data };
      locations.push(location);
      return location;
    },
    updateLocation: (parent, { id, data }) => {
      const location_index = locations.findIndex(
        (location) => location.id == id
      );
      if (location_index === -1) throw new Error("Location not found");

      const updated_location = (locations[location_index] = {
        ...locations[location_index],
        ...data,
      });

      return updated_location;
    },
    deleteLocation: (parent, { id }) => {
      const location_index = locations.findIndex(
        (location) => location.id == id
      );

      if (location_index === -1) throw new Error("Location not found");

      const deleted_index = locations[location_index];
      locations.splice(location_index, 1);
      return deleted_index;
    },
    deleteAllLocations: () => {
      const length = locations.length;

      locations.splice(0, length);

      return {
        count: length,
      };
    },
  },
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
