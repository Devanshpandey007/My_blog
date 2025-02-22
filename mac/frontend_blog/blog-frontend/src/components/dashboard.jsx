import "../App.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PaginationControl } from "react-bootstrap-pagination-control";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { style } from "@mui/system/Stack/createStack";
import { margin } from "@mui/system";
import { Box } from "@mui/material";
import { Icon } from "@iconify/react";
import trashIcon from "@iconify-icons/mdi/trash";

const DashBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  const username = sessionStorage.getItem("username");
  const userEmail = sessionStorage.getItem("user_email");

  console.log("username:", username, "user_email:", userEmail);

  const getRandomAvatarUrl = (seed) => {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  };

  const onButtonClick = () => {
    navigate("/create");
  };


  const handleDelete = async (postId) => {
    try {
      console.log(postId)
      const response = await fetch(`http://127.0.0.1:8008/blog/posts/${postId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId)); 
        setTotalPosts(totalPosts - 1); 
      } else {
        console.error("Failed to delete post:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8008/blog/posts/dashboard/?page=${page}&page_size=${postsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            },
          }
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
  
    fetchUserPosts();
  }, [page]);
  
  

  const extractFirstImage = (content) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = content.match(imgRegex);
    return match ? match[1] : "https://via.placeholder.com/345x140";
  };

  const extractText = (content) => {
    const strippedText = content.replace(/<\/?[^>]+(>|$)/g, "");
    const cleanText = strippedText.replace(/\s+/g, " ").trim();
    const maxWords = 15;
    return cleanText.split(" ").slice(0, maxWords).join(" ") + "...";
  };

  return (
    <div className="container">
      <div className="row" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Centered Profile Section */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <div className="profile" style={{ textAlign: "center" }}>
            <Stack direction="row" spacing={2} justifyContent="center" paddingBottom={2}>
              <Avatar
                alt="User Avatar"
                src={getRandomAvatarUrl(username)}
                sx={{ width: 100, height: 100 }}
              />
            </Stack>
            <h2 style={{ paddingBottom: "10px" }}>{username}</h2>
            {username && userEmail ? (
              <div>
                <p style={{ lineHeight: "10px", fontSize: "20px" }}>{userEmail}</p>
              </div>
            ) : (
              <p>Loading user details...</p>
            )}
          </div>
        </div>
        {/* Button Section */}
        <Stack direction="row" justifyContent="end" spacing={3} paddingBottom={2}>
          <button className="wpf--create-new" type="button" onClick={onButtonClick}></button>
        </Stack>
        {/* Posts Section */}
        <div className="col-md-12">
          <h2>Posts:</h2>
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            <div>
              <div className="row">
                {posts.map((post) => (
                  <div className="col-md-4" style={{paddingBottom:"10px"}} key={post.id}>
                    <Card
                      sx={{
                        maxWidth: 345,
                        marginBottom: 2.5,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      <CardMedia
                        sx={{ height: 140 }}
                        image={extractFirstImage(post.content)}
                        title={post.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {extractText(post.content)}...
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <Button size="small" href={`/posts/${post.id}`}>
                            Read More
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Icon icon={trashIcon} width={20} height={20} />
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </div>
                ))}
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
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
