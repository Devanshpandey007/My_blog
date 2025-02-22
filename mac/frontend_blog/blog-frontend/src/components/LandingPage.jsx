import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "../LandingPage.css" ;

const LandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8008/blog/posts/?page=${page}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.results && Array.isArray(data.results)) {
            setPosts(data.results);
            setTotalPosts(data.count || data.results.length);
          } else {
            console.error("Unexpected data structure:", data);
            setPosts([]);
            setTotalPosts(0);
          }
        } else {
          console.error("Error fetching posts:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const extractFirstImage = (content) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  };

  const extractText = (content, title = "") => {
    const strippedText = content.replace(/<\/?[^>]+(>|$)/g, ""); 
    const cleanText = strippedText.replace(/\s+/g, " ").trim(); 
    const maxWords = title.length > 50 ? 10 : 15; 
    return cleanText.split(" ").slice(0, maxWords).join(" ") + "...";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Blog Posts</h1>
      <div className="row">
        {posts.map((post) => {
          const thumbnail = extractFirstImage(post.content);
          const previewText = extractText(post.content, post.title);
          return (
            <div className="col-md-4 mb-4" key={post.id}>
              <Card className="custom-card">
                {thumbnail ? (
                  <Card.Img variant="top" src={thumbnail} alt="Post Thumbnail" />
                ) : (
                  <Card.Img
                    variant="top"
                    src="https://via.placeholder.com/150"
                    alt="Placeholder Thumbnail"
                  />
                )}
                <Card.Body>
                  <Card.Title className="card-title">{post.title}</Card.Title>
                  <Card.Text className="card-text">{previewText}</Card.Text>
                  <Button variant="primary" as={Link} to={`/posts/${post.id}`}>
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-end mt-4">
        <PaginationControl
          page={page}
          between={4}
          total={totalPosts}
          limit={postsPerPage}
          changePage={(newPage) => setPage(newPage)}
          ellipsis={1}
        />
      </div>
    </div>
  );
};

export default LandingPage;
