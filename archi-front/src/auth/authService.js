import api from "../api/graphql";

// 🔐 LOGIN
export const login = async (username, password) => {
  const res = await api.post("", {
    query: `
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password)
      }
    `,
    variables: {
      username,
      password,
    },
  });

  // ❌ Erreur GraphQL → on la remonte
  if (res.data.errors) {
    throw new Error(res.data.errors[0].message);
  }

  return res.data.data.login; // JWT
};

// 📝 REGISTER
export const register = async (username, email, password) => {
  const res = await api.post("", {
    query: `
      mutation Register(
        $username: String!
        $email: String!
        $password: String!
      ) {
        register(
          username: $username
          email: $email
          password: $password
        ) {
          id
          username
        }
      }
    `,
    variables: {
      username,
      email,
      password,
    },
  });

  // ❌ Erreur GraphQL → on la remonte
  if (res.data.errors) {
    throw new Error(res.data.errors[0].message);
  }

  return res.data.data.register;
};
