import UniqueEntityID from '@core/domain/UniqueEntityID';

export default interface IDomainEvent {
    dateTimeOccurred: Date;
    aggregateId: UniqueEntityID;
}
