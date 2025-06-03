require("dotenv").config();
let SUPABASE_URL = process.env.SUPABASE_URL;
let SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  try {
    // Try to load from React Native (Expo) environment
    const { SUPABASE_URL: RN_URL, SUPABASE_ANON_KEY: RN_KEY } = require("@env");
    SUPABASE_URL = RN_URL;
    SUPABASE_ANON_KEY = RN_KEY;
  } catch (e) {
    throw new Error(
      "❌ Supabase keys are missing. Set them in your environment."
    );
  }
}

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = { supabase };
