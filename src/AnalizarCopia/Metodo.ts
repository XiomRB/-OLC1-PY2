import Nodo from '../Arbol/Nodo'

export default class Funcion{
    listaparametros:Array<string>;
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
        var lp:Array<string> = [];
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
                            if(this.listaparametros[i] == lp[j]){
                                if(this.listaretornos[i] == lr[j]){
                                    i++
                                    break
                                }
                            }
                        }
                        if(j == lf.length-1){
                            this.listafunciones.splice(i,1)
                            this.listaparametros.splice(i,1)
                            this.listaretornos.splice(i,1)
                            lf.splice(i,1)
                            lp.splice(i,1)
                            lr.splice(i,1)
                        }
                        j++
                    }

                }
                if(i < this.listafunciones.length){
                    this.listafunciones.splice(i,this.listafunciones.length-i)
                }
            }
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

    verificarFunciones(original:Nodo,lf:Array<string>,lp:Array<string>,lr:Array<string>){
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
                    this.verificarParametros(funcion,lp)
                }else if(funcion.tipo == "METODO" || funcion.tipo == "MAIN"){
                    lf.push(funcion.valor)
                    lr.push("void")
                    this.verificarParametros(funcion,lp)
                }
            }
        }
        return origen
    }

    verificarParametros(funcion:Nodo, lista:Array<string>){
        let listaparam:string = ""
        for (let index = 0; index < funcion.sentencias.length; index++) {
            let parametro:Nodo = funcion.getSentencia(index)
            if(parametro.tipo == "PARAMETRO"){
                listaparam += parametro.valor + " " + parametro.getSentencia(0).valor + ","
            } else break
        }
        if(listaparam == "") listaparam = " "
        lista.push(listaparam)
    }
}