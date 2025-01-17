%{
    const Nodo = require('../Arbol/Nodo');
    var CErrores=require('../Arbol/Errores');
    var CNodoError=require('../Arbol/NodoError');
%}

/* Definición Léxica */
%lex

%options case-sensitive

%%

\s+			{}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]  {}
"//"[^\n]*        {}

"System.out.println"              return'PRINTLN';
"System.out.print"              return'PRINT';
"int"			    return 'INT';
"double"			return 'DOUBLE';
"boolean"			return 'BOOLEAN';
"char"			  return 'CHAR';
"String"			return 'STRING';
"class"			  return 'CLASS';
"import"			return 'IMPORT';
"true"  			return 'TRUE';
"false"			  return 'FALSE';
"else"			  return 'ELSE';
"if"		    	return 'IF';
"switch"			return 'SWITCH';
"case"			  return 'CASE';
"default"			return 'DEFAULT';
"break"			  return 'BREAK';
"while"			  return 'WHILE';
"do"  			  return 'DO';
"for"			    return 'FOR';
"continue"		return 'CONTINUE';
"return "			return 'RETURN';
"void"  			return 'VOID';
"main"			  return 'MAIN';


">="          return 'MAYORIGUAL';
"<="          return 'MENORIGUAL';
"!="          return 'DISTINTO';
"=="          return 'IGUAL';
">"           return 'MAYOR';
"<"           return 'MENOR';

";"					return 'PTCOMA';
","					return 'COMA';
":"					return 'DOSPUNTOS';
"("					return 'PARIZQ';
")"					return 'PARDER';
"{"					return 'LLAVEIZQ';
"}"					return 'LLAVEDER';
"="					return 'ASIGNADOR';

"++"        return 'INCREMENTO';
"--"        return 'DECREMENTO';
"+"					return 'SUMA';
"-"					return 'RESTA';
"*"					return 'POR';
"/"					return 'DIVIDIDO';
"^"         return 'POTENCIA';
"%"         return 'MODULO';

"&&"        return 'AND';
"||"        return 'OR';
"!"         return 'NOT';

[0-9]+("."[0-9]+)?         return 'NUMERO';
([a-zA-Z_])[0-9a-zA-Z_]*   return 'IDENTIFICADOR';
(\"[^"]*\")              return 'CADENA';
(\'[^']\')                return 'CARACTER';

<<EOF>>				return 'EOF';

.					{ CErrores.Errores.add(new CNodoError.NodoError("Lexico","No se esperaba el caracter: "+yytext,yylineno)) }
/lex



/* Asociación de operadores y precedencia */

%left ELSE
%left OR
%left AND
%left IGUAL, DISTINTO
%left MAYORIGUAL, MENORIGUAL, MENOR, MAYOR
%left SUMA, RESTA
%left POR, DIVIDIDO, MODULO
%left POTENCIA
%right NOT
%left UMENOS

%start ini

%% /* Definición de la gramática */

ini
	: arch EOF {$$ = new Nodo("RAIZ","RAIZ"); $$.setHijos($1); return $$;}
  | error { CErrores.Errores.add(new CNodoError.NodoError("Sintactico","No se esperaba : "+yytext,yylineno)) }
;

clase : CLASS IDENTIFICADOR instclase {$$ = new Nodo("CLASE",$2); if($3!=null) $$.setHijos($3)} ;

listaid
  : listaid COMA IDENTIFICADOR {$$ = $1; $$.push(new Nodo("VARIABLE",$3));}
  | IDENTIFICADOR {$$ = []; $$.push(new Nodo("VARIABLE",$1));}
;

declavar : tipo listaid asigvar { $$ = new Nodo("DECLARACION",$1); $$.setHijos($2); if($3 != null) $$.sentencias.push($3); };

asigvar : ASIGNADOR expresion PTCOMA {$$ = new Nodo("ASIGNACION","ASIGNACION"); $$.sentencias.push($2);}
         | PTCOMA {$$ = null;}
;

tipo
  : BOOLEAN {$$ = $1;}
  | CHAR     {$$ = $1;}
  | STRING {$$ = $1;}
  | INT  {$$ =$1;}
  | DOUBLE {$$ =$1;}
;

expresion : RESTA expresion %prec UMENOS	      { $$ = new Nodo("ARITMETICA",$1); $$.sentencias.push($2);}
          | expresion SUMA expresion		        { $$ = new Nodo("ARITMETICA",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion RESTA expresion		        { $$ = new Nodo("ARITMETICA",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion POR expresion		          { $$ = new Nodo("ARITMETICA",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion DIVIDIDO  expresion	      { $$ = new Nodo("ARITMETICA",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion MODULO expresion          { $$ = new Nodo("ARITMETICA",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion POTENCIA expresion        { $$ = new Nodo("ARITMETICA",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion MENOR expresion		        { $$ = new Nodo("RELACIONAL",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion MAYOR expresion		        { $$ = new Nodo("RELACIONAL",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion MAYORIGUAL expresion	    { $$ = new Nodo("RELACIONAL",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion MENORIGUAL expresion	    { $$ = new Nodo("RELACIONAL",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion IGUAL expresion	          { $$ = new Nodo("RELACIONAL",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion DISTINTO expresion	      { $$ = new Nodo("RELACIONAL",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion OR expresion	            { $$ = new Nodo("LOGICA",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | expresion AND expresion	            { $$ = new Nodo("LOGICA",$2); $$.sentencias.push($1); $$.sentencias.push($3); }
          | NOT expresion	                      { $$ = new Nodo("LOGICA", $1); $$.sentencias.push($2); }
          | NUMERO				                      { $$ = new Nodo("PRIMITIVO",$1); }
          | TRUE				                        { $$ = new Nodo("PRIMITIVO",$1); }
          | FALSE				                        { $$ = new Nodo("PRIMITIVO",$1); }
          | CADENA			                        { $$ = new Nodo("PRIMITIVO",$1); }
          | IDENTIFICADOR       			          { $$ = new Nodo("VARIABLE",$1); }
          | IDENTIFICADOR llamada               { $$ = new Nodo("LLAMADA",$1); $$.setHijos($2);}
          | CARACTER                            { $$ = new Nodo("PRIMITIVO",$1); }
          | PARIZQ expresion PARDER		          { $$ = $2; }
;

llamada : PARIZQ param {$$ = []; if($2!= null) $$ =$2;};

lparam
  : lparam COMA expresion { $$ = $1; $$.push($3); }
  | expresion {$$ = []; $$.push($1);}
;

param
  : lparam PARDER {$$ = $1;}
  | PARDER {$$ = null;}
;

condicion : PARIZQ expresion PARDER { $$ = new Nodo("CONDICION", "CONDICION"); $$.sentencias.push($2) } ;


operador: INCREMENTO { $$ = new Nodo("SENTENCIA",$1); }
  | DECREMENTO { $$ = new Nodo("SENTENCIA",$1); }
;

repmet : LLAVEIZQ instruccionesrepmet LLAVEDER  { $$ = $2; }
       | LLAVEIZQ LLAVEDER                      { $$ = null; }
;

ifmet : LLAVEIZQ instruccionesifmet LLAVEDER    { $$ = $2; }
      | LLAVEIZQ LLAVEDER                       { $$ = null; }
;

ifmetrep : LLAVEIZQ instruccionesifmetrep LLAVEDER    { $$ = $2; }
      | LLAVEIZQ LLAVEDER                       { $$ = null; }
;

ifmetw : LLAVEIZQ instruccionesifmetw LLAVEDER    { $$ = $2; }
      | LLAVEIZQ LLAVEDER                       { $$ = null; }
;

sentwhilemet : WHILE condicion repmet { $$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2)};

sentformet : FOR PARIZQ inifor PTCOMA expresion PTCOMA IDENTIFICADOR operador PARDER repmet {$$ = new Nodo("SENTENCIA",$1); if($10 != null) $$.setHijos($10); $$.sentencias.unshift($8); $$.sentencias.unshift(new Nodo("CONDICION","CONDICION")) ; $$.sentencias[0].sentencias.push($5); $$.sentencias.unshift($3);};

sentifmet : IF condicion ifmet {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);}
   | IF condicion ifmet ELSE ifmet {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);$$.sentencias.push(new Nodo("SENTENCIA",$4)); if($5 != null) $$.sentencias[$$.sentencias.length-1].setHijos($5);}
   | IF condicion ifmet ELSE sentifmet {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3);$$.sentencias.unshift($2);$$.sentencias.push($5);}
;

sentifmetrep : IF condicion ifmetrep {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);}
   | IF condicion ifmetrep ELSE ifmetrep {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);$$.sentencias.push(new Nodo("SENTENCIA",$4)); if($5 != null) $$.sentencias[$$.sentencias.length-1].setHijos($5);}
   | IF condicion ifmetrep ELSE sentifmetrep {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3);$$.sentencias.unshift($2);$$.sentencias.push($5);}
;

sentifmetw : IF condicion ifmetw {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);}
   | IF condicion ifmetw ELSE ifmetw {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);$$.sentencias.push(new Nodo("SENTENCIA",$4)); if($5 != null) $$.sentencias[$$.sentencias.length-1].setHijos($5);}
   | IF condicion ifmetw ELSE sentifmetw {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3);$$.sentencias.unshift($2);$$.sentencias.push($5);}
;

sentdowhilemet : DO repmet WHILE condicion PTCOMA { $$ = new Nodo("SENTENCIA",$1); if($2 != null) $$.setHijos($2);  $$.sentencias.push($4); };

sentswitchmet : SWITCH PARIZQ expresion PARDER LLAVEIZQ casedef LLAVEDER {$$ = new Nodo("SENTENCIA",$1); $$.setHijos($6); $$.sentencias.unshift($3)};

sentswitchmetrep : SWITCH PARIZQ expresion PARDER LLAVEIZQ casedefrep LLAVEDER {$$ = new Nodo("SENTENCIA",$1); $$.setHijos($6); $$.sentencias.unshift($3)};

inifor: tipo IDENTIFICADOR ASIGNADOR expresion {$$ = new Nodo("DECLARACION",$1); $$.sentencias.push(new Nodo("VARIABLE",$2));$$.sentencias[0].sentencias.push($4);}
      | IDENTIFICADOR ASIGNADOR expresion {$$ = new Nodo("ASIGNACION",$1); $$.sentencias.push($3);}
;

listacase : listacase CASE expresion DOSPUNTOS instruccioneswemet      {$$ = $1; $$.push(new Nodo("CASE",$2)); $$[$$.length-1].setHijos($5);$$[$$.length-1].sentencias.unshift($3);}
          | CASE expresion DOSPUNTOS instruccioneswemet             {$$ = []; $$.push(new Nodo("CASE",$1)); $$[0].setHijos($4);$$[0].sentencias.unshift($2);}
;

casedef : listacase {$$ = $1;}
        | listacase DEFAULT DOSPUNTOS instruccioneswemet  {$$ = $1; $$.push(new Nodo("DEFAULT",$2)); $$[$$.length-1].setHijos($4); }
;

listacaserep : listacaserep CASE expresion DOSPUNTOS instruccionesifmetrep      {$$ = $1; $$.push(new Nodo("CASE",$2)); $$[$$.length-1].setHijos($5); $$[SS.length-1].sentencias.unshift($3);}
          | CASE expresion DOSPUNTOS instruccionesifmetrep             {$$ = []; $$.push(new Nodo("CASE",$1)); $$[0].setHijos($4); $$[0].sentencias.unshift($2);}
;

casedefrep : listacaserep {$$ = $1;}
        | listacaserep DEFAULT DOSPUNTOS instruccionesifmetrep {$$ = $1; $$.push(new Nodo("DEFAULT",$2)); $$[$$.length-1].setHijos($4); }
;

sentbreak : BREAK PTCOMA {$$ = new Nodo("SENTENCIA",$1);};

sentcont : CONTINUE PTCOMA {$$ = new Nodo("SENTENCIA",$1);};

sentretmet : RETURN PTCOMA {$$ = new Nodo("RETURN",$1)};
sentretfun : RETURN expresion PTCOMA {$$ = new Nodo("RETURN",$1); $$.sentencias.push($2); };

sout : PRINT PARIZQ expresion PARDER PTCOMA     {$$ = new Nodo("SENTENCIA",$1); $$.sentencias.push($3)}
     | PRINTLN PARIZQ expresion PARDER PTCOMA   {$$ = new Nodo("SENTENCIA",$1); $$.sentencias.push($3)}
;

instruccionesifmet
	: instruccionesifmet instruccionifmet {$$ = $1; $$.push($2);}
	| instruccionifmet {$$ = []; $$.push($1);}
;

instruccionifmet
	: sout  {$$ = $1;}
  | sentwhilemet {$$ = $1;}
  | sentdowhilemet {$$ = $1; }
  | sentformet { $$ = $1; }
  | sentifmet {$$ = $1; }
  | sentswitchmet { $$ = $1;}
  | declavar { $$ = $1;}
  | sentretmet { $$ = $1;}
  | IDENTIFICADOR llamada PTCOMA { $$ = new Nodo("LLAMADA",$1); $$.setHijos($2); if($$ != null) $$.valor = $1} 
  | IDENTIFICADOR varmet { $$ = $2; if($$ != null) $$.valor = $1}
;

instruccionesifmetw
	: instruccionesifmetw instruccionifmetw {$$ = $1; $$.push($2);}
	| instruccionifmetw {$$ = []; $$.push($1);}
;

instruccionifmetw
	: sout  {$$ = $1;}
  | sentwhilemet {$$ = $1;}
  | sentdowhilemet {$$ = $1; }
  | sentformet { $$ = $1; }
  | sentifmetw {$$ = $1; }
  | sentswitchmet { $$ = $1;}
  | declavar { $$ = $1;}
  | sentretmet { $$ = $1;}
  | IDENTIFICADOR llamada PTCOMA { $$ = new Nodo("LLAMADA",$1); $$.setHijos($2); if($$ != null) $$.valor = $1} 
  | IDENTIFICADOR varmet { $$ = $2; if($$ != null) $$.valor = $1}
  | sentbreak    {$$ =$1}
;

instruccionesifmetrep
	: instruccionesifmetrep instruccionifmetrep {$$ = $1; $$.push($2);}
	| instruccionifmetrep {$$ = []; $$.push($1);}
;

instruccionifmetrep
	: sout  {$$ = $1;}
  | sentwhilemet {$$ = $1;}
  | sentdowhilemet {$$ = $1; }
  | sentformet { $$ = $1; }
  | sentifmetrep {$$ = $1; }
  | sentswitchmetrep { $$ = $1;}
  | declavar { $$ = $1;}
  | sentretmet { $$ = $1;}
  | IDENTIFICADOR llamada PTCOMA { $$ = new Nodo("LLAMADA",$1); $$.setHijos($2); if($$ != null) $$.valor = $1} 
  | IDENTIFICADOR varmet { $$ = $2; if($$ != null) $$.valor = $1}
  | sentbreak { $$ = $1; }
  | sentcont  { $$ = $1; }
;

instruccionesrepmet : instruccionesrepmet instruccionifmetrep   {$$ = $1; $$.push($2);}
                    | instruccionifmetrep                       {$$ = []; $$.push($1);}
; 

instruccionrepmet : instruccionswmet  {$$ = $1;}
                  | sentcont          {$$ = $1;}
;

instruccionswmet : instruccionifmet   {$$ = $1;}
                 | sentbreak          {$$ = $1;}
;

instruccioneswemet: instruccioneswemet instruccionifmetw {$$ = $1; $$.push($2);}
                  | instruccionifmetw                    {$$ = []; $$.push($1);}
;

varmet : asigvar   { $$ = $1;}
       | operador PTCOMA  { $$ = $1;}
;

parametros : parametros COMA tipo IDENTIFICADOR   { $$ = $1; $$.push(new Nodo("PARAMETRO",$3)); $$[$$.length-1].sentencias.push(new Nodo("VARIABLE",$4));}
           | tipo IDENTIFICADOR                   { $$ = []; $$.push(new Nodo("PARAMETRO",$1)); $$[0].sentencias.push(new Nodo("VARIABLE",$2)); }
;

listaparametros: parametros PARDER {$$ = $1}
               | PARDER            {$$ = null}
;

metodo : VOID MAIN PARIZQ PARDER instmetodo { $$ = new Nodo("MAIN",$2); if($5 != null) $$.setHijos($5);}
      |  VOID IDENTIFICADOR PARIZQ listaparametros instmetodo { $$ = new Nodo("METODO",$2); if($4!=null) $$.setHijos($4); if($5 != null) $$.agregarHijos($5);}
;

instmetodo : LLAVEIZQ instruccionesifmet LLAVEDER   {$$ = $2;}
           | LLAVEIZQ LLAVEDER                      {$$ = null;}
;

funcion : tipo IDENTIFICADOR PARIZQ listaparametros instfun { $$ = new Nodo("FUNCION",$1 + " " +$2); if($4!= null) $$.setHijos($4);$$.agregarHijos($5);}
;

repfun : LLAVEIZQ instruccionesrepfun LLAVEDER  { $$ = $2; }
       | LLAVEIZQ LLAVEDER                      { $$ = null; }
;

iffun : LLAVEIZQ instruccionesiffun LLAVEDER  { $$ = $2; }
       | LLAVEIZQ LLAVEDER                    { $$ = null; }
;

iffunrep : LLAVEIZQ instruccionesiffunrep LLAVEDER  { $$ = $2; }
       | LLAVEIZQ LLAVEDER                    { $$ = null; }
;

iffunw : LLAVEIZQ instruccionesiffunw LLAVEDER  { $$ = $2; }
       | LLAVEIZQ LLAVEDER                    { $$ = null; }
;

sentwhilefun : WHILE condicion repfun{ $$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2)};

sentforfun : FOR PARIZQ inifor PTCOMA expresion PTCOMA IDENTIFICADOR operador PARDER repfun {$$ = new Nodo("SENTENCIA",$1); if($10 != null) $$.setHijos($10); $$.sentencias.unshift($8); $$.sentencias.unshift(new Nodo("CONDICION","CONDICION")) ; $$.sentencias[0].sentencias.push($5); $$.sentencias.unshift($3);};

sentiffun : IF condicion iffun {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);}
   | IF condicion iffun ELSE iffun {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);$$.sentencias.push(new Nodo("SENTENCIA",$4)); if($5 != null) $$.sentencias[$$.sentencias.length-1].setHijos($5);}
   | IF condicion iffun ELSE sentiffun {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3);$$.sentencias.unshift($2);$$.sentencias.push($5);}
;

sentiffunrep : IF condicion iffunrep {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);}
   | IF condicion iffunrep ELSE iffunrep {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);$$.sentencias.push(new Nodo("SENTENCIA",$4)); if($5 != null) $$.sentencias[$$.sentencias.length-1].setHijos($5);}
   | IF condicion iffunrep ELSE sentiffunrep {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3);$$.sentencias.unshift($2);$$.sentencias.push($5);}
;

sentiffunw : IF condicion iffunw {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);}
   | IF condicion iffunw ELSE iffunw {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3); $$.sentencias.unshift($2);$$.sentencias.push(new Nodo("SENTENCIA",$4)); if($5 != null) $$.sentencias[$$.sentencias.length-1].setHijos($5);}
   | IF condicion iffunw ELSE sentiffunw {$$ = new Nodo("SENTENCIA",$1); if($3 != null) $$.setHijos($3);$$.sentencias.unshift($2);$$.sentencias.push($5);}
;

sentdowhilefun : DO repfun WHILE condicion PTCOMA { $$ = new Nodo("SENTENCIA",$1); if($2 != null) $$.setHijos($2);  $$.sentencias.push($4); };

sentswitchfun : SWITCH PARIZQ expresion PARDER LLAVEIZQ casedeffun LLAVEDER {$$ = new Nodo("SENTENCIA",$1); $$.setHijos($6); $$.sentencias.unshift($3)};

sentswitchfunrep : SWITCH PARIZQ expresion PARDER LLAVEIZQ casedeffunrep LLAVEDER {$$ = new Nodo("SENTENCIA",$1); $$.setHijos($6); $$.sentencias.unshift($3)};

instruccionesiffun
	: instruccionesiffun instruccioniffun {$$ = $1; $$.push($2);}
	| instruccioniffun {$$ = []; $$.push($1);}
;

instruccioniffun
	: sout  {$$ = $1;}
  | sentwhilefun {$$ = $1;}
  | sentdowhilefun {$$ = $1;}
  | sentforfun { $$ = $1;}
  | sentiffun {$$ = $1;}
  | sentswitchfun { $$ = $1;}
  | declavar { $$ = $1;}
  | sentretfun { $$ = $1;}
  | IDENTIFICADOR llamada PTCOMA { $$ = new Nodo("LLAMADA",$1); $$.setHijos($2); if($$ != null) $$.valor = $1} 
  | IDENTIFICADOR varmet { $$ = $2; if($$ != null) $$.valor = $1}
;

instruccionesiffunrep
	: instruccionesiffunrep instruccioniffunrep {$$ = $1; $$.push($2);}
	| instruccioniffunrep {$$ = []; $$.push($1);}
;

instruccioniffunrep
	: sout  {$$ = $1;}
  | sentwhilefun {$$ = $1;}
  | sentdowhilefun {$$ = $1;}
  | sentforfun { $$ = $1;}
  | sentiffunrep {$$ = $1;}
  | sentswitchfunrep { $$ = $1;}
  | declavar { $$ = $1;}
  | sentretfun { $$ = $1;}
  | IDENTIFICADOR llamada PTCOMA { $$ = new Nodo("LLAMADA",$1); $$.setHijos($2); if($$ != null) $$.valor = $1} 
  | IDENTIFICADOR varmet { $$ = $2; if($$ != null) $$.valor = $1}
  | sentbreak {$$ = $1;}
  | sentcont  {$$ = $1;}
;

instruccionesiffunw
	: instruccionesiffunw instruccioniffunw {$$ = $1; $$.push($2);}
	| instruccioniffunw {$$ = []; $$.push($1);}
;

instruccioniffunw
	: sout  {$$ = $1;}
  | sentwhilefun {$$ = $1;}
  | sentdowhilefun {$$ = $1;}
  | sentforfun { $$ = $1;}
  | sentiffunw {$$ = $1;}
  | sentswitchfun { $$ = $1;}
  | declavar { $$ = $1;}
  | sentretfun { $$ = $1;}
  | IDENTIFICADOR llamada PTCOMA { $$ = new Nodo("LLAMADA",$1); $$.setHijos($2); if($$ != null) $$.valor = $1} 
  | IDENTIFICADOR varmet { $$ = $2; if($$ != null) $$.valor = $1}
  | sentbreak {$$ = $1;}
;

instruccionesrepfun : instruccionesrepfun instruccioniffunrep  {$$ = $1; $$.push($2);}
                    | instruccioniffunrep                       {$$ = []; $$.push($1);}
; 

instruccionrepfun : instruccionswfun  {$$ = $1;}
                  | sentcont          {$$ = $1;}
;

instruccionswfun : instruccioniffun   {$$ = $1;}
                 | sentbreak          {$$ = $1;}
;

instruccioneswefun: instruccioneswefun instruccioniffunw {$$ = $1; $$.push($2);}
                  | instruccioniffunw                    {$$ = []; $$.push($1);}
;

listacasef : listacasef CASE expresion DOSPUNTOS instruccioneswefun      {$$ = $1; $$.push(new Nodo("CASE",$2)); $$[$$.length-1].setHijos($5); $$[$$.length-1].sentencias.unshift($3);}
          | CASE expresion DOSPUNTOS instruccioneswefun                {$$ = []; $$.push(new Nodo("CASE",$1)); $$[0].setHijos($4);$$[0].sentencias.unshift($2);}
;

casedeffun : listacasef {$$ = $1;}
        | listacasef DEFAULT DOSPUNTOS instruccioneswefun {$$ = $1; $$.push(new Nodo("DEFAULT",$2));  $$[$$.length-1].setHijos($4);}
;

listacasefrep : listacasefrep CASE expresion DOSPUNTOS instruccionesiffunrep      {$$ = $1; $$.push(new Nodo("CASE",$2)); $$[$$.length-1].setHijos($5); $$[$$.length-1].sentencias.unshift($3);}
          | CASE expresion DOSPUNTOS instruccionesiffunrep                {$$ = []; $$.push(new Nodo("CASE",$1)); $$[0].setHijos($4); $$[0].sentencias.unshift($2);}
;

casedeffunrep : listacasefrep {$$ = $1;}
              | listacasefrep DEFAULT DOSPUNTOS instruccionesiffunrep {$$ = $1; $$.push(new Nodo("DEFAULT",$2)); $$[$$.length-1].setHijos($4); }
;

instfun : LLAVEIZQ instrucsfun sentretfun LLAVEDER   {$$ = $2; $$.push($3);}
        | LLAVEIZQ sentretfun LLAVEDER   {$$ = []; $$.push($2);}
;

instrucfun : sout  {$$ = $1;}
  | sentwhilefun {$$ = $1;}
  | sentdowhilefun {$$ = $1;}
  | sentforfun { $$ = $1;}
  | sentiffun {$$ = $1;}
  | sentswitchfun { $$ = $1;}
  | declavar { $$ = $1;}
  | IDENTIFICADOR llamada PTCOMA { $$ = new Nodo("LLAMADA",$1); $$.setHijos($2); if($$ != null) $$.valor = $1} 
  | IDENTIFICADOR varmet { $$ = $2; if($$ != null) $$.valor = $1}
;

instrucsfun : instrucsfun instrucfun    {$$ = $1; $$.push($2); }
            | instrucfun                {$$ = []; $$.push($1); }
;

instruccionesclase : instruccionesclase instruccionclase  {$$ = $1; $$.push($2);}
                   | instruccionclase                     {$$ = []; $$.push($1);}
;

instruccionclase : funcion    {$$ = $1;}
                 | metodo     {$$ = $1;}
                 | declavar   {$$ = $1;} 
;

instclase : LLAVEIZQ instruccionesclase LLAVEDER {$$ = $2;}
          | LLAVEIZQ LLAVEDER {$$ = null;}
;

sentimp : sentimp IMPORT IDENTIFICADOR PTCOMA  {$$ = $1; $$.push(new Nodo("IMPORT",$3))}
        | IMPORT IDENTIFICADOR PTCOMA          {$$ = []; $$.push(new Nodo("IMPORT",$2))}
;

arch : sentimp clase  {$$ = $1; $$.push($2)}
     | clase          {$$ = []; $$.push($1)}
;