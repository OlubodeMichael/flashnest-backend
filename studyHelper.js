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
    .insert([{ user_id: userId, title, description }])
    .select();
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

async function getFlashcards(deckId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Flashcards")
    .select("*")
    .eq("deck_id", deckId);
  if (error) throw new Error(error.message);
  return data;
}

async function createFlashcard(userId, deckId, question, answer) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Flashcards")
    .insert([{ user_id: userId, deck_id: deckId, question, answer }])
    .select();
  if (error) throw new Error(error.message);

  const { error: updateError } = await supabase
    .from("Decks")
    .update({ flashcards_count: supabase.raw("flashcards_count + 1") })
    .eq("id", deckId);

  if (updateError) throw new Error(updateError.message);
  return data;
}

async function updateFlashcard(flashcardId, question, answer) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Flashcards")
    .update({ question, answer })
    .eq("id", flashcardId);
  if (error) throw new Error(error.message);
  return data;
}

async function addBulkFlashcards(userId, deckId, flashcards) {
  const supabase = getSupabase();

  // Map each flashcard to include user_id and deck_id
  const enrichedFlashcards = flashcards.map((card) => ({
    ...card,
    user_id: userId,
    deck_id: deckId,
  }));

  const { data, error } = await supabase
    .from("Flashcards")
    .insert(enrichedFlashcards)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

async function deleteFlashcard(flashcardId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Flashcards")
    .delete()
    .eq("id", flashcardId);
  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  getDecks,
  getDeck,
  createDeck,
  updateDeck,
  deleteDeck,
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  addBulkFlashcards,
};
