import Nodo from '../Arbol/Nodo'

export default class Variable{
    nombre:string;
    variables:Array<FuncionMetodo>

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

    verificarFuncion(original:Nodo, l:Array<FuncionMetodo>){
        let origen:Nodo = this.verificarClase(original)
        for(let index = 0; index < origen.sentencias.length; index++) {
            let f:Nodo = origen.getSentencia(index)
            if(f.tipo == "FUNCION" || f.tipo == "METODO" || f.tipo == "MAIN"){
                let fm = new FuncionMetodo(f.valor)
                for (let i = 0; i < f.sentencias.length; i++) {
                    let v:Nodo = f.getSentencia(i)
                    if(v.tipo == "PARAMETRO"){
                        fm.parametros.push(v.valor)
                    }else{
                        this.verificarVariables(v,fm.variables)
                    }
                }
               /* for (let k = i; k < f.sentencias.length; k++) {
                    let v:Nodo = f.getSentencia(k)
                    this.verificarVariables(v,fm.variables)
                }*/
                l.push(fm)
            }
        }
        return origen
    }

    verificar(original:Nodo,copia:Nodo){
        this.variables = [];
        let origen:Nodo = this.verificarFuncion(original,this.variables)
        let l:Array<FuncionMetodo> = []
        let copy:Nodo = this.verificarFuncion(copia,l)
        if (origen.valor == copy.valor) {
            this.nombre = origen.valor
            for (let i = 0; i < this.variables.length; i++) {
                let j
                for (j = 0; j < l.length; j++) {
                    if(this.variables[i].funcion == l[j].funcion){
                        if(JSON.stringify(this.variables[i].parametros) == JSON.stringify(l[j].parametros)){
                            let k
                            for (k = 0; k < this.variables[i].variables.length; k++) {
                                let m;
                                for (m = 0; m < l[j].variables.length; m++) {
                                    if((this.variables[i].variables[k].tipo == l[j].variables[m].tipo) && (this.variables[i].variables[k].nombre == l[j].variables[m].nombre)){
                                        this.variables[i].variables[k].esCopia = true;
                                        break
                                    }
                                }
                            }
                            if(k != this.variables[i].variables.length) break
                        }
                            
                    }
                } 
            }
        }else while(this.variables.length > 0) this.variables.pop()
    }

    verificarVariables(nodo:Nodo,vrb:Array<ListaVar>){
        if(nodo.tipo == "DECLARACION"){
            for (let j = 0; j < nodo.sentencias.length; j++) {
                if(nodo.getSentencia(j).tipo == "VARIABLE"){
                    let nuevavar = new ListaVar(nodo.getSentencia(j).valor,nodo.valor)
                    vrb.push(nuevavar)
                } 
            }
        }else if(nodo.valor == "while" || nodo.valor == "if" || nodo.valor == "for" || nodo.valor == "do" || nodo.valor == "else"){
            for (let i = 0; i < nodo.sentencias.length; i++) this.verificarVariables(nodo.getSentencia(i),vrb)
        }else if(nodo.valor == "switch"){
            for (let j = 1; j < nodo.sentencias.length; j++) {
                    for (let k = 0; k < nodo.getSentencia(j).sentencias.length; k++) {
                        this.verificarVariables(nodo.getSentencia(j).getSentencia(k),vrb)
                    }
            }
        }
    }
}

class FuncionMetodo{
    parametros:Array<string>
    variables:Array<ListaVar> //LISTA DE IDs
    funcion:string

    constructor(f:string){
        this.variables = []
        this.funcion = f
        this.parametros = []
    }
}

class ListaVar{
    tipo:string
    nombre: string;
    esCopia:boolean;

    constructor(name:string,t:string){
       this.nombre = name
       this.esCopia = false;
       this.tipo = t
    }
}