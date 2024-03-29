// 1. Функция sum принимает параметром целые положительные
// числа (неопределённое кол-во) и возвращает их сумму (rest).

export function sum(...nums: Array<number>): number {
  console.log(nums);
  let b = [...nums];
  let sum1 = 0;
  for (let i = 0; i < b.length; i++) {
    sum1 += b[i];
  }
  return sum1;
  //return nums.reduce((a,b) => a+b)
  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return 123;
}

// 2. Функция getTriangleType принимает три параметра:
// длины сторон треугольника.
// Функция должна возвращать:
//  - "10", если треугольник равносторонний,
//  - "01", если треугольник равнобедренный,
//  - "11", если треугольник обычный,
//  - "00", если такого треугольника не существует.

export function getTriangleType(a: number, b: number, c: number): string {
  if (a + b < c || a + c < b || b + c < a) return '00';
  if (a === b && b === c) return '10';
  if (a !== b && b !== c && a !== c) return '11';
  if (a === b || a === c || b === c) return '01';

  // В return стоит "заглушка", чтоб typescript не ругался
  return '';
}

// 3. Функция getSum принимает параметром целое число и возвращает
// сумму цифр этого числа

export function getSum(number: number): number {
  let sum = 0,
    tmp;
  while (number > 0) {
    tmp = number % 10;
    number = (number - tmp) / 10;
    sum += tmp;
  }
  return sum;

  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return 123;
}

// 4. Функция isEvenIndexSumGreater принимает  параметром массив чисел.
// Если сумма чисел с чётными ИНДЕКСАМИ!!! (0 как чётный индекс) больше
// суммы чисел с нечётными ИНДЕКСАМИ!!!, то функция возвращает true.
// В противном случае - false.

export const isEvenIndexSumGreater = (arr: Array<number>): boolean => {
  let sum1 = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 == 0) sum1 += arr[i];
  }

  let sum2 = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 !== 0) sum2 += arr[i];
  }
  if (sum1 > sum2) return true;
  return false;
};

/*let sum3 = 0;
let sum4 = 0;
for (let i = 0; i < arr.length; i++){
    if(i%2){
      sum3 += arr[i];
    }else{
      sum4 += arr[i];
    }
}*/

//...здесь пишем код.

// В return стоит "заглушка", чтоб typescript не ругался

// 5. Функция getSquarePositiveIntegers принимает параметром массив чисел и возвращает новый массив.
// Новый массив состоит из квадратов целых положительных чисел, котрые являются элементами исходгого массива.
// Исходный массив не мутирует.

export function getSquarePositiveIntegers(array: Array<number>): Array<number> {
  let newarray: number[] = [];
  for (let i = 0; i < array.length; i++) {
    if (Number.isInteger(array[i]) && array[i] > 0) {
      newarray.push(array[i] * array[i]);
    } else {
      continue;
    }
  }
  return newarray;
  return array.filter((el) => el % 1 === 0 && el > 0).map((el) => el * el);
  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
}

// 6. Функция принимает параметром целое не отрицательное число N и возвращает сумму всех чисел от 0 до N включительно
// Попробуйте реализовать функцию без использования перебирающих методов.

export function sumFirstNumbers(N: number): number {
  /* let sum = 0;
  for (let i = 1; i <= N; i++) {
    sum += i;
  }
  return sum;
} */

  /* return (N*(N+1))/2 */
  if (N > 0) return (N += sumFirstNumbers(N - 1));
  return N;
}
//...здесь пишем код.
// В return стоит "заглушка", чтоб typescript не ругался

// ...и "лапку" вверх!!!!

// Д.З.:
// 7. Функция-банкомат принимает параметром целое натуральное число (сумму).
// Возвращает массив с наименьшим количеством купюр, которыми можно выдать эту
// сумму. Доступны банкноты следующих номиналов:
// const banknotes = [1000, 500, 100, 50, 20, 10, 5, 2, 1].
// Считаем, что количество банкнот каждого номинала не ограничено

export function getBanknoteList(amountOfMoney: number): Array<number> {
  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return [1];
}
