
async function gameForm(event,id) {
    event.preventDefault();

    console.log(event)
    let route ='/game';
    if  (id)  {
        route='/edit-game';
    }
    const formData = new FormData(event.target);
    const response = await fetch(route, {
        method: "POST",
        body: formData,
    });
    const url = new URL(response.url);
    const destId = url.searchParams.get('id');

    if (response.ok) {
        alert("The Game has been saved!");
        window.location=`/detail/${destId}`;
    } else {
        alert("Failed to create post. Please try again.");
    }
}
