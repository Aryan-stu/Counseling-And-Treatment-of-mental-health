
/**
 * import firebase
 */

// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const iconClose3 = document.querySelector(".icon-close3");
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
iconClose3.addEventListener('click',()=>{
    wrapper3.classList.remove('active-popup3');
});
Details.addEventListener('click',()=>{
    wrapper3.classList.add('active-popup3');
});
Off.addEventListener('click',()=>{
    wrapper3.classList.remove('active-popup3');
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
            await updateProfileImageURL(auth.currentUser);

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
    const userId = storedUserCreds.uid;
    if (storedUserInfo && storedUserCreds) {
        const proRef = ref(db, `selfCounseling/${userId}/problem/problem`);
  const spro1Ref = ref(db, `selfCounseling/${userId}/problem/subproblem1`);
  const spro2Ref = ref(db, `selfCounseling/${userId}/problem/subproblem2`);
  const whenRef = ref(db, `selfCounseling/${userId}/when/when`);


  Promise.all([
      get(proRef),
      get(spro1Ref),
      get(spro2Ref),
      get(whenRef)

  ]).then((snapshots) => {
      const pro = snapshots[0].val();
      const spro1 = snapshots[1].val();
      const spro2 = snapshots[2].val();
      const when = snapshots[3].val();


      document.getElementById('pro').textContent = `${pro}`;
      document.getElementById('sp1').textContent = `${spro1}`;
      document.getElementById('sp2').textContent = `${spro2}`;
      document.getElementById('since').textContent = `${when}`;
      document.getElementById('nobot').style.display = 'none';
      document.getElementById('gobot').style.display = 'block';
  }).catch((error) => {
      console.error("Error getting user information:", error);
  });
        // The user is already logged in
        document.getElementById('name').textContent = `${storedUserInfo.username}`;
        document.getElementById('profileName').textContent = `${storedUserInfo.username}`;
        document.getElementById('profileName').textContent = `${storedUserInfo.username}`;
        document.getElementById('profileEmail').textContent = ` ${storedUserInfo.email}`;
      Out.classList.add('active');
        In.classList.add('active');
        const sumRef = ref(db, `LAssessment/${userId}/total`);
        const majordepRef = ref(db, `MAssessment/${userId}/majorDep`);
        const bipolarDRef = ref(db, `MAssessment/${userId}/bipolarD`);
        const pddRef = ref(db, `MAssessment/${userId}/pdd`);
        const ppdRef = ref(db, `MAssessment/${userId}/ppd`);
        const seasonalDRef = ref(db, `MAssessment/${userId}/seasonalD`);
        const psychoticDRef = ref(db, `MAssessment/${userId}/psychoticD`);
        const preddRef = ref(db, `MAssessment/${userId}/predd`);
        const adRef = ref(db, `MAssessment/${userId}/ad`);
        const sdRef = ref(db, `MAssessment/${userId}/sd`);
        const dmddRef = ref(db, `MAssessment/${userId}/dmdd`);

        const snapshot001 = await get(majordepRef);
        const snapshot002 = await get(pddRef);
        const snapshot003 = await get(bipolarDRef);
        const snapshot004 = await get(ppdRef);
        const snapshot005 = await get(seasonalDRef);
        const snapshot006 = await get(psychoticDRef);
        const snapshot007 = await get(preddRef);
        const snapshot008 = await get(adRef);
        const snapshot009 = await get(sdRef);
        const snapshot0010 = await get(dmddRef);

        const majorDepValue = snapshot001.val();
        const pddValue = snapshot002.val();
        const bipolarDValue = snapshot003.val();
        const ppdValue = snapshot004.val();
        const seasonalDValue = snapshot005.val();
        const psychoticDValue = snapshot006.val();
        const preddValue = snapshot007.val();
        const adValue = parseInt(snapshot008.val());
        const sdValue = parseInt(snapshot009.val());
        const dmddValue = parseInt(snapshot0010.val());
        // You can perform additional actions as needed
        get(sumRef).then((snapshot) => {
            console.log("Snapshot exists:", snapshot.exists());
            if (snapshot.exists()) {
                const sumValue = snapshot.val();
                console.log("Sum value:", sumValue);


                if (sumValue !== null) {
                    // Calculate the result based on the sum value
                    const result = parseInt(((sumValue + 11) * 100) / 22);
                    console.log("Result:",result);
                    // Display the result div and hide the test div


                    // Update the progress bar value
                    const progressBar = document.querySelector('.progress-bar-1');
                    progressBar.style.setProperty('--value', result);
                }

                }}).catch((error) => {
                    console.error('Error fetching sum value:', error);
                });
                get(adRef).then((snapshots) =>{
                    console.log("Snapshot exists:", snapshots.exists());
                    if (snapshots.exists()) {
                        const adValue = snapshots.val();
                        console.log("ad value:", adValue);

                        if (adValue !== null) {
                            // Calculate the result based on the sum value
                    let results=parseInt(0);
                    if(ppdValue != 0 && preddValue!= 0){
                    results = parseInt((majorDepValue+pddValue+bipolarDValue+seasonalDValue+psychoticDValue+adValue+sdValue+dmddValue+preddValue+ppdValue)/10);
                    }if(pddValue!=0 && preddValue == 0){
                        results = parseInt((majorDepValue+pddValue+bipolarDValue+seasonalDValue+psychoticDValue+adValue+sdValue+dmddValue+ppdValue)/9);

                    }if(pddValue==0 && preddVaue !== 0){
                        results = parseInt((majorDepValue+pddValue+bipolarDValue+seasonalDValue+psychoticDValue+adValue+sdValue+dmddValue+predd)/9);

                    }else{
                        results = parseInt((majorDepValue+pddValue+bipolarDValue+seasonalDValue+psychoticDValue+adValue+sdValue+dmddValue)/8);
                    }

                    const progressBar = document.querySelector('.progress-bar-2');
                    progressBar.style.setProperty('--value', results);
                        }

                }}).catch((error) => {
                    console.error('Error fetching sum value:', error);
                });
                    // Fetch and display user profile image
if(!downloadURL){
    await updateProfileImageURL(auth.currentUser);
}


                        // Update the image source for the specified IDs
                        if (downloadURL) {
                            const updateProfileImageElement = document.getElementById("updateProfileImageElement");
                            const menuButton = document.getElementById("menuButton");
                            const profileImageElement = document.getElementById("profileImageElement");
                
                            updateProfileImageElement.src = downloadURL;
                            menuButton.src = downloadURL;
                            profileImageElement.src = downloadURL;
                        }

                    const userInformationRef = ref(db, `UserInformation/${userId}`);
                        try {
                            const snapshot = await get(userInformationRef);
                            const userInformation = snapshot.val();
                            console.log('Retrieved user information from Firebase:', userInformation);
                            if (!(userInformation)) {
                                document.getElementById('userDetailWarning').textContent = `Your have not filled it yet!`;
                            } 
                            if (userInformation) {

                                document.getElementById('detailAge').textContent = `${userInformation.age}`;
                                document.getElementById('detailSex').textContent = `${userInformation.sex}`;
                                document.getElementById('detailPhone').textContent = `${userInformation.phone}`;
                                document.getElementById('detailProfession').textContent = `${userInformation.profession}`;
                                document.getElementById('detailCity').textContent = `${userInformation.city}`;
                            } else {
                                document.getElementById('detailAge').textContent = '';
                            }
                        } catch (error) {
                            console.error('Error fetching user information from Firebase:', error);
                        }
    } else {
        Out.classList.remove('active');
        In.classList.remove('active');
        // The user is not logged in
        // You may want to show the login/register form
    }
    async function updateProfileImageURL(user) {
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


let ProfileImageForm = document.getElementById('ProfileImageForm');
let ProfileImageInput = document.getElementById('profileImage');
let updateProfileImageElement = document.getElementById('updateProfileImageElement');
let loadingSpinner = document.querySelector('.loading-spinner');
ProfileImageForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    try {
        loadingSpinner.style.display = 'block';
        const file = ProfileImageInput.files[0];
        await uploadProfileImage(file);
        console.log('Profile image URL updated in user profile');
        alert('Profile image uploaded successfully!');
        
    } catch (error) {
        console.error('Error uploading profile image:', error);
        alert('Error uploading profile image. Please try again.');
    }
    loadingSpinner.style.display = 'none';
});
// Function to upload profile image and update user profile
async function uploadProfileImage(file) {
    const user = auth.currentUser;
    const storage = getStorage(app);

    // Reference to the user's profile image directory
    const userImagesRef = storageRef(storage, `profile_images/${user.uid}`);

    try {
        // List all items in the directory
        const items = await listAll(userImagesRef);

        // Delete each file in the directory
        await Promise.all(items.items.map((item) => deleteObject(item)));

        console.log('User profile image directory cleaned successfully');
    } catch (error) {
        // Handle error if the directory doesn't exist (ignore the error)
        if (error.code !== 'storage/object-not-found') {
            console.error('Error cleaning user profile image directory:', error);
            throw error;
        }
    }

    // Reference to the new file location
    const storageReference = storageRef(storage, `profile_images/${user.uid}/${file.name}`);
    const uploadTask = uploadBytes(storageReference, file);

    try {
        const snapshot = await uploadTask;
        console.log('Profile Image uploaded successfully:', snapshot);

        // After updating the profile image, fetch and display it
        downloadURL = await getDownloadURL(snapshot.ref);


        await updateProfile(user, { photoURL: downloadURL });
        
        
        
    }
    catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
    window.location.href = '/user-profile';
        return downloadURL;
}


const UserDataForm = document.getElementById('UserDataForm');

UserDataForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    // Get the user ID from authentication
    const userId = auth.currentUser.uid;

    // Get form values
    const age = document.getElementById('age').value;
    const sex = document.getElementById('sex').value;
    const profession = document.getElementById('profession').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;

    // Save user information in the database
    set(ref(db, `UserInformation/${userId}`), {
        age: age,
        sex: sex,
        profession: profession,
        phone: phone,
        city: city
    }).then(() => {
        alert('User information saved successfully!');
        // Optionally, you can redirect or perform other actions here
    }).catch((error) => {
        console.error('Error saving user information:', error);
    });
});