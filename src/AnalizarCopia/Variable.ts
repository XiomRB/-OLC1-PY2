import Nodo from '../Arbol/Nodo'

export default class Variable{
    nombre:string;
    variables:Array<Var>

    constructor(){
        this.nombre = "---"
        this.variables = []
    }

    verificarClase(original:Nodo){
        for (let index = 0; index < original.sentencias.length; index++) {
            if(original.getSentencia(index).tipo == "CLASE") return original.getSentencia(index)
        }
        return new Nodo("","")
    }

    verificarFuncion(original:Nodo, l:Array<Var>){
        let origen:Nodo = this.verificarClase(original)
        for(let index = 0; index < origen.sentencias.length; index++) {
            let f:Nodo = origen.getSentencia(index)
            if(f.tipo == "FUNCION" || f.tipo == "METODO" || f.tipo == "MAIN"){
                for (let i = 0; i < f.sentencias.length; i++) {
                    let v:Nodo = f.getSentencia(i)
                    if(v.tipo == "DECLARACION"){
                        let nueva = new Var(v.valor,f.valor)
                        for (let j = 0; j < v.sentencias.length; j++) {
                            if(v.getSentencia(j).tipo == "VARIABLE"){
                                let nuevavar = new ListaVar(v.getSentencia(j).valor)
                                nueva.nombre.push(nuevavar)
                            } 
                        }
                        l.push(nueva)
                    }
                }
            }
        }
        return origen
    }

    verificar(original:Nodo,copia:Nodo){
        this.variables = [];
        let origen:Nodo = this.verificarFuncion(original,this.variables)
        let l:Array<Var> = []
        let copy:Nodo = this.verificarFuncion(copia,l)
        if (origen.valor == copy.valor) {
            this.nombre = origen.valor
            for (let i = 0; i < this.variables.length; i++) {
                let j
                for (j = 0; j < l.length; j++) {
                    if((this.variables[i].funcion == l[j].funcion) && (this.variables[i].tipo == l[j].tipo) ){
                            let k
                            for (k = 0; k < this.variables[i].nombre.length; k++) {
                                let m;
                                for (m = 0; m < l[j].nombre.length; m++) {
                                    if(this.variables[i].nombre[k].nombre == l[j].nombre[m].nombre){
                                        this.variables[i].nombre[k].esCopia = true;
                                        break
                                    }
                                }
                            }
                            if(k != this.variables[i].nombre.length) break
                    }
                } 
            }
        }else while(this.variables.length > 0) this.variables.pop()
    }
}

class Var{
    tipo:string
    nombre:Array<ListaVar> //LISTA DE IDs
    funcion:string

    constructor(t:string,f:string){
        this.tipo = t
        this.nombre = []
        this.funcion = f
    }
}

class ListaVar{
    nombre: string;
    esCopia:boolean;

    constructor(name:string){
       this.nombre = name
       this.esCopia = false;
    }
}