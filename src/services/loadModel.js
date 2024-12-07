const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel('https://storage.googleapis.com/c-predict-store/model.json');
}
module.exports = loadModel;