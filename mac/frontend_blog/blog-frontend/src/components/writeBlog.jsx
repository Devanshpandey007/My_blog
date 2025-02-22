import React, { useState, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import Spinner from "react-bootstrap/Spinner";
import "react-quill/dist/quill.snow.css";
import CustomToolbar from "./CustomToolbar";

const BlogPostForm = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const quillRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: "#toolbar",
      handlers: {
        image: () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();
          input.onchange = handleImageSelection;
        },
      },
    },
  }), []);

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("access_token");
    const authorId = sessionStorage.getItem("user_id"); 
    if (!token || !authorId) {
      alert("You must be logged in to submit a blog post.");
      setLoading(false);
      return;
    }

    let imageUrl = "";
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "blog_images");

      try {
        const cloudinaryApi = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryApi}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await cloudinaryResponse.json();
        if (data.secure_url) {
          imageUrl = data.secure_url.replace("/upload/", "/upload/w_800,h_600,c_limit/");
        } else {
          console.error("Cloudinary upload failed:", data);
          alert("Image upload failed.");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        alert("Error uploading image.");
        setLoading(false);
        return;
      }
    }

    // Prepare blog data
    const blogData = {
      title: title,
      content: content.replace(/<img[^>]*src="([^"]+)"[^>]*>/, `<img src="${imageUrl}" />`),
      author: authorId, // Use author ID (pk) here
    };

    try {
      const response = await fetch("http://127.0.0.1:8008/blog/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Blog post submitted:", result);
        alert("Blog post submitted successfully!");
        setTitle("");
        setContent("");
        setImage(null);
      } else {
        const errorData = await response.json();
        console.error("Error submitting post:", errorData);
        alert("Failed to submit the blog post.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Error submitting the blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Create Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="title" style={{ fontSize: "16px" }}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog post title"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              marginTop: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <CustomToolbar />
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          style={{
            height: "300px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" role="status" /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BlogPostForm;
