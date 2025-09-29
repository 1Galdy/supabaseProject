const db = "https://laayvzrxudazcfvkouuv.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg3MjU1MywiZXhwIjoyMDc0NDQ4NTUzfQ.xXgCD0J1L_YvIvdlKGO08CO4Cl5tBMMIKKAdpZrzQf4";

// Variables global
let info = document.getElementById('infos');
const defaultBio = "Veuillez mettre à jour votre biographie ☺️";
const confirmeButton = document.getElementById('confirm_compte');

// Création d'un client unique pour interagir avec ma base de données
const supabaseClient = supabase.createClient(db, key);

// ------------------------ Fonction pour se connecter -----------------------------
//----------------------------------------------------------------------------------

const connexionButton = document.getElementById('connexion');

async function signInUser(email, password) {

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    info.innerHTML = `<p style="color: red;">Connexion échouée : ${error.message}</p>`;
    return;
  }

  // Récupérer l'utilisateur connecté
  const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
        localStorage.setItem("user_id", user.id);
        info.innerHTML = `<p style="color: green;">Connecté avec succès</p>`;

        // Attendre que le profil soit créé avant de rediriger
        createProfileIfMissing().then(() => {
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Erreur lors de la création du profil :", error);
        });
    }

}

// Function de connexion

connexionButton.addEventListener('click', () => {
        
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if(email && password){
        info.innerHTML = `<p style="color: green;">Connexion réussie!</p>`;
        signInUser(email, password);
    }
    else{
        info.innerHTML = `<p style="color: red;">Veuillez remplir tous les champs!</p>`;
    }
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
