import React from "react";
import ReactQuill from "react-quill";
const Index = (props) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: [] }],
      ["clean"],
    ],
  };
  return (
    <div data-text-editor="bounds">
      <ReactQuill
        bounds={"[data-text-editor=" + "bounds" + "]"}
        // preserveWhitespace
        className={"note_input"}
        selection={{ start: 0, end: 0 }}
        theme="snow"
        value={props.commit.commentDesc}
        onChange={(data) =>
          props.setCommit((x) => ({ ...x, commentDesc: data }))
        }
        modules={modules}
        placeholder={"Please enter your text..."}
      />
    </div>
  );
};

export default Index;
