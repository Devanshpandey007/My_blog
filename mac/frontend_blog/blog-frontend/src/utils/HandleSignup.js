const HandleSignup = async (e, email, password, username, setError, handleLoginSuccess) => {
    e.preventDefault(); 
    const data = { email, password, username };
  
    try {
      const response = await fetch('http://127.0.0.1:8008/blog/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), 
      });
  
      const result = await response.json(); 
      console.log("Signup response:", result);
  
      if (response.ok) {
  
        if (result.access_token && result.refresh_token && result.data) {
          sessionStorage.setItem('access_token', result.access_token);
          sessionStorage.setItem('refresh_token', result.refresh_token);
          
       
          if (result.data.email && result.data.username) {
            sessionStorage.setItem('user_email', result.data.email);
            sessionStorage.setItem('username', result.data.username);
  
           
            handleLoginSuccess();
          } else {
            console.log("Missing user data fields.");
            setError("User data is missing.");
            return;
          }
  
          setError('');
          alert('Registration successful!');
  
          window.location.reload();
        } else {
          setError('Missing tokens or user data in response.');
        }
      } else {
        setError(result.errors ? result.errors : 'Registration failed.');
      }
    } catch (err) {
      console.log(err);
      setError('Something went wrong. Please try again.');
    }
  };
  
  export default HandleSignup;
  