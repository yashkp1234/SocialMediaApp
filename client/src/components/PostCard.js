import React from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {
  let tes = true;
  function likePost() {
    console.log("Like Post");
  }

  function commentOnPost() {
    console.log("Like Post");
  }
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
        <Button
          basic
          as="div"
          labelPosition="right"
          onClick={likePost}
          color="red"
          icon="heart"
          label={{
            basic: true,
            color: "red",
            pointing: "left",
            content: likeCount
          }}
        />
        <Button
          basic
          as="div"
          labelPosition="right"
          onClick={commentOnPost}
          color="teal"
          icon="comments"
          label={{
            basic: true,
            color: "teal",
            pointing: "left",
            content: commentCount
          }}
        />
      </Card.Content>
    </Card>
  );
}

export default PostCard;
