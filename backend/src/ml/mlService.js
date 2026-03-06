import axios from "axios";

export const getMLPredictions = async (features) => {

  try {

    const res = await axios.post(
      "http://127.0.0.1:8000/predict",
      features
    );

    return res.data;

  } catch (err) {

    console.error("ML prediction failed", err.message);
    return null;

  }
};