document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://http://128.6.60.9:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        throw new Error("Login failed");
      }
  
      const data = await response.json();
  
      localStorage.setItem("token", data.token);
  
      window.location.href = "/profile_user_logged_in/index.html";
    } catch (err) {
      console.error("Login error:", err.message);
      alert("Invalid login credentials");
    }
  });
  