import { Component } from '@angular/core';
import firebase from 'firebase/app'; 	// Doit être toujours importé en premier
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.css']
})
export class AppComponent {
  	title = 'prj-book';
	//  databaseURL: "https://prj-book-2021.firebaseio.com", 
	constructor() {
		const config = {
			apiKey: "AIzaSyBXn97TSIe4ilQ7NejiXS6eWRGEb_gcJ1c",
			authDomain: "prj-book-2021.firebaseapp.com",
			databaseURL: "https://prj-book-2021-default-rtdb.firebaseio.com/",
			projectId: "prj-book-2021",
			storageBucket: "prj-book-2021.appspot.com",
			messagingSenderId: "856793800231",
			appId: "1:856793800231:web:1b4d6262a58a55e91b3802",
			measurementId: "G-G9WSQC43K1"
		};
		firebase.initializeApp(config);
	}
}
