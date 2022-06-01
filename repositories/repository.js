const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating repository requires a filename');
    }
    this.filename = filename;

    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async create(atrs) {
    atrs.Id = this.randomId();

    const records = await this.getAll();
    records.push(atrs);
    await this.writeAll(records);

    return atrs;
  }

  async getAll() {
    // abrir el archivo parsear el contenido y repornarlo
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    ); // preferible trabajar con promesas a medida de lo posible
  }

  // escribir el archivo (filename) con el nuevo registro (records)
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }
  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(Id) {
    const records = await this.getAll();
    return records.find((record) => record.Id === Id);
  }

  async delete(Id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.Id !== Id);
    await this.writeAll(filteredRecords);
  }

  async update(Id, atrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.Id === Id);

    if (!record) {
      throw new Error(`Record with Id ${Id} does not exist`);
    }
    Object.assign(record, atrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
};
