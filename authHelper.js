const { getSupabase } = require("./supabaseClient");

async function signUp({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}) {
  const supabase = getSupabase();
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);

  const userId = authData.user?.id;
  console.log(userId);
  if (!userId) throw new Error("User signup failed");

  const { error: insertError } = await supabase.from("Users").upsert({
    id: userId,
    first_name: firstName,
    last_name: lastName,
    email,
    active: true,
  });

  if (insertError)
    throw new Error(
      "User created, but failed to save profile: " + insertError.message
    );

  return {
    message: "Signup successful",
    user: authData.user,
    session: authData.session,
  };
}

async function signIn({ email, password }) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  const user = data.user;
  const session = data.session;

  // Optionally fetch profile from Users table
  const { data: profile, error: profileError } = await supabase
    .from("Users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.warn(
      "⚠️ Logged in, but failed to fetch profile:",
      profileError.message
    );
  }

  return {
    message: "Login successful",
    user,
    profile,
    session,
  };
}

async function getCurrentUser() {
  const supabase = getSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("No user found");

  const { data: profile, error: profileError } = await supabase
    .from("Users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError)
    throw new Error("Failed to fetch profile: " + profileError.message);

  return profile;
}

async function signOut() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return { message: "Logout successful" };
}

async function signInWithOAuth({ provider = "google", redirectTo }) {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo, // must be set based on platform
      },
    });

    if (error) throw new Error(error.message);

    return data; // will contain the `url` to open for OAuth
  } catch (err) {
    throw new Error("OAuth sign-in failed: " + err.message);
  }
}

module.exports = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  signInWithOAuth,
};
