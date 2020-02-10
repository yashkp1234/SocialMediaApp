import React, { useContext, useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Grid,
  Button,
  Icon,
  Image,
  Card,
  Label,
  Segment,
  Form,
  Popup
} from "semantic-ui-react";
import gql from "graphql-tag";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");
  const [commented, setCommented] = useState(false);

  const { loading, data, err } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    onError(err) {
      console.log(err);
    },
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  let getPost;

  if (loading) {
    return (
      <div class="ui segement">
        <div class="ui active inverted dimmer">
          <div class="ui huge text loader">Loading</div>
        </div>
        <p></p>
      </div>
    );
  } else if (data) {
    getPost = data.getPost;
  } else {
    return (
      <div class="ui segement">
        <div class="ui active inverted dimmer">
          <div class="ui huge text loader">Error No Card With ID</div>
        </div>
        <p></p>
      </div>
    );
  }

  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = (
      <div class="ui segement">
        <div class="ui active inverted dimmer">
          <div class="ui huge text loader">Loading</div>
        </div>
        <p></p>
      </div>
    );
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount
    } = getPost;

    postMarkup = (
      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <Image
                src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                size="large"
                float="right"
              ></Image>
            </Grid.Column>
            <Grid.Column width={10}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{body}</Card.Description>
                </Card.Content>
                <hr />
                <Card.Content extra>
                  <LikeButton
                    user={user}
                    post={{ id, likeCount, likes }}
                  ></LikeButton>
                  <Popup
                    content="Comment on Yell"
                    inverted
                    trigger={
                      <Button
                        as="div"
                        labelPosition="right"
                        onClick={() => console.log("comment")}
                      >
                        {comments.filter(
                          comment => comment.username === user.username
                        ).length > 0 ? (
                          <Button color="teal">
                            <Icon name="comments"></Icon>
                          </Button>
                        ) : (
                          <Button basic color="teal">
                            <Icon name="comments"></Icon>
                          </Button>
                        )}
                        <Label basic color="teal" pointing="left">
                          {commentCount}
                        </Label>
                      </Button>
                    }
                  ></Popup>
                  {user && user.username === username && (
                    <DeleteButton
                      postId={id}
                      callback={deletePostCallback}
                    ></DeleteButton>
                  )}
                </Card.Content>
              </Card>
              {user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a Comment</p>
                    <Form>
                      <div className="ui action input fluid">
                        <input
                          type="text"
                          placeholder="Comment  ..."
                          name="comment"
                          value={comment}
                          onChange={event => setComment(event.target.value)}
                          ref={commentInputRef}
                        ></input>
                        <button
                          type="submit"
                          className="ui button teal"
                          disable={(comment.trim() === "").toString()}
                          onClick={submitComment}
                        >
                          Submit Comment
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              {comments.map(comment => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton
                        postId={id}
                        commentId={comment.id}
                      ></DeleteButton>
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );

    return postMarkup;
  }
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
