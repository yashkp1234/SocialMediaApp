import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Button } from "semantic-ui-react";

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

function DropZone(props) {
  return (
    <section className="container">
      <Mutation mutation={UPLOAD_FILE}>
        {(singleUpload, { _, loading }) => {
          return (
            <form onSubmit={() => {}} encType={"multipart/form-data"}>
              <input
                name={"document"}
                type={"file"}
                onChange={({ target: { files } }) => {
                  const file = files[0];
                  toDataURL(URL.createObjectURL(file), function(dataUrl) {
                    singleUpload({
                      variables: { url: dataUrl }
                    });
                  });
                }}
              />
              <Button padding type="submit" color="blue">
                Accept
              </Button>
              {loading && (
                <div class="ui segement">
                  <div class="ui active inverted dimmer">
                    <div class="ui huge text loader">Loading</div>
                  </div>
                  <p></p>
                </div>
              )}
            </form>
          );
        }}
      </Mutation>
    </section>
  );
}

const UPLOAD_FILE = gql`
  mutation singleUpload($url: String) {
    singleUpload(url: $url)
  }
`;

export default DropZone;
