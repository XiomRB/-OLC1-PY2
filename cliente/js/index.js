function analizar(){
    let url = "http://localhost:3000/api/"
    let principal = editor.getValue()
    $.post(url,{text:principal},function(data,status){
        if (status.toString() == "success") {
            console.log("El resultado es: " + data)
            var salida = "";
            if(data == "Existen errores en el archivo") alert(data)
            else salida = data
            localStorage.setItem("ast",salida);
        } else alert("se encontro error " + status)
    })
}

//ABRIR ARCHIVOS
function abrirArchivo(){
    var archivos = document.getElementById("abrir")
    var archivo = archivos.files[0]
    var lector = new FileReader()
    lector.readAsText(archivo)
    lector.addEventListener("load",mostrarArchivo,false)
}

function mostrarArchivo(e){
    var resultado = e.target.result
    if(editor.getValue() == "") editor.setValue(resultado)
    else if(editorcopia1.getValue() == "") editorcopia1.setValue(resultado)
    else if(editorcopia2.getValue() == "") editorcopia2.setValue(resultado)
    else if(editorcopia3.getValue() == "") editorcopia3.setValue(resultado)
}

function reportarArbol(){
    var d = localStorage.getItem("ast")
    var jsonData = [JSON.parse(d)];
      
      $('#jstree-tree')
        .on('changed.jstree', function (e, data) {
          var objNode = data.instance.get_node(data.selected);
          $('#jstree-result').html('Selected: <br/><strong>' + objNode.id+'-'+objNode.text+'</strong>');
        })
        .jstree({
        core: {
          data: jsonData
        }
      });
}
