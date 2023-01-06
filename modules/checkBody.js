function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) {
    if (!body[field] || body[field] === '') {
      isValid = false;
    }
  }

  return isValid;
}

function checkBodyFront(state) {
  let isValid = true;

  for (const field of state) {
    if (!field|| field === '') {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { checkBody, checkBodyFront };
