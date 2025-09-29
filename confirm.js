const db = "https://laayvzrxudazcfvkouuv.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg3MjU1MywiZXhwIjoyMDc0NDQ4NTUzfQ.xXgCD0J1L_YvIvdlKGO08CO4Cl5tBMMIKKAdpZrzQf4";

// Variables global
let info = document.getElementById('infos');
const defaultBio = "Veuillez mettre à jour votre biographie ☺️";

// Création d'un client unique pour interagir avec ma base de données
const supabaseClient = supabase.createClient(db, key);

const confirmeButton = document.getElementById('confirm_compte');

confirmeButton.addEventListener('click', () => {
    createProfileIfMissing();
});


//---------------------------------------------------------------------------------------------------------------------------------
// ----------------------------- Fonction pour insérer automatiquement l'id et le nom ainsi qu'une bio par défaut dans profiles -----------------------------
//---------------------------------------------------------------------------------------------------------------------------------

async function createProfileIfMissing() {
  const { data: userData, error: userError } = await supabaseClient.auth.getUser();

  if (userError || !userData?.user) {
    console.warn("Utilisateur non connecté");
    return;
  }

  const user = userData.user;
  const userId = user.id;
  const name = user.raw_user_meta_data?.name ?? user.user_metadata?.name;

  // Si pas de nom, on ne crée pas le profil
  if (!name) {
    console.warn("Aucun nom trouvé dans user_metadata");
    return;
  }

  // Vérifie si un profil existe déjà
  const { data: existingProfile, error: profileCheckError } = await supabaseClient
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existingProfile) {
    console.log("Profil déjà existant, aucune action nécessaire");
    return;
  }

  const { data: profileData, error: profileError } = await supabaseClient
    .from('profiles')
    .insert([
      { id: userId, username: name, bio: defaultBio }
    ]);

  if (profileError) {
    console.error("Erreur lors de l'insertion dans profiles :", profileError.message);
    return;
  }

  console.log("Profil inséré avec succès :", profileData);
}