const fs = require('fs');

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
    const records = await this.getAll();
    records.push(atrs);
    await this.writeAll(records);
  }

  // escribir el archivo (filename) con el nuevo registro (records)
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }
}

// nota: usamos versiones sincronas de los metodos porque dentro del constructor
// de una clases no se permiten funciones asincronas y en este caso
// esta clase se va instanciar una sola vez en el flujo de la aplicacion
// asi que no afecta el rendimiendo de manera significativa

const test = async () => {
  const repo = new usersRepository('users.json');
  await repo.create({ email: 'test@test.com', password: '123456' });
  const users = await repo.getAll();
  console.log(users);
};

test();
