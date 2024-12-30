const fs = require("fs");

// Function to decode a value from a given base to decimal
function decodeValue(base, value) {
  return parseInt(value, base);
}

// Function to perform Lagrange interpolation and find the constant term (f(0))
function lagrangeInterpolation(points) {
  let c = 0;
  const k = points.length;

  for (let i = 0; i < k; i++) {
    let xi = points[i][0]; // x-value
    let yi = points[i][1]; // y-value (f(xi))

    let li = 1;
    // Calculate Lagrange basis polynomial L_i(x) at x = 0
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        let xj = points[j][0];
        li *= (0 - xj) / (xi - xj); // Lagrange basis polynomial at x = 0
      }
    }
    c += yi * li; // Accumulate the contribution to the constant term
  }

  return c;
}

// Main function to read JSON input and calculate the constant term
function findConstantTerm(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const n = data.keys.n; // Number of points
  const k = data.keys.k; // Minimum number of points required (k = m + 1)

  // Decode the points (x, y)
  const points = [];
  for (let i = 1; i <= n; i++) {
    if (data[i]) {
      const x = i; // The key is the x-value
      const base = parseInt(data[i].base); // Base of the y-value
      const value = data[i].value; // Encoded y-value
      const y = decodeValue(base, value); // Decode the y-value
      points.push([x, y]);
    }
  }

  // Select the first k points for interpolation (this is sufficient for finding the constant term)
  const selectedPoints = points.slice(0, k);

  // Calculate the constant term using Lagrange interpolation
  const constantTerm = lagrangeInterpolation(selectedPoints);

  console.log("Constant term (c):", constantTerm);
}

// Example usage
findConstantTerm("data.json");
