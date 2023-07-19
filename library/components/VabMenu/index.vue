<template>
  <component
    :is="menuComponent"
    v-if="item.meta && !item.meta.hidden"
    :item-or-menu="item"
  >
    <template v-if="item.children && item.children.length">
      <vab-menu
        v-for="route in item.children"
        :key="route.path"
        :item="route"
      />
    </template>
  </component>
</template>

<script>
  const imports = import.meta.glob('./**/*.vue', { eager: true })
  const Components = {}
  Object.getOwnPropertyNames(imports).forEach((key) => {
    Components[key.replace(/(\/|components|\.|vue)/g, '')] =
      imports[key].default
  })

  export default defineComponent({
    name: 'VabMenu',
    components: Components,
    props: {
      item: {
        type: Object,
        required: true,
      },
      layout: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const menuComponent = computed(() =>
        props.item.children &&
        props.item.children.some((route) => {
          return route.meta && route.meta.hidden !== true
        })
          ? 'VabSubMenu'
          : 'VabMenuItem'
      )

      return {
        menuComponent,
      }
    },
  })
</script>
