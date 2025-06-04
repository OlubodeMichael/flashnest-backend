const { getSupabase } = require("./supabaseClient");

async function getDecks(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .select("*")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
}

async function getDeck(deckId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .select("*")
    .eq("id", deckId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function createDeck(userId, title, description) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .insert([{ user_id: userId, title, description }]);
  if (error) throw new Error(error.message);
  return data;
}

async function updateDeck(deckId, title, description) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .update({ title, description })
    .eq("id", deckId);
  if (error) throw new Error(error.message);
  return data;
}

async function deleteDeck(deckId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .delete()
    .eq("id", deckId);
  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  getDecks,
  getDeck,
  createDeck,
  updateDeck,
  deleteDeck,
};
