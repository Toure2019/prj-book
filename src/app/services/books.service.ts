import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../models/book.model';
import firebase from 'firebase/app';
// import DataSnapshot from 'firebase';

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
			.on('value', (data) => {		// data: DataSnapshot
				this.books = data.val() ? data.val() : [];
				this.emitBooks();
			});
	}

	getSignleBook(id: number) {
		return new Promise((resolve, reject) => {
			firebase.database().ref('/books' + id).once('value').then(
				(data) => {					// data: DataSnapshot
					resolve(data.val());
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
}
