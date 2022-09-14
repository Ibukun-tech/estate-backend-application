class ApiQuery {
  constructor(request, query) {
    console.log("constructor");
    this.request = request;
    this.query = query;
  }
  filter() {
    console.log("filter");
    const filteredQuery = { ...this.request };
    const fields = ["page", "sort", "limit", "fields"];
    fields.forEach((el) => {
      delete filteredQuery[el];
    });
    this.query = this.query.find(filteredQuery);
    return this.query;
  }
  sort() {
    if (this.request.sort) {
      const sortRequest = this.request.sort.split(",").join(" ");
      this.query = this.query.sort(sortRequest);
    }
    return this.query;
  }
  fields() {
    if (this.request.fields) {
      const fieldRequest = req.request.split(",").join(" ");
      this.query = this.query.sort(fieldRequest);
    }
    return this.query;
  }
}
module.exports = ApiQuery;
