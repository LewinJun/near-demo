// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view } from 'near-sdk-js';

interface BookItem { timestamp: bigint; content: string }

@NearBindgen({})
class HelloNear {

  static schema = {
    greeting: 'string',
    books: 'object'
  };

  greeting: string = 'lewin1';
  books: { [key: string]: Array<BookItem> } = {};

  @view({}) // This method is read-only and can be called for free
  get_greeting(): string {
    return this.greeting;
  }

  @call({}) // This method changes the state, for which it cost gas
  set_greeting({ greeting }: { greeting: string }): void {
    near.log(`Saving greeting ${greeting}`);
    this.greeting = greeting;
  }

  @view({})
  get_books({ from_index, limit, accountId } : {from_index?: number; limit?: number; accountId: string }) : { total: number; data: Array<BookItem>; } {
    const aBooks = this.books[accountId] || [];
    const fIndex = from_index || 0;
    const size = limit || 10;
    let data: Array<BookItem> = [];
    if (aBooks.length > 0 && fIndex < aBooks.length) {
      data = aBooks.slice(fIndex, size + fIndex);
    }
    return { total: aBooks.length, data: data }
  }

  @call({})
  set_book({ content }: { content: string; }): { accountId: string; item: BookItem } {
    const accountId = near.predecessorAccountId()
    const aBooks = this.books[accountId] || []
    const timestampNanoseconds = near.blockTimestamp();
    const timestampMilliseconds = timestampNanoseconds / BigInt(1_000_000);
    const item = { timestamp: timestampMilliseconds, content: content }
    aBooks.push(item)
    this.books[accountId] = aBooks
    return {accountId, item}
  }

}