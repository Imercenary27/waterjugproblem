import { NotFoundException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';

import {
    Connection,
    FilterQuery,
    Model,
    PipelineStage,
    ProjectionType,
    SaveOptions,
    Types,
    UpdateQuery,
} from 'mongoose';

import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;

    constructor(
        protected readonly model: Model<TDocument>,
        private readonly connection: Connection,
    ) {}

    async create(document: Omit<TDocument, '_id'>, options?: SaveOptions): Promise<TDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        return (
            (await createdDocument.save(options))
                // await createdDocument.save()
                .toJSON() as unknown as TDocument
        );
    }

    async insertMany(docs: Array<TDocument>) {
        const documents = await this.model.insertMany(docs);
        return documents;
    }

    async findOne(
        filterQuery: FilterQuery<TDocument>,
        projection?: ProjectionType<TDocument> | null | undefined,
    ): Promise<TDocument> {
        const document = await this.model.findOne(filterQuery, projection, { lean: true });
        return document;
    }
    async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>) {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            lean: true,
            new: true,
        });

        if (!document) {
            this.logger.warn(`Document not found with filterQuery:`, filterQuery);
            throw new NotFoundException('Document not found.');
        }

        return document;
    }

    async upsert(filterQuery: FilterQuery<TDocument>, document: Partial<TDocument>) {
        return this.model.findOneAndUpdate(filterQuery, document, {
            lean: true,
            upsert: true,
            new: true,
        });
    }
    async updateMany(filterQuery: FilterQuery<TDocument>, updatequery: UpdateQuery<TDocument>) {
        return this.model.updateMany(filterQuery, updatequery, {
            lean: true,
            ///upsert: true,
            new: true,
        });
    }

    async aggregation(pipeline: PipelineStage[]) {
        return this.model.aggregate(pipeline);
    }

    async distinct(field: string, filterQuery: FilterQuery<TDocument>) {
        return this.model.distinct(field, filterQuery);
    }

    async find(
        filterQuery: FilterQuery<TDocument>,
        projection?: ProjectionType<TDocument> | null | undefined,
    ) {
        return this.model.find(filterQuery, projection, { lean: true });
    }

    async startTransaction() {
        const session = await this.connection.startSession();
        session.startTransaction();
        return session;
    }
}
