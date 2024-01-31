import React, { useCallback, memo, forwardRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import QuillMention from "quill-mention";
Quill.register("modules/mentions", QuillMention);
import "react-quill/dist/quill.snow.css";
const TextBox = (props, ref) => {
  const handleChange = (value) => {
    props.setEditorVal(value);
  };

  return (
    <div data-text-editor="name">
      <ReactQuill
        ref={ref}
        selection={{ start: 0, end: 0 }}
        theme="snow"
        defaultValue={props.editorVal}
        preserveWhitespace
        value={props.editorVal}
        placeholder={"Please enter your text..."}
        className={"note_input"}
        bounds={"[data-text-editor=" + "name" + "]"}
        onChange={handleChange}
        modules={{
          mention: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "–1" },
                { indent: "+1" },
              ],
              ["link", "image"],
              ["clean"],
            ],
            allowedChars: /^[A-Za-z\s]*$/,
            mentionDenotationChars: ["@", "#"],
            spaceAfterInsert: true,
            defaultMenuOrientation: "bottom",
            onSelect: useCallback((item, insertItem) => {
              props.setSelectedValue((x) => {
                if (
                  x.filter((uniqureId) => uniqureId.value == item.id).length ==
                  0
                )
                  return [...x, { value: item.id, label: item.value }];
                else return [...x];
              });
              insertItem(item);
            }, []),
            source: useCallback((searchTerm, renderList, mentionChar) => {
              let values;
              if (searchTerm.length > 2) {
                if (mentionChar === "@") {
                  values = props.people;
                }
                if (searchTerm.length === 0) {
                  renderList(values, searchTerm);
                } else {
                  const matches = [];
                  for (let i = 0; i < values.length; i++)
                    if (
                      ~values[i].value
                        .toLowerCase()
                        .indexOf(searchTerm.toLowerCase())
                    )
                      matches.push(values[i]);
                  renderList(matches, searchTerm);
                }
              } else {
                renderList([], []);
              }
            }, []),
          },
        }}
      />
    </div>
  );
};

export default memo(forwardRef(TextBox));
