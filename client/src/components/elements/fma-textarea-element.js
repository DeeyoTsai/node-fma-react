import React from "react";

const FmaTextareaElement = ({ postContent, setPostContent }) => {
  return (
    <div className="form-floating">
      <textarea
        className="form-control mt-3"
        placeholder="Leave a comment here"
        id="floatingTextarea2"
        style={{ height: "100px" }}
        // defaultValue="點數超規進行fma"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      ></textarea>
      <label htmlFor="floatingTextarea2">Comments</label>
    </div>
  );
};

export default FmaTextareaElement;
