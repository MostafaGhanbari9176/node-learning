function requestDelete(productId, csrf, item) {
    fetch(`/product/${productId}`, {
        method: "DELETE",
        headers:{
            'csrf-token':csrf
        }
    }).then(result => {
        return result.json()
    })
        .then(result => {
            console.log(result)
            //item.remove()
            item.parentNode.removeChild(item)
        })
        .catch(err => console.log(err))
}

document.getElementById("deleteProduct").addEventListener('click',
    function (ev) {
        const productId = ev.target.parentNode.querySelector('[name=id]').value
        const csrf = ev.target.parentNode.querySelector('[name=_csrf]').value
        const item = ev.target.closest('li')

        requestDelete(productId, csrf, item)

    })