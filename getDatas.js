// ✅ Corriger l'URL de base Supabase
const db = "https://laayvzrxudazcfvkouuv.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg3MjU1MywiZXhwIjoyMDc0NDQ4NTUzfQ.xXgCD0J1L_YvIvdlKGO08CO4Cl5tBMMIKKAdpZrzQf4";

const supabaseClient = supabase.createClient(db, key);

// Attendre que le DOM soit prêt
document.addEventListener('DOMContentLoaded', async () => {
  // Récupère l'utilisateur connecté
  const {
    data: { user },
    error: userError
  } = await supabaseClient.auth.getUser();

  // ✅ Vérification sécurisée
  if (userError || !user) {
    alert("Utilisateur non connecté.");
    window.location.href = "login.html"; // redirection si non connecté
    return;
  }

  // ✅ Affichage du nom d'utilisateur
  const usernameDiv = document.querySelector('.username');
  const { data: profileData, error: profileError } = await supabaseClient
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Erreur récupération profil :", profileError.message);
    usernameDiv.textContent = "Utilisateur inconnu";
  } else {
    usernameDiv.textContent = profileData.username;
  }

  // ✅ Récupération de tous les profils
  const { data: profiles, error: fetchError } = await supabaseClient
    .from('profiles')
    .select('id, username, bio');

  if (fetchError) {
    console.error("Erreur récupération des profils :", fetchError.message);
    return;
  }

  // ✅ Affichage des profils dans le tableau
  const tableBody = document.getElementById('profile-list');
  tableBody.innerHTML = ''; // Vide d'abord

  profiles.forEach(profile => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${profile.id}</td>
      <td>${profile.username}</td>
      <td>${profile.bio || ''}</td>
      <td>
        <button class="edit-btn" data-id="${profile.id}">✏️</button>
        <button class="delete-btn" data-id="${profile.id}">🗑️</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  // ✅ Déconnexion
  document.getElementById('logout').addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    localStorage.removeItem('user_id');
    window.location.href = 'login.html';
  });
});


  // Ajoute les gestionnaires pour modifier et supprimer la bio
  tableBody.addEventListener('click', async (event) => {
    const target = event.target;
    const id = target.dataset.id;

    // Modification de la bio
    if (target.classList.contains('edit-btn')) {
      const nouvelleBio = prompt("Entrez la nouvelle bio :");
      if (nouvelleBio !== null) {
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ bio: nouvelleBio })
          .eq('id', id);

        if (updateError) {
          alert("Erreur lors de la mise à jour : " + updateError.message);
        } else {
          alert("Bio mise à jour !");
          location.reload(); // Recharge pour voir les changements
        }
      }
    }

    // Suppression de la bio (mettre à vide)
    if (target.classList.contains('delete-btn')) {
      const confirmation = confirm("Supprimer la bio ?");

      if (confirmation) {
        const { error: deleteError } = await supabaseClient
          .from('profiles')
          .update({ bio: '' })
          .eq('id', id);

        if (deleteError) {
          alert("Erreur lors de la suppression : " + deleteError.message);
        } else {
          alert("Bio supprimée !");
          location.reload(); // Recharge la page
        }
      }
    }
  });
