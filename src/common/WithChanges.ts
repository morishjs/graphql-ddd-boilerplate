import { Service } from 'typedi';
import { Result } from './functionalTypes/Result';

// Use cases that need changes can implement this
export interface WithChanges {
  changes: Changes;
}

// Extracted into its own class
@Service()
export class Changes {
  private readonly changes: Array<Result<any>>;

  constructor() {
    this.changes = [];
  }

  public addChange(result: Result<any>): void {
    this.changes.push(result);
  }

  public getCombinedChangesResult(): Result<any> {
    return Result.combine(this.changes);
  }
}
