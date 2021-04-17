import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../models/book.model';
import firebase from 'firebase/app';
// import DataSnapshot from 'firebase';   import "firebase/database";
import "firebase/database";
import "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class BooksService {

	books: Book[] = [];
	bookSubject = new Subject<Book[]>();

	constructor() {
		this.getBooks();
	}

	emitBooks() {
		this.bookSubject.next(this.books);
	}

	saveBooks() {
		firebase.database().ref('/books').set(this.books);
	}

	getBooks() {
		firebase.database().ref('/books')
			.on('value', (snapshot) => {
				this.books = snapshot.val() ? snapshot.val() : [];
				this.emitBooks();
			});
	}

	getSignleBook(id: number) {
		return new Promise((resolve, reject) => {
			firebase.database().ref('/books/' + id).once('value').then(
				(snapshot) => {				
					resolve(snapshot.val());
				},
				(error) => {
					reject(error);
				}
			)
		})
	}

	createNewBook(newBook: Book) {
		this.books.push(newBook);
		this.saveBooks();
		this.emitBooks();
	}

	removeBook(book: Book) {
		if (book.photo) {
			const storageRef = firebase.storage().refFromURL(book.photo);
			storageRef.delete().then(
				() => console.log('Photo file removed !'),
				(error) => console.log('Could not remove photo ! ' + error)
			);
		}
		const bookIndexToRemove = this.books.findIndex(
			(bookEl) => {
				if (bookEl === book) {
					return true; 
				}
			}
		);
		this.books.splice(bookIndexToRemove, 1);
		this.saveBooks();
		this.emitBooks();
	}

	uploadFile(file: File) {
		return new Promise((resolve, reject) => {
			const almostUniqueFileName = Date.now().toString();

			// --- METHODE OK ------------------------------------------------------
			const storageRef = firebase.storage().ref();
			var uploadTask = storageRef.child('images/' + almostUniqueFileName + file.name).put(file);
			// Listen for state changes, errors, and completion of the upload.
			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
				(snapshot) => {
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
					switch (snapshot.state) {
						case firebase.storage.TaskState.PAUSED: // or 'paused'
							console.log('Upload is paused');
							break;
						case firebase.storage.TaskState.RUNNING: // or 'running'
							console.log('Upload is running');
							break;
					}
				}, 
				(error) => {
					// A full list of error codes is available at
					// https://firebase.google.com/docs/storage/web/handle-errors
					// switch (error.code) {
					// 	case 'storage/unauthorized':
					// 		// User doesn't have permission to access the object
					// 		console.log("User doesn't have permission to access the object");
					// 		break;
					// 	case 'storage/canceled':
					// 		// User canceled the upload
					// 		console.log("User canceled the upload");
					// 		break;
					// 	case 'storage/unknown':
					// 		// Unknown error occurred, inspect error.serverResponse
					// 		console.log("Unknown error occurred, inspect error.serverResponse");
					// 		break;
					// }
					reject(error);
				}, 
				() => {
					// Upload completed successfully, now we can get the download URL
					uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
						console.log('File available at', downloadURL);
						resolve(downloadURL);
					});
				}
			);

			// --- METHODE OK ------------------------------------------------------
			// const storage = firebase.storage();		// Get a reference to the storage service
			// const storageRef = storage.ref();		// Create a storage reference from our storage service
			// const bookImgRef = storageRef.child('images/' + almostUniqueFileName + file.name); // Child Ref
			// bookImgRef.put(file)
			// 	.then((snapshot) => {
			// 		console.log('Uploaded a blob or file!');
			// 		snapshot.ref.getDownloadURL().then((downloadUrl) => {
			// 			console.log('URL img = ' + downloadUrl);
			// 			resolve(downloadUrl);
			// 		});
			// 	}).catch((error) => {
			// 		console.log('Erreur de chargement ! : ' + error);
			// 		reject();
			// 	});
			
			// --- METHODE OK ------------------------------------------------------
			// const upload = firebase.storage().ref()
			// 	.child('images/' + almostUniqueFileName + file.name).put(file);
			// upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
			// 	() => {
			// 		console.log('Chargement...');
			// 	},
			// 	(error) => {
			// 		console.log('Erreur de chargement ! : ' + error);
			// 		reject();
			// 	},
			// 	() => {
			// 		resolve(upload.snapshot.ref.getDownloadURL());
			// 	}
			// );
		});
	}
}
