export default class Nodo{
    tipo:string;
    valor:string;
    sentencias:Array<Nodo>;

    constructor(tipo:string, valor:string){
        this.tipo = tipo;
        this.valor = valor;
        this.sentencias = [];
    }

    getSentencia(indice:number){
        return this.sentencias[indice];
    }

    setHijos(sentencias:Array<Nodo>){
        this.sentencias = sentencias;
    }

    agregarHijos(sentencias:Array<Nodo>){
        for(let i:number = 0; i < sentencias.length;i++) this.sentencias.push(sentencias[i]);
    }

}