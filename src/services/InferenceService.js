const tf = require("@tensorflow/tfjs-node");

const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeImage(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    console.log("score: ", score);
    console.log("confidenceScore: ", confidenceScore);

    // Array with 0 to 1 from the model. > 50% as Cancer and below 50% as Non-cancer.
    const label = confidenceScore > 50 ? "Cancer" : "Non-cancer";

    let suggestion;

    if (label === "Cancer") {
      suggestion =
        "Segera periksa ke dokter";
    } else {
      suggestion =
        "Penyakit kanker tidak terdeteksi.";
    }

    return {
      confidenceScore,
      label,
      suggestion: suggestion,
    };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
  }
}

module.exports = predictClassification;
