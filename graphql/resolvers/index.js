const postResolvers = require("./posts");
const userResolvers = require("./users");
const commentResolvers = require("./comments");
const fileResolvers = require("./file");
const { GraphQLUpload } = require("apollo-server");

module.exports = {
  Upload: GraphQLUpload,
  Post: {
    likeCount: parent => parent.likes.length,
    commentCount: parent => parent.comments.length
  },
  Query: {
    ...postResolvers.Query,
    ...fileResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...fileResolvers.Mutation
  },
  Subscription: {
    ...postResolvers.Subscription
  }
};
