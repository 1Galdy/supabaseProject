const db = "https://laayvzrxudazcfvkouuv.supabase.co";
const keyPublic = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI1NTMsImV4cCI6MjA3NDQ0ODU1M30.kZiMZJYJHO2ZwbvMEeJhEXYbLOd6AuZRQm8Uo2eW2Nk";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg3MjU1MywiZXhwIjoyMDc0NDQ4NTUzfQ.xXgCD0J1L_YvIvdlKGO08CO4Cl5tBMMIKKAdpZrzQf4";

// Variables global
let info = document.getElementById('infos');

// Création d'un client unique pour interagir avec ma base de données
const supabaseClient = supabase.createClient(db, key);

// ---------------------------- Fonction pour la communication du DOM -----------------------------
//-------------------------------------------------------------------------------------------------

// Function d'inscription
document.addEventListener('DOMContentLoaded', async () => {
    const inscriptionButton = document.getElementById('inscription');

    inscriptionButton.addEventListener('click', () => {

        const email = document.getElementById('signup-email').value.trim();
        const name = document.getElementById('signup-name').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();

        if(email && name && password && phone){
            info.innerHTML = `<p style="color: green;">Inscription réussie ! Création du compte...</p>`;
            signUpAndCreateProfile(email, name, password, phone);
        }
        else{
            info.innerHTML = `<p style="color: red;">Veuillez remplir tous les champs!</p>`;
        }
    });
});

// ------------------------ Fonction pour créer un utilisateur Inscription -----------------------------
//------------------------------------------------------------------------------------------------------

async function signUpAndCreateProfile(email, name, password, phone) {
  const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
    email,
    password,
    phone,
    options: {
    data: {
      name: name // stocké le nom dans user_metadata
    }
  }
  });

  if (signUpError) {
    info.innerHTML = `<p style="color: red;">Erreur : ${signUpError.message}</p>`;
    return;
  }

  // Attendre que l'utilisateur confirme son email ou est connecté
//   const { data: { user } } = await supabaseClient.auth.getUser();

//   if (!user) {
//     info.innerHTML = `<p style="color: red;">Vous avez reçu un mail, veuillez confirmer votre email</p>`;
//     return;
//   }

  // Stocke son ID dans localStorage si tu veux
//   localStorage.setItem("user_id", user.id);


  info.innerHTML = `<p style="color: green;">Compte créé avec succès. Vous avez reçu un mail, veuillez confirmer votre email pour continuer</p>`;

  // Redirige vers la page d’accueil
  window.location.href = "index.html";
}
