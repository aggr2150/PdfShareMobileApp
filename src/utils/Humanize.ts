const ALPHABET = ['K', 'M', 'B', 'T'];
// const KOREAN = ['천', '만', '억'];
const Korean = [
  {
    string: '억',
    tres: 100000000,
  },
  {
    string: '만',
    tres: 10000,
  },
  {
    string: '천',
    tres: 1000,
  },
];
// export const humanizeNumber = (number: number) => {
//   let idx = 0;
//   while (number >= 1000 && ++idx <= ALPHABET.length) {
//     number /= 1000;
//   }
//   return String(idx === 0 ? number : number + ALPHABET[idx - 1]);
// };
export const humanizeNumber = (number = 0) => {
  // for (let key in Korean) {
  //   number >= key;
  // }
  for (const unit of Korean) {
    if (unit.tres <= number) {
      return String(
        (number / unit.tres).toFixed(number / unit.tres / 10 > 1 ? 0 : 1) +
          unit.string,
      );
    }
  }
  return String(number);
};

export const humanizeDate = (date: Date) => {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-');
};
