import Nodo from '../Arbol/Nodo'

export default class Funcion{
    listaparametros:Array<Array<Parametro>>;
    listafunciones:Array<string>;
    listaretornos:Array<string>;
    nombre:string;

    constructor(){
        this.listafunciones = [];
        this.listaparametros = [];
        this.listaretornos = [];
        this.nombre = "---";
    }

    verificar(original:Nodo,copia:Nodo){
        let origen:Nodo = this.verificarFunciones(original,this.listafunciones,this.listaparametros,this.listaretornos)
        var lf:Array<string> = [];
        var lp:Array<Array<Parametro>> = [];
        var lr:Array<string> = [];
        let copy:Nodo = this.verificarFunciones(copia,lf,lp,lr)
        if(origen.valor == copy.valor){
            this.nombre = origen.valor
            if(this.listafunciones.length != 0 && lf.length != 0){
                let i:number = 0
                while(i < this.listafunciones.length){
                    let j = 0
                    while(j < lf.length){
                        if(this.listafunciones[i] == lf[j]){
                            if(this.listaretornos[i] == lr[j]){
                                let x
                                if(this.listaparametros[i].length == lp[j].length){
                                    for (x = 0; x < this.listaparametros[i].length; x++) {
                                        if(this.listaparametros[i][x].tipo != lp[j][x].tipo) break
                                    }
                                    if(x == this.listaparametros[i].length){
                                        i++
                                        break
                                    }
                                }
                            }
                        }
                        j++
                    }
                    if(j == lf.length){
                        this.listafunciones.splice(i,1)
                        this.listaparametros.splice(i,1)
                        this.listaretornos.splice(i,1)
                    }

                }
                if(i < this.listafunciones.length){
                    this.listafunciones.splice(i,this.listafunciones.length-i)
                }
            }
        }else{
            while(this.listafunciones.length > 0) this.listafunciones.pop()
            while(this.listaparametros.length > 0) this.listaparametros.pop()
            while(this.listaretornos.length > 0) this.listaretornos.pop()
        }
    }

    validarClase(original:Nodo){
        let i:number = 0
        while(i < original.sentencias.length){
            if(original.getSentencia(i).tipo == "CLASE") return original.getSentencia(i)
            i++;
        }
        return new Nodo("","");
    }

    verificarFunciones(original:Nodo,lf:Array<string>,lp:Array<Array<Parametro>>,lr:Array<string>){
        let origen:Nodo = this.validarClase(original)
        if(origen.sentencias.length!=0){
            for (let index = 0; index < origen.sentencias.length; index++) {
                let funcion:Nodo = origen.getSentencia(index);
                if (funcion.tipo == "FUNCION") {
                    if (funcion.valor.startsWith("boolean")) {
                        lf.push(funcion.valor.substring(8))
                        lr.push("boolean")
                    } else if(funcion.valor.startsWith("int")) {
                        lf.push(funcion.valor.substring(4))
                        lr.push("int")
                    } else if(funcion.valor.startsWith("char")) {
                        lf.push(funcion.valor.substring(5))
                        lr.push("char")
                    } else if(funcion.valor.startsWith("String")) {
                        lf.push(funcion.valor.substring(7))
                        lr.push("String")
                    } else if(funcion.valor.startsWith("double")) {
                        lf.push(funcion.valor.substring(7))
                        lr.push("double")
                    }
                    let params:Array<Parametro> = []
                    lp.push(this.verificarParametros(funcion,params))
                }else if(funcion.tipo == "METODO" || funcion.tipo == "MAIN"){
                    lf.push(funcion.valor)
                    lr.push("void")
                    let params:Array<Parametro> = []
                    lp.push(this.verificarParametros(funcion,params))
                }
            }
        }
        return origen
    }

    verificarParametros(funcion:Nodo, lista:Array<Parametro>){
        for (let index = 0; index < funcion.sentencias.length; index++) {
            let parametro:Nodo = funcion.getSentencia(index)
            if(parametro.tipo == "PARAMETRO"){
                let param = new Parametro(parametro.getSentencia(0).valor,parametro.valor)
                lista.push(param)
            } else break
        }
        return lista
    }
}

class Parametro{
    nombre:string
    tipo: string

    constructor(n:string,t:string){
        this.nombre =n
        this.tipo = t
    }
}