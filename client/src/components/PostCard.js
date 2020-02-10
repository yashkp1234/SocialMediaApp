import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

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
  const didComment =
    comments.filter(comment => comment.username === user.username).length > 0;
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
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
                as="link"
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
                as="link"
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

export default PostCard;
