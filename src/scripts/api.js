/// TODO: Silakan sesuaikan BASE URL dari endpoint Anda
const BASE_URL = 'https://notes-api-326499598178.asia-southeast2.run.app';

const ENDPOINT = {
  predict: `${BASE_URL}/predict`,
};

class PredictAPI {
  static async predict(data) {
    const response = await fetch(ENDPOINT.predict, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      redirect: 'follow',
    });

    const json = await response.json();
    return json;
  }
}
