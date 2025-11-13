// files imports

import { paginationFunction } from "../pagination.js";




export class ApiFeaturesCategory {
    // mongooseQuery = model.find
    // query = req.query
    constructor(query, mongooseQuery) {
        this.query = query;
        this.mongooseQuery = mongooseQuery;
    }


    pagination({ page, size }) {
        const { limit, skip } = paginationFunction({ page, size });
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
        return this;
    }

    sort(sortBy) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 });
            return this;
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':');
        const [key, value] = formula.split(':');

        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value });
        return this;
    }

    search(search) {
        const queryFilter = {};
        if (search.title) queryFilter.title = { $regex: search.title, $options: 'i' };

        this.mongooseQuery = this.mongooseQuery.find(queryFilter);
        return this;
    }

    filter(filters){
        const queryFilter = JSON.stringify(filters).replace(/gt|gte|lt|lte|regex|ne|eq|in|nin /g,(operator)=>`$${operator}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryFilter));
        return this;
    }
}