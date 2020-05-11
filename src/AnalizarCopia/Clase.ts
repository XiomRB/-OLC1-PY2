import Nodo from '../Arbol/Nodo'

export default class ClaseCopia{
    nombre:string;
    metodos:number;
    funciones:number;
    clasecopia:boolean;
    
    constructor(){
        this.nombre = "";
        this.metodos = 0;
        this.funciones = 0;
        this.clasecopia = true;
    }

    verificar(original:Nodo, copia:Nodo){
        var tablaoriginal:Array<Objeto> = this.verificarClase(original);
        var tablacopia:Array<Objeto> = this.verificarClase(copia);
        if(tablaoriginal.length == tablacopia.length){
            if (JSON.stringify(tablaoriginal[0]) == JSON.stringify(tablacopia[0])) {
                this.nombre = tablaoriginal[0].nombre
                for (let index = 1; index < tablaoriginal.length; index++) {
                    let j
                    for (j = 1; j < tablacopia.length; j++) {
                        if(JSON.stringify(tablaoriginal[index]) == JSON.stringify(tablacopia[j])){
                            if(tablaoriginal[index].tipo == "FUNCION") this.funciones++
                            else this.metodos++
                            break
                        }
                    }
                    if(j == tablacopia.length){
                        this.clasecopia = false;
                        return
                    }
                }
            } else{
                this.clasecopia = false
                return
            }
        }else{
            this.clasecopia = false
            return
        }
    }

    verificarClase(original:Nodo){
        let tabla:Array<Objeto> = [];
        for (let index = 0; index < original.sentencias.length; index++) {
            let nodo:Nodo = original.getSentencia(index)
            if(nodo.tipo == "CLASE"){
                tabla.push(new Objeto(nodo.tipo,nodo.valor))
                this.llenarTabla(nodo,tabla);
            }
        }
        return tabla;
    }

    llenarTabla(original:Nodo, tabla:Array<Objeto>){
        for (let index = 0; index < original.sentencias.length; index++) {
            let nodo:Nodo = original.getSentencia(index)
            if(nodo.tipo == "METODO" || nodo.tipo == "FUNCION" || nodo.tipo == "MAIN"){
                tabla.push(new Objeto(nodo.tipo,nodo.valor))
            }
        }
    }
}

class Objeto{
    tipo:string;
    nombre:string;

    constructor(t:string,n:string){
        this.tipo = t;
        this.nombre = n;
    }
}