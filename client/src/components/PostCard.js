import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Card, Image, Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import { GET_PICTURE_QUERY } from "../util/graphql";

function PostCard({
  post: {
    body,
    createdAt,
    id,
    username,
    likeCount,
    comments,
    commentCount,
    likes
  }
}) {
  const { user } = useContext(AuthContext);
  const [picURL, setPicURL] = useState(
    "https://react.semantic-ui.com/images/avatar/large/molly.png"
  );
  const { loading, data, error } = useQuery(GET_PICTURE_QUERY, {
    variables: { username: username }
  });
  useEffect(() => {
    if (data) {
      setPicURL(data.getPicture);
    }
  }, [data]);
  const didComment = user
    ? comments.filter(comment => comment.username === user.username).length > 0
    : false;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }
  if (loading) {
    return (
      <div class="ui segement">
        <div class="ui active inverted dimmer">
          <div class="ui huge text loader">Loading</div>
        </div>
        <p></p>
      </div>
    );
  }
  if (data) {
    const url = picURL.split(
      "http://res.cloudinary.com/yellappyash/image/upload/"
    );
    const urlA = url.length > 1 ? url[1].split("/")[0] : "None";
    const urlB = url.length > 1 ? url[1].split("/")[1] : "Default";
    return (
      <Card fluid>
        <Card.Content>
          <Image floated="right" className="icon_corner" src={picURL} />
          <Card.Header>{username}</Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}/${urlA}/${urlB}`}>
            {moment(createdAt).fromNow()}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <LikeButton user={user} post={{ id, likes, likeCount }}></LikeButton>
          <Popup
            content="Comment on Yell"
            inverted
            trigger={
              didComment ? (
                <Button
                  labelPosition="right"
                  as={Link}
                  to={`/posts/${id}`}
                  color="teal"
                  icon="comments"
                  label={{
                    basic: true,
                    color: "teal",
                    pointing: "left",
                    content: commentCount
                  }}
                />
              ) : (
                <Button
                  basic
                  labelPosition="right"
                  as={Link}
                  to={`/posts/${id}`}
                  color="teal"
                  icon="comments"
                  label={{
                    basic: true,
                    color: "teal",
                    pointing: "left",
                    content: commentCount
                  }}
                />
              )
            }
          ></Popup>
          {user && user.username === username && (
            <DeleteButton postId={id}></DeleteButton>
          )}
        </Card.Content>
      </Card>
    );
  }
}

export default PostCard;
