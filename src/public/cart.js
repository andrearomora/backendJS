const addProduct = (id) => {
    const cid = "64cef69c04a0aed82a3489ab";
    const pid = id;
    console.log(id)
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }),
    };
    fetch(`/api/carts/${cid}/product/${pid}`, request)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error("Error adding product to cart:", err);
      });
  };
  const deleteProduct = (id) => {
    const cid = "64cef69c04a0aed82a3489ab";
    const pid = id;
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`/api/carts/${cid}/product/${pid}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          console.log("product deleted successfuly");
        } else {
          console.error("Product deleted error. Code status:", response.status);
        }
      })
      .catch((error) => {
        console.error("product deleted error", error);
      });
  };