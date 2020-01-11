const tools = require('../js/tools');

const alphabet = { 
    "A": 0,
    "Ą": 1,
    "B": 2,
    "C": 3,
    "Ć": 4,
    "D": 5,
    "E": 6,
    "Ę": 7,
    "F": 8,
    "G": 9,
    "H": 10,
    "I": 11,
    "J": 12,
    "K": 13,
    "L": 14,
    "Ł": 16,
    "M": 17,
    "N": 18,
    "Ń": 19,
    "O": 20,
    "Ó": 21,
    "P": 22,
    "R": 23,
    "S": 24,
    "Ś": 25,
    "T": 26,
    "U": 27,
    "W": 28,
    "Y": 29,
    "Z": 30,
    "Ź": 32,
    "Ż": 33,
 };

const Sort = array => {
    let buffer;
    let first;
    let second;
    let sortedArray = [];

    let data = tools.LoadData();

    //array of persons indices in pesrons array
    let indices = GetIndices(array, data.members);

    

    return sortedArray;  
};

const GetIndices = (arrayToSort, membersArray) => {
    let indices = [];

    arrayToSort.forEach(el => {
        const index = tools.GetElementOfArrayById(el, membersArray);
        indices.push(index);
    });

    return indices;
}