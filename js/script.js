document.addEventListener('DOMContentLoaded', () => {
    
    //Lógica para pag de produtos
    fetchProdutos();

    //logica para a pag do carrinho

    //criando as variáveis e selecionando elementos
    const cardItensContainer = document.getElementById('card-itens-container');
    const cardTotalValue = document.getElementById('card-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');

    //verifica se estamos na pag do carrinho
    if(cardItensContainer){
        //pega os itens 'armazenados no navegador'
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
    
        if(cart.length == 0){
            //se o carrinho estiver vazio, mostra a mensagem no html
        }else{
            //mas se houver itens, limpa o conteúdo padrão
            cardItensContainer.innerHTML = "";

            //vamos descobrir os itens
            cart.forEach(product => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item'); //adiciona a classe 'cart-item' ao div

                //definimos o conteúdo HTML
                //to.fixed formata para ter duas casas decimais
                cartItem.innerHTML = `
                <span>${product.name}</span>
                <span>R$ ${product.price.toFixed(2)}</span>
                `;
                
                //vai adicionar uma nova div
                cardItensContainer.appendChild(cartItem);

                //soma o preço de cada produto
                total += product.price;

            })
        }

        //atualizar o texto do valor total da página
        cardTotalValue.textContent = `R$ ${total.toFixed(2)}`;

        checkoutBtn.addEventListener('click', () => {
            const numeroWhatsApp = '5515991008921';

            //montar a mensagem do pedido
            let mensagem = 'Olá! Segue meu Pedido:\n\n';
            cart.forEach(product => {
                mensagem += `- ${product.name}: (R$ ${product.price.toFixed(2)})\n`;
            });
            mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

            const urlWhatsApp = `https://wa.me/${5515991008921}?text=${encodeURIComponent(mensagem)}`;
            window.open(urlWhatsApp, '_blank');
            localStorage.removeItem('cart'); //limpa o carrinho
        });
    }

        const limparTabela = document.getElementById('limpar-pedido');
        limparTabela.addEventListener('click', () => {
            localStorage.removeItem('cart'); //remove o item 'cart' do localStorage
            location.reload(true); //recarrega a página atual
        })
});

function fetchProdutos(){
    fetch("http://localhost:8000/api/produtos/")
    .then(res => res.json())
    .then(data => renderProdutos(data))
    .catch(err => console.error("Erro ao buscar o produto", err));
}

function renderProdutos(produtos){
    produtos.forEach(produto => {
        const categoria = produto.categoria.nome.toLowerCase();
        const container = document.getElementById(categoria);

        if(container){
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("data-name", produto.nome);
            card.setAttribute("data-price", produto.preco);
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h4>${produto.nome}</h4>
                <p class="price">R$${produto.preco}</p>
                <button class="adicionar-carrinho">Adicionar no Carrinho</button>
            `;
            container.appendChild(card);
        }
    });
    addCarrinho();
}

function addCarrinho(){
     //Seleciona todos os botões com a classe 'aad-to-cart-btn'
    const addTocartButtons = document.querySelectorAll('.adicionar-carrinho');

    //Intera sobre cada botão encontrado. 'forEach' é um laço de repetição
    addTocartButtons.forEach(button => {
        button.addEventListener('click', () => {

            //adiciona um 'ouvinte de evento' de clique para cada botão
            //quando o botão for clicado a função 'addeventlist....' será executada
            const card = button.closest('.card'); //button.closest encontra o elemento pai
            const productName = card.getAttribute('data-name'); //pega o nome do produto através dos atributos 'data-name'
            const productPrice = parseFloat(card.getAttribute('data-price')); //aqui convertemos o preço do produto em número decimal

            const product = { //cria um objeto 'product' para armazenar as informações do item
                name: productName,
                price: productPrice,
            };

            //vamos pegar o carrinho atual do 'localStorage' do navegador,
            //json.parse converte a string do localStorage de volta para um objeto
            //se não houver nada no carrinho, inicializamos a array vazia [].

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product) //adiciona o produto novo

            //vamos salvar o array no carrinho atualizado
            //'JSON;stringfy' converte o objeto/array em String para armazenar
            localStorage.setItem('cart', JSON.stringify(cart));

            //agora vamos adicionar um alerta simples
            alert(`${productName} foi adicionado ao carrinho!`)
        });
    });
}