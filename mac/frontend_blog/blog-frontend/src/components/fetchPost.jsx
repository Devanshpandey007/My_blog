import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { CommentSection } from "react-comments-section";
import "react-quill/dist/quill.snow.css";
import "react-comments-section/dist/index.css";
import "../App.css";

const BlogPostView = ({ doLogin }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [currUsername, setCurrUserName] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8008/blog/posts/${id}/`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          console.error("Error fetching blog post:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoadingPost(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      const fetchComments = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8008/blog/posts/${id}/comments/`
          );
          if (response.ok) {
            const data = await response.json();
            const filteredComments = data.results.filter(
              (comment) => comment.blog === parseInt(id)
            );
            setComments(filteredComments);
          } else {
            console.error("Error fetching comments:", response.statusText);
          }
        } catch (error) {
          console.error("Network error:", error);
        } finally {
          setLoadingComments(false);
        }
      };

      fetchComments();
    }
  }, [id, post]);

  useEffect(() => {
    setCurrUserName(sessionStorage.getItem("username"));
    setUserId(sessionStorage.getItem("user_id"));
  }, []);


  const handleCommentSubmit = async (commentData) => {
    console.log(userId)
    if (userId === null) {
      alert("You need to log in to post a comment!");
      return;
    } else {
      console.log("Hello there!!")
      const token = sessionStorage.getItem("access_token");
      const requestPayload = {
        user_name: userId,
        body: commentData.text,
        name: currUsername,
        blog: id,
      };

      try {
        const response = await fetch(
          `http://127.0.0.1:8008/blog/posts/${id}/comments/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestPayload),
          }
        );

        if (response.ok) {
          const newComment = await response.json();
          setComments((prevComments) => [...prevComments, newComment]);
        } else {
          console.error("Error submitting comment:", response.statusText);
          alert("Failed to submit comment. Please try again.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please check your connection and try again.");
      }
    }
  };

  if (loadingPost) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!post) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>Blog post not found.</p>
    );
  }

  return (
    <div>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>{post.title}</h1>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Published on {new Date(post.created_at).toLocaleDateString()}
        </p>
        <div
          className="blog-post-content"
          style={{
            marginTop: "20px",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <div
        className="CommentSection"
        style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
      >
        <h1>Comments:</h1>

        {loadingComments ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading comments...</span>
            </Spinner>
          </div>
        ) : comments.length === 0 ? (
          <>
            <p style={{ color: "#666" }}>
              No comments yet. Be the first to comment!
            </p>
            <CommentSection
              currentUser={{
                currentUserId: userId,
                currentUserImg: `https://ui-avatars.com/api/name=${currUsername}&background=random`,
                currentUserFullName: currUsername,
              }}
              logIn={{
                onLogin: () => doLogin(),
                signUpLink: "http://localhost:5173/",
              }}
              commentData={[]}
              onSubmitAction={handleCommentSubmit}
              currentData={(data) => {
                console.log("Current data", data);
              }}
            />
          </>
        ) : (
          <CommentSection
            currentUser={{
              currentUserId: userId,
              currentUserImg: `https://ui-avatars.com/api/name=${currUsername}&background=random`,
              currentUserFullName: currUsername,
            }}
            logIn={{
              onLogin: () => alert("Call login function"),
              signUpLink: "http://localhost:5173/login/",
            }}
            commentData={comments.map((comment) => ({
              userId: comment.user_name,
              comId: comment.id,
              fullName: comment.name,
              text: comment.body,
              avatarUrl: `https://ui-avatars.com/api/name=${comment.name}&background=random`,
              timestamp: new Date(comment.date_posted).toISOString(),
              replies: [],
            }))}
            onSubmitAction={handleCommentSubmit}
            // currentData={(data) => {
            //   console.log("Current data", data);
            // }}
          />
        )}
      </div>
    </div>
  );
};

export default BlogPostView;
