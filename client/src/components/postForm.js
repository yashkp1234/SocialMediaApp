import React from "react";
import { Form, Button, Segment, Header } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { CREATE_POST_MUTATION } from "../util/graphql";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ""
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      const new_post = result.data.createPost;
      console.log({ newPost: new_post, getPosters: data.getPosts });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [new_post, ...data.getPosts] }
      });
      values.body = "";
    },
    onError(err) {
      console.log(err);
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Segment style={{ marginBottom: "2rem" }}>
        <Form onSubmit={onSubmit}>
          <Header as="h2">Yell Something!</Header>
          <Form.Field>
            <Form.Input
              placeholder="Yell here, let it out!"
              name="body"
              onChange={onChange}
              value={values.body}
              error={error ? true : false}
            ></Form.Input>
            <Button type="submit" color="blue">
              {" "}
              Submit
            </Button>
          </Form.Field>
        </Form>
      </Segment>
      {error && (
        <div className="ui error message" style={{ marginBottom: "2rem" }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default PostForm;
