interface Pagination {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
}

export const applyPagination = (query: Pagination, total: number) => {
  let pages = 0;
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const sort = query.sort || "desc";

  const skip = (page - 1) * limit;

  if (total) {
    pages = limit ? Math.ceil(total / limit) : 1;
  }

  return { skip, limit, pages, sort, page };
};
