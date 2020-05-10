function analizarArchivos(){
    let url = "http://localhost:3000/api/textos"
    texto1 = editorcopia1.getValue()
    $.post(url,{text:texto1},function(data,status){
        if (status.toString() == "success") {
            console.log("El resultado es: " + data)
        } else alert("se encontro error " + status)
    })
  }

  function analizarArchs(){
    let url = "http://localhost:3000/api/textos/prueba"
    textos = []
    if(editorcopia1.getValue() != "") textos.push(editorcopia1.getValue())
    if(editorcopia2.getValue() != "") textos.push(editorcopia2.getValue())
    if(editorcopia3.getValue() != "") textos.push(editorcopia3.getValue())
    console.log(textos)
    $.post(url,{text:textos},function(data,status){
        if (status.toString() == "success") {
            console.log(data)
            let tablaclase = document.getElementById("tablaClase")
            tablaclase.innerHTML = "<tr><th>Archivo</th><th>Clase</th><th>Cantidad Metodos</th><th>Cantidad Funciones</th></tr>" +  data
        } else alert("Se encontro error " + status)
    })
  }

  function reporteFuncion(){
     let url = "http://localhost:3000/api/textos/funcion"
     textos = []
     if(editorcopia1.getValue() != "") textos.push(editorcopia1.getValue())
     if(editorcopia2.getValue() != "") textos.push(editorcopia2.getValue())
     if(editorcopia3.getValue() != "") textos.push(editorcopia3.getValue())    
     $.post(url,{textos:textos},function(data,status){
         if(status.toString() == "success"){
             let tablafunciones = document.getElementById("tablaFuncion")
            tablafunciones.innerHTML = "<tr><th>Archivo</th><th>Clase</th><th>Nombre</th><th>Parametros</th><th>TipoRetorno</th></tr>" + data
         }else alert("Se encontro error " + status)
     })
  }

  function reporteVariable(){
      let url = "http://localhost:3000/api/textos/variable"
      textos = "reporte"  
     $.post(url,{textos:textos},function(data,status){
         if(status.toString() == "success"){
             let tablavariables = document.getElementById("tablaVariable")
            tablavariables.innerHTML = "<tr><th>Archivo</th><th>Clase</th><th>Funcion/Metodo</th><th>Variables</th></tr>" + data
         }else alert("Se encontro error " + status)
     })
  }