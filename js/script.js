window.onload = function() {
  refreshCart();
}

/**
 * refresh cart list
 * @return {[type]} [description]
 */
function refreshCart() {
  //remove all icon (li element) from shopping cart (div element)
  var shoppingCart = document.getElementById("shoppingCart");
  shoppingCart.innerHTML = '';
  
  //get all icon
  var cart = getCart();
  
  //if cart not empty
  if(cart.length > 0) {
    //append icon (li element) to shopping cart (div element)
    for(var i=0; i < cart.length; i++) {
      addIcon(cart[i]);
    }
    
  }
}

/**
 * get all icon from local storage
 * @return {[type]} [description]
 */
function getCart() {
  //get icons from cart which save on local storage
  var cart = localStorage.getItem("cart");
  cart = cart ? JSON.parse(cart) : []; // if cart empty, set default empty array

  return cart;
}

// membuat fungsi untuk menghapus item dari keranjang
function removeFromCart(e) {
  // // menentukan element di atas element yang ingin kita hapus
  // var parentDiv = e.parentNode.parentNode.parentNode;
  // // menentukan element target yang ingin kita hapus
  // var parentLi = e.parentNode.parentNode;
  // // mengesekusi penghapusan element target
  // parentDiv.removeChild(parentLi);

  swal({   title: "Are you sure?",   
    text: "You can add this Icons into cart again!",   
    type: "warning",   
    showCancelButton: true,   
    confirmButtonColor: "#DD6B55",   
    confirmButtonText: "Yes, delete it!",   
    cancelButtonText: "No, cancel please!",   
    closeOnConfirm: false,   
    closeOnCancel: false }, 
    function(isConfirm){   
      if (isConfirm) {    
        //get id icon
        var id = e.getAttribute("data-id");

        //get all icon
        var cart = getCart();

        //remove icon/item from cart on local storage
        removeItem(id, cart, function(result) {
           if(result === true) {    
              //refresh cart list     
              refreshCart();
           }
        }); 
        swal("Deleted!", 
        "Icons telah dihapus dari keranjang.", 
        "success");   
      } else {     
        swal("Cancelled", "Penghapusan Icons dibatalkan.", "error");   
      } 
    });

}

/**
 * remove item/icon from local storage
 * @param  {[type]}   id       [description]
 * @param  {[type]}   cart     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function removeItem(id, cart, callback) {
    for (var i=0; i < cart.length; i++) {
        if (cart[i].id === id) {
            var index = cart.indexOf(cart[i]);
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            // alert('Berhasil terhapus');
            
            callback(true);
            return false;
        }
    }
    
    callback(false);
    return false;
}


// membuat fungsi untuk mengambil semua icon pada keranjang
function getIcons() {
  // mengambil element list pada id shopping cart (keranjang)
  var lists = document.getElementById("shoppingCart").getElementsByTagName("li");

  // membuat array dengan value dinamis
  var icons = [];

  // membuat perulangan untuk panjang dari list dalam shopping cart
  for (var i = 0; i < lists.length; i++) {
    
    var list = lists[i].childNodes;
    var icon = list[0].src;

    icons.push(icon);
  }

  return icons;
}

function downloadAll() {
  var link = document.createElement('a');
  var icons = getIcons();
  
  link.setAttribute('download', null);
  link.style.display = 'none';

  document.body.appendChild(link);


  for (var i = 0; i < icons.length; i++) {
    link.setAttribute('href', icons[i]);
    link.click();
  }

  document.body.removeChild(link);
}

// membuat fungsi untuk menambahkan item pada keranjang
function addToCart(btn) {
  //  get attribute data-id from clicked button
  var id = btn.getAttribute('data-id');
  //get icon name
  var name = btn.getAttribute('data-name');
  var cart = getCart();

  //  memeriksa id sebelum dimasukan dalam keranjang
  // membuat parameter selectedId
  // dan juga fungsi untuk hasil dari validation
  checkIsExist(id, cart, function(result) {
    // jika hasilnya false (tidak ditemukan id yang sama maka akan dijalankan suatu action)
    if(result === false) {

      var icon = {
         id: id,
         name: name
      };
      
      //add icon to local storage
      cart.push(icon);
      localStorage.setItem("cart", JSON.stringify(cart));
      addIcon(icon);

      // give notice the item has been added to cart
      // alert(name + ' Added to cart');
      swal(name, "Added to cart", "success")
    }
    else {
      // jika sudah tersedia id yang sama maka akan diberikan notice seperti di bawah ini
      // alert("data sudah ada");
      sweetAlert("Oops...", "Icons sudah pada keranjang!", "error");
    }
  });

  // breakup the scroll
  return false;
}

function addIcon(icon) {
  //  get name icon from data-nama-icon
      var selectedIconId = icon.id;
      var selectedIconName = icon.name; 

      //  get path location img by selected id
      var selectedPathImg = document.getElementById(selectedIconId).src;

      // Define element to variables
      var rootList = document.createElement("li");
      rootList.setAttribute("data-id-icon", selectedIconId);           
      var elementImgIcon = document.createElement("img"); 
      var elementAnchor = document.createElement("a"); 
      var elementPrg = document.createElement("p"); 
      var elementDiv = document.createElement("div");

      // Define content to variables
      var anchorRemove = document.createTextNode("Remove");
      var iconName = document.createTextNode(selectedIconName);

        // Set our image wrapper path and height
      elementImgIcon.src = selectedPathImg;
      elementImgIcon.height = '40';

      // Append image to list
      rootList.appendChild(elementImgIcon).className = 'icon-keranjang';

      // Append icon name to list
      // rootList.appendChild(iconName);

      // Append anchor link to list
      elementAnchor.appendChild(anchorRemove);
      elementDiv.appendChild(elementAnchor);
      rootList.appendChild(elementDiv).classList.add('remove-item-keranjang', 'clearfix');

      // Give a new attribute to 'remove' link
      elementAnchor.setAttribute("href", "javascript:void(0)");
      elementAnchor.setAttribute("onclick", "removeFromCart(this); return false;");
      elementAnchor.setAttribute("data-id", selectedIconId);

      // Append all of rootlist into div
      document.getElementById("shoppingCart").appendChild(rootList);
}

/**
 * check if icon exist in local storage
 * @param  {[type]}   id       [description]
 * @param  {[type]}   cart     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function checkIsExist(id, cart, callback){
    if(cart.length > 0) {
      for (var i=0; i < cart.length; i++) {
          if (cart[i].id === id) {
              callback(true);
              return false;
          }
      }
    }
    callback(false);
    return false;
}



