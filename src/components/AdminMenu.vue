<template>
  <v-navigation-drawer
    expand-on-hover
    permanent
    app
    clipped
  >
    <template v-slot:prepend>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/women/85.jpg" />
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link two-line>
          <v-list-item-content>
            <v-list-item-title class="title"> Sandra Adams </v-list-item-title>
            <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>

    <v-divider />

    <v-list nav dense>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon v-text="'fas fa-folder'" />
        </v-list-item-icon>
        <v-list-item-title>My Files</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon v-text="'fas fa-user-circle'" />
        </v-list-item-icon>
        <v-list-item-title>Shared with me</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon v-text="'fas fa-star'" />
        </v-list-item-icon>
        <v-list-item-title class="logout" @click="logout">Log out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// import { ref, computed } from '@vue/composition-api'
import store from '@/store/store'
import router from '@/router'

export default {
  name: 'AdminMenu',
  setup(props) {
    const logout = () => {
      store.dispatch('user/logout')
      router.push('login')
    }

    return { logout }
  },
}
</script>

<style lang="scss" scoped>
.logout {
  &:hover {
    cursor: pointer;
  }
}
</style>
