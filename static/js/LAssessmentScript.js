
/**
 * import firebase
 */

// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref as storageRef, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Initialize Firebase app


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
const wrapper3 = document.querySelector(".wrapper3");
const ForgotPass = document.querySelector(".forgotpass");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");
const iconClose2 = document.querySelector(".icon-close2");

const Out = document.querySelector(".out");
const In = document.querySelector(".in");
const Off = document.querySelector(".off");
const Details = document.querySelector(".details");

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

// Initialize Firebase services
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
let downloadURL;

let EmailInp1 = document.getElementById('emailInp1');
let PasswordInp1 = document.getElementById('passwordInp1');
let UsernameInp1 = document.getElementById('usernameInp1');
let MainForm1 = document.getElementById('MainForm1');

let RegisterUser = evt =>{
    evt.preventDefault();

    createUserWithEmailAndPassword(auth, EmailInp1.value, PasswordInp1.value)
    .then((Credentials)=>{
        set(dbref(db, 'UserAuthList/' + Credentials.user.uid), {
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

let SignInUser = async (evt) => {
    evt.preventDefault();

    try {
        const Credentials = await signInWithEmailAndPassword(auth, EmailInp.value, PassInp.value);
        console.log('Authentication successful:', Credentials);

        // Fetch email and username from the database
        const userRef = ref(db, 'UserAuthList/' + Credentials.user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userEmail = Credentials.user.email;
            const username = snapshot.val().username;

            // Display a welcome message with the user's email and username
            Out.classList.add('active');
            In.classList.add('active');
            wrapper.classList.remove('active-popup');

            // Use await here since the function is marked as async
            await updateProfileImageURL();

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

        // Log and store information within the same try block
        console.log('User credentials stored in storage:', Credentials.user);
        console.log('User info stored in storage:', sessionStorage.getItem("user-info"));

    } catch (error) {
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    }
};

async function getProfileImageURLWithCache(user) {
    // If downloadURL is already available in the cache, return it
    if (downloadURL) {
        return downloadURL;
    }

    const storage = getStorage(app);
    const userImagesRef = storageRef(storage, `profile_images/${user.uid}`);

    try {
        const items = await listAll(userImagesRef);
        if (items.items.length > 0) {
            // If there are items, get the download URL of the first item (assuming only one image)
            downloadURL = await getDownloadURL(items.items[0]);
            return downloadURL;
        }
    } catch (error) {
        console.error('Error fetching profile image URL:', error);
    }

    // Return null if no downloadURL is found
    return null;
}

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

        const userId = storedUserCreds.uid;
        document.getElementById('name').textContent = `${storedUserInfo.username}`;
        document.getElementById('names').textContent = `${storedUserInfo.username}`;
        Out.classList.add('active');
        In.classList.add('active');
        // Reference to the sum value in the database under LAssessment path



        
if(!downloadURL){
    await updateProfileImageURL();
}


                        // Update the image source for the specified IDs
                        if (downloadURL) {
                            const updateProfileImageElement = document.getElementById("updateProfileImageElement");
                            const menuButton = document.getElementById("menuButton");
                            const profileImageElement = document.getElementById("profileImageElement");
                

                            menuButton.src = downloadURL;
                            profileImageElement.src = downloadURL;
                        }


    } else {
        console.log("no user");
        window.location.href="/?redirected=true";
        alert("Please login to avail this facility.")

        Out.classList.remove('active');
        In.classList.remove('active');
        // The user is not logged in
        // You may want to show the login/register form
    }
    async function updateProfileImageURL() {
        const userId = storedUserCreds.uid;
        const storage = getStorage(app);
        const userImagesRef = storageRef(storage, `profile_images/${userId}`);
    
        try {
            const items = await listAll(userImagesRef);
            if (items.items.length > 0) {
                // If there are items, get the download URL of the first item (assuming only one image)
                downloadURL = await getDownloadURL(items.items[0]);
            } else {
                downloadURL = null; // Set downloadURL to null if no image is found
            }
        } catch (error) {
            console.error('Error fetching profile image URL:', error);
            downloadURL = null; // Set downloadURL to null in case of an error
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

// Get the user ID from authentication





const quizForm = document.getElementById('quizForm');

quizForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    // Get the user ID from authentication
    const userId = auth.currentUser.uid;


    

    const radioButton1 = document.querySelector('input[name="answer1"]:checked');
    const radioButton2 = document.querySelector('input[name="answer2"]:checked');
    const radioButton3 = document.querySelector('input[name="answer3"]:checked');
    const radioButton4 = document.querySelector('input[name="answer4"]:checked');
    const radioButton5 = document.querySelector('input[name="answer5"]:checked');
    const radioButton6 = document.querySelector('input[name="answer6"]:checked');
    const radioButton7 = document.querySelector('input[name="answer7"]:checked');
    const radioButton8 = document.querySelector('input[name="answer8"]:checked');
    const radioButton9 = document.querySelector('input[name="answer9"]:checked');
    const radioButton10 = document.querySelector('input[name="answer10"]:checked');
    const radioButton11 = document.querySelector('input[name="answer11"]:checked');
   
    // Get the value of the checked radio button
    const selectedValue1 = radioButton1 ? parseInt(radioButton1.getAttribute('data-value')) : 0;
    const selectedValue2 = radioButton2 ? parseInt(radioButton2.getAttribute('data-value')) : 0;
    const selectedValue3 = radioButton3 ? parseInt(radioButton3.getAttribute('data-value')) : 0;
    const selectedValue4 = radioButton3 ? parseInt(radioButton4.getAttribute('data-value')) : 0;
    const selectedValue5 = radioButton5 ? parseInt(radioButton5.getAttribute('data-value')) : 0;
    const selectedValue6 = radioButton6 ? parseInt(radioButton6.getAttribute('data-value')) : 0;
    const selectedValue7 = radioButton7 ? parseInt(radioButton7.getAttribute('data-value')) : 0;
    const selectedValue8 = radioButton8 ? parseInt(radioButton8.getAttribute('data-value')) : 0;
    const selectedValue9 = radioButton9 ? parseInt(radioButton9.getAttribute('data-value')) : 0;
    const selectedValue10 = radioButton10 ? parseInt(radioButton10.getAttribute('data-value')) : 0;
    const selectedValue11 = radioButton11 ? parseInt(radioButton11.getAttribute('data-value')) : 0;
   
    //total sum
    const sum = selectedValue1+selectedValue2+selectedValue3+selectedValue4+selectedValue5+selectedValue6+selectedValue7+selectedValue8+selectedValue9+selectedValue10+selectedValue11;

    // Save user information in the database
    set(ref(db, `LAssessment/${userId}`), {
        unprocessedFood: selectedValue1,
        fastFood: selectedValue2,
        ciggarette: selectedValue3,
        alcohol: selectedValue4,
        sugarDrinks : selectedValue5,
        redMeat: selectedValue6,
        sleep: selectedValue7,
        exersice: selectedValue8,
        social: selectedValue9,
        stress: selectedValue10,
        screen: selectedValue11,
       
        total: sum
    }).then(() => {
        alert('User information saved successfully!');
        window.location.href = "/Lifestyle";
        // Optionally, you can redirect or perform other actions here
    }).catch((error) => {
        console.error('Error saving user information:', error);
    });
});
