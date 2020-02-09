import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data, error } = useQuery(FETCH_POSTS_QUERY);
  if (error) {
    return <p>Error</p>;
  }
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (data) {
    const posts = data.getPosts;
    return (
      <Grid columns={3} fluid="true">
        <Grid.Row className="page-Title">
          <h1> Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm></PostForm>
            </Grid.Column>
          )}
          {loading ? (
            <h1>Loading posts..</h1>
          ) : (
            posts &&
            posts.map(post => (
              <Grid.Column key={post.id} style={{ marginBottom: "2rem" }}>
                <PostCard post={post} />
              </Grid.Column>
            ))
          )}
        </Grid.Row>
      </Grid>
    );
  }
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
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

export default Home;
