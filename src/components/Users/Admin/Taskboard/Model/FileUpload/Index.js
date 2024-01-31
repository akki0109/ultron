import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Col, Row } from "reactstrap";
import { TaskFileGet, TaskFileUpload } from "../../Services/taskBoard.services";
import { APIURL } from "../../../../../../constants/config";
import pdfImage from "../../../../../../assets/images/pdf.png";
import excelImage from "../../../../../../assets/images/excel.png";
import DocsImage from "../../../../../../assets/images/docs.png";

const fileTypes = [
  "JPEG",
  "PNG",
  "GIF",
  "PDF",
  "JPG",
  "XLS",
  "XLSX",
  "PPT",
  "PPTX",
  "DOC", 
  "DOCX"
  
];

export default function Index({ taskID }) {
  const [filename, setFilename] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileFormatError,setFileFormatError]=useState("");
  const handleChange = (file) => {
    const formData = new FormData();
    formData.append("taskId", taskID);
    formData.append("files", file);

    TaskFileUpload(formData)
      .then((res) => {
        setFileFormatError("");
        setFilename(file.name);
        console.log(res);
        refreshMainList();
      })
      .catch((error) => {
        setFilename("");
        error&&setFileFormatError(error.response.data.data.errors.common[0]);
      });
  };
  const refreshMainList = () => {
    TaskFileGet({ taskId: taskID }).then((res) => {
      let data = res.data.data;
      data.length > 0 && setFileList(data);
    });
  };
  useEffect(() => {
    refreshMainList();
  }, []);

  return (
    <div className="file">
      <Row>
        <Col className="border-right">
          <div className="upload_img_grid">
          {fileList &&
            fileList.map((file, fileIndex) => (
              <div key={fileIndex}>
                {console.log(345,file.taskfiles.files)}
                  <div>
                    {file.taskfiles.files.endsWith(".pdf") ? (
                      // PDF file
                      <a
                        href={APIURL + file.taskfiles.filesPath}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          alt={`File ${fileIndex}`}
                          src={pdfImage}
                        />
                      </a>
                    ) : file.taskfiles.files.endsWith(".xls") || file.taskfiles.files.endsWith(".xlsx") ? (
                      // Excel file
                      <a
                        href={APIURL + file.taskfiles.filesPath}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={excelImage} 
                          alt={`File ${fileIndex}`}
                        />
                      </a>
                    ) : file.taskfiles.files.endsWith(".doc") || file.taskfiles.files.endsWith(".docx") ? (
                      // Word document file
                      <a
                        href={APIURL + file.taskfiles.filesPath}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={DocsImage} 
                          alt={`File ${fileIndex}`}
                        />
                      </a>
                    ) : (
                      // Other file types ( images)
                      <a
                        href={APIURL + file.taskfiles.filesPath}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={APIURL + file.taskfiles.filesPath}
                          alt={`File ${fileIndex}`}
                        />
                      </a>
                    )}
                  </div>
            
              </div>
            ))}
          </div>
        </Col>
        <Col>
          <div className="fileupload">
            <div>
              <FileUploader
                multiple={false}
                handleChange={handleChange}
                name="file"
                types={fileTypes}
              />
              <p>
                {fileFormatError ?  (<span className="text-danger" >{fileFormatError} </span>):(`File name:${filename}`)}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
