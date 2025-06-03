const { signUp, login } = require("./authHelper");

/*
(async () => {
  try {
    const result = await signUp({
      firstName: "Michael",
      lastName: "Olubode",
      email: "moolubode3@gmail.com",
      password: "password123",
      confirmPassword: "password123",
    });

    console.log("✅ Signup result:", result);
  } catch (err) {
    console.error("❌ Signup error:", err.message);
  }
})();
*/
(async () => {
  try {
    const result = await login({
      email: "moolubode3@gmail.com",
      password: "password123",
    });
    console.log("✅ Login result:", result);
  } catch (err) {
    console.error("❌ Login error:", err.message);
  }
})();
