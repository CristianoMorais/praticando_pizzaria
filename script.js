//Declara a variavel para o carrinho
let cart = []
//Declaração de Variavel modalQt 
let modalQt = 1
//Declaração da Variavel modalkey que me dirá qual a pizza selecionada
let modalkey = 0

//retorna o item
const c = (el) => document.querySelector(el)
//retorna o Array com os itens que ele achou
const cs = (el)=> document.querySelectorAll(el)


//Listagem das pizzas 
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true)
    
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src=item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault()

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        //"Reset quantidade" ---- Sempre que abrir o modal vai iniciar com 1 na quantidade
        modalQt = 1
        //Variavel que vai me dizer qual é a pizza selecionada
        modalkey = key
        //Preenchendo o modal com informações das pizzas
        c('.pizzaBig img').src = pizzaJson[key].img
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

        //"Reset tamanho selecionado" ----- Deseleciona o item selecionado anteriormente
        c('.pizzaInfo--size.selected').classList.remove('selected')
        //Informação de tamanho da pizza
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            //se não tiver tamanho de pizza selecionado ele seleciona o tamanho grande
            if(sizeIndex ==2){
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        //Utiliza a variavel modalQt para adicionar a quantidade de pizzas desejada
        c('.pizzaInfo--qt').innerHTML = modalQt
        //animação de abertura do modal
        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = "flex"
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity =1
        }, 200)
    })
    c('.pizza-area').append( pizzaItem)
})

//Eventos/Funcionamento do modal
function closeModal(){
    //Animação de fechar modal igual a de abrir 
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display ='none'
    }, 500)
}
    cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
        item.addEventListener('click', closeModal)
    })
    
    //Adicionar e Remover itens
    //Remover itens
    c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
        //Quando clicar no - remove -1 item e adiciona condição para item não ser menor que 1
        if(modalQt>1){
            modalQt--
             c('.pizzaInfo--qt').innerHTML = modalQt
        }
    })
    //Adiciona itens
    c('.pizzaInfo--qtmais').addEventListener('click',()=>{
        //Quando clicar no + ele adiciona +1 item
        modalQt++
        c('.pizzaInfo--qt').innerHTML = modalQt
    })

    //Selecionar tamanho da pizza
    cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
        size.addEventListener('click', (e)=>{
            c('.pizzaInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')

        })
    })

    //Botão de carrinho
    c('.pizzaInfo--addButton').addEventListener('click', ()=>{
        
        let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))
        let identifier = pizzaJson[modalkey].id+'@'+size
        let key = cart.findIndex((item)=>item.identifier == identifier)
        if (key > -1){
            cart[key].qt += modalQt
        }else{
        cart.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:modalQt
            })
        }
        /*
        Informações necessárias
        Qual a pizza?
        -------->console.log("Pizza: "+modalkey)
        Qual o tamanho?
        -------->let size = c('.pizzaInfo--size.selected').getAttribute('data-key')
        -------->console.log("Tamanho: "+size)
        Quantas pizzas?
        -------->console.log("Quantidade: "+modalQt)
        */

        //Ao final de adicionar o(s) iten(s) ao carrinho fecha o modal 
        updateCart()
        closeModal()
    })

    c('.menu-openner').addEventListener('click', ()=>{
        if(cart.length > 0){
            c('aside').style.left = '0'
        }
    })
    c('.menu-closer').addEventListener('click', ()=>{
        c('aside').style.left = '100vw'
    })


    function updateCart(){
        c('.menu-openner span').innerHTML = cart.length

        if(cart.length > 0){
            c('aside').classList.add('show')
            c('.cart').innerHTML = ''

            //Desclaração de variaveis para armazenar os valores das pizzas no carrinho
            let subtotal = 0
            let desconto = 0
            let total = 0

                for (let i in cart){
                let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)
                subtotal += pizzaItem.price * cart[i].qt

                let cartItem = c('.models .cart--item').cloneNode(true)
                
                //Adiciona o tamanho da pizza entre () dentro do carrinho ao lado da imagem
                let pizzaSizeName
                //condição para os tamanhos das pizzas
                switch (cart[i].size) {
                    case 0:
                        pizzaSizeName = "P"
                        break;
                    case 1:
                        pizzaSizeName = "M"
                        break
                    case 2:
                        pizzaSizeName = "G"
                        break
                }
                //escrever o tamanho da pizza entre () no carrinho
                let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

                //adiciona a imagem da pizza no carrinho
                cartItem.querySelector('img').src = pizzaItem.img
                //adiciona o nome da pizza no carrinho
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
                //adiciona a quantidade de pizzas no carrinho
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
                //Funções para os botões de - e + do carrinho
                    cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                            if(cart[i].qt > 1){
                                cart[i].qt--
                            }else{
                                cart.splice(i, 1)
                            }
                            updateCart()
                        })
                    cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                        cart[i].qt++
                        updateCart()
                        })
                c('.cart').append(cartItem)
                }

                //calculo do total e subtotal com desconto
                desconto = subtotal * 0.1
                total = subtotal - desconto

                c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
                c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
                c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
        }else{
            c('aside').classList.remove('show')
            c('aside').style.left = '100vw'
        }
    }
