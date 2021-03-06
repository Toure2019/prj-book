import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})
export class SingleBookComponent implements OnInit {

	book: Book;

  	constructor(private route: ActivatedRoute, private bookService: BooksService, private router: Router) { }

  	ngOnInit(): void {
		this.book = new Book('', '');
		const id = this.route.snapshot.params['id'];
		this.bookService.getSignleBook(+id).then(
			(book: Book) => {
				this.book = book;
			}
		).catch((error) => {
			console.log('Erreur : ' + error);
		});
  	}

	onBack() {
		this.router.navigate(['/books']);
	}
}
