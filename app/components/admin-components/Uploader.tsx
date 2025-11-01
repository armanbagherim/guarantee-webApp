import React, { useCallback, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import toast from "@/app/components/toast";
import { IconButton, Tooltip } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

const Uploader = ({
  id,
  location,
  refetch,
  setPhotos,
  text = "آپلود تصویر",
  photos,
  type = "image",
  isFull,
  triggered,
  setTriggered,
}) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const statusRef = useRef();
  const loadTotalRef = useRef();
  const inputRef = useRef();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [type]
  );

  const handleFileChange = useCallback(
    (e) => {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    },
    [type]
  );

  const processFiles = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      console.log(`File: ${file.name}, Type: ${file.type}`);
    });

    const validFiles = acceptedFiles.filter((file) => {
      const isValidImage =
        type === "image" && /^image\/(jpeg|png|gif|webp)$/.test(file.type);
      const isValidVideo =
        type === "video" && /^video\/(mp4|avi|mov)$/.test(file.type);
      const isValidExcel =
        type === "excel" && (
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel" ||
          /\.(xlsx|xls)$/i.test(file.name)
        );

      return isValidImage || isValidVideo || isValidExcel;
    });

    if (validFiles.length === 0) {
      toast.error("No valid files were uploaded.");
      return;
    }

    setFiles(
      validFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${process.env.NEXT_PUBLIC_BASE_URL}/${location}${id ? `/${id}` : ""}`
      );
      xhr.setRequestHeader("Authorization", `Bearer ${session.token}`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
          if (loadTotalRef.current) {
            loadTotalRef.current.innerHTML = `${e.loaded} آپلود شده از ${e.total}`;
          }
          if (statusRef.current) {
            statusRef.current.innerHTML = `${Math.round(
              percentComplete
            )}% آپلود شد...`;
          }
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (triggered) {
            setTriggered(!triggered);
          }
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));

      xhr.send(formData);
    });
  };

  const uploadFiles = async () => {
    setUploading(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await uploadFile(file);
        toast.success(`${file.name} uploaded successfully`);
        if (triggered) {
          setTriggered(!triggered);
        }
        if (refetch) refetch();
        setPhotos((prev) => [
          ...prev,
          {
            fileName: result.result.fileName,
            id: +result.result.id,
          },
        ]);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setFiles([]);
    setUploading(false);
    setOpen(false);
  };

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <>
      {isFull ? (
        <div className="wrapper">
          <Button
            fullWidth={isFull}
            onClick={() => setOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg"
          >
            {text}
          </Button>
        </div>
      ) : (
        <Tooltip className="IranSans" arrow placement="top" title="آپلود تصویر">
          <IconButton>
            <a onClick={() => setOpen(true)}>
              <FileUploadOutlinedIcon />
            </a>
          </IconButton>
        </Tooltip>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{"آپلود فایل"}</DialogTitle>
        <DialogContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="dropzone border border-dashed border-gray-200 p-4 mb-4"
            onClick={() => inputRef.current.click()}
          >
            <input
              type="file"
              ref={inputRef}
              style={{ display: "none" }}
              accept={
                type === "image"
                  ? "image/jpeg,image/png,image/gif,image/webp"
                  : type === "video"
                  ? "video/mp4,video/avi,video/mov"
                  : /* excel */
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.xlsx,.xls"
              }
              multiple
              onChange={handleFileChange}
            />
            {isDragActive ? (
              <p>فایل‌ها را اینجا رها کنید ...</p>
            ) : (
              <p>برای انتخاب فایل‌ها کلیک کنید یا آن‌ها را به اینجا بکشید</p>
            )}
          </div>
          <div className="flex gap-4">
            {files.map((file) => (
              <div key={file.name} className="flex items-center gap-2">
                {type === "image" ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-auto"
                    height={100}
                    width={100}
                  />
                ) : type === "video" ? (
                  <video className="" src={file.preview} controls></video>
                ) : type === "excel" ? (
                  <div className="flex items-center gap-2 p-2 border rounded bg-yellow-50">
                    <span style={{ fontSize: 28 }}>📊</span>
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <span>📄</span>
                    <div>{file.name}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {uploading && (
            <div className="border p-4 border-gray-100 rounded-lg mt-4">
              <LinearProgress
                className="mt-4"
                variant="determinate"
                value={progress}
              />
              <p className="text-sm mt-2" ref={statusRef}></p>
              <p className="text-sm mt-2" ref={loadTotalRef}></p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpen(false)}
          >
            لغو
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={uploadFiles}
            autoFocus
            disabled={uploading || files.length === 0}
          >
            آپلود
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Uploader;
