var parser = require("./gramatica").parser;
//var Nodo = require("../Arbol/Nodo").parser;

function exec (input) {
    return parser.parse(input);
}

var arbol = exec(" import _cl3ases; \n import que_pedo ;\nclass token{boolean metodo1(){\n metodo32(hola,fdaf); quehace=2+32; if(fsd==87){comer(papaya,sandia,kiwi);}else if(24==jp){int c = i();}while(34<=hola){\n switch(clave>jj){case 4: return ooooo;}}return ldl;}\n void main(){\n double contador=69.42; }}");

function imprimirArbol(root){
    if(root!= null){
        console.log(root.tipo);
        for (let index = 0; index < root.sentencias.length; index++) {
            imprimirArbol(root.sentencias[index]);
        }
    }
}
imprimirArbol(arbol);