import React from "react";

const FmaTextareaElement = () => {
  return (
    <div class="form-floating">
      <textarea
        className="form-control mt-3"
        placeholder="Leave a comment here"
        id="floatingTextarea2"
        style={{ height: "100px" }}
      ></textarea>
      <label for="floatingTextarea2">Comments</label>
    </div>
  );
};

export default FmaTextareaElement;
