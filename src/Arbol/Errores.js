class  Errores{

    descripcion;
    valor;
    linea;
    columna;

    constructor(desc,val,l,c){
        this.descripcion = desc;
        this.valor = val;
        this.linea = l;
        this.columna = c;
    }

    mostrarError(){
        return this.descripcion + " " + this.valor + " en la linea: " + this.linea + " en la columna: " + this.columna;
    }
}