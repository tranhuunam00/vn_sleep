/** Dto of domain layer(Payload) */
export class BaseQueryMongoPayload {
  filter?: object;
  sort?: Record<string, 1 | -1>;
  pagination?: {
    page?: number;
    limit?: number;
  };
  textSearch?: string;
}

/** Merge filter to payload */
export const mergeFilterToPayload = (
  queryPayload?: BaseQueryMongoPayload,
  moreFilter?: object,
): BaseQueryMongoPayload => {
  if (!queryPayload) {
    return {
      filter: { ...moreFilter },
    };
  }

  queryPayload.filter = { ...queryPayload.filter, ...moreFilter };

  return queryPayload;
};

export class MongooseQuery {
  filter?: object;
  sort?: Record<string, 1 | -1>;
  pagination?: {
    page?: number;
    limit?: number;
  };
}
export const mapToMongoQuery = (
  queryPayload: BaseQueryMongoPayload,
): MongooseQuery => {
  if (queryPayload.textSearch) {
    mergeFilterToPayload(queryPayload, {
      $text: { $search: queryPayload.textSearch },
    });
    // remove decor
    delete queryPayload.textSearch;
  }

  return queryPayload;
};
