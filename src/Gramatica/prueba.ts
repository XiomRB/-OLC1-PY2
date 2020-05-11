import Nodo from '../Arbol/Nodo'
var parser = require("./gramatica").parser;

/*function exec (input:string) {
    return parser.parse(input);
}

var twenty = exec("int id");
console.log(twenty.valor);*/

class analizador{
    raiz:Nodo;
    constructor(entrada:string){
        this.raiz = this.ejecutarAnalizador(entrada);
    }

    ejecutarAnalizador(entrada:string){
        return parser.parse(entrada)
    }

    imprimirArbol(root:Nodo){
        if(root!= null){
            console.log(root.tipo);
            root.sentencias.forEach(sentencia => {
                this.imprimirArbol(sentencia);
            });
        }
    }

    verArbol(){
        this.imprimirArbol(this.raiz);
    }
}

var analiza = new analizador("int id1,id2,id3");
analiza.verArbol();