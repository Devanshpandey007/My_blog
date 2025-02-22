const HandleLogin = async (e, setIsAdmin, email, password, setError, handleLoginSuccess) => {
    e.preventDefault();
    console.log("Form submitted with:", email, password);

    const data = {email, password };

    try {
        const response = await fetch('http://127.0.0.1:8008/blog/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(response.status);
        if (result.status) console.log("result status- ", result.status);
        console.log("Login response:", result);

        if (result.status === 200) {
            console.log("Success, storing tokens");
            sessionStorage.setItem('user_id', result.id);
            sessionStorage.setItem('access_token', result.access);
            localStorage.setItem('refresh_token', result.refresh);
            sessionStorage.setItem('user_email', result.email);
            sessionStorage.setItem('username', result.username);
            sessionStorage.setItem('user_role', result.role);
            

            setError('');
            handleLoginSuccess(); 

            alert('Logged in successfully!');
            window.location.reload();  
        } else {
            console.log("Login failed with error:", result.error);
            setError(result.error || "Invalid login credentials.");
        }
    } catch (err) {
        console.log("Error during login:", err);
        setError('Something went wrong. Please try again.');
    }
};

export default HandleLogin;
