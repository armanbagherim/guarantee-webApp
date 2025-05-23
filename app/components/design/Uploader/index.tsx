import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { LinearProgress, Box, IconButton } from "@mui/material";
import toast from "react-hot-toast";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ClearIcon from "@mui/icons-material/Clear";

const Uploader = ({
  id,
  location,
  refetch,
  setPhotos,
  token,
  maxFiles = 3,
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(Array(maxFiles).fill(false));
  const [progress, setProgress] = useState(Array(maxFiles).fill(0));

  const onDrop = useCallback((acceptedFiles, index) => {
    const file = acceptedFiles[0]; // Only take one file per drop
    if (!file) return;

    const isValidImage = /^image\/(jpeg|png|gif|webp)$/.test(file.type);

    if (!isValidImage) {
      toast.error("فرمت تصویر نامعتبر است (فقط jpeg, png, gif, webp)");
      return;
    }

    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = Object.assign(file, {
        preview: URL.createObjectURL(file),
        index,
      });
      return newFiles;
    });

    // Automatically start upload when file is selected
    uploadFile(file, index);
  }, []);

  const uploadFile = async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploading((prev) => {
      const newUploading = [...prev];
      newUploading[index] = true;
      return newUploading;
    });

    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[index] = 0;
      return newProgress;
    });

    try {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${process.env.NEXT_PUBLIC_BASE_URL}/${location}${id ? `/${id}` : ""}`
      );
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = percentComplete;
            return newProgress;
          });
        }
      });

      const result = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(formData);
      });

      toast.success(`${file.name} با موفقیت آپلود شد`);
      setPhotos((prev) => [
        ...prev,
        {
          fileName: result.result.fileName,
          id: +result.result.id,
        },
      ]);

      if (refetch) refetch();
    } catch (error) {
      toast.error(`خطا در آپلود ${file.name}`);
      // Remove the file if upload fails
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = null;
        return newFiles;
      });
    } finally {
      setUploading((prev) => {
        const newUploading = [...prev];
        newUploading[index] = false;
        return newUploading;
      });
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index]?.preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles[index] = null;
      return newFiles;
    });
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file?.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {Array.from({ length: maxFiles }).map((_, index) => {
        const { getRootProps, getInputProps } = useDropzone({
          onDrop: (acceptedFiles) => onDrop(acceptedFiles, index),
          accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/gif": [],
            "image/webp": [],
          },
          maxFiles: 1,
          noClick: !!files[index],
        });

        return (
          <Box
            key={index}
            position="relative"
            width={100}
            height={100}
            border="1px dashed #ccc"
            borderRadius={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            sx={{
              cursor: "pointer",
              backgroundColor: files[index]
                ? "transparent"
                : "rgba(0,0,0,0.05)",
            }}
          >
            {files[index] ? (
              <>
                <img
                  src={files[index].preview}
                  alt={files[index].name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    zIndex: 999,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
                {!uploading[index] && (
                  <Box
                    {...getRootProps()}
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    <FileUploadOutlinedIcon sx={{ color: "white" }} />
                  </Box>
                )}
              </>
            ) : (
              <Box
                {...getRootProps()}
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <input {...getInputProps()} />
                <FileUploadOutlinedIcon sx={{ color: "rgba(0,0,0,0.3)" }} />
              </Box>
            )}

            {uploading[index] && (
              <Box position="absolute" bottom={0} left={0} right={0} p={1}>
                <LinearProgress variant="determinate" value={progress[index]} />
                <Box fontSize={10} textAlign="center" color="text.secondary">
                  {Math.round(progress[index])}%
                </Box>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Uploader;
