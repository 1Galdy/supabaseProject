// require('dotenv').config();

const db = "https://laayvzrxudazcfvkouuv.supabase.co";
const keyPublic = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI1NTMsImV4cCI6MjA3NDQ0ODU1M30.kZiMZJYJHO2ZwbvMEeJhEXYbLOd6AuZRQm8Uo2eW2Nk";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXl2enJ4dWRhemNmdmtvdXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg3MjU1MywiZXhwIjoyMDc0NDQ4NTUzfQ.xXgCD0J1L_YvIvdlKGO08CO4Cl5tBMMIKKAdpZrzQf4";

// Variables global
let info = null;
let res = null;
let userId = null;

// Create a single supabase client for interacting with your database
const supabaseClient = supabase.createClient(db, key);

async function signUpAndCreateProfile(email, password) {
    // 1. Créer l'utilisateur
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
    });

    if (signUpError) {
        // console.error("Erreur de création d'utilisateur :", signUpError);
        info = document.getElementById('infos');
        res = `<p style="color: red;">Le mail ou les infos renseignées ne sont pas valide</p>`;
        info.innerHTML = res;
        return;
    }

    // userId = signUpData.user?.id;
    userId = [
        {
            id: signUpData.user?.id,
            name: signUpData.user?.name,
            name: signUpData.user?.email,
        }
    ]

    if(userId){
        window.location.href = "index.html?id="+userId;
        GetAllUsers();
    }else{
        info = document.getElementById('infos');
        res = `<p style="color: red;">Erreur de création de l'utilisateur</p>`;
        info.innerHTML = res;
        return;
    }
    // console.log("Nouvel utilisateur ID :", userId);
    // InsertProfile(userId, 'John Doe', 'I am a software engineer');
}

// signUpAndCreateProfile("brechtdianzinga@gmail.com", "password123");

async function signInGetUsers(usersemail, userspassword) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: usersemail,
        password: userspassword,
    })
    if(error){
        console.error("Erreur de connexion :", error);
        return;
    }
    // console.log(data);
    const user = data.user?.id;
    console.log("Utilisateur ID :", user);
    InsertProfile(user, 'Brecht', "Vérification de l'insert après auth");
}

// signInGetUsers("brechtdianzinga@gmail.com", "password123");

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

async function GetAllUsers() {
    const params = new URLSearchParams(window.location.search);
    const userDatas = params.get('id');
    alert("Données " + userDatas.id);
}

async function InsertProfile(id, username, bio){
    
const { data, error } = await supabaseClient

  .from('profiles')
  .insert([
    {id: id, username: username, bio: bio },
  ])
  .select()
  if(error){
    console.error(error);
    return;
  }   
} 


// Functions avec front en design

const inscriptionButton = document.getElementById('inscription');

inscriptionButton.addEventListener('click', () => {

    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if(email && password){
        info = document.getElementById('infos');
        res = `<p style="color: green;">Inscription réussie ! Création du compte...</p>`;
        info.innerHTML = res;
        signUpAndCreateProfile(email, password);
    }
    else{
        info = document.getElementById('infos');
        res = `<p style="color: red;">Veuillez remplir tous les champs!</p>`;
        info.innerHTML = res;
    }
});