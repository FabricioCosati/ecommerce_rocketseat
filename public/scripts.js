
const Mask = {
    apply(input, func){

        setTimeout(function(){
            input.value = Mask[func](input.value)

        }, 0.1)
    }, 

    formatBRL(value){

        value = value.replace(/\D/g, "")

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100)
    },

    cpfCnpj(value){

        value = value.replace(/\D/g, "")
        
        if(value.length > 14){
            value = value.slice(0, -1)
        }
        
        if(value.length > 11){
            // CNPJ
            
            // 11222333444455
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            // 11.222333444455
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // 11.222.333444455
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            // 11.222.333/444455
            value = value.replace(/(\d{4})(\d)/, "$1-$2")
            // 11.222.333/4444-55
        }
        else{
            // CPF

            // 11122233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // 111.22233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // 111.222.33344
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
            // 111.222.333-44
        }

        return value
    },

    cep(value){

        value = value.replace(/\D/g, "")

        if(value.length > 8){
            value = value.slice(0, -1)
        }

        // CEP

        // 55555555
        value = value.replace(/(\d{5})(\d)/, "$1-$2")
        // 55555-555

        return value
    }
}

const PhotosUpload = {
    limitPhotos: 6, // limite de fotos
    preview: document.querySelector('#gallery-preview'), // coloca a gallery preveiw em uma variável
    files: [], // um array que vai conter os files (as fotos que vamos adicionando)
    input: "", // o input que vai conter o valor do event.target do inputHandler, para pegarmos em outro lugar

    inputHandler(event){
        // o event.target pega todo o input, com direito ao name, type, class, etc.
        const {files: fileList} = event.target  // estamos tirando de dentro do input, o atributo files, que contém os arquivos que estamos adicionando
        PhotosUpload.input = event.target // adiciona ao input global, o event.target
        
        if(PhotosUpload.hasLimit(event)) return // Chama a função de verificar se há limite

        Array.from(fileList).forEach(file => { // transforma o fileList (que não é um array) em um array, e usando o forEach
            this.files.push(file)
            
            const reader = new FileReader() // criar uma variável reader do tipo fileReader

            reader.onload = () => { // função do fileReader de onload, que vai rodar após terminar a função
                const image = new Image() // cria uma tag do tipo <img/>

                image.src = String(reader.result) // atribui ao src de image o resultado que veio após a execução
                
                const div = PhotosUpload.createContainerImage(image) // cria a div com a função que lá em baixo
                
                PhotosUpload.preview.appendChild(div) // coloca dentro da galeria de imagens, a div que por sinal, tem as imagens dentro
            }

            reader.readAsDataURL(file) // pega a url da data para transformar em BLOB (transformar a imagem em um texto)
        })

       PhotosUpload.input.files = PhotosUpload.getAllFiles() // passa para o array global, a função getAllFiles()
    }, 

    createContainerImage(image){
        const div = document.createElement('div') // criar uma tag <div/>

        div.classList.add('photo') // adiciona classe photo a div

        div.addEventListener('click', (event) => { // ação da div é de clique, ou seja, ao clicar vai acontecer alguma coisa
            PhotosUpload.removePhoto(event) // Chama a função para remover uma foto ao clicar nela, passando o event do <i/>
        })

        const materialIconElement = PhotosUpload.getRemoveButton() // chama a função onde criamos o botão de remover e coloca em uma variável

        div.appendChild(image) // adiciona como filho da div, a imagem que criamos
        div.appendChild(materialIconElement) // adiciona a div, esse elemento <i/> que criamos

        return div // fazer o retorno da div após a operação, caso contrário, não seria possivel ultilizar essa div
    }, 

    hasLimit(event){

        const {limitPhotos, preview} = PhotosUpload // Pego o limite de fotos para dentro da função
        const {files: fileList} = event.target // tira do input, os files (os arquivos/imagens) e colcoa na variavel fileList

        if(fileList.length > limitPhotos){ // verificar se a quantidade de arquivos que o usuário colocou é maior que o limite de fotos
            alert(`Coloque no máximo ${limitPhotos} fotos`) // se sim, dê um alerta
            event.preventDefault() // previne a ação de upload de fotos de continuar
            return true // retorna após previnir a ação
        }

        const photosDiv = [] // cria um array vazio que vai conter o total de photos que temos
        preview.childNodes.forEach(photo => { // para cada foto do preview...
            if(photo.classList && photo.classList.contains('photo')){ // se a foto conter uma classe, e essa classe se chamar 'photo'...
                photosDiv.push(photo) // vamos adicionar ao array, essa foto
            }
        })    

        const totalPhotos = photosDiv.length + fileList.length // a soma do total de fotos do array + do fileList
        if(totalPhotos > limitPhotos){ // verificar se a quantidade de fotos que somamos é maior que o limite de fotos
            alert(`Coloque no máximo ${limitPhotos} fotos`) // se sim, dê um alerta
            event.preventDefault() // previne a ação de upload de fotos
            return true // retorna após previnir a ação de upload de fotos
        }

        return false // Se tiver tudo ok, retorna false
    },

    getRemoveButton(){
        const materialIconElement = document.createElement('i') // Cria um elemento de tag <i/>
        materialIconElement.classList.add('material-icons') // adiciona a classe de material-icons

        materialIconElement.innerHTML = 'close' // adiciona ao html "close"

        return materialIconElement // retorna esse elemento criado
    }, 

    removePhoto(event){

        const photoDiv = event.target.parentNode // pega o parent, a <div/> do elemento <i/>

        const photosArray = Array.from(PhotosUpload.preview.children) // adiciona a lista de fotos, um array com os filhos (fotos) do preview
        const index = photosArray.indexOf(photoDiv) // pega o index do elemento <div/> que foi clicado

        PhotosUpload.files.splice(index, 1) // retira a foto dos files, passando o index do elemento <div/>
        PhotosUpload.input.files = PhotosUpload.getAllFiles() // Atualiza a lista de fotos chamando a função getAllFiles

        photoDiv.remove() // Remove a foto

    },

    getAllFiles(){

        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer() // 

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file)) // para cada file em files, adiciona ao dataTransfer

        return dataTransfer.files // retorna os files do dataTransfer
    },

    removeOldPhoto(event){
        const photoDiv = event.target.parentNode
        
        if(photoDiv.id){
            const removedFiles = document.querySelector('input[name="removed_files"]')
            removedFiles.value += `${photoDiv.id},`
        }


        photoDiv.remove()
    }
}

const HoverSelectPhoto = {
    p: document.querySelector('#text-input'),
    style: "",

    hoverInput(){
        const {p: textInput} = HoverSelectPhoto

        if(window.getComputedStyle){
            HoverSelectPhoto.style = window.getComputedStyle(textInput)
        }

        textInput.style.backgroundColor = '#0049a9'
        textInput.style.transition = '.3s'
    },

    hoverInputOut(){
        const {p: textInput, style} = HoverSelectPhoto
        const newStyle = HoverSelectPhoto.convertHex(style.backgroundColor)

        textInput.style = {backgroundColor: newStyle}
        textInput.style.transition = '.3s'
    },

    convertHex(rgb){
        rgb = rgb.split("(")[1].split(")")[0]; // Tirando os parênteses
        rgb = rgb.split(",") // Separando pela "," e colocando em um array

        let hex = rgb.map(x => { // Para cada elemento do array...
            x = parseInt(x).toString(16) // Converte em uma string de base 16 (hexadecimal)
            return (x.length == 1) ? "0" + x : x // Se tiver só um caractere, retorna o 0 + o caractere, senão retorna ele inteiro
        })
        
        return "#" + hex.join("") // Junta tudo e retorna
    }
}

const ImageGallery = {
    previewImages: document.querySelectorAll('.product-single .gallery-items img'),
    highlightImage: document.querySelector('.product-single .highlight img'),

    setImage(e){
        const {target} = e
        
        ImageGallery.previewImages.forEach(image => image.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlightImage.src = target.src

        Lightbox.lightboxImage.src = target.src

    }
}

const Lightbox = {
    lightbox: document.querySelector('.lightbox-target'),
    lightboxImage: document.querySelector('.lightbox-target img'),
    lightboxClose: document.querySelector('.lightbox-target a.lightbox-close'),

    open(){
        Lightbox.lightbox.style.opacity = 1
        Lightbox.lightbox.style.top = 0
        Lightbox.lightbox.style.bottom = 0
        Lightbox.lightboxClose.style.top = 0

    }, 

    close(){
        Lightbox.lightbox.style.opacity = 0
        Lightbox.lightbox.style.top = '-100%'
        Lightbox.lightbox.style.bottom = "initial"
        Lightbox.lightboxClose.style.top = "-80px"
    }
}

const Pagination = {
    paginate(selectedPage, totalPages){
        // Selected Page
        // Total Pages
        // Pages []

        let pages = [],
            oldPage = 0

        for(let currentPage = 1; currentPage <= totalPages; currentPage++){
            
            const firstAndLastPage = currentPage == 1 || currentPage == totalPages
            const pagesAfter = currentPage <= selectedPage + 2
            const pagesBefore = currentPage >= selectedPage - 2

            if(firstAndLastPage || pagesAfter && pagesBefore){
                
                if(oldPage && currentPage - oldPage > 2){
                    pages.push("...")
                }

                if(oldPage && currentPage - oldPage == 2){
                    pages.push(oldPage + 1)
                }

                oldPage = currentPage
                pages.push(currentPage)
            }
        }
        return pages
    },

    insertPage(){
        const totalPages = document.querySelector('.footerPaginate').dataset.total
        const selectedPage = document.querySelector('.footerPaginate').dataset.page
        const filterPage = document.querySelector('.footerPaginate').dataset.filter

        const allPages = Pagination.paginate(+selectedPage, +totalPages)
        let elements = ""
        const hasPath = String(window.location.pathname).includes("/products/search")

        for(page of allPages){
            if(String(page).includes("...")){
                elements += `<span>${page}</span>`
            }
            else{
                if(hasPath){
                    elements += `<a href="/products/search?filter=${filterPage}&page=${page}">${page}</a>`
                }
                else{
                    elements += `<a href="/?page=${+page}">${page}</a>`
                }
            }
        }

        document.querySelector('.footerPaginate').innerHTML = elements
    },

    onLoadPage(){

        const shopSection = document.querySelector('section.shop')
        if(shopSection){
            Pagination.insertPage()
        }
    }
}

const Validate = {
    apply(input, func){

        Validate.cleanError(input)

        let results = Validate[func](input.value)
        // Seria o mesmo que fazer: input.value = Validate.isEmail(input.value) || Validate.isCpfCnpj(input.value)
        input.value = results.value

        if(results.error){
            Validate.displayError(input, results.error)

            if(func == 'isCpfCnpj' || func == 'isCep'){
                document.querySelector('.error').classList.add('limitField')
            }
        }

        return input.value
        
    },

    isEmail(value){
        let error = null

        const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(email)){
            error = "Email Inválido"
        }

        return {
            error,
            value
        }
    },

    isCpfCnpj(value){
        let error = null

        value = value.replace(/\D/g, "")

        if(value.length > 11 && value.length !== 14){
            error = "Cnpj Inválido"
        }
        else if(value.length < 12 && value.length !== 11){
            error = "Cpf Inválido"
        }

        value = Mask.cpfCnpj(value)
        
        return {
            error,
            value
        }
    },

    isCep(value){
        let error = null

        value = value.replace(/\D/g, "")

        if(value.length !== 8){
            error = "Cep Inválido"
        }

        value = Mask.cep(value)

        return {
            error,
            value
        }
    },

    displayError(input, error){

        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error

        input.parentNode.appendChild(div)
        input.focus()
    },

    cleanError(input){

        const div = input.parentNode.querySelector('.error')

        if(div){
            div.remove()
        }
    },

    allFields(e){
        const items = document.querySelectorAll(".item input, .item textarea, .item select")
        
        for(let item of items){
            if(item.value == ""){
                const message = document.createElement("div")
                message.classList.add("messages", "error")
                message.innerHTML = "Todos os Campos são obrigatórios."
                
                document.querySelector("body").appendChild(message)

                e.preventDefault()
            }
        }
    }

}