[Render Page](https://cse340-57ri.onrender.com/)
[GitHub Repo](https://github.com/tristan-galloway/cse340)

[Assignment Two](https://youtu.be/h5A2fjfuNhI)
[Assignment 3 Details Page](https://youtu.be/em-NkBjWS0w)

```
Error at: "/account/register": C:\Users\Direc\OneDrive - BYU-Idaho\Documents\winter25\cse340\views\account\login.ejs:13
    11|
    12| <!-- Display Errors -->
 >> 13| <% if (errors) { %>
    14|   <ul class="notice" id="form-errors">
    15|  <% errors.array().forEach(error => { %>
    16|    <li><%= error.msg %></li>

errors is not defined
``` 