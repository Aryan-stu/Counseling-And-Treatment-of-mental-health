
/**
 * import firebase
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2fxyHrAHrB8k9PzLF4MIaDde6W09wn_4",
  authDomain: "mental-health-7c08f.firebaseapp.com",
  databaseURL: "https://mental-health-7c08f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mental-health-7c08f",
  storageBucket: "mental-health-7c08f.appspot.com",
  messagingSenderId: "184742629329",
  appId: "1:184742629329:web:184d9591d35607c4d29af0"
};


/**
* Login register
*/     
const wrapper = document.querySelector(".wrapper");
const wrapper2 = document.querySelector(".wrapper2");
const ForgotPass = document.querySelector(".forgotpass");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");
const iconClose2 = document.querySelector(".icon-close2");
const Out = document.querySelector(".out");
const In = document.querySelector(".in");

registerLink.addEventListener('click',()=>{
wrapper.classList.add('active');
});

loginLink.addEventListener('click',()=>{
wrapper.classList.remove('active');
});

btnPopup.addEventListener('click',()=>{
wrapper.classList.add('active-popup');
});
ForgotPass.addEventListener('click',()=>{
    wrapper.classList.remove('active-popup');
    wrapper2.classList.add('active-popup2')
});
iconClose.addEventListener('click',()=>{
wrapper.classList.remove('active-popup');
});
iconClose2.addEventListener('click',()=>{
    wrapper2.classList.remove('active-popup2');
    wrapper.classList.add('active-popup');
});
/**
* Firebase register
*/


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);


let EmailInp1 = document.getElementById('emailInp1');
let PasswordInp1 = document.getElementById('passwordInp1');
let UsernameInp1 = document.getElementById('usernameInp1');
let MainForm1 = document.getElementById('MainForm1');

let RegisterUser = evt =>{
    evt.preventDefault();

    createUserWithEmailAndPassword(auth, EmailInp1.value, PasswordInp1.value)
    .then((Credentials)=>{
        set(child(dbref, 'UserAuthList/' + Credentials.user.uid), {
         username: UsernameInp1.value
        }).then(() => {
        alert('Registration successful!'); // Provide feedback to the user
         wrapper.classList.remove('active'); // Redirect to the login page
        });
})
    .catch((error)=>{
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    })
}

MainForm1.addEventListener('submit',RegisterUser);

/**
* Firebase login
*/

let RememberMeCheckbox = document.getElementById('rememberMeCheckbox');
let EmailInp = document.getElementById('emailInp');
let EmailInp2 = document.getElementById('emailInp2');
let PassInp = document.getElementById('passwordInp');
let MainForm = document.getElementById('MainForm');
let MainForm2 = document.getElementById('MainForm2');

let SignInUser = (evt) => {
    evt.preventDefault();

    signInWithEmailAndPassword(auth, EmailInp.value, PassInp.value)
        .then((Credentials) => {
            console.log('Authentication successful:', Credentials);

            // Fetch email and username from the database
            const userRef =ref (db, 'UserAuthList/' + Credentials.user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userEmail = Credentials.user.email;
                    const username = snapshot.val().username;

                    // Display a welcome message with the user's email and username
                    
                    Out.classList.add('active');
                    In.classList.add('active');
                    wrapper.classList.remove('active-popup');
                    alert(`User with email ${userEmail} has logged in.\nWelcome ${username}!`);
                    window.location.href = '/';
                    document.getElementById('name').textContent = `${username}`;
                    // Store user data based on "Remember Me" checkbox
                    
                    if (RememberMeCheckbox.checked) {
                        // Use localStorage for persistent storage
                        localStorage.setItem("user-info", JSON.stringify({
                            email: userEmail,
                            username: username
                        }));
                        localStorage.setItem("user-creds", JSON.stringify(Credentials.user));
                    } else {
                        // Use sessionStorage for session-specific storage
                        sessionStorage.setItem("user-info", JSON.stringify({
                            email: userEmail,
                            username: username
                        }));
                        sessionStorage.setItem("user-creds", JSON.stringify(Credentials.user));
                    }
                }
            });

            // Log and store information within the same then block
            console.log('User credentials stored in storage:', Credentials.user);
            console.log('User info stored in storage:', sessionStorage.getItem("user-info"));

        })
        .catch((error) => {
            alert(error.message);
            console.log(error.code);
            console.log(error.message);
        });
};

let ForgotPassword = () =>{
    
    sendPasswordResetEmail(auth, EmailInp2.value)
    .then(()=>{
        alert("Password reset link has been sent to your email.")
        wrapper2.classList.remove('active-popup2');
        wrapper.classList.add('active-popup');
    })
    .catch((error)=>{
        console.log(error.code);
        console.log(error.message);
    })
}
MainForm.addEventListener('submit', SignInUser);
MainForm2.addEventListener('submit',ForgotPassword);



document.addEventListener('DOMContentLoaded', async() => {
    // Check if user is logged in based on stored data
    const storedUserInfo = JSON.parse(localStorage.getItem("user-info")) || JSON.parse(sessionStorage.getItem("user-info"));
    const storedUserCreds = JSON.parse(localStorage.getItem("user-creds")) || JSON.parse(sessionStorage.getItem("user-creds"));

    if (storedUserInfo && storedUserCreds) {
        // The user is already logged in
        document.getElementById('name').textContent = `${storedUserInfo.username}`;

      Out.classList.add('active');
        In.classList.add('active');
        // You can perform additional actions as needed


                    // Fetch and display user profile image
                    const user = auth.currentUser;
                    const downloadURL = await getProfileImageURL(user);
                    if (downloadURL) {
                        // Update the image source for the specified IDs

                        const menuButton = document.getElementById("menuButton");
                        const profileImageElement = document.getElementById("profileImageElement");
            


                            menuButton.src = downloadURL;

            

                            profileImageElement.src = downloadURL;

                    }
    } else {
        Out.classList.remove('active');
        In.classList.remove('active');
        // The user is not logged in
        // You may want to show the login/register form
    }
    async function getProfileImageURL(user) {
        const storage = getStorage(app);
        const userImagesRef = storageRef(storage, `profile_images/${storedUserCreds.uid}`);
    
        try {
            const items = await listAll(userImagesRef);
            if (items.items.length > 0) {
                // If there are items, get the download URL of the first item (assuming only one image)
                const downloadURL = await getDownloadURL(items.items[0]);
                return downloadURL;
            }
        } catch (error) {
            console.error('Error fetching profile image URL:', error);
        }
    
    }
    var nameElement = document.getElementById("name");

    // Check if the element exists
    if (nameElement) {
        // Get the content of the h3 element
        var content = nameElement.textContent;

        // Check if the content is longer than 12 digits
        if (content.length > 12) {
            // Trim the content to 10 digits and add three dots
            var trimmedContent = content.slice(0, 12) + "...";

            // Update the content of the h3 element
            nameElement.textContent = trimmedContent;
        }
    }
});


/*
 *signout
 */
let signOutBtn = document.getElementById('signOutBtn');
let subMenu= document.getElementById("subMenu");
// Function to handle user sign-out
let signOutUser = () => {
    // Sign out the user
    auth.signOut().then(() => {
        // Clear stored user data from localStorage and sessionStorage
        localStorage.removeItem("user-info");
        localStorage.removeItem("user-creds");
        sessionStorage.removeItem("user-info");
        sessionStorage.removeItem("user-creds");

        // You can perform additional actions upon sign-out if needed

        // Alert to indicate successful sign-out
        alert('You have been signed out.',2000);
        // Force reload the current page, bypassing the cache
        window.location.href = '/';

        Out.classList.remove('active');
        In.classList.remove('active');
        subMenu.classList.remove('open-menu')

    }).catch((error) => {
        // Handle errors if sign-out fails
        console.error('Sign-out error:', error.message);
        alert('Sign-out failed. Please try again.');
    });
};
// Attach the sign-out function to the button click event
signOutBtn.addEventListener('click', signOutUser);


// Function to check if the user is signed in
document.getElementById("authLink").addEventListener("click", function(event) {
    const user = auth.currentUser;
    if (!user) {
        console.log("User not authenticated");
        event.preventDefault();
        wrapper.classList.add('active-popup');    // Prevent the default behavior of following the link
    } else {
        console.log("Authentication successful");
        // You can optionally perform additional actions here
    }
});

