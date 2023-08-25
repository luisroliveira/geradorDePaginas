const inputImage = document.getElementById('input-image');
const selectedImage = document.getElementById('selected-image');

inputImage.addEventListener('change', function() {
  const file = inputImage.files[0];
  if (file) {
    selectedImage.src = URL.createObjectURL(file);
  }
});

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("form");
    const btnAvancar = document.getElementById("btn-avancar");
    const inputWord = document.getElementById("input-word");
  
    btnAvancar.addEventListener("click", function(event) {
        event.preventDefault(); // Impede o envio do formulário padrão
    
        // Obtém a palavra inserida
        const word = inputWord.value;
        const image = inputImage.value;
        
        console.log(image)
        console.log(word)
        
        //   // Redireciona para a nova página, passando os dados via URL
        //   const queryParams = new URLSearchParams(formData);
        //   window.location.href = "outra_pagina.html?" + queryParams.toString();
    });
});


  