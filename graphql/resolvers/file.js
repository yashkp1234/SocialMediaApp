const cloudinary = require("cloudinary");
const fs = require("fs");

const checkAuth = require("../../util/checkAuth");
const File = require("../../models/File");
const config = require("../../config");

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET
});

module.exports = {
  Query: {
    getPicture: async (_, args, context) => {
      const username = await args.username;
      const pic = await File.findOne({ username });
      if (!pic) {
        return "https://react.semantic-ui.com/images/avatar/large/molly.png";
      }
      return pic.data;
    }
  },
  Mutation: {
    singleUpload: async (_, args, context) => {
      const { username } = checkAuth(context);
      const url = await args.url;
      const data = await cloudinary.uploader.upload(url, {
        tags: "gotemps",
        resource_type: "auto"
      });
      const pic = await File.findOne({ username });
      if (!pic) {
        const userFile = new File({
          username,
          data: data.url
        });
        await userFile.save();
        return true;
      } else {
        await File.updateOne({ username }, { $set: { data: data.url } });
        return true;
      }
    }
  }
};
