const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class usersRepository extends Repository {
  async comparePasswords(saved, supplied) {
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString('hex');
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
}

// nota: usamos versiones sincronas de los metodos porque dentro del constructor
// de una clases no se permiten funciones asincronas y en este caso
// esta clase se va instanciar una sola vez en el flujo de la aplicacion
// asi que no afecta el rendimiendo de manera significativa

module.exports = new usersRepository('users.json');
