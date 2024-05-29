const fetch = require('node-fetch');

class Fetch {
  constructor(token) {
    this.base = process.env.BASE_GATEWAY;
    this.token = token; // Bearer eyJhbGciOiJSUzI ...
  }

  headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': this.token
    };
  }

  async get(url) {
    const requestOptions = {
      method: 'GET',
      headers: this.headers()
    };
    try {
      const response = await fetch(this.base + "/" + url, requestOptions);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        let er = await response.json();
        throw new Error(er.error);
      }
    } catch (error) {
      throw error;
    }
  }

  async post(url, body) {
    const requestOptions = {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body)  // Convert body to JSON format
    };
    try {
      const response = await fetch(this.base + "/" + url, requestOptions);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        let er = await response.json();
        throw new Error(er.error);
      }
    } catch (error) {
      throw error;
    }
  }

  async put(url, body) {
    const requestOptions = {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(body)  // Convert body to JSON format
    };
    try {
      const response = await fetch(this.base + "/" + url, requestOptions);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        let er = await response.json();
        throw new Error(er.error);
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(url) {
    const requestOptions = {
      method: 'DELETE',
      headers: this.headers()
    };
    try {
      const response = await fetch(this.base + "/" + url, requestOptions);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        let er = await response.json();
        throw new Error(er.error);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Fetch;
