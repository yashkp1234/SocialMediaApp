import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Modal, Icon, Header, Popup } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const question = commentId ? "Comment" : "Yell";
  const [deletePostOrComment] = useMutation(mutation, {
    update(cache) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = cache.readQuery({
          query: FETCH_POSTS_QUERY
        });
        cache.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter(p => p.id !== postId)
          }
        });
      }
      if (callback) {
        callback();
      }
    },
    onError(err) {
      console.log(err);
    },
    variables: {
      postId,
      commentId
    }
  });
  return (
    <>
      <Popup
        content={`Delete ${question}`}
        inverted
        trigger={
          <Button
            as="div"
            color="grey"
            onClick={() => setConfirmOpen(true)}
            floated="right"
          >
            <Icon name="trash" style={{ margin: 0 }}></Icon>
          </Button>
        }
      ></Popup>
      <Modal open={confirmOpen}>
        <Header icon="trash" content={`Delete ${question}?`} />
        <Modal.Content>
          <p>Are you sure you want to delete your {question}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setConfirmOpen(false)}>
            <Icon name="remove" /> No
          </Button>
          <Button color="green" onClick={deletePostOrComment}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
export default DeleteButton;
