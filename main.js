// require('dotenv').config();

const db = "";
const key = "";

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
