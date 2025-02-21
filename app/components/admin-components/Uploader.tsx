import React, { useCallback, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
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

  const statusRef = useRef();
  const loadTotalRef = useRef();

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        console.log(`File: ${file.name}, Type: ${file.type}`);
      });

      const validFiles = acceptedFiles.filter((file) => {
        const isValidImage =
          type === "image" && /^image\/(jpeg|png|gif|webp)$/.test(file.type);
        const isValidVideo =
          type === "video" && /^video\/(mp4|avi|mov)$/.test(file.type);
        return isValidImage || isValidVideo;
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
    },
    [type]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      type === "image"
        ? {
            "image/jpeg": [],
            "image/png": [],
            "image/gif": [],
            "image/webp": [],
          }
        : {
            "video/mp4": [],
            "video/avi": [],
            "video/mov": [],
          },
  });

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
        <Button
          fullWidth={isFull}
          onClick={() => setOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg"
        >
          {text}
        </Button>
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
            {...getRootProps()}
            className="dropzone border border-dashed border-gray-200 p-4 mb-4"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>فایل‌ها را اینجا رها کنید ...</p>
            ) : (
              <p>برای انتخاب فایل‌ها کلیک کنید یا آن‌ها را به اینجا بکشید</p>
            )}
          </div>
          <div className="flex gap-4">
            {files.map((file) => (
              <div key={file.name}>
                {type === "image" ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-auto"
                    height={100}
                    width={100}
                  />
                ) : (
                  <video className="" src={file.preview} controls></video>
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
