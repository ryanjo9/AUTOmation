<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark" style="background-color: #232F3E">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <!-- <img src="./assets/hiclipart.com.png" alt="logo" style="width:50px;"> -->
            <li class="nav-item">
              <h3 style="color:white;padding-left:10px;padding-right:10px;">Automation</h3>
            </li>
            <li class="nav-item active">
              <router-link style="color:white" class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link style="color:white" class="nav-link" to="/add">Add</router-link>
            </li>
            <li class="nav-item">
              <router-link style="color:white" class="nav-link" to="/login">Login </router-link>
            </li>
            <li class="nav-item">
              <router-link style="color:white" class="nav-link" to="/register">Register </router-link>
            </li>
          </ul>
        </div>
      </nav>
      <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
