const test = {
  a: {
    aa: 51551,
  },
};

const s = structuredClone(test);

console.log(s);

s.a.aa = 35125631658;

console.log(s);
