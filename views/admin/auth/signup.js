const layout = require('../layout');

module.exports = ({ req }) =>
  layout({
    content: `
      <div>
        <form method="POST">
          your id is ${req.session.userId}
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="confirm password" />
            <button>Sign Up</button>
        </form>
      </div>
`,
  });
