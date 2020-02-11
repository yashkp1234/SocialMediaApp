import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const { loading, data, error } = useQuery(FETCH_POSTS_QUERY);
  useEffect(() => {
    if (data) {
      setPosts(data.getPosts);
    }
  }, [data]);

  if (error) {
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
    return (
      <Grid columns={3} fluid="true">
        <Grid.Row className="page-Title">
          <h1> Recent Yells</h1>
        </Grid.Row>
        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm></PostForm>
            </Grid.Column>
          )}
          {loading ? (
            <h1>Loading Yells..</h1>
          ) : (
            <Transition.Group>
              {posts &&
                posts.map(post => (
                  <Grid.Column key={post.id} style={{ marginBottom: "2rem" }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    );
  }
}

export default Home;
