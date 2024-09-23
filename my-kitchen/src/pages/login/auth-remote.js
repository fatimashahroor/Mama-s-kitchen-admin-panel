export const authRemote = {
    login: async(email, password) => {
      const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    };
    const response = await fetch('http://192.168.1.11:4000/api/login', settings);
    const data = await response.json();

    return data;
    },
    resetPassword: () => {},
  };