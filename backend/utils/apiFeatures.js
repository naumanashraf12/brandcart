const _ = require("lodash");

class APIFeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });

    return this;
  }
  filterCategory() {
    const keyword = this.querystr.category;
    if (keyword) {
      this.query = this.query.find({ category: keyword });
    }
    return this;
  }
  pagination(resperpage) {
    const currentPage = Number(this.querystr.page) || 1;
    const skip = resperpage * (currentPage - 1);
    this.query = this.query.limit(resperpage).skip(skip);
    return this;
  }
  filter() {
    const copystr = { ...this.querystr };
    const result = _.omit(copystr, ["keyword", "category", "page", "limit"]);

    let querystr = JSON.stringify(result);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(querystr));
    return this;
  }
  filterLive() {
    this.query = this.query.find({
      dateAuction: {
        $lt: new Date(Date.now()),
        $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    });

    return this;
  }
  filterExpired() {
    this.query = this.query.find({
      dateAuction: {
        $lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      active: true,
    });

    return this;
  }
}
module.exports = APIFeatures;
