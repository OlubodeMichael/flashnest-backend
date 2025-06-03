const { signUp } = require("./authHelper");

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
