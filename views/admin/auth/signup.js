const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ req, errors }) =>
  layout({
    content: `
      <div>
        <form method="POST">
          your id is ${req.session.userId}
            <input name="email" placeholder="email" />
            ${getError(errors, 'email')}
            <input name="password" placeholder="password" />
            ${getError(errors, 'password')}
            <input name="passwordConfirmation" placeholder="confirm password" />
            ${getError(errors, 'passwordConfirmation')}
            <button>Sign Up</button>
        </form>
      </div>
`,
  });
