/*
FULLSTACK Example - docker (Variant 3)

This is one of many narrated examples added to reach a large volume of practical code samples.

CODE:
const input = { id: 42, topic: "docker" };
const processed = Object.entries(input).reduce((acc, [k, v]) => { acc[k] = typeof v === 'string' ? v.toUpperCase() : v; return acc; }, {});
console.log("Processed docker:", processed);

ENGLISH NARRATION / EXPLANATION FOR A JUNIOR SOFTWARE ENGINEER:

We are looking at a realistic usage of docker.

Step 1: We prepare the data or dependencies that this feature needs. In real applications this data usually comes from user input, an API response, a database query, or configuration.

Step 2: The main logic runs. Pay attention to how we avoid common pitfalls such as mutation of shared state, missing null checks, or ignoring error cases. Juniors often write the happy path first and then discover production breaks these assumptions.

Step 3: We produce a result or side effect. The code shows both the transformation and how we might communicate the outcome (return value, logging, updating UI state, or persisting).

Why this matters:
- docker is used in almost every non-trivial feature you will build.
- Understanding the difference between mutating and immutable approaches saves hours of debugging later.
- Proper error and edge case handling is what separates demo code from production code.
- The patterns here compose: once you understand docker, you will see it inside React components, API handlers, background jobs, and data pipelines.

Try this yourself:
Change the input data, add another condition, or wrap it in a function that can be reused. Run the file and observe the output. Then read the surrounding lesson files to connect the dots.

This example exists so you can read code + explanation repeatedly until the concept feels natural. Good engineers read and write thousands of small examples like this over their career.
*/