const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class usersRepository {
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

  async getAll() {
    // abrir el archivo parsear el contenido y repornarlo
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    ); // preferible trabajar con promesas a medida de lo posible
  }
  async create(atrs) {
    atrs.Id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(atrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...atrs,
      password: `${buf.toString('hex')}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);

    return record;
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
}

// nota: usamos versiones sincronas de los metodos porque dentro del constructor
// de una clases no se permiten funciones asincronas y en este caso
// esta clase se va instanciar una sola vez en el flujo de la aplicacion
// asi que no afecta el rendimiendo de manera significativa

module.exports = new usersRepository('users.json');
