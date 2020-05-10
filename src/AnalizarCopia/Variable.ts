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
            for (let i = 0; i < this.variables.length; i++) {
                let j
                for (j = 0; j < l.length; j++) {
                    if((this.variables[i].funcion == l[j].funcion) && (this.variables[i].tipo == l[j].tipo) ){
                            let k
                            for (k = 0; k < this.variables[i].nombre.length; k++) {
                                let m;
                                for (m = 0; m < l[j].nombre.length; m++) {
                                    if(this.variables[i].nombre[k] == l[j].nombre[m])break
                                }
                                if(m == l[j].nombre.length) this.variables[i].nombre.splice(k,1)
                                else break
                            }
                            if(k != this.variables[i].nombre.length) break
                        
                    }
                }
                console.log(j + " original " + i )
                if(j == l.length){
                    this.variables.splice(i,1)
                    i--
                } 
            }
        }
    }
}

class Var{
    tipo:string
    nombre:Array<string> //LISTA DE IDs
    funcion:string

    constructor(t:string,f:string){
        this.tipo = t
        this.nombre = []
        this.funcion = f
    }
}