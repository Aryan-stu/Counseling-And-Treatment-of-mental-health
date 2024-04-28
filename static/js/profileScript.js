import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Initialize Firebase (replace with your Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyC2fxyHrAHrB8k9PzLF4MIaDde6W09wn_4",
    authDomain: "mental-health-7c08f.firebaseapp.com",
    databaseURL: "https://mental-health-7c08f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mental-health-7c08f",
    storageBucket: "mental-health-7c08f.appspot.com",
    messagingSenderId: "184742629329",
    appId: "1:184742629329:web:184d9591d35607c4d29af0"
  };
  

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

const cropperOptions = {
    aspectRatio: 1, // Square cropping (you can adjust this as needed)
    crop: function (event) {
        const data = event.detail;
        document.getElementById('cropX').value = Math.round(data.x);
        document.getElementById('cropY').value = Math.round(data.y);
        document.getElementById('cropWidth').value = Math.round(data.width);
        document.getElementById('cropHeight').value = Math.round(data.height);
    }
};

// Initialize cropper with options
const imageInput = document.getElementById('profileImage');
const croppedImageContainer = document.getElementById('croppedImageContainer');
const croppedImage = document.getElementById('croppedImage');
let cropper;

// Listen for changes in the file input
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        // Create an image element dynamically
        const imageElement = document.createElement('img');

        // Append the image element to the container
        imageInput.parentNode.insertBefore(imageElement, imageInput.nextSibling);

        // Read the selected image into cropper
        const reader = new FileReader();
        reader.onload = (e) => {
            imageElement.src = e.target.result;

            // Initialize cropper with options
            cropper = new Cropper(imageElement, cropperOptions);
            croppedImageContainer.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Handle profile form submission
const userProfileForm = document.getElementById('UserProfileForm');
userProfileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get cropping coordinates
    const cropX = document.getElementById('cropX').value;
    const cropY = document.getElementById('cropY').value;
    const cropWidth = document.getElementById('cropWidth').value;
    const cropHeight = document.getElementById('cropHeight').value;

    // Get the cropped image data (as a Blob)
    const croppedImageData = cropper.getCroppedCanvas().toDataURL('image/jpeg').split(',')[1];
    const croppedImageBlob = base64ToBlob(croppedImageData, 'image/jpeg');

    // Upload the cropped image to Firebase Storage
    const userId = auth.currentUser.uid;
    const storageRef = firebase.storage().ref(`profileImages/${userId}.jpg`);
    const uploadTask = storageRef.put(croppedImageBlob);

    // Handle the upload completion
    uploadTask.then(() => {
        // Get the download URL for the uploaded image
        storageRef.getDownloadURL().then((downloadURL) => {
            // Save the download URL in the database (you may have a 'users' node for this)
            const userRef = firebase.ref(db, `users/${userId}`);
            firebase.set(userRef, { profileImage: downloadURL });

            // Display the cropped image
            croppedImage.src = downloadURL;
            croppedImageContainer.style.display = 'block';

            // Optionally, you can redirect or perform other actions here
            alert('Profile updated successfully!');
        });
    }).catch((error) => {
        console.error('Error uploading image:', error);
        alert('Error updating profile. Please try again.');
    });
});

// Helper function to convert base64 to Blob
function base64ToBlob(base64String, mimeType) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
}