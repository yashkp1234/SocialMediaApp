const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty COmment", {
          errors: {
            body: "comment body must not be empty"
          }
        });
      }

      const post = await Post.findById(postId);
      const test = new Date().toISOString();
      console.log(test);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: test
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);
      console.log("Here");

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(
          com => com.id === commentId
        );
        console.log(post.comments, commentIndex, post.comments[commentIndex]);
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // Post already liked
          post.likes = post.likes.filter(like => like.username != username);
        } else {
          // Post not liked
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    }
  }
};
