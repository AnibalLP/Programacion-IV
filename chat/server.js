console.log("Hola Mundo desde NodeJS");

let num1 = 5,
    num2 = 6,
    resp = num1 + num2;
console.log("Respuesta: ", resp);

let generarTable = (ntable)=>{
    for(let i=1; i<=10; i++){
        console.log( `${ntable}*${i}=${ntable*i}` );
    }
};
generarTable(8);
generarTable(9);