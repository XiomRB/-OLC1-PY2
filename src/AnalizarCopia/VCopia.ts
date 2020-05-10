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
                            if(v.getSentencia(j).tipo == "VARIABLE") nueva.nombre.push(v.getSentencia(j).valor)
                        }
                        l.push(nueva)
                    }
                }
            }
        }
        return origen
    }

    verificar(original:Nodo,copia:Nodo){
        let origen:Nodo = this.verificarFuncion(original,this.variables)
        let l:Array<Var> = []
        let copy:Nodo = this.verificarFuncion(copia,l)
        if (origen.valor == copy.valor) {
            this.nombre = origen.valor
            let i:number = 0
            while(i < this.variables.length && i < l.length){
                if(this.variables[i].funcion == l[i].funcion){
                    if(this.variables[i].tipo == l[i].tipo){
                        if (JSON.stringify(this.variables[i].nombre) == JSON.stringify(l[i].nombre)) i++
                        else {
                            let j = 0
                            while(j < this.variables[i].nombre.length && j < l[i].nombre.length){
                                if(this.variables[i].nombre[j] == l[i].nombre[j]) i++
                                else{
                                    this.variables.splice(i,1)
                                    l.splice(i,1)
                                }
                            }
                            if(j < this.variables[i].nombre.length){
                                this.variables.splice(j,this.variables.length-j-1) //borra las funciones que sobran en el original
                            }
                        }
                    }else{
                        this.variables.splice(i,1)
                        l.splice(i,1)
                    }
                }else{
                    this.variables.splice(i,1)
                    l.splice(i,1)
                }
            }
            if(i < this.variables.length){
                this.variables.splice(i,this.variables.length-i)
            }
        }
    }
}

class Var{
    tipo:string
    nombre:Array<string>
    funcion:string

    constructor(t:string,f:string){
        this.tipo = t
        this.nombre = []
        this.funcion = f
    }
}