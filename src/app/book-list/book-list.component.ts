import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from '../models/book.model';
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

	books: Book[];
	bookSubscription: Subscription;

  	constructor(private bookService: BooksService, private router: Router) { }

  	ngOnInit(): void {
		this.bookSubscription = this.bookService.bookSubject.subscribe(
			(books: Book[]) => {
				this.books = books;
			}
		);
		this.bookService.emitBooks();
  	}
	
	onNewBook() {
		this.router.navigate(['/books', 'new']);
	}

	onDeleBook(book: Book) {
		this.bookService.removeBook(book);
	}

	onViewBook(id: number) {
		this.router.navigate(['/books', 'view', id]);
	}

	ngOnDestroy() {
		this.bookSubscription.unsubscribe();
	}
}
