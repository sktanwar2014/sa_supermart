const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve({ data: reader.result, name: file.name });
  reader.onerror = error => reject(error);
});

module.exports = {toBase64: toBase64};