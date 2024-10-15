import Aggregate from "@core/domain/Aggregate";
import Candidate from "./candidate";

export default class Candidates extends Aggregate<Candidate> {
    private permanentRemoved: Candidate[] = [];

    public get permanentRemovedItems(): Array<Candidate> {
        return this.permanentRemoved;
    }
    compareItems(a: Candidate, b: Candidate): boolean {
        return a.equals(b);
    }

    static create(initialItems?: Array<Candidate>): Candidates {
        return new Candidates(initialItems);
    }

    public permanentRemove(...itemsToRemove: Array<Candidate>): void {
        itemsToRemove.forEach(item => {
            if (
                !this.permanentRemoved.find((permanentRemovedItem: Candidate) =>
                    this.compareItems(item, permanentRemovedItem),
                )
            ) {
                this.permanentRemoved.push(item);
            }
        });
    }
}
