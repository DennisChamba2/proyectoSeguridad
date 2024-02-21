function sConsole(event) {
    event.preventDefault();
    var data = document.getElementById("data");
    console.log(data.value);
    document.getElementById('data').value=null;
    alert("Thanks!");
}
