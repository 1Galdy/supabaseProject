// require('dotenv').config();

const db = "https://laayvzrxudazcfvkouuv.supabase.co";
const keyPublic = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI1NTMsImV4cCI6MjA3NDQ0ODU1M30.kZiMZJYJHO2ZwbvMEeJhEXYbLOd6AuZRQm8Uo2eW2Nk";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg3MjU1MywiZXhwIjoyMDc0NDQ4NTUzfQ.xXgCD0J1L_YvIvdlKGO08CO4Cl5tBMMIKKAdpZrzQf4";

// Variables global
let info = document.getElementById('infos');

// Création d'un client unique pour interagir avec ma base de données
const supabaseClient = supabase.createClient(db, key);

// ------------------------ Appelle de la fonction après redirection vers la page accueil(index) si le profil n’existe pas encore -----------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
async function InsertProfile(username, bio) {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    console.error("Aucun utilisateur connecté");
    return;
  }

  const { data, error } = await supabaseClient
    .from('profiles')
    .insert([{ id: user.id, username, bio }]);

  if (error) {
    console.error("Erreur création profil :", error.message);
  } else {
    console.log("Profil créé avec succès", data);
  }
}


// ------------------------ Fonction pour la récupération du profile -----------------------------
//------------------------------------------------------------------------------------------------
async function fetchProfiles() {
    let { data: profiles, error } = await supabaseClient
       .from('profiles')
       .select('*');
        console.log(profiles);
        if(error){
            console.error(error);
            return;
        }
}

// fetchProfiles();

// ------------------------ function de déconnexion -----------------------------
//-------------------------------------------------------------------------------
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    logout();
});

async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Erreur déconnexion :", error.message);
        return;
    }

    // Nettoyage localStorage si besoin
    localStorage.removeItem("user_id");
    // Redirection vers page de login
    window.location.href = "login.html";
}

// ------------------------ Fonction pour la création d'un profil -----------------------------
//---------------------------------------------------------------------------------------------
// async function InsertProfile(id, username, bio){
    
// const { data, error } = await supabaseClient

//   .from('profiles')
//   .insert([
//     {id: id, username: username, bio: bio },
//   ])
//   .select()
//   if(error){
//     console.error(error);
//     return;
//   }   
// } 


//---------------------------- Fonction pour détecter automatiquement l'utilisateur sur toutes les pages -----------------------------
//------------------------------------------------------------------------------------------------------------------------------------
// window.addEventListener("DOMContentLoaded", async () => {
//   const { data: { user } } = await supabaseClient.auth.getUser();
//   if (!user) {
//     // Redirige s’il n’est pas connecté
//     window.location.href = "login.html";
//   } else {
//     console.log("Utilisateur connecté :", user.email);
//     window.location.href = "index.html";
//   }
// });
